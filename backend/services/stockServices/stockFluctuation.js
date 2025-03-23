const { fluctuation } = require('../../utils/stock/priceFluctuation');
const { redisClient, connectRedis } = require('../../config/redisConfig');

connectRedis();

const stockFluctuation = async () => {
    const parsedStockDetails = JSON.parse(await redisClient.get("live_stock"));
    for (const stock in parsedStockDetails) {
        const { oldPrice, company_sentiment, sector_sentiment, volatility, randomness } = parsedStockDetails[stock];
        if(parsedStockDetails[stock].newPrice != null) {
            parsedStockDetails[stock].oldPrice = parsedStockDetails[stock].newPrice;
        }
        const { finalPrice, percentageChange } = await fluctuation( parsedStockDetails[stock].oldPrice, company_sentiment, sector_sentiment, volatility, randomness);
        parsedStockDetails[stock].newPrice = finalPrice;
        parsedStockDetails[stock].percentChange = percentageChange;
        parsedStockDetails[stock].timestamp = new Date(Date.now()).toISOString();
        console.log(`${stock} stock price has been updated to ${finalPrice}`);
    }
    // console.log(`\n\n\n`)
    await redisClient.set("live_stock", JSON.stringify(parsedStockDetails));
    console.log(`Stock prices updated in redis at timestamp ${new Date().toISOString()}`);
};


const sendDataToBigQuery = async() => {
    try {
        const { insertIntoBigQuery } = require('./bigQueryservie');
        const parsedStockDetails = JSON.parse(await redisClient.get('live_stock'));
        //parsedStockDetails is an object with keys as company names and values as objects containing stock details

        const data = [];
        //data is an array of objects containing stock details

        for (let stock in parsedStockDetails) {
            data.push({
                symbol: parsedStockDetails[stock].stockShortForm, //stock symbol
                old_price: parsedStockDetails[stock].oldPrice, //stock old price
                new_price: parsedStockDetails[stock].newPrice, //stock new price
                percentage_change: parsedStockDetails[stock].percentChange, //stock percentage change
                timestamp: parsedStockDetails[stock].timestamp //stock insertion timestamp
            });
        }
        await insertIntoBigQuery('virtual_stock_data', 'stock_prices', data); //insertion into big query
        console.log(`Batch insertion completed to Big Query in timestamp ${new Date().toISOString()}`);
    } catch (error) {
        console.error(`Error before sending data to BigQuery at timestamp ${new Date().toISOString()}`);
    }
}

const test = async() => {
    await stockFluctuation();
    await sendDataToBigQuery();
};

test();

module.exports = { stockFluctuation, sendDataToBigQuery };






//we have a redis key called "live_stock" which stores the current stock details of all the companies, which has datatype of string
//once parsed it will return the value in the following fashion
// 'EduCorp International': {
//     timestamp: '2025-03-22T19:27:54.227Z',
//     stockShortForm: 'EDCI',
//     oldPrice: 95.1,
//     newPrice: null,
//     percentChange: null,
//     volatility: 'high',
//     randomness: 'high',
//     company_sentiment: 'negative',
//     sector_sentiment: 'negative',
//     sector: 'Education'
//   }


//The idea behind this is, every second we would call the fluctuation function and update the stock prices of all the companies
//based on their last news status, so that stocks can keep fluctuating and we can keep track of the stock prices of all the companies
//in real time.

//The fluctuation function will take the initial price of the stock, company sentiment, sector sentiment, volatility and randomness as input
//and return the final price and the price change of the stock.

//Every 2 minutes, the data of all the 8 stocks would be sent to Big Query database, cron job
//every second, the prices are bound to fluctuate, this is also going to be a cron job