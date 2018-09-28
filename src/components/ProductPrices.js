import React, { Component } from 'react';
import * as axios from 'axios';
import { GridLoader } from './Loader'

export default class ProductPrices extends Component {
    constructor() {
        super()
        this.state = {
            prices: [],
            showLoader: true,
            errorTimeout: 0
        }
        this.errTimeoutFN = undefined
    }
    componentWillMount() {
        this.loadPrices()
    }
    componentWillReceiveProps(nextProps) {
        clearTimeout(this.errTimeoutFN)
        this.loadPrices()
        this.setState({ showLoader: true })
    }
    loadPrices() {
        if (this.props.product) {
            axios
                .get('http://localhost:5000/api/Products/' + this.props.product + '/Prices')
                .then((res) => {
                    if (res.data.code === 0) {
                        this.setState({ showLoader: false, errorOccured: false, prices: res.data.result, errorTimeout: 0 });
                    } else {
                        this.setState({ showLoader: false, errorOccured: true, errorTimeout: this.getNewErrorTimeout() });
                    }
                })
                .catch((err) => {
                    this.setState({ showLoader: false, errorOccured: true, errorTimeout: this.getNewErrorTimeout() });
                    console.log(err);
                })
        }
    }
    getNewErrorTimeout() {
        return this.state.errorTimeout > 100000 ? 100000 : this.state.errorTimeout + 5000;
    }
    renderPricesLi() {
        this.state.prices.sort((a, b) => {
            return parseFloat(b.data.price) - parseFloat(a.data.price);
        })
        return this.state.prices.map((item, index) => {
            return (
                <li
                    className={['list-group-item', (index === 0 ? 'higher_price' : (index === this.state.prices.length - 1 ? 'lower_price' : ''))].join(' ')}
                    key={item.exchange}>
                    {item.exchange}: {item.data.price}
                </li>
            )
        });
    }
    renderPrices() {
        if (this.state.errorOccured) {
            this.errTimeoutFN = setTimeout(() => {
                this.loadPrices();
            }, this.state.errorTimeout);
            return (
                <div className='col-md-6'>
                    Oops, Some error occured. Trying within {this.state.errorTimeout / 1000} seconds...
                </div>
            );
        }
        if (this.state.prices.length) {
            return (
                <div className="col-md-6">
                    <ul className="list-group">
                        {this.renderPricesLi()}
                    </ul>
                </div>
            )
        }
    }
    render() {
        if (this.state.showLoader) {
            return (
                <GridLoader />
            );
        } else {
            return (
                <div className='row'>
                    <div className="col-md-3"></div>
                    {this.renderPrices()}
                    <div className="col-md-3"></div>
                </div>
            );
        }
    }
}