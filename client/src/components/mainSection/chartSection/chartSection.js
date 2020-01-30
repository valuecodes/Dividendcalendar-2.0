import React, { Component } from 'react';
import { SetTarget } from './setTarget';
import { MainChart } from './mainChart';

export class ChartSection extends Component {

    constructor() {
        super();
        this.state = {
            monthSum: [],
            allData: null
        };
    }

    componentDidMount() {
        class month {
            constructor(id, name, sumOfDiv) {
                this.id = id;
                this.name = name;
                this.sumOfDiv = sumOfDiv;
            }
        }
        let monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let months = [];
        for (var i = 0; i < 12; i++) {
            months[i] = new month(i, monthsName[i], 0);
        }
        this.setState({ monthSum: months })
    }

    static getDerivedStateFromProps(props, state) {
        // console.log(JSON.stringify(props.allData));
        // console.log(Object(props.allData).length === 0)

        if (Object(props.monthStackData).length !== 0) {
            let dividends = props.monthStackData;
            let monthSum = state.monthSum;
            monthSum.forEach(month => month.sumOfDiv = 0);
            for (var i = 0; i < 12; i++) {
                for (var a = 0; a < dividends[i].data.length; a++) {
                    monthSum[i].sumOfDiv += dividends[i].data[a].sum
                }
            }
            return {
                monthSum: monthSum,
                allData: props.allData
            }
        }
        return null;
    }

    render() {
        return (
            <div className='chartSection'>
                <SetTarget />
                {<MainChart createChart={this.state.monthSum} />}
            </div>
        )
    }
}

export default ChartSection
