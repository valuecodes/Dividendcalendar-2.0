import React, { Component } from 'react'
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class EarningsChart extends Component {

    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            timeFrame: 'Yearly',
            payoutRatio: true,
            peRatio: false,
            earnings: false,
            earningsYield: false,
            chartChange: "Earnings Chart",
            chartLabel: 'Payout Ratio'
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {

            let label = [];
            let edata = [];
            let ddata = [];
            let pdata = [];
            let pedata = [];
            let eYdata = [];
            let wData = [];
            if (state.peRatio === false && state.earningsYield === false) {
                if (state.timeFrame === 'Yearly') {
                    for (var i = 2014; i < 2020; i++) {
                        let yearlyE = props.selectedCompany.earnings.filter(element => element.year == i);
                        let sumE = 0;
                        yearlyE.forEach(element => sumE += Number(element.eps));

                        let yearlyD = props.selectedCompany.dividend.filter(element => element.year == i);
                        let sumD = 0;
                        yearlyD.forEach(element => (sumD += Number(element.dividend)));
                        edata.push(sumE.toFixed(2));
                        ddata.push(sumD.toFixed(2));
                        label.push(i);
                    }
                } else {
                    props.selectedCompany.earnings.forEach(element => {
                        if (element.year >= 2014) {
                            label.push(element.year + ' Q' + element.quarter);
                            edata.push(Number(element.eps));
                        }
                    });
                    props.selectedCompany.dividend.forEach(element => {
                        if (element.year >= 2014) {
                            ddata.unshift(element.dividend);
                        }
                    });
                }
            } else {
                let qEData = {};
                props.selectedCompany.earnings.forEach(element => {
                    if (element.year >= 2014) {
                        // label.push(element.year + ' Q' + element.quarter);
                        qEData[element.year + '/' + element.quarter] = Number(element.eps);
                        // edata.push(Number(element.eps));
                    }
                });

                let keys = Object.keys(qEData);
                keys = keys.reverse();
                let trailing = {};
                for (var s = 0; s < keys.length; s++) {
                    trailing[keys[s]] = 0;
                    for (var d = s; d < s + 4; d++) {
                        trailing[keys[s]] += qEData[keys[d]];
                    }
                    if (keys.length - s < 4) {
                        trailing[keys[s]] = trailing[keys[s - 1]]
                    }
                }

                props.selectedCompany.weeklyData.forEach(element => {
                    if (element.year >= 2014 && element.year < 2020) {
                        // let sum;
                        // for (var i = 0;)
                        label.unshift(element.year + ' Q' + element.quarter);
                        if (state.earningsYield) {
                            eYdata.unshift(((trailing[element.year + '/' + element.quarter] / element.close) * 100).toFixed(2));
                        } else {
                            pedata.unshift((element.close / trailing[element.year + '/' + element.quarter]).toFixed(2));
                        }
                    }
                });
            }

            let dlabel = true;

            if (state.peRatio || state.earningsYield) {
                dlabel = false;
            }


            for (var i = 0; i < edata.length; i++) {
                pdata.push((ddata[i] / edata[i] * 100).toFixed(0))
            }
            let fontSize = state.timeFrame === 'Yearly' && state.payoutRatio ? 25 : 12;
            let data = {
                labels: label,
                datasets: [
                    {
                        data: edata,
                        label: 'EPS',
                        backgroundColor: [
                            'rgba(71, 189, 138, 0.5)',
                        ],
                        borderColor: [
                        ],
                        borderWidth: 1,
                        hidden: !state.earnings,
                    },
                    {
                        data: ddata,
                        label: 'Dividend',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        hidden: !state.earnings
                    },
                    {
                        type: 'bar',
                        label: 'Payout Ratio',
                        data: pdata,
                        backgroundColor: 'rgba(255, 50, 97,0.8)',
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        maxBarThickness: 80,
                        hidden: !state.payoutRatio
                    },
                    {
                        data: pedata,
                        label: 'PE-Ratio',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.peRatio
                    },
                    {
                        data: eYdata,
                        label: 'Earnings Yields',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.earningsYield
                    }
                ]
            }
            let options = {
                maintainAspectRatio: true,
                responsive: true,
                width: "100px",
                height: "100px",
                plugins: {
                    datalabels: {
                        display: dlabel,
                        color: 'black',
                        align: 'end',
                        font: {
                            size: fontSize,
                        },
                        formatter: (value, ctx) => {
                            if (state.payoutRatio || state.earningsYield) {
                                return value + '%';
                            } else {
                                return value;
                            }

                        }
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: state.payoutRatio || state.earnings ? true : false,
                            callback: function (value) {
                                if (state.payoutRatio || state.earningsYield) {
                                    return value + "%";
                                } else {
                                    return value;
                                }

                            }
                        }
                    }],
                    xAxes: [{
                        offset: state.payoutRatio,
                        ticks: {
                            fontSize: 14
                        }
                    }],
                },
                // tooltips: {
                //     // enabled: !state.dividendYield,
                //     cornerRadius: 10,
                //     callbacks: {
                //         label: function (tooltipItem, data) {
                //             let divLabel;
                //             let count = 0;
                //             if (state.earningsYield) {
                //                 return Number(tooltipItem.value).toFixed(1) + '%';
                //             } else {
                //                 // return tooltipItem.value;
                //             }

                //         }
                //     }
                // },
                legend: {
                    display: state.earnings,
                    position: 'top',
                    labels: {
                        "fontSize": 15,
                        filter: function (item, chart) {
                            let check = true;
                            if (item.text.includes('atio') || item.text.includes('Yield')) {
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

    changeTimeFrame() {
        if (this.state.timeFrame === 'Yearly') {
            this.setState({ timeFrame: 'Quarterly' })
        } else {
            this.setState({ timeFrame: 'Yearly' })
        }
    }

    changeType(type) {
        let payRatio = false;
        let peRatio = false;
        let earnings = false;
        let eYield = false;
        if (type === "Payout Ratio") {
            payRatio = true
        }
        if (type === 'Historical PE-Ratio') {
            peRatio = true
        }
        if (type === 'Earnings Yield') {
            eYield = true
        }
        if (type === "Earnings and Dividends") {
            earnings = true
        }

        this.setState({ payoutRatio: payRatio, peRatio: peRatio, earnings: earnings, earningsYield: eYield, chartLabel: type, chartChange: type });
    }

    datasetKeyProvider() { return Math.random(); }

    setColor(position) {
        if (this.state.chartLabel === position) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }
    render() {
        return (
            <div id='earningsChart'>
                <div id="earningsChartOptions">
                    <h2 id="earningsChartLabel">{this.state.chartLabel}</h2>
                    {/* <p></p> */}
                    <button id="earningsTimeFrame" onClick={this.changeTimeFrame.bind(this)}>{this.state.timeFrame}</button>
                    <button style={{ background: this.setColor("Payout Ratio") }} onClick={this.changeType.bind(this, "Payout Ratio")}>Payout Ratio</button>
                    <button style={{ background: this.setColor("Earnings and Dividends") }} onClick={this.changeType.bind(this, "Earnings and Dividends")}>Earnings</button>
                    <button style={{ background: this.setColor("Historical PE-Ratio") }} onClick={this.changeType.bind(this, "Historical PE-Ratio")}>PE-ratio</button>
                    <button style={{ background: this.setColor("Earnings Yield") }} onClick={this.changeType.bind(this, "Earnings Yield")}>Earnings Yield</button>
                </div>
                <Line
                    type={'Bar'}
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

export default EarningsChart
