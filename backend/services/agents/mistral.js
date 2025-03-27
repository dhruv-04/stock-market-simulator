const axios = require('axios');
const { convertToJSONObject } = require('../../utils/stock/fetchGeminiNews')
const { bigquery } = require('../../config/bigqueryConfig');
const { db } = require('../../config/firebaseConfig');
require('dotenv').config();

const API_KEY = process.env.MISTRAL_KEY;  
const MOMENTUM_AGENT_ID = process.env.MOMENTUM_AGENT_ID;
const TRADE_FOLLOWER_AGENT_ID = process.env.TRADE_FOLLOWER_AGENT_ID;
const BREAKOUT_AGENT_ID = process.env.BREAKOUT_AGENT_ID;
const CONTRARIAN_AGENT_ID = process.env.CONTRARIAN_AGENT_ID;
const MEAN_REVERSION_AGENT_ID = process.env.MEAN_REVERSION_AGENT_ID;

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
    } catch (error) {
        console.error("Error fetching required data:", error);
    }
};

const momentumTraderDecision = async() => {
    try {
        const response = await axios.post(
            `https://api.mistral.ai/v1/agents/completions`,  
            {
                messages: [
                    { role: "user", content: `Current Price:${await requiredData('current_price')}, Previous 10 prices: ${await requiredData('previos_10_transactions')}` }
                ],
                response_format: { type: "text" },
                tool_choice: "auto",
                n: 1,
                agent_id: MOMENTUM_AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // console.log("Trade Decision:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
}

const meanReversionTraderDecision = async() => {
    try {
        const response = await axios.post(
            `https://api.mistral.ai/v1/agents/completions`,  
            {
                messages: [
                    { role: "user", content: "Current stock price: 150, previous prices: 148, 149.5, 150, 151.5, 152.0. Should I buy, sell, or hold?" }
                ],
                response_format: { type: "text" },
                tool_choice: "auto",
                n: 1,
                agent_id: MEAN_REVERSION_AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // console.log("Trade Decision:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
};

const breakoutTraderDecision = async() => {
    try {
        const response = await axios.post(
            `https://api.mistral.ai/v1/agents/completions`,  
            {
                messages: [
                    { role: "user", content: "Current stock price: 150, previous prices: 148, 149.5, 150, 151.5, 152.0. Should I buy, sell, or hold?" }
                ],
                response_format: { type: "text" },
                tool_choice: "auto",
                n: 1,
                agent_id: BREAKOUT_AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // console.log("Trade Decision:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
};

const contrarianTraderDecision = async() => {
    try {
        const data = await requiredData('previos_10_transactions');
        const response = await axios.post(
            `https://api.mistral.ai/v1/agents/completions`,  
            {
                messages: [
                    { role: "user", content: `${data}` }
                ],
                response_format: { type: "text" },
                tool_choice: "auto",
                n: 1,
                agent_id: CONTRARIAN_AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // console.log("Trade Decision:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
};

const tradeFollowerTraderDecision = async() => {
    try {
        const response = await axios.post(
            `https://api.mistral.ai/v1/agents/completions`,  
            {
                messages: [
                    { role: "user", content: "Current stock price: 150, previous prices: 148, 149.5, 150, 151.5, 152.0. Should I buy, sell, or hold?" }
                ],
                response_format: { type: "text" },
                tool_choice: "auto",
                n: 1,
                agent_id: TRADE_FOLLOWER_AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // console.log("Trade Decision:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
};

const main = async() => {
    try {
        //give them a one second timeout between function calls
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log(convertToJSONObject(await momentumTraderDecision()));
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log(convertToJSONObject(await meanReversionTraderDecision()));
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log(convertToJSONObject(await breakoutTraderDecision()));
        // await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(convertToJSONObject(await contrarianTraderDecision()));
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log(convertToJSONObject(await tradeFollowerTraderDecision()));
    } catch (err) {
        console.error('Error making trade decision:', err);
    }
};

main();
