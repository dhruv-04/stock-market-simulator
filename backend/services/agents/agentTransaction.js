const { bigquery } = require('../../config/bigqueryConfig');
const { db } = require('../../config/firebaseConfig');
const { fetchAgentPortfolio } = require('./createAgentPortfolio');

const agentTransaction = async(transaction) => {
    try {
        const { action, agentID, stock, quantity } = transaction;
        const [price] = await bigquery.query(`
            SELECT new_price FROM virtual_stock_data.market WHERE stock_id = '${stock}' ORDER BY timestamp DESC LIMIT 1;`
        );
        const portfolio = await fetchAgentPortfolio(agentID);

        if (action === 'BUY' || action === 'buy') {
            portfolio.stocks[stock] = {
                stockID: stock,
                quantity: quantity,
                price: price[0].new_price
            };
            portfolio.balance -= (quantity * price[0].new_price);
        } else if (action === 'SELL' || action === 'sell') {
            if (portfolio.stocks[stock].quantity >= quantity) {
                portfolio.stocks[stock].quantity -= quantity;
            } else {
                throw new Error(`Not enough shares of ${stock} to sell`);
            }
        } else {
            throw new Error(`Invalid action: ${action}`);
        }


        await db.collection('portfolio-agents').doc(agentID).update({
            stocks: portfolio.stocks,
            lastModified: new Date().toISOString()
        });
        
    } catch (err) {
        throw err;
    }
};

const main = async() => {
    await agentTransaction({
        action: 'BUY',
        agentID: 'momentum-trader',
        stock: 'NOVA',
        quantity: 10
    });
    console.log('Transaction completed successfully.');
};

main();

module.exports = {
    agentTransaction
}