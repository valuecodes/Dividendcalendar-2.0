import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
// import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class MainChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            chartOptions: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        let months = [];
        let sum = [];
        props.createChart.forEach((month, index) => {
            months[index] = month.name;
            sum[index] = Math.round(month.sumOfDiv * 100) / 100;
        });
        let data = {
            labels: months,
            datasets: [
                {
                    data: sum,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
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
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                }
            ]
        }
        let options = {
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    display: true,
                    color: 'black',
                    align: 'end',
                    font: {
                        size: 25,
                    }
                },

            }
        }
        return {
            chartData: data,
            chartOptions: options
        }
        // return null;
    }
    render() {
        return (
            <div className='mainChart' id='mainChart'>
                <div className='chart'>¨
                <Line
                        data={this.state.chartData}
                        width={100}
                        height={350}
                        options={this.state.chartOptions}
                    />
                </div>
            </div>
        )
    }

}

export default MainChart
