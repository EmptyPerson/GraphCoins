'use strict'
class DataModel {
    constructor() {
        this.startPeriods = [];
        this.openPrices = [];
        this.url = `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=${time_start}&time_end=${time_end}&limit=${limit}`;
        this.urlPeriod = `https://rest.coinapi.io/v1/ohlcv/periods`;
        this.periodId = [];
        this.lengthSeconds = [];
        this.periodMap = new Map();
    }
    async getData() {
        let response =  await fetch(this.url, {
            method: "GET",
            headers: {"X-CoinAPI-Key": "899668AD-E295-40F7-903B-CFE2D7DAF0C0"},
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
};

// Second	1SEC, 2SEC, 3SEC, 4SEC, 5SEC, 6SEC, 10SEC, 15SEC, 20SEC, 30SEC
// Minute	1MIN, 2MIN, 3MIN, 4MIN, 5MIN, 6MIN, 10MIN, 15MIN, 20MIN, 30MIN
// Hour	1HRS, 2HRS, 3HRS, 4HRS, 6HRS, 8HRS, 12HRS
// Day	1DAY, 2DAY, 3DAY, 5DAY, 7DAY, 10DAY
// Month	1MTH, 2MTH, 3MTH, 4MTH, 6MTH
// Year	1YRS, 2YRS, 3YRS, 4YRS, 5YRS
function CalculatePeriodId(time_start, time_end, countGraphPoints = 100) {
    let periodMap = new Map();
    //let countGraphPoints = 100;

    periodMap.set("1SEC", 1 * countGraphPoints);
    periodMap.set("2SEC", 2 * countGraphPoints);
    periodMap.set("3SEC", 3 * countGraphPoints);
    periodMap.set("4SEC", 4 * countGraphPoints);
    periodMap.set("5SEC", 5 * countGraphPoints);
    periodMap.set("6SEC", 6 * countGraphPoints);
    periodMap.set("10SEC", 10 * countGraphPoints);
    periodMap.set("15SEC", 15 * countGraphPoints);
    periodMap.set("20SEC", 20 * countGraphPoints);
    periodMap.set("30SEC", 30 * countGraphPoints);
    periodMap.set("1MIN", 60 * countGraphPoints);
    periodMap.set("2MIN", 120 * countGraphPoints);
    periodMap.set("3MIN", 180 * countGraphPoints);
    periodMap.set("4MIN", 240 * countGraphPoints);
    periodMap.set("5MIN", 300 * countGraphPoints);
    periodMap.set("6MIN", 360 * countGraphPoints);
    periodMap.set("10MIN", 600 * countGraphPoints);
    periodMap.set("15MIN", 900 * countGraphPoints);
    periodMap.set("20MIN", 1200 * countGraphPoints);
    periodMap.set("30MIN", 1800 * countGraphPoints);
    periodMap.set("15MIN", 900 * countGraphPoints);

}


const time_start = '2018-01-01T00:00:00';
const symbolId = 'BITSTAMP_SPOT_BTC_USD';
const periodId = '1HRS';
const time_end = '2018-01-02T00:00:00';
const limit = 100;
let data = new DataModel();
const el = document.getElementById('myChart');
//el.height = window.screen.height;
const ctx = el.getContext('2d');

async function main() {
    let period = await data.getPeriod();
    alert(period.get('5SEC'));
    let result = await data.getData();
    alert(result[0]);
    let date =  result[0].map(DataModel.FormatDate);//  result[0].map(formatDate);
    let price = result[1];

    let view = new viewModel(date, price);
    let myChart = new Chart(ctx, view.chartConfig());

}
main();
