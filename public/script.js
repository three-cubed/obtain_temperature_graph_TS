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
let dayMaxima = [];
let dayMinima = [];
let parsedData;
const fetchWeather = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/data').then(function (response) {
        response.text()
            .then(function (text) {
            parsedData = JSON.parse(text);
            dayMaxima = parsedData[3];
            dayMinima = parsedData[4];
        }).then(function () {
            createChart();
            writeNotes();
        });
    });
});
fetchWeather();
function createChart() {
    let graph = document.getElementById('graph').getContext('2d');
    Chart.defaults.defaultFontFamily = 'Lato';
    Chart.defaults.defaultFontSize = 25;
    let maxiMiniChart = new Chart(graph, {
        type: 'line',
        data: {
            labels: ['5 days ago', '4 days ago', '3 days ago', '2 days ago', 'yesterday', 'today'],
            datasets: [
                {
                    label: '24-hour maximum temperature in ° C',
                    data: dayMaxima,
                    borderWidth: 3,
                    borderColor: 'red'
                },
                {
                    label: '24-hour minimum temperature in ° C',
                    data: dayMinima,
                    borderWidth: 3,
                    borderColor: 'blue'
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Maximum and minimum temperatures for the last five days',
                fontSize: 25
            }
        }
    });
    resizeChart();
}
function writeNotes() {
    let topNotes = document.getElementById('topNotes');
    topNotes.innerHTML = 'Up-to-date data have been obtained from <i>api.openweathermap.org</i> and processed for display.';
    topNotes.innerHTML += `<br>The correlation between daily maximum and minimum temperatures is <span class="highlightedText">&ensp;${parsedData[0]}&ensp;</span>.`;
    topNotes.innerHTML += `<br>The standard deviation of daily maximum temperatures is <span class="highlightedText">&ensp;${parsedData[1]}° C&ensp;</span>`;
    topNotes.innerHTML += `, and that of daily minimum temperatures is <span class="highlightedText">&ensp;${parsedData[2]}° C&ensp;</span>.`;
    let endNotes = document.getElementById('endNotes');
    endNotes.innerHTML = '<br><br>Notes:';
    endNotes.innerHTML += '<br><small>Data are for 51°30\' N, 0° W (north Greenwich).</small>';
    endNotes.innerHTML += '<br><small>Correlation statistics are to one decimal place and standard deviation statistics are to two decimal places.</small>';
    endNotes.innerHTML += '<br><small>The correlation statistic provided is Pearson\'s coefficient of correlation.</small>';
    // endNotes.innerHTML += '<br><small>Twenty-four-hour periods are measured back from the most recent piece of data available at the moment of loading the page.</small>';
    // endNotes.innerHTML += '<br><small>For example, "current" actually indicates the most recent twenty-four hours of data available at the moment of loading.</small>';
}
window.onresize = resizeChart;
function resizeChart() {
    let graph = document.getElementById('graph');
    graph.style.width = '1100px';
    graph.style.maxWidth = '88vw';
}
