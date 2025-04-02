//routes file for user orders
const express = require('express');
const { marketBuyOrder, marketSellOrder, limitBuyOrder, limitSellOrder } = require('../controllers/orderController');
const router = express.Router();

//market order route
router.post('/market/buy', marketBuyOrder);
router.post('/market/sell', marketSellOrder);
//limit order route
router.post('/limit/buy', limitBuyOrder);
router.post('/limit/sell', limitSellOrder);