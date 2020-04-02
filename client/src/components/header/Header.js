import React, { Component } from 'react'
import Currencies from './currencies'

export class Header extends Component {
    render() {
        return (
            <div>
                <h1 id='mainHeader'>Dividend calender</h1>
                <Currencies />
            </div>
        )
    }
}

export default Header
