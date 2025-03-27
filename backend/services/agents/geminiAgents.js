const { GoogleGenerativeAI } = require('@google/generative-ai');
const { bigquery } = require('../../config/bigqueryConfig');
const { db } = require('../../config/firebaseConfig');
const { convertToJSONObject } = require('../../utils/stock/fetchGeminiNews');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
};

const requiredData = async(dataType) => {
    try {
        if(dataType === 'current_price') {
            const query = `SELECT stock_id, new_price FROM (SELECT stock_id, new_price, ROW_NUMBER() OVER (PARTITION BY stock_id ORDER BY timestamp DESC) AS row_num FROM virtual_stock_data.market) AS ranked WHERE row_num = 1;`;

            const [result] = await bigquery.query(query);
            return result;
        }

        if(dataType === 'previos_10_transactions') {
            const query = `SELECT * FROM virtual_stock_data.transactions ORDER BY timestamp DESC LIMIT 10;`;

            const [result] = await bigquery.query(query);
            return result;
        }

        if(dataType === 'previos_transactions') {
            const query = `SELECT * FROM virtual_stock_data.transactions ORDER BY timestamp DESC LIMIT 100;`;

            const [result] = await bigquery.query(query);
            return result;
        }

        if(dataType === 'last_1_hour_news') {
            const query = `SELECT * FROM virtual_stock_data.news WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) LIMIT 100;`;

            const [result] = await bigquery.query(query);
            return result;
        }

        if(dataType === 'market_1_hour') {
            const query = `SELECT * FROM virtual_stock_data.market WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) LIMIT 100;`;

            const [result] = await bigquery.query(query);
            return result;
        }

        if(dataType === 'last_1_hour_news') {
            const query = `SELECT * FROM virtual_stock_data.news WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) LIMIT 100;`;
            const [result] = await bigquery.query(query);
            return result;
        }
    } catch (error) {
        console.error("Error fetching required data:", error);
    }
};


const momentumTrader = async() => {
    try {
        const prompt = `You are a Momentum Trader AI Agent in a virtual stock market simulator. Your goal is to identify short-term price trends and execute trades based on market momentum. You make decisions following a rule based approach but consulting AI for strategic refinements. Identify Momentum: Analyze the last 10 minutes of stock price movements. Look for consistent upward trends (bullish momentum) to buy. Look for consistent downward trends (bearish momentum) to sell. Avoid stocks with flat or erratic price movements. Trading Volume Consideration: Higher trading volume supports stronger momentum signals. Avoid stocks with low trading volume, as they may lack liquidity. Buy Criteria: Only buy if momentum is strong and positive (price rising consistently). Ensure enough balance is available in the portfolio. Do not buy more than 30% of available balance in one trade. Sell Criteria:Sell stocks if momentum turns negative and price is declining. Sell only if the agent owns enough quantity of the stock. Prioritize selling high-risk stocks first if multiple options are available. Risk Management: Avoid stocks with high volatility but no clear trend. If a stock price suddenly drops more than 5% in 10 minutes, consider selling. If a stock price suddenly jumps more than 5% in 10 minutes, consider partial profit-taking. Execution Rules: Each decision should return a JSON object with: {"action": "BUY" or "SELL" or "HOLD", "stock": "<stock_symbol>", "quantity": <number_of_stocks>,"reason": "<brief reason for decision>"}. You receive live stock price and volume data as part of the user prompt. You can analyze recent news headlines (if relevant for momentum shifts). Constraints: Do not exceed portfolio balance while buying. Do not sell stocks the agent doesn’t own. Do not trade in illiquid or highly volatile stocks without clear momentum. You are only allowed to send the json output, nothing else. In case of hold, set stock = None and quantity = 0.
        Current Price:${await requiredData('current_price')}, Previous 10 prices: ${await requiredData('previos_10_transactions')}, Your Portfolio: ${await fetchAgentPortfolio('momentum-trader')}List of available stocks: {"NOVA", "CYBR", "EDCI", "EDLK", "GTI", "MCRP", "STBC", "VPHM"}`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
        
    } catch (error) {
        console.error("Error in momentumTrader:", error);
    }
};

const meanReversionTrader = async() => {
    try {
        const prompt = `You are a mean reversion trading agent operating in a virtual stock market. Your strategy is to buy stocks when their price falls below their recent average and sell when they rise above it. You make trading decisions last 60 minutes of transactions. Buying Rule: If the stock price is significantly below its 60-minute moving average, consider buying. Selling Rule: If the stock price is significantly above its 60-minute moving average, consider selling. Ensure that you do not exceed your available balance when buying stocks. You are allowed to execute multiple transactions but only when you feel they are needed. Only consider recent news sentiment if it strongly contradicts the mean reversion signal.The output should strictly follow the following JSON structure: {"action": <BUY or SELL or HOLD>"stock": <stock name>"quantity": <number of stocks>"reason": <why did you choose this transaction>}. You are only allowed to send the json output, nothing else. If action is HOLD, set stock = None and quantity = 0, Previous prices: ${await requiredData('previos_transactions')}, Your Portfolio: ${await fetchAgentPortfolio('mean-reversion-trader')}, News: ${await requiredData('last_1_hour_news')}List of available stocks: {"NOVA", "CYBR", "EDCI", "EDLK", "GTI", "MCRP", "STBC", "VPHM"}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Error in meanReversionTrader:", err);
    }
};


const breakoutTrader = async() => {
    try {
        const prompt = `Role: You are a Breakout Trading Agent operating in a virtual stock market. Your goal is to identify stocks that break above resistance levels or below support levels and execute trades accordingly. If a stock breaks above its highest price in the last 10 intervals → Buy. If a stock falls below its lowest price in the last 10 intervals → Sell. A single trade must not exceed 40% of the available cash balance. Do not hold more than 60% of the portfolio in one stock. Expected Output Format {"action": "<BUY | SELL | HOLD>", "stock": "<stock_symbol>","quantity": <int>, "reason": "<short explanation>"} Follow risk management rules before executing any trade. You are only allowed to send the json output, nothing else. You are only allowed to send the json output, nothing else. If action is HOLD, set stock = None and quantity = 0, Previous prices: ${await requiredData('previos_10_transactions')}, Your Portfolio: ${await fetchAgentPortfolio('breakout-trader')}, last one hour market: ${await requiredData('market_1_hour')}List of available stocks: {"NOVA", "CYBR", "EDCI", "EDLK", "GTI", "MCRP", "STBC", "VPHM"}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Error in breakoutTrader:", err);
    }
};

const trendFollowingTrader = async() => {
    try {
        const prompt = `You are a Trend-Follower Trader who follows the direction of the market trend and executes trades based on price movements. Your goal is to identify price trends and execute trades that align with the prevailing trend. You will monitor the market for price breaks or trend reversals, and you can initiate a trade immediately when you detect a trend in the market. Act quickly once a clear trend is detected (such as a price crossing above or below a threshold). Do not execute trades if there is no clear trend (avoid choppy or sideways markets). Do NOT execute a "BUY" if you don't have enough balance for enough stocks.  OUTPUT should only be a JSON in the format, 
{"action": buy/sell/hold,"stock" : <select the stock_id from the current_price which you want to buy/sell/hold>, "quantity": <write the number of stocks that you want to buy or sell, 0 for hold>,"reason": <small reason as to why you choose to trade the stock.>}. You are only allowed to send the JSON output, nothing else. You can execute only ONE trade at a time. Previous prices: ${await requiredData('previos_transactions')}, Your Portfolio: ${await fetchAgentPortfolio('trend-follower-trader')}, News: ${await requiredData('last_1_hour_news')}List of available stocks: {"NOVA", "CYBR", "EDCI", "EDLK", "GTI", "MCRP", "STBC", "VPHM"}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Error in trendFollowingTrader:", err);
    }
};

const contrarianTrader = async() => {
    try {
        const prompt = `You are a Contrarian Trader AI that takes positions against the prevailing market trend. Your goal is to identify overbought or oversold stocks and trade in the opposite direction of the trend. Expected Input Agent Portfolio: List of stocks owned and cash balance. Stock Price Data (Last 10 Intervals): Price history of tracked stocks. Recent News Headlines: Market news relevant to selected stocks. Buy: If a stock has dropped significantly despite neutral or positive news (potential overreaction). Sell: If a stock has risen excessively despite neutral or negative news (potential overvaluation). Compare current price to moving averages to detect extremes.Consider news sentiment to confirm whether a reversal is likely. JSON Output Format:{"action": "BUY" or "SELL" or "HOLD","stock": "<stock_id which you decide to trade>","quantity": <Number of Stocks that you decide to trade>,"reason": "<Short Explanation as to why you decided to trade that stock>"}. You can only perform one transaction at a time.If action is HOLD, set stock = None and quantity = 0, Previous prices: ${await requiredData('previos_10_transactions')}, Your Portfolio: ${await fetchAgentPortfolio('contrarian-trader')}, News: ${await requiredData('last_1_hour_news')}List of available stocks: {"NOVA", "CYBR", "EDCI", "EDLK", "GTI", "MCRP", "STBC", "VPHM"}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Error in contrarianTrader:", err);
    }
};

const main = async() => {
    const agents = [
        momentumTrader,
        meanReversionTrader,
        breakoutTrader,
        trendFollowingTrader,
        contrarianTrader,
    ];
    const portfolio_name = [
        "momentum-trader",
       "mean-reversion-trader",
        "breakout-trader",
        "trend-follower-trader",
        "contrarian-trader"
    ];
    for(let i = 0; i < agents.length; i++) {
        try {
            console.log(`Executing ${portfolio_name[i]} at ${new Date().toISOString()}`);
            const response = convertToJSONObject(await agents[i]());
            console.log(`Response by ${portfolio_name[i]} : ${response}`);
            if(response.action !== 'HOLD' || response.action != undefined && response.stock != undefined && response.quantity != undefined && response.reason != undefined) {
                const { agentTransaction } = require('./agentTransaction');
                await agentTransaction({
                    action: response.action,
                    agentID: `${portfolio_name[i]}`,
                    stock: response.stock,
                    quantity: response.quantity,
                    reason: response.reason
                });
            }
        } catch (err) {
            console.error(`Error executing ${portfolio_name}`, err);
        }

        if(i < agents.length - 1) {
            console.log(`Waiting for 5 seconds before executing the next agent...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    console.log('All queries executed!');
};

main();

module.exports = {
    main,
}