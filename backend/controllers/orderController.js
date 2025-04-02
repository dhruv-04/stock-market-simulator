const { marketBuy, marketSell, limitBuy, limitSell } = require('../services/orderService/userOrderService');

//controller to execute market sell
const marketSellOrder = async (req, res) => {
    try {
        await marketSell(req, res);
        console.log('Market Sell order executed successfully.');
        res.status(200).json({ message: 'Market Sell order executed successfully.' });
    } catch (err) {
        console.error('Error executing market sell order:', err);
        res.status(500).json({ error: 'Error executing market sell order' });
    }
};

//controller to execute market buy
const marketBuyOrder = async (req, res) => {
    try {  
        await marketBuy(req, res);
        console.log('Market Buy order executed successfully.');
        res.status(200).json({ message: 'Market Buy order executed successfully.' });
    } catch (err) {
        console.error('Error executing market buy order:', err);
        res.status(500).json({ error: 'Error executing market buy order' });
    }
};

//controller to execute limit sell
const limitSellOrder = async(req, res) => {
    try {
        await limitSell(req, res);
        console.log('Limit Sell order executed successfully.');
        res.status(200).json({ message: 'Limit Sell order executed successfully.' });
    } catch (err) {
        console.error('Error executing limit sell order:', err);
        res.status(500).json({ error: 'Error executing limit sell order' });
    }
};

//controller to execute limit buy
const limitBuyOrder = async(req, res) => {
    try {
        await limitBuy(req, res);
        console.log('Limit Buy order executed successfully.');
        res.status(200).json({ message: 'Limit Buy order executed successfully.' });
    } catch (err) {
        console.error('Error executing limit buy order:', err);
        res.status(500).json({ error: 'Error executing limit buy order' });
    }
};

// Exporting all the order controllers
module.exports = {
    marketSellOrder,
    marketBuyOrder,
    limitSellOrder,
    limitBuyOrder
};
// This code defines the controller functions for executing market and limit orders in a trading application.