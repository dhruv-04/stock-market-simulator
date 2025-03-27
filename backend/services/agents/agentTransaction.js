const { bigquery } = require('../../config/bigqueryConfig');
const { db } = require('../../config/firebaseConfig');
const { fetchAgentPortfolio } = require('./createAgentPortfolio');

const updateTransactionInBigQuery = async(parameters) => {
    try {
        const { action, agentID, stock, quantity, reason, total_price, price } = parameters;

        if (action === 'BUY' || action === 'buy') {
            await bigquery.query(`INSERT INTO virtual_stock_data.transactions (uid, stock_id, volume, price_per_stock, status, reason, total_price) VALUES ('${agentID}', '${stock}', ${quantity}, ${price}, 'BUY', '${reason}', ${total_price});`);
        } else if (action === 'SELL' || action === 'sell') {
            await bigquery.query(`INSERT INTO virtual_stock_data.transactions (uid, stock_id, volume, price_per_stock, status, total_price, reason) VALUES ('${agentID}', '${stock}', ${quantity}, ${price}, 'SELL', ${total_price}, '${reason}');`);
        } 
        console.log(`Transaction updated for ${stock}`);
    } catch (err) {
        console.log(`Error updating transaction for ${stock}:`, err);
        throw err;
    }
};

const updateMarketInBigQuery = async(parameters) => {
    try {
        const { stock, old_price, new_price, percentage_change, volume } = parameters;
        await bigquery.query(`INSERT INTO virtual_stock_data.market (stock_id, old_price, new_price, percentage_change, volume) VALUES ('${stock}', ${old_price}, ${new_price}, ${percentage_change}, ${volume});`);
        console.log(`Market updated for ${stock}`);
        console.log(`Market data inserted for ${stock} with new price: ${new_price}`);
    } catch (err) {
        console.log(`Error updating market for ${stock}:`, err);
        throw err;
    }
};

const agentTransaction = async(transaction) => {
    try { 
        const { action, agentID, stock, quantity, reason } = transaction;
        const [price] = await bigquery.query(` 
            SELECT new_price FROM virtual_stock_data.market WHERE stock_id = '${stock}' ORDER BY timestamp DESC LIMIT 1;`
        );
        const portfolio = await fetchAgentPortfolio(agentID);
        console.log("Stock is : ",stock);
        console.log("Quantity is : ",quantity);
        console.log("Action is : ",action);
        console.log("Price is : ",price[0].new_price);

        if (action === 'BUY' || action === 'buy') {
            portfolio.stocks[stock] = {
                stockID: stock,
                quantity: quantity,
                price: price[0].new_price
            };
            portfolio.balance = portfolio.balance - (quantity * price[0].new_price);
            await updateTransactionInBigQuery({
                action: action,
                agentID: agentID,
                stock: stock,
                quantity: quantity,
                total_price: quantity * portfolio.stocks[stock].price,
                price: price[0].new_price,
                reason: reason
            });

            const marketImpact = 0.001 + Math.random() * 0.005;
            const newPrice = price[0].new_price + (1 + (marketImpact * (quantity * price[0].new_price)));
            const priceChange = newPrice - price[0].new_price;
            const percentageChange = (priceChange / price[0].new_price) * 100;
            await updateMarketInBigQuery({
                stock: stock,
                old_price: price[0].new_price,
                new_price: newPrice,
                percentage_change: percentageChange,
                volume: quantity
            });

        } else if (action === 'SELL' || action === 'sell') {
            if (portfolio.stocks[stock].quantity >= quantity) {
                portfolio.stocks[stock].quantity -= quantity;
                portfolio.balance = portfolio.balance - (quantity * price[0].new_price);
                await updateTransactionInBigQuery({
                    action: action,
                    agentID: agentID,
                    stock: stock,
                    quantity: quantity,
                    total_price: quantity * price[0].new_price,
                    price: price[0].new_price,
                    reason: reason
                });

                const marketImpact = 0.01 + Math.random() * 0.05;
                const newPrice = price[0].new_price * (1 - marketImpact);
                const priceChange = newPrice - price[0].new_price;
                const percentageChange = (priceChange / price[0].new_price) * 100;
                await updateMarketInBigQuery({
                    stock: stock,
                    old_price: price[0].new_price,
                    new_price: newPrice,
                    percentage_change: percentageChange,
                    volume: quantity
                });
            } else {
                console.log(`Not enough shares of ${stock} to sell`);
            }
        } 


        await db.collection('portfolio-agents').doc(agentID).update({
            stocks: portfolio.stocks,
            lastModified: new Date().toISOString()
        });
        
    } catch (err) {
        throw err;
    }
};

// const main = async() => {
//     await agentTransaction({
//         action: 'SELL',
//         agentID: 'momentum-trader',
//         stock: 'NOVA',
//         quantity: 10
//     });
//     console.log('Transaction completed successfully.');
// };

// main();

module.exports = {
    agentTransaction
}