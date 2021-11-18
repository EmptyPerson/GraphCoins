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
        this.APIKey = {"X-CoinAPI-Key": "F48B7E48-AFAC-4AA4-8159-9EAC547589A1"};
    }

    async getData(periodId) {
        this.url = `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=${periodId}&time_start=${time_start}&time_end=${time_end}&limit=${limit}`;
        let response = await fetch(this.url, {
            method: "GET",
            headers: this.APIKey,
        });

        if (response.status === 200) {
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

        if (response.status === 200) {
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

        if (response.status === 200) {

            let symbolID = await response.json();

            for (let note of symbolID) {
                this.symbolMap.set(note['symbol_id'], note['exchange_id']);
            }

            return this.symbolMap;
        } else {
            throw new HttpError(response);
        }

    }

    CalculatePeriodId(limit, time_start, time_end) {
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

    static FormatDate(date, format) {

        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        let yy;
        if (format == 'dd.mm.yyyy hh:mm:ss') {
            yy = date.getFullYear() % 100;
        } else if (format == 'yyyy-mm-ddThh:mm:ss') {
            yy = date.getFullYear();
        }
        if (yy < 10) yy = '0' + yy;

        let hh = date.getHours();
        if (hh < 10) hh = '0' + hh;

        let min = date.getMinutes();
        if (min < 10) min = '0' + min;

        let ss = date.getSeconds();
        if (ss < 10) ss = '0' + ss;


        if (format == 'dd.mm.yyyy hh:mm:ss') {
            return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + min + ':' + ss;
        } else if (format == 'yyyy-mm-ddThh:mm:ss') {
            return yy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss;

        }
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
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: false,
                            borderColor: 'rgba(0, 0, 0, 1)'
                        },
                        ticks: {
                            color: 'rgba(255, 99, 132, 1)',
                            stepSize : 50,
                        }

                    },
                    y: {
                        grid: {
                            borderColor: 'rgba(0, 0, 0, 1)'
                        },
                        ticks: {
                            color: 'rgba(255, 99, 132, 1)'
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false,

                    }
                }
            }


        };

    }

    addData(chart, labels, data) {
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

    removeData(chart) {
        chart.data.labels = [];
        myChart.data.datasets[0].data = []
        chart.update();
    }
}

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;

    }

    CodeError() {
        if (this.response.status === 400) {
            alert("There is something wrong with your request");
        } else if (this.response.status === 401) {
            alert("Unauthorized -- Your API key is wrong");
        } else if (this.response.status === 403) {
            alert("Forbidden -- Your API key doesn't have enough privileges to access this resource");
        } else if (this.response.status === 429) {
            alert("Too many requests -- You have exceeded your API key rate limits");
        } else if (this.response.status === 550) {
            alert("No data -- You requested specific single item that we don't have at this moment");
        }
    }
}

//input buttons
function ButtonChooseCoin() {
    document.getElementById("myDropdownCoin").classList.toggle("show");
}

async function ChooseTime(ChoiceTime) {
    data.cleaningDate();
    time_start = DataModel.FormatDate(TimeId.get(ChoiceTime), 'yyyy-mm-ddThh:mm:ss');
    document.getElementById("timefromto").innerText = "from " + DataModel.FormatDate(new Date(time_start), 'dd.mm.yyyy hh:mm:ss') + " to " + DataModel.FormatDate(new Date(time_end), 'dd.mm.yyyy hh:mm:ss');
    await main();
}

async function ChooseCoin(ChoiceCoins) {
    data.cleaningDate();
    symbolId = CoinID.get(ChoiceCoins);
    document.getElementById("choose-coin").innerText = ChoiceCoins;
    await main();
}

async function fun1() {
    data.cleaningDate();
    let rng = document.getElementById('r1');
    limit = rng.value;
    await main();
}

document.getElementById('btn-download').onclick = function() {
    let a = document.createElement('a');
    a.href = myChart.toBase64Image();
    a.download = 'CoinChart.png';
    a.click();
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");

        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
//Data for setup
const CoinID = new Map();
CoinID.set('Bitcoin', 'BITSTAMP_SPOT_BTC_USD');
CoinID.set('Ethereum', 'ETOROX_SPOT_ETC_USD');
CoinID.set('Atom', 'ETOROX_SPOT_ATOM_USD');
CoinID.set('Doge', 'ETOROX_SPOT_DOGE_USD');
let symbolId = 'BITSTAMP_SPOT_BTC_USD';

let today = new Date();
let diffTime = new Date();
diffTime.setDate(diffTime.getDate() - 1);
let time_end = DataModel.FormatDate(today, 'yyyy-mm-ddThh:mm:ss');
let time_start = DataModel.FormatDate(diffTime, 'yyyy-mm-ddThh:mm:ss');
let limit = '50';
document.getElementById("timefromto").innerText = "from " + DataModel.FormatDate(today, 'dd.mm.yyyy hh:mm:ss') + " to " + DataModel.FormatDate(diffTime, 'dd.mm.yyyy hh:mm:ss');

let TimeId = new Map();
TimeId.set('6 hour', new Date(new Date().setHours(today.getHours() - 6)));
TimeId.set('12 hours', new Date(new Date().setHours(today.getHours() - 12)));
TimeId.set('1 day', new Date(new Date().setDate(today.getDate() - 1)));
TimeId.set('1 week', new Date(new Date().setDate(today.getDate() - 7)));
TimeId.set('1 month', new Date(new Date().setMonth(today.getMonth() - 1)));
TimeId.set('1 year', new Date(new Date().setFullYear(today.getFullYear() - 1)));

let data = new DataModel();
const el = document.getElementById('myChart');
const ctx = el.getContext('2d');

let view = new viewModel();
let myChart = new Chart(ctx, view.chartConfig());

async function main() {
    let result;

    try {
        await data.getPeriod();
        let periodId = data.CalculatePeriodId(limit, time_start, time_end);
        result = await data.getData(periodId);
    } catch (err) {
        if (err instanceof HttpError) {
            err.CodeError();
        } else {
            alert(err);
            throw err;
        }
    }

    let date = result[0].map((value) => {
        return DataModel.FormatDate(value, 'dd.mm.yyyy hh:mm:ss')
    });
    let price = result[1];

    view.removeData(myChart);
    view.addData(myChart, date, price);
}

main();
