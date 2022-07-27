// const express = require('express');
import express from 'express';

// const fetch = require('node-fetch');
import fetch from 'node-fetch';

const Statistics = require('statistics.js');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './.env' })
}

const app: express.Application = express();
app.use(express.static('./public'));
app.use(express.json({ limit: '1mb' }));

const favicon = require('serve-favicon');
app.use(favicon('./favicon.png'));

app.get('/data', async (request: express.Request, response: express.Response) => {
    let APIresponseArray: any[] = [];
    let newDate = Math.floor(Date.now() / 1000);
    let backDates: number[] = new Array;
    let periodsOnGraph: number = 6;
    for (let i = 0; i < periodsOnGraph; i++) {
        backDates.unshift(newDate - (i * 24 * 60 * 60));
    }
    for (let i = 0; i < periodsOnGraph; i++) {
        const api_url = `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=51.5&lon=0&dt=${backDates[i]}&appid=${process.env.API_KEY}&units=metric`;
        const fetch_response = await fetch(api_url);
        const jsonWeather = await fetch_response.json();
        APIresponseArray.push(jsonWeather);  
    }
    extractDataAndCalculateStatistics(APIresponseArray);
    response.json([correlationCoefficient1dp, standardDeviationOfMaxima, standardDeviationOfMinima, dayMaximaStats, dayMinimaStats]);
});

let correlationCoefficient1dp: number;
let standardDeviationOfMaxima: number;
let standardDeviationOfMinima: number;
let dayMaximaStats: number[] = [];
let dayMinimaStats: number[] = [];

const extractDataAndCalculateStatistics = async (APIresponseArray: any[]) => {
    let dailyTempExtremes = [];
    dayMaximaStats = [];
    dayMinimaStats = [];
    for (let i = 0; i < APIresponseArray.length; i++) {
        let temperatureArray: number[] = [];
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
}

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Starting server: http://localhost:${PORT}`));
