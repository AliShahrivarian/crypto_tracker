const axios = require('axios')
const HEADERS = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbG92b2FwcC5jb20iLCJpZCI6IjVhNTcyZGEyNTM4OWMzNzZiZWZlNjY1NCIsImlhdCI6MTUxNTY2MjgyMn0.a6homMOumqLBxwfX9nOwbBaxmSx-srkS8dISSPCPPYE'
};

Array.prototype.hasCurrencyItem = function (item) {
    return this.some((curr) => {
        return curr.id === item.id
    })
};

const createResponse = (result, code) => {
    return { result: result, code: code };
}

module.exports = {
    getAll: (req, res) => {
        axios.all([
            axios.get('https://api.moneeda.com/api/exchanges/BNB/products', {
                headers: HEADERS
            }),
            axios.get('https://api.moneeda.com/api/exchanges/BTX/products', {
                headers: HEADERS
            }),
            axios.get('https://api.moneeda.com/api/exchanges/BFX/products', {
                headers: HEADERS
            })
        ]).then(
            axios.spread((res_bnb, res_btx, res_bfx) => {
                try {
                    let result = [];
                    let gatherCommonItems = (arrays) => {
                        if (arrays.length === 0) {
                            return []
                        }
                        if (arrays.length === 1) {
                            return arrays[0];
                        }
                        for (let i = 0; i < arrays[0].length; i++) {
                            let allArrHasThis = true;
                            for (let j = 1; j < arrays.length; j++) {
                                if (arrays[j].hasCurrencyItem(arrays[0][i])) {
                                    continue;
                                }
                                allArrHasThis = false;
                                break;
                            }
                            if (allArrHasThis) {
                                result.push(arrays[0][i])
                            }
                        }
                    }
                    if (res_btx.data.length > res_bnb.data.length && res_btx.data.length > res_bfx.data.length) {
                        gatherCommonItems([res_btx.data, res_bnb.data, res_bfx.data])
                    } else if (res_bfx.data.length > res_bnb.data.length) {
                        gatherCommonItems([res_bfx.data, res_bnb.data, res_btx.data])
                    } else {
                        gatherCommonItems([res_bnb.data, res_btx.data, res_bfx.data])
                    }
                    return res.json(createResponse(result, 0));
                } catch (ex) {
                    console.log(ex);
                    return res.json(createResponse('Something bad happened, we are working on it...', 2))
                }
            })
        ).catch((err) => {
            console.log(err)
            return res.json(createResponse('Something bad happened, we are working on it...', 2))
        });
    },
    getPrices: (req, res) => {
        axios.all([
            axios.get('https://api.moneeda.com/api/exchanges/BNB/ticker?product=' + req.params.product, {
                headers: HEADERS
            }),
            axios.get('https://api.moneeda.com/api/exchanges/BTX/ticker?product=' + req.params.product, {
                headers: HEADERS
            }),
            axios.get('https://api.moneeda.com/api/exchanges/BFX/ticker?product=' + req.params.product, {
                headers: HEADERS
            })
        ]).then(
            axios.spread((res_bnb, res_btx, res_bfx) => {
                try {
                    return res.json(
                        createResponse([
                            { exchange: 'BNB', data: res_bnb.data },
                            { exchange: 'BTX', data: res_btx.data },
                            { exchange: 'BFX', data: res_bfx.data },
                        ], 0));
                } catch (ex) {
                    return res.json(createResponse('Something bad happened, we are working on it...', 2));
                }
            })
        ).catch((err) => {
            console.log(err)
            return res.json(createResponse('Something bad happened, we are working on it...', 2));
        });
    }
}