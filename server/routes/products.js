const productsController = require('./../controllers/products.ctrl')

module.exports = (router)=>{
    router.route('/Products').get(productsController.getAll);
    router.route('/Products/:product/Prices').get(productsController.getPrices)
}