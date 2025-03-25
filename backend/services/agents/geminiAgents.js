const { GoogleGenerativeAI } = require('@google/generative-ai');
const { bigquery } = require('../../config/bigqueryConfig');
const { db } = require('../../config/firebaseConfig');
const { convertToJSONObject } = require('../../utils/stock/fetchGeminiNews');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const fetchlast10StockPrice = async() => {
    try {
        const query = `
            SELECT stock_id, old_price, new_price, percentage_change, volume from virtual_stock_data.market
            ORDER BY timestamp DESC LIMIT 10;
            `;
        const [rows] = await bigquery.query(query);
        return rows;
    } catch (err) {
        console.error('Error fetching last 10 minute stock price:', err);
        throw err;
    }
};

const fetchAgentPortfolio = async(agentID) => {
    try {
        const portfolioDoc = await db.collection('portfolio-agents').doc(agentID).get();
        if (!portfolioDoc.exists) {
            throw new Error(`Portfolio for agent ${agentID} not found`);
        }
        return portfolioDoc.data();
    } catch (err) {
        throw err;
    }
}



const momentumTrader = async() => {

    const data = await fetchlast10StockPrice();

    const prompt = `
        Your Role : You are a Momentum Trader AI Agent in a virtual stock market simulator. Your goal is to identify short-term price trends and execute trades based on market momentum. You make decisions every 10 minutes, following a rule based approach but consulting AI for strategic refinements.
Identify Momentum:
Analyze the last 10 minutes of stock price movements.
Look for consistent upward trends (bullish momentum) to buy.
Look for consistent downward trends (bearish momentum) to sell.
Avoid stocks with flat or erratic price movements.
Trading Volume Consideration:
Higher trading volume supports stronger momentum signals.
Avoid stocks with low trading volume, as they may lack liquidity.
Buy Criteria:
Only buy if momentum is strong and positive (price rising consistently).
Ensure enough balance is available in the portfolio.
Do not buy more than 30% of available balance in one trade.
Sell Criteria:
Sell stocks if momentum turns negative and price is declining.
Sell only if the agent owns enough quantity of the stock.
Prioritize selling high-risk stocks first if multiple options are available.
Risk Management:
Avoid stocks with high volatility but no clear trend.
If a stock price suddenly drops more than 5% in 10 minutes, consider selling.
If a stock price suddenly jumps more than 5% in 10 minutes, consider partial profit-taking.
Execution Rules:
Each decision should return a JSON object with:
{
  "action": "BUY" or "SELL" or "HOLD",
  "stock": "<stock_symbol>",
  "quantity": <number_of_stocks>,
  "reason": "<brief reason for decision>"
}
If no strong trend is detected, respond with "action": "HOLD".
Portfolio & Market Data Access:
You have real-time access to the agent’s portfolio stored in Firestore.
You receive live stock price and volume data as part of the user prompt.
You can analyze recent news headlines (if relevant for momentum shifts).
Constraints:
Do not exceed portfolio balance while buying.
Do not sell stocks the agent doesn’t own.
Do not trade in illiquid or highly volatile stocks without clear momentum.
Expect all the three data, agent portfolio, last 10 minute stock price and news in json format.
Last 10 stock prices: ${JSON.stringify(data)}
Your portfolio: ${JSON.stringify(await fetchAgentPortfolio('momentum-trader'))}
DO NOT GENERATE ANY OTHER TEXT OTHER THAN JSON OBJECT
    `

    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

const main = async() => {
    const response = convertToJSONObject(await momentumTrader());
    if(response.action !== 'HOLD'){
        const { agentTransaction } = require('./agentTransaction');
        await agentTransaction({
            action: response.action,
            agentID: 'momentum-trader',
            stock: response.stock,
            quantity: response.quantity
        });
    }
    // console.log(await fetchAgentPortfolio('momentum-trader'));
    // const last10StockPrice = await fetchlast10StockPrice();
    // console.log(last10StockPrice);
};

main();


module.exports = {
    momentumTrader,
}