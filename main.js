'use strict'
class DataModel {
    constructor() {
        this.startPeriods = [];
        this.openPrices = [];
        this.url = `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=2018-01-01T00:00:00`;
        //  fetch(this.url, {
        //     method: "GET",
        //     headers: {"X-CoinAPI-Key": "A1904552-2F29-4BB0-8D41-0EC70971699A"},
        // }).then((response) => response.json()).then((data) => {
        //     for(let note of data) {
        //         this.startPeriods.push(note['time_period_start']);
        //         this.openPrices.push(note['price_open']);
        //     }
        // });
        //const myChart = new Chart(ctx, chartConfig(this.startPeriods, this.startPeriods));
    }
    async getData() {
        let response =  await fetch(this.url, {
            method: "GET",
            headers: {"X-CoinAPI-Key": "A1904552-2F29-4BB0-8D41-0EC70971699A"},
        });

        let data = await response.json();
        //alert(response.status);
        for(let note of data) {
            this.startPeriods.push(new Date(note['time_period_start']));
            this.openPrices.push(note['price_open']);
        }

        return [this.startPeriods, this.openPrices];
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
const ctx = document.getElementById('myChart').getContext('2d');


async function getData(url = '') {
    return (await fetch(url, {
        method: "GET",
        headers: {"X-CoinAPI-Key": "A1904552-2F29-4BB0-8D41-0EC70971699A"},
    })).json();
}


function chartConfig(labels, data) {
    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Coint graphic',
                data: data,
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

const symbolId = 'BITSTAMP_SPOT_BTC_USD';
const periodId = '1MIN';

// getData(`https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=2016-01-01T00:00:00`)
//     .then((data) => {
//         console.log(data);
//         let startPeriods = [];
//         let openPrices = [];
//         for(let note of data) {
//             startPeriods.push(note['time_period_start']);
//             openPrices.push(note['price_open']);
//         }
//         alert(openPrices);
//         const myChart = new Chart(ctx, chartConfig(startPeriods, openPrices));
//     });

// function formatDate(date) {
//
//     let dd = date.getDate();
//     if (dd < 10) dd = '0' + dd;
//
//     let mm = date.getMonth() + 1;
//     if (mm < 10) mm = '0' + mm;
//
//     let yy = date.getFullYear() % 100;
//     if (yy < 10) yy = '0' + yy;
//
//     let hh = date.getHours();
//     if (hh < 10) hh = '0' + hh;
//
//     let min = date.getMinutes();
//     if (min < 10) min = '0' + min;
//
//     let ss = date.getSeconds();
//     if (ss < 10) ss = '0' + ss;
//
//     return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + min + ':' + ss;
// }
// ;(async () => {
//
// })()
let data = new DataModel();

async function main() {
    //let result = await new DataModel();
    let result = await data.getData();
    let date = result[0].map(DataModel.FormatDate);//  result[0].map(formatDate);
    let price = result[1];
    alert(date);
    alert(price);
    const myChart = new Chart(ctx, chartConfig(date, price));
}
main();
// while (d.startPeriods === undefined || d.startPeriods.length <= 0) {
//
// }

// d.getData(`https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=2016-01-01T00:00:00`).then((data, da) => alert(data, da));
// alert(d.startPeriods);
