const Order = require('../../models/orderModel');
const OrderBook = require('../../models/orderBookModel');
const generateOrderID = require('../../utils/generateOrderID');
const generateTransactionID = require('../../utils/generateTransactionID');
const { sequelize } = require('../../config/mysqlConfig');

const marketBuyOrder = async(order) => {
    try {
        await Order.create(order);
        console.log(`Order inserted in Order table for market buy.`);
        let query = `
            SELECT * FROM order_book WHERE order_type = 'BUY' AND price >= ? ORDER BY price ASC;
        `;
        const [results] = await sequelize.query(query, {
            replacements: [order.price],
            type: sequelize.QueryTypes.SELECT
        });

        for(let row of results) {
            if (order.quantity >= row.quantity) {
                order.quantity -= row.quantity;
                row.quantity = 0;
                row.status = 'COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
            } else {
                row.quantity -= order.quantity;
                order.quantity = 0;
                row.status = 'PARTIALLY_COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
                break;
            }

            if(order.quantity == 0) break;
        }

    } catch (err) {
        console.error('Error processing market sell order:', err);
        throw err;
    }
};


//function to process market sell order
const marketSellOrder = async(order) => {
    try {
        await Order.create(order);
        console.log(`Order inserted in Order table for market sell.`);
        let query = `
            SELECT * FROM order_book WHERE order_type = 'SELL' AND price <= ? ORDER BY price DESC;
        `;
        const [results] = await sequelize.query(query, {
            replacements: [order.price],
            type: sequelize.QueryTypes.SELECT
        });

        for(let row of results) {
            if (order.quantity >= row.quantity) {
                order.quantity -= row.quantity;
                row.quantity = 0;
                row.status = 'COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
            } else {
                row.quantity -= order.quantity;
                order.quantity = 0;
                row.status = 'PARTIALLY_COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
                break;
            }

            if(order.quantity == 0) break;
        }

    } catch (err) {
        console.error('Error processing market sell order:', err);
        throw err;
    }
};


//function to process limit buy order
const limitBuyOrder = async(order) => {
    try {
        await Order.create(order);
        console.log(`Order inserted in Order table for limit buy.`);
        let query = `
            SELECT * FROM order_book WHERE order_type = 'SELL' AND price = ? ORDER BY UPDATED_AT ASC;
        `;
        const [results] = await sequelize.query(query, {
            replacements: [order.price],
            type: sequelize.QueryTypes.SELECT
        });

        //if no matching order found, insert the order in order book
        if(results.length === 0) {
            await OrderBook.create(order);
            console.log(`Order inserted in Order Book table for limit buy.`);
            return;
        }

        //if matching order found, process the order
        for(let row of results) {
            if (order.quantity >= row.quantity) {
                order.quantity -= row.quantity;
                row.quantity = 0;
                row.status = 'COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
            } else {
                row.quantity -= order.quantity;
                order.quantity = 0;
                row.status = 'PARTIALLY_COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
                break;
            }

            if(order.quantity == 0) break;
        }

        //if order is not completed, insert the order in order book
        if(order.quantity > 0) {
            await OrderBook.create(order);
            console.log(`Order inserted in Order Book table for limit buy.`);
        }

        return;

    } catch (err) {
        console.error('Error processing limit buy order:', err);
        throw err;
    }
};

//function to process limit sell order
const limitSellOrder = async(order) => {
    try {
        await Order.create(order);
        console.log(`Order inserted in Order table for limit sell.`);
        let query = `
            SELECT * FROM order_book WHERE order_type = 'BUY' AND price = ? ORDER BY UPDATED_AT ASC;
        `;
        const [results] = await sequelize.query(query, {
            replacements: [order.price],
            type: sequelize.QueryTypes.SELECT
        });

        //if no matching order found, insert the order in order book
        if(results.length === 0) {
            await OrderBook.create(order);
            console.log(`Order inserted in Order Book table for limit sell.`);
            return;
        }

        //if matching order found, process the order
        for(let row of results) {
            if (order.quantity >= row.quantity) {
                order.quantity -= row.quantity;
                row.quantity = 0;
                row.status = 'COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
            } else {
                row.quantity -= order.quantity;
                order.quantity = 0;
                row.status = 'PARTIALLY_COMPLETED';

                // Update the row in the database
                await sequelize.query(
                    `UPDATE order_book SET quantity = ?, status = ? WHERE order_id = ?`,
                    {
                        replacements: [row.quantity, row.status, row.order_id],
                        type: sequelize.QueryTypes.UPDATE
                    }
                );
                break;
            }

            if(order.quantity == 0) break;
        }

        //if order is not completed, insert the order in order book
        if(order.quantity > 0) {
            await OrderBook.create(order);
            console.log(`Order inserted in Order Book table for limit sell.`);
        }

        return;

    } catch (err) {
        console.error('Error processing limit sell order:', err);
        throw err;
    }
};

// This function is responsible for executing an order based on the process type and order type.
const executeOrder = async(processType, orderType, req, res) => {
    try {
        const id = generateOrderID();
        // order.order_id = id;
    } catch (err) {
        console.error('Error executing order:', err);
        throw err;
    }
};