import React, { Component } from 'react'

export class Currencies extends Component {

    constructor() {
        super();
        this.state = {
            currencies: { updated: "", data: {} },
            EURUSD: '',
            EURSEK: '',
            EURCAD: '',
            EURNOK: '',
        };
    }

    componentDidMount() {
        let currency = getCurrencyLocal();
        var d = new Date();
        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        let todayKey = day + '.' + month + '.' + year;

        if (currency === null) {
            this.updateCurrency(todayKey);
            console.log('Created currency Local Storage')
        } else if (todayKey !== currency.updated) {
            this.updateCurrency(todayKey);
            console.log('Updated currency Local Storage')
        } else {
            console.log('Local Storage Currencies is up to date at ' + todayKey)
            this.setState({
                currencies: currency,
                EURUSD: currency.data['USD'].slice(0, 6),
                EURSEK: currency.data['SEK'].slice(0, 6),
                EURCAD: currency.data['CAD'].slice(0, 6),
                EURNOK: currency.data['NOK'].slice(0, 6),
            });
        }
    }

    updateCurrency(todayKey) {
        // console.log('Updating...')
        // fetch('https://api.worldtradingdata.com/api/v1/forex?base=EUR&api_token=')
        //     .then(res => res.json())
        //     .then(data => {
        //         let cData = {
        //             updated: todayKey,
        //             data: data.data
        //         }
        //         localStorage.setItem('Currency', JSON.stringify(cData))
        //         this.setState({
        //             currencies: cData,
        //             EURUSD: cData.data['USD'].slice(0, 6),
        //             EURSEK: cData.data['SEK'].slice(0, 6),
        //             EURCAD: cData.data['CAD'].slice(0, 6),
        //             EURNOK: cData.data['NOK'].slice(0, 6),
        //         });
        //     })
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(Object.keys(this.state.currencies.data))

        if (JSON.stringify(this.state.currencies) !== JSON.stringify(nextState.currencies)) {
            return true;
        }
        return false;
    }

    render() {
        console.log(this.state);
        return (
            <div id='currencyContainer'>
                <p className='cHeader'>EURUSD</p>
                <p className='cHeader'>EURSEK</p>
                <p className='cHeader'>EURCAD</p>
                <p className='cHeader'>EURNOK</p>
                <p className='cHeader'>{this.state.EURUSD}</p>
                <p className='cHeader'>{this.state.EURSEK}</p>
                <p className='cHeader'>{this.state.EURCAD}</p>
                <p className='cHeader'>{this.state.EURNOK}</p>
            </div>
        )
    }
}

export default Currencies


let getCurrencyLocal = () => {
    let currencyData = localStorage.getItem('Currency');
    return JSON.parse(currencyData)
}