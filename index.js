"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
// const fetch = require('node-fetch');
const node_fetch_1 = __importDefault(require("node-fetch"));
const Statistics = require('statistics.js');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './.env' });
}
const app = (0, express_1.default)();
app.use(express_1.default.static('./public'));
app.use(express_1.default.json({ limit: '1mb' }));
const favicon = require('serve-favicon');
app.use(favicon('./favicon.png'));
app.get('/data', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let APIresponseArray = [];
    let newDate = Math.floor(Date.now() / 1000);
    let backDates = new Array;
    let periodsOnGraph = 6;
    for (let i = 0; i < periodsOnGraph; i++) {
        backDates.unshift(newDate - (i * 24 * 60 * 60));
    }
    for (let i = 0; i < periodsOnGraph; i++) {
        const api_url = `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=51.5&lon=0&dt=${backDates[i]}&appid=${process.env.API_KEY}&units=metric`;
        const fetch_response = yield (0, node_fetch_1.default)(api_url);
        const jsonWeather = yield fetch_response.json();
        APIresponseArray.push(jsonWeather);
    }
    extractDataAndCalculateStatistics(APIresponseArray);
    response.json([correlationCoefficient1dp, standardDeviationOfMaxima, standardDeviationOfMinima, dayMaximaStats, dayMinimaStats]);
}));
let correlationCoefficient1dp;
let standardDeviationOfMaxima;
let standardDeviationOfMinima;
let dayMaximaStats = [];
let dayMinimaStats = [];
const extractDataAndCalculateStatistics = (APIresponseArray) => __awaiter(void 0, void 0, void 0, function* () {
    let dailyTempExtremes = [];
    dayMaximaStats = [];
    dayMinimaStats = [];
    for (let i = 0; i < APIresponseArray.length; i++) {
        let temperatureArray = [];
        APIresponseArray[i].hourly.forEach(hour => {
            temperatureArray.push(hour.temp);
        });
        let dayMax = Math.max(...temperatureArray);
        let dayMin = Math.min(...temperatureArray);
        const dayTempExtremes = {
            miniTemp: dayMin,
            maxiTemp: dayMax,
        };
        dailyTempExtremes.push(dayTempExtremes);
        dayMaximaStats.push(dayMax);
        dayMinimaStats.push(dayMin);
    }
    var variablesTemperatureMaxAndMin = {
        miniTemp: 'metric',
        maxiTemp: 'metric'
    };
    let stats = new Statistics(dailyTempExtremes, variablesTemperatureMaxAndMin);
    correlationCoefficient1dp = stats.correlationCoefficient('miniTemp', 'maxiTemp').correlationCoefficient.toFixed(1);
    standardDeviationOfMaxima = stats.standardDeviation(dayMaximaStats).toFixed(2);
    standardDeviationOfMinima = stats.standardDeviation(dayMinimaStats).toFixed(2);
});
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Starting server: http://localhost:${PORT}`));
