'use strict'

class DataModel {
    constructor() {
        this.startPeriods = [];
        this.openPrices = [];

        this.urlPeriod = `https://rest.coinapi.io/v1/ohlcv/periods`;
        this.periodId = [];
        this.lengthSeconds = [];
        this.periodMap = new Map();
    }
    async getData(periodId) {
        this.url = `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=${time_start}&time_end=${time_end}&limit=${limit}`;
        let response =  await fetch(this.url, {
            method: "GET",
            headers: {"X-CoinAPI-Key": "8C68FF6B-234A-4AF4-9629-4E4CF5DF8DE8"},
        });
        alert(response.status);
        let data = await response.json();

        for(let note of data) {
            this.startPeriods.push(new Date(note['time_period_start']));
            this.openPrices.push(note['price_open']);
        }

        return [this.startPeriods, this.openPrices];
    }
    async getPeriod() {
        let response =  await fetch(this.urlPeriod, {
            method: "GET",
            headers: {"X-CoinAPI-Key": "899668AD-E295-40F7-903B-CFE2D7DAF0C0"},
        });
        alert(response.status);
        let period = await response.json();
        for(let note of period) {
            if (note['length_seconds'] != 0) {
                this.periodId.push(note['period_id']);
                this.lengthSeconds.push(note['length_seconds']);
                this.periodMap.set(note['period_id'], note['length_seconds']);

            }else {
                this.periodId.push(note['period_id']);
                this.lengthSeconds.push(note['length_months'] * 30 * 24 * 60 * 60);
                this.periodMap.set(note['period_id'], note['length_months'] * 30 * 24 * 60 * 60);
            }
        }

        return this.periodMap;
        // for(let note of period) {
        //     this.startPeriods.push(new Date(note['time_period_start']));
        //     this.openPrices.push(note['price_open']);
        // };
    }
    CalculatePeriodId(limit = 100, time_start, time_end) {
        let time_1 = new Date(time_start);
        let time_2 = new Date(time_end);
        let diffSeconds = (time_2.getTime() - time_1.getTime()) / (1000 * limit);
        let periodFlag = [];

        this.periodMap.forEach((value, key, map) => {
            if (value >= diffSeconds) {
                periodFlag.push(key);
            }
        });

        return periodFlag[0];
    }
    static FormatDate(date) {

        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        let yy = date.getFullYear() % 100;
        if (yy < 10) yy = '0' + yy;

        let hh = date.getHours();
        if (hh < 10) hh = '0' + hh;

        let min = date.getMinutes();
        if (min < 10) min = '0' + min;

        let ss = date.getSeconds();
        if (ss < 10) ss = '0' + ss;

        return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + min + ':' + ss;
    }

}

class viewModel {
    constructor(timeGraph, valueGraph) {
        this.timeGraph = timeGraph;
        this.valueGraph = valueGraph;
    }
    chartConfig() {
        return {
            type: 'line',
            data: {
                labels: this.timeGraph,
                datasets: [{
                    label: 'Coin graphic',
                    data: this.valueGraph,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }//,
            // options: {
            //     scales: {
            //         y: {
            //             beginAtZero: true
            //         }
            //     }
            // }
        };

    }
}

class ControlModel {
    constructor() {

    }
}


// function CalculatePeriodId(periodMap, limit = 100, time_start, time_end) {
//     let time_1 = new Date(time_start);
//     let time_2 = new Date(time_end);
//     let diffSeconds = (time_2.getTime() - time_1.getTime()) / (1000 * limit);
//     let periodFlag = [];
//
//     periodMap.forEach((value, key, map) => {
//         if (value >= diffSeconds) {
//             periodFlag.push(key);
//         }; // огурец: 500 и так далее
//     });
//
//     return periodFlag[0];
// }


const time_start = '2018-01-01T00:00:00';
const symbolId = 'BITSTAMP_SPOT_BTC_USD';
//const periodId = '1HRS';
const time_end = '2018-01-02T00:00:00';
const limit = 100;
let data = new DataModel();
const el = document.getElementById('myChart');
//el.height = window.screen.height;
const ctx = el.getContext('2d');

async function main() {
    await data.getPeriod();
    let periodId = data.CalculatePeriodId(100, time_start, time_end);//CalculatePeriodId(data.periodMap, 100, time_start, time_end);
    let result = await data.getData(periodId);
    let date =  result[0].map(DataModel.FormatDate);//  result[0].map(formatDate);
    let price = result[1];
    let view = new viewModel(date, price);
    let myChart = new Chart(ctx, view.chartConfig());
}
main();
