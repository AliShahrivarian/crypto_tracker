import React, { Component } from 'react';
import Select from 'react-select';
import * as axios from 'axios';
import ProductPrices from './ProductPrices';
import { EllipsisLoader } from './Loader';

export default class Products extends Component {
    constructor() {
        super()
        this.state = {
            products: [],
            selectedProducts: undefined,
            errorOccured: false,
            errorTimeout: 0,
            showLoader: true
        }
    }
    componentWillMount() {
        this.loadProducts();
    }
    loadProducts() {
        this.setState({ showLoader: true })
        axios
            .get('http://localhost:5000/api/Products')
            .then((res) => {
                if (res.data.code === 0) {
                    this.setState({ showLoader: false, products: res.data.result, errorOccured: false, errorTimeout: 0 });
                } else {
                    this.setState({ showLoader: false, errorOccured: true, errorTimeout: this.getNewErrorTimeout() })
                }
            })
            .catch((err) => {
                this.setState({ showLoader: false, errorOccured: true, errorTimeout: this.getNewErrorTimeout() })
                console.log(err)
            })
    }
    getNewErrorTimeout() {
        return this.state.errorTimeout > 100000 ? 100000 : this.state.errorTimeout + 5000;
    }
    buildSelectOptions() {
        return this.state.products.map((item) => {
            return { value: item.id, label: item.id }
        });
    }
    productChanged(selectedOption) {
        this.setState({ selectedProducts: selectedOption.value })
    }
    renderSelect() {
        if (this.state.errorOccured) {
            setTimeout(() => {
                this.loadProducts();
            }, this.state.errorTimeout);
            return (
                <div className='col-md-6'>
                    Oops, Some error occured. Trying within {this.state.errorTimeout / 1000} seconds...
                </div>
            );
        }
        if (this.state.showLoader) {
            return (
                <div className="col-md-6">
                    Please wait. We are gathering products for you...
                        <br />
                    <EllipsisLoader />
                </div>
            );
        }
        if (this.state.products.length) {
            return (
                <div className="col-md-6">
                    <p className="App-intro">
                        For details preview select a product from following selections:
                    </p>
                    <Select
                        options={this.buildSelectOptions()}
                        onChange={(selectedOption) => this.productChanged(selectedOption)} />
                </div>
            )
        }
    }
    renderProductPrices() {
        if (this.state.selectedProducts) {
            return (
                <ProductPrices product={this.state.selectedProducts} />
            )
        }
        else {
            return (
                ''
            )
        }
    }
    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className="col-md-3"></div>
                    {this.renderSelect()}
                    <div className="col-md-3"></div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <br />
                    </div>
                </div>
                {this.renderProductPrices()}
            </div>
        );
    }
}