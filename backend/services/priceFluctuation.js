const { sequelize } = require('../config/mysqlConfig');
const { Op } = require('sequelize');
const Order = require('../models/orderModel');
const OrderBook = require('../models/orderBookModel');

const orderData = {
    user_id: 1,
    stock: 'CYBR',
    order_type: 'BUY',
    execution_type: 'LIMIT',
    price: 100.5,
    quantity: 10,
    status: 'PENDING'
};

const orderBookData = [
    {
        user_id: 1,
        stock: 'CYBR',
        order_type: 'BUY',
        price: 100.5,
        quantity: 10,
        status: 'PENDING'
    },
    {
        user_id: 1,
        stock: 'CYBR',
        order_type: 'SELL',
        price: 101.5,
        quantity: 10,
        status: 'PENDING'
    },
    {
        user_id: 2,
        stock: 'CYBR',
        order_type: 'SELL',
        price: 99.5,
        quantity: 10,
        status: 'PENDING'
    },
    {
        user_id: 1,
        stock: 'CYBR',
        order_type: 'SELL',
        price: 97.5,
        quantity: 10,
        status: 'PENDING'
    }
];

//stock trsaction function
const transaction = async() => {
    try {
        
    } catch (error) {
        console.error(`Error in transaction: ${error.message}`);
    }
};

const insertIntoOrders = async(orderData) => {
    try {
        await Order.create(orderData);
        console.log(`Inserted into orders at timestamp: ${new Date().toISOString()}`);
    } catch (err) {
        console.error(`Error inserting into orders at timestamp: ${new Date().toISOString()} : ${err.message}`);
        throw err;
    }
};

const insertIntoOrderBook = async(orderData) => {
    try {
        await OrderBook.bulkCreate(orderData);
        console.log(`Inserted into order book at timestamp: ${new Date().toISOString()}`);
    } catch (err) {
        console.error(`Error inserting into order book at timestamp: ${new Date().toISOString()} : ${err.message}`);
        throw err;
    }
};

const main = async() => {
    try {
        await insertIntoOrders(orderData);
        // await insertIntoOrderBook(orderBookData);
    } catch (err) {
        console.error(`Error in main function: ${err.message}`);
    }
};

main();