import React, { Component } from 'react';
import { PriceChart } from './priceChart';
import { EarningsChart } from './earningsChart';
import { Statistics } from './statistics';
import { ForecastChart } from './forecastChart';

export class TickerInfoPage extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.selectedCompany !== null) {
            return {
                selectedCompany: props.selectedCompany,
            }
        }
        return false
    }
    datasetKeyProvider() { return Math.random(); }
    render() {
        return (
            <div>
                <div id="tickerInfoBar">
                    <button id="closeInfoPage" onClick={this.props.closeInfoPage}>Back</button>
                    <h1 id="infoName">{this.state.selectedCompany.name}({this.state.selectedCompany.ticker})</h1>
                    {/* <h1>{this.state.selectedCompany.ticker}</h1> */}
                    {/* <h1>{this.state.selectedCompany.sector}</h1> */}
                    {/* <h1>{this.state.selectedCompany.country}</h1> */}
                </div>
                <div id='tickerInfoCharts'>
                    <PriceChart selectedCompany={this.state.selectedCompany} />
                    <Statistics selectedCompany={this.state.selectedCompany} />
                    <EarningsChart selectedCompany={this.state.selectedCompany} />
                    <ForecastChart selectedCompany={this.state.selectedCompany} />
                </div>

            </div>
        )
    }
}

export default TickerInfoPage
