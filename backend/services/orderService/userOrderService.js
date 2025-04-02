const { executeOrder } = require('./executeOrder');

//function to execute market sell
const marketSell = async(req, res) => {
    await executeOrder('MARKET', 'SELL', req.body, res);
};

//function to execute market buy
const marketBuy = async(req, res) => {
    await executeOrder('MARKET', 'BUY', req.body, res);
};

//function to execute limit sell
const limitSell = async(req, res) => {
    await executeOrder('LIMIT', 'SELL', req.body, res);
};

//function to execute limit buy
const limitBuy = async(req, res) => {
    await executeOrder('LIMIT', 'BUY', req.body, res);
};

module.exports = {
    marketSell,
    marketBuy,
    limitSell,
    limitBuy
}