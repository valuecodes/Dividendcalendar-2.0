import React, { Component } from 'react'
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


export class ForecastChart extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            dividendYield: false,
            chartType: "Dividend Yield",
            chartLabel: "Stock Price",
            timeFrame: 5
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {
            let label = [];
            let dData = [];
            let fData = [];
            let yearlyData = {};
            let backGround = [];
            let fDataBackGround = [];
            let radius = [];

            let d2020 = 0;

            props.selectedCompany.weeklyData.forEach(element => {
                if (element.year >= 2010) {
                    if (element.year < 2020 && element.year > 2014) {
                        if (yearlyData[element.year] !== undefined) {
                            yearlyData[element.year] += element.dividend;
                        } else {
                            yearlyData[element.year] = 0;
                        }
                    }
                    if (element.dividend !== 0) {
                        label.unshift(element.year);
                        dData.unshift(element.dividend);
                        backGround.push('rgba(71, 189, 138, 0.6)');
                        fData.push(0);
                        radius.push(3);
                        let fDataBackGround = ['rgba(171, 159, 138, 1)'];
                        if (element.year === 2020) {
                            d2020++;
                        }
                    }
                }
            });
            let growth = getGrowthRate(yearlyData);
            console.log(growth);
            console.log(dData[dData.length - 4]);
            for (var i = 2020; i <= 2030; i++) {
                for (var j = 1; j <= 4; j++) {
                    label.push(i);
                    dData.push((dData[dData.length - 4] * growth).toFixed(2));
                    backGround.push('rgba(171, 89, 138, 0.6)');
                    fData.push((dData[dData.length - 4] * growth).toFixed(2));
                    radius.push(4);
                    let fDataBackGround = ['rgba(171, 89, 138, 0.9)'];
                }
            }
            console.log(label);

            let data = {
                labels: label,

                datasets: [
                    {
                        data: dData,
                        label: 'Price Chart',
                        backgroundColor: backGround,
                        borderColor: 'rgba(40, 49, 54, 1)',
                        fill: false,
                        pointRadius: radius,

                    },
                    {
                        label: 'Dividends',
                        backgroundColor: 'rgba(60,179,113)',
                        borderColor: 'rgba(0,0,0,0.6)',
                    },
                    {
                        label: 'Forecast',
                        backgroundColor: 'rgba(191, 120, 168, 0.6)',
                        borderColor: 'rgba(0,0,0,0.6)',
                    }
                ]
            }

            let options = {
                legend: {
                    // display: false
                },
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        align: 'end',
                        font: {
                            size: 12,
                        }
                    },
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }]
                },
                legend: {
                    position: 'top',
                    labels: {
                        "fontSize": 15,
                        filter: function (item, chart) {
                            let check = true;
                            if (item.text.includes('Price')) {
                                check = false
                            }
                            return check;
                        }
                    },
                    fontSize: 30
                }

            }
            return {
                selectedCompany: props.selectedCompany,
                chartData: data,
                chartOptions: options
            }
        }
        return false
    }
    datasetKeyProvider() { return Math.random(); }

    render() {
        return (
            <div id='forecastChart'>
                <h3>Forecast</h3>
                <Line
                    data={this.state.chartData}
                    width={50}
                    height={18}
                    options={this.state.chartOptions}
                    datasetKeyProvider={this.datasetKeyProvider}
                />
            </div>
        )
    }
}

export default ForecastChart

let getGrowthRate = (annual) => {
    let years = Object.keys(annual);
    let len = years.length - 1;
    let sum = 0;
    let growth = [];
    for (var i = 0; i < len; i++) {
        console.log(annual[years[i + 1]] / annual[years[i]], years[i]);
        sum += annual[years[i + 1]] / annual[years[i]];
        growth.push(annual[years[i + 1]] / annual[years[i]]);
    }
    return ((sum / len) / 100) * 100;
}