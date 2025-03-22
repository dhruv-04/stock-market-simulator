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
        const { finalPrice, finalChange } = await fluctuation( parsedStockDetails[stock].oldPrice, company_sentiment, sector_sentiment, volatility, randomness);
        parsedStockDetails[stock].newPrice = finalPrice;
        parsedStockDetails[stock].percentChange = finalChange;
        parsedStockDetails[stock].timestamp = new Date(Date.now()).toISOString();
        console.log(`${stock} stock price has been updated to ${finalPrice}`);
    }
    console.log(`\n\n\n`)
    await redisClient.set("live_stock", JSON.stringify(parsedStockDetails));
};

// stockFluctuation();

module.exports = { stockFluctuation };


// const testStockFluctuation = async () => {
//     // for (let i = 1; i <= 10; i++) {
//     //     console.log(`Iteration ${i} - Updating stock prices...`);
//     //     await stockFluctuation();
//     //     await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
//     // }
//     // console.log("Test completed!");
//     const parsed = await redisClient.get("live_stock");
//     console.log(parsed);
// };

// testStockFluctuation();





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