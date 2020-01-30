import React, { Component } from 'react'
import { element } from 'prop-types';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            sector: "",
            country: "",
            eps: "",
            price: "",
            dividend: "",
            dividendYield: "",
            pe: "",
            eps: "",
            epsGrowthRate: "",
            dividendGrowthRate: "",
            priceGrowth: "",
            growthTime: ""
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {
            let price = props.selectedCompany.weeklyData[0].close;
            let eps = 0;
            let len = props.selectedCompany.earnings.length - 1;
            console.log(len);
            for (var i = len; i > len - 4; i--) {
                eps += Number(props.selectedCompany.earnings[i].eps)
            }
            let annualD = {};
            let annualE = {};
            let annualP = {};

            for (var a = 2014; a < 2020; a++) {
                annualD[a] = 0;
                annualE[a] = 0;
                props.selectedCompany.dividend.forEach(element => {
                    if (element.year === a) {
                        annualD[a] += element.dividend
                    }
                })
                props.selectedCompany.earnings.forEach(element => {
                    if (element.year === a) {
                        annualE[a] += Number(element.eps);
                    }
                })
                annualP[a] = props.selectedCompany.weeklyData.filter(element => element.year === a && element.month === 1)[0].close;
            }
            annualP[2020] = price;
            let dividend = annualD[2019];
            eps = Number(eps.toFixed(2));
            dividend = Number(dividend.toFixed(2));

            let epsGrowthRate = getGrowthRate(annualE);
            let dividendGrowthRate = getGrowthRate(annualD);
            let annualPriceGrowth = getGrowthRate(annualP);
            let dividendYield = Number(((dividend / price) * 100).toFixed(2));
            let pe = Number((price / eps).toFixed(2));
            let growthTime = Object.keys(annualE).length;

            let label = ['Earnings', 'Dividend', 'Stock price']
            let rates = [epsGrowthRate, dividendGrowthRate, annualPriceGrowth];
            let colors = [];
            rates.forEach(element => {
                console.log(element);
                if (element >= 0) {
                    colors.push('rgba(71, 189, 138, 0.5)');
                } else {
                    colors.push('rgba(245, 61, 29, 0.5)');
                }
            })

            let data = {
                labels: label,
                datasets: [
                    {
                        data: rates,
                        label: 'Price Chart',
                        backgroundColor: colors,
                        borderColor: [
                        ],
                        borderWidth: 1,
                        // pointRadius: pStyle,
                        // pointHitRadius: pStyle,
                        // hidden: state.dividendYield,
                    }
                ]
            }

            let options = {
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
                width: "100px",
                height: "100px",
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'center',
                        font: {
                            size: 20,
                        },
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
                tooltips: {
                    // enabled: !state.dividendYield,
                    cornerRadius: 10,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let divLabel;
                            let count = 0;
                            return Number(tooltipItem.value).toFixed(1) + '%';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                return value + "%";
                            },
                            fontSize: 15
                        }
                    }],
                }
            }

            return {
                chartData: data,
                chartOptions: options,
                selectedCompany: props.selectedCompany,
                sector: props.selectedCompany.sector,
                country: props.selectedCompany.country,
                eps: eps,
                price: price,
                dividend: dividend,
                dividendYield: dividendYield,
                pe: pe,
                epsGrowthRate: epsGrowthRate,
                dividendGrowthRate: dividendGrowthRate,
                priceGrowth: annualPriceGrowth,
                growthTime: growthTime
            }
        }
        return false
    }


    render() {
        console.log(this.state);
        return (
            <div id='statistics'>
                <div id='stats'>
                    <p>Sector</p>
                    <h3>{this.state.sector}</h3>
                    <p>Country</p>
                    <h3>{this.state.country}</h3>
                    <p>Share Price</p>
                    <h3>{this.state.price}</h3>
                    <p>Eps</p>
                    <h3>{this.state.eps}</h3>
                    <p>Dividend</p>
                    <h3>{this.state.dividend}</h3>
                    <p>Dividend Yield</p>
                    <h3>{this.state.dividendYield}%</h3>
                    <p>PE</p>
                    <h3>{this.state.pe}</h3>
                    <p>PEG</p>
                    <h3>{this.state.pe}</h3>
                </div>
                <div id="growthGraphs">
                    <h2 id='growthRate'>Annual {this.state.growthTime} year growth rates</h2>
                    <Bar
                        data={this.state.chartData}
                        width={50}
                        height={39}
                        options={this.state.chartOptions}
                        datasetKeyProvider={this.datasetKeyProvider}
                    />
                </div>
            </div>
        )
    }
}

export default Statistics

let getGrowthRate = (annual) => {
    let endYear = Object.keys(annual)[Object.keys(annual).length - 1]
    let startYear = Object.keys(annual)[0];
    let years = Object.keys(annual).length
    let growthRate = (((Math.pow(annual[endYear] / annual[startYear], 1 / years)) - 1) * 100);
    return Number(growthRate.toFixed(1));
}