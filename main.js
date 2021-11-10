'use strict'

class DataModel {
    constructor() {
        this.HistoryTime = [];
        this.Prices = [];
        this.urlSymbol = `https://rest.coinapi.io/v1/symbols`;
        this.urlPeriod = `https://rest.coinapi.io/v1/ohlcv/periods`;
        this.periodMap = new Map();
        this.symbolMap = new Map();
        this.periodFlag = [];
        this.APIKey = {"X-CoinAPI-Key": "7382133D-FE4D-4446-B34D-F7C924F9B538"};
    }

    async getData(periodId) {
        this.url = `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=${time_start}&time_end=${time_end}&limit=${limit}`;
        let response = await fetch(this.url, {
            method: "GET",
            headers: this.APIKey,
        });

        if (response.status == 200) {
            let data = await response.json();

            for (let note of data) {
                this.HistoryTime.push(new Date(note['time_period_start']));
                this.Prices.push(note['price_open']);
            }

            return [this.HistoryTime, this.Prices];

        } else {
            throw new HttpError(response);
        }
    }

    async getPeriod() {
        let response = await fetch(this.urlPeriod, {
            method: "GET",
            headers: this.APIKey,
        });

        if (response.status == 200) {
            let period = await response.json();
            for (let note of period) {
                if (note['length_seconds'] != 0) {
                    this.periodMap.set(note['period_id'], note['length_seconds']);

                } else {
                    this.periodMap.set(note['period_id'], note['length_months'] * 30 * 24 * 60 * 60);
                }
            }
            return this.periodMap;
        } else {
            throw new HttpError(response);
        }

    }

    async getSymbol() { // show all ID coins
        let response = await fetch(this.urlSymbol, {
            method: "GET",
            headers: this.APIKey,
        });

        if (response.status == 200) {

            let symbolID = await response.json();

            for (let note of symbolID) {
                this.symbolMap.set(note['symbol_id'], note['exchange_id']);
            }

            return this.symbolMap;
        } else {
            throw new HttpError(response);
        }

    }

    CalculatePeriodId(limit = 100, time_start, time_end) {
        let time_1 = new Date(time_start);
        let time_2 = new Date(time_end);
        let diffSeconds = (time_2.getTime() - time_1.getTime()) / (1000 * limit);

        this.periodMap.forEach((value, key, map) => {
            if (value >= diffSeconds) {
                this.periodFlag.push(key);
            }
        });

        return this.periodFlag[0];
    }

    cleaningDate() {
        this.periodMap.clear();
        this.symbolMap.clear();
        this.HistoryTime = [];
        this.periodFlag = [];
        this.Prices = [];

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
    constructor(timeGraph = [], valueGraph = []) {
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
            //         y: { // defining min and max so hiding the dataset does not change scale range
            //             min: 0,
            //             max: 70000
            //         }
            //     }
            // }
        };

    }
}

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;

    }

    CodeError() {
        if (this.response.status == 400) {
            alert("There is something wrong with your request");
        } else if (this.response.status == 401) {
            alert("Unauthorized -- Your API key is wrong");
        } else if (this.response.status == 403) {
            alert("Forbidden -- Your API key doesn't have enough privileges to access this resource");
        } else if (this.response.status == 429) {
            alert("Too many requests -- You have exceeded your API key rate limits");
        } else if (this.response.status == 550) {
            alert("No data -- You requested specific single item that we don't have at this moment");
        }
    }
}


function ButtonChooseCoin() {
    document.getElementById("myDropdownCoin").classList.toggle("show");
}

function ButtonChooseTime() {
    document.getElementById("myDropdownTime").classList.toggle("show");
}

async function ChooseTime(ChoiceTime) {
    data.cleaningDate();
    time_start = setTime(TimeId.get(ChoiceTime));
    document.getElementById("choose-time").innerText = ChoiceTime;
    await main();
}

async function ChooseCoin(ChoiceCoins) {
    data.cleaningDate();
    symbolId = CoinID.get(ChoiceCoins);
    document.getElementById("choose-coin").innerText = ChoiceCoins;
    await main();
}

function setTime(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    let hh = date.getHours();
    if (hh < 10) hh = '0' + hh;

    let min = date.getMinutes();
    if (min < 10) min = '0' + min;

    let ss = date.getSeconds();
    if (ss < 10) ss = '0' + ss;

    return yy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss;
}
function addData(chart, labels, data) {
    labels.forEach((label) => {
        chart.data.labels.push(label);
    })
    chart.data.datasets.forEach((dataset) => {
        data.forEach((note) => {
            dataset.data.push(note);
        })
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels = [];
    myChart.data.datasets[0].data = []
    chart.update();
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbutton')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let dropdownsTime = document.getElementsByClassName("dropdowntime-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }

        for (i = 0; i < dropdownsTime.length; i++) {
            let openDropdown = dropdownsTime[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//const time_start = '2021-09-01T00:00:00';
let symbolId = 'BITSTAMP_SPOT_BTC_USD';
//const time_end = '2021-11-09T00:00:00';
let today = new Date();
let diffTime = new Date();
diffTime.setDate(diffTime.getDate() - 1);
let time_end = setTime(today);
let time_start = setTime(diffTime);
const limit = 300;

let TimeId = new Map();

TimeId.set('6 hours', new Date(new Date().setHours(today.getHours() - 6)));
TimeId.set('12 hours', new Date(new Date().setHours(today.getHours() - 12)));
TimeId.set('1 day', new Date(new Date().setDate(today.getDate() - 1)));
TimeId.set('5 days', new Date(new Date().setDate(today.getDate() - 5)));
TimeId.set('10 days', new Date(new Date().setDate(today.getDate() - 10)));
TimeId.set('15 days', new Date(new Date().setDate(today.getDate() - 15)));
TimeId.set('1 month', new Date(new Date().setMonth(today.getMonth() - 1)));
TimeId.set('3 months', new Date(new Date().setMonth(today.getMonth() - 3)));
TimeId.set('6 months', new Date(new Date().setMonth(today.getMonth() - 6)));
TimeId.set('1 year', new Date(new Date().setFullYear(today.getFullYear() - 1)));
TimeId.set('2 year', new Date(new Date().setFullYear(today.getFullYear() - 2)));

let data = new DataModel();
const el = document.getElementById('myChart');
const ctx = el.getContext('2d');
let view = new viewModel();
let myChart = new Chart(ctx, view.chartConfig());

const CoinID = new Map();
CoinID.set('Bitcoin', 'BITSTAMP_SPOT_BTC_USD');
CoinID.set('Ethereum', 'ETOROX_SPOT_ETC_USD');
CoinID.set('Atom', 'ETOROX_SPOT_ATOM_USD');
CoinID.set('Doge', 'ETOROX_SPOT_DOGE_USD');

async function main() {
    let result;
    try {
        await data.getPeriod();
    } catch (err) {
        if (err instanceof HttpError) {
            err.CodeError();
        } else {
            alert(err);
            throw err;
        }
    }
    let periodId = data.CalculatePeriodId(limit, time_start, time_end);

    try {
        result = await data.getData(periodId);
    } catch (err) {
        if (err instanceof HttpError) {
            err.CodeError();
        } else {
            alert(err);
            throw err;
        }
    }
    let date = result[0].map(DataModel.FormatDate);
    let price = result[1];

    removeData(myChart);
    addData(myChart, date, price);

}

main();
