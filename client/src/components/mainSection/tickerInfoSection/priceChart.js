import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class PriceChart extends Component {
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
            console.log(props.selectedCompany);
            let label = [];
            let wData = [];
            let dData = [];
            let pStyle = [];
            let quarterDivs = {};
            let divYield = [];
            // let div

            let timeFrame = 2020 - state.timeFrame;

            props.selectedCompany.weeklyData.forEach(element => {
                if (element.year >= timeFrame) {

                    label.unshift(element.year + ' Q' + element.quarter);
                    wData.unshift(element.close);
                    dData.unshift((element.dividend));

                    if (element.dividend !== 0) {
                        // console.log(element.dividend, element.year, element.quarter);
                        pStyle.unshift('3');
                        let yearQ = element.year + '/' + element.quarter;
                        if (quarterDivs[yearQ] !== undefined) {
                            quarterDivs[yearQ] += element.dividend;
                        } else {
                            quarterDivs[yearQ] = element.dividend;
                        }
                    } else {
                        pStyle.unshift('0');
                    }
                }
            });
            let keys = Object.keys(quarterDivs);
            let trailing = {};
            for (var s = 0; s < keys.length; s++) {
                trailing[keys[s]] = 0;
                for (var d = s; d < s + 4; d++) {
                    trailing[keys[s]] += quarterDivs[keys[d]];
                }
                if (keys.length - s < 4) {
                    trailing[keys[s]] = trailing[keys[s - 1]]
                }
            }

            props.selectedCompany.weeklyData.forEach(element => {
                let sum = 0;
                if (element.year >= timeFrame) {
                    divYield.unshift((trailing[element.year + '/' + element.quarter] / element.close) * 100);
                }
            })

            let data = {
                labels: label,
                datasets: [
                    {
                        data: wData,
                        label: 'Price Chart',
                        backgroundColor: [
                            'rgba(71, 189, 138, 0.6)',
                        ],
                        borderColor: 'rgba(40, 49, 54, 1)',
                        borderWidth: 1,
                        pointRadius: pStyle,
                        pointHitRadius: pStyle,
                        hidden: state.dividendYield,
                    },
                    {
                        data: divYield,
                        label: 'Dividend Yield',
                        backgroundColor: [
                            'rgba(71, 89, 138, 0.8)',
                        ],
                        // borderColor: 'rgba(221, 89, 138, 0.5)',
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.dividendYield,
                    }
                ]
            }
            let options = {
                legend: {
                    display: false,
                },
                maintainAspectRatio: true,
                responsive: true,
                width: "100px",
                height: "100px",
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
                tooltips: {
                    // enabled: !state.dividendYield,
                    cornerRadius: 10,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let divLabel;
                            let count = 0;
                            if (!state.dividendYield) {
                                for (var i = 0; i < 52; i++) {
                                    count++;
                                    if (dData[tooltipItem.index + i] !== 0) {
                                        divLabel = dData[tooltipItem.index + i];
                                        break
                                    }
                                }
                                return "Dividend " + divLabel
                            } else {
                                return Number(tooltipItem.value).toFixed(1) + '%';
                            }

                        }
                    }
                },
                // plugins: {
                //     datalabels: {
                //         display: true,
                //         color: 'black',
                //         align: 'end',
                //         font: {
                //             size: 10,
                //         },
                //         formatter: (value, ctx, index) => {
                //             console.log(ctx.dataset.pointRadius, value);
                //             // if (state.payoutRatio) {
                //             //     return value + '%';
                //             // } else {
                //             //     return value;
                //             // }

                //         }
                //     },
                // },
                hover: {
                    enabled: false,
                    mode: null
                },
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        max: 12,
                        min: 1,
                        stepSize: 1,
                        callback: function (value, index, values) {
                            return dData.labels[index];
                        }
                    }
                }]
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

    dividendYield() {
        if (this.state.dividendYield === false) {
            this.setState({ dividendYield: true, chartType: "Stock Price", chartLabel: 'Historical Dividend Yield' })
        } else {
            this.setState({ dividendYield: false, chartType: "Dividend Yield", chartLabel: 'Stock price' })
        }
    }

    changeTimeFrame(value) {
        this.setState({ timeFrame: value });

    }

    myColor(position) {
        if (this.state.timeFrame === position) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }

    render() {
        return (
            <div id='priceChart'>
                <div id="priceChartOptions">
                    <h2 id="priceChartLabel">{this.state.chartLabel}</h2>
                    <button id='priceChange' onClick={this.dividendYield.bind(this)}>{this.state.chartType}</button>
                    <button style={{ background: this.myColor(1) }} onClick={this.changeTimeFrame.bind(this, 1)}>1 Year</button>
                    <button style={{ background: this.myColor(3) }} onClick={this.changeTimeFrame.bind(this, 3)}>3 Year</button>
                    <button style={{ background: this.myColor(5) }} onClick={this.changeTimeFrame.bind(this, 5)}>5 Year</button>
                    <button style={{ background: this.myColor(10) }} onClick={this.changeTimeFrame.bind(this, 10)}>10 Year</button>
                    <button style={{ background: this.myColor(20) }} onClick={this.changeTimeFrame.bind(this, 20)}>Max</button>
                </div>
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

export default PriceChart
