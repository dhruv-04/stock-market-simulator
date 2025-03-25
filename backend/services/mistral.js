const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.MISTRAL_KEY;   // Replace with your Mistral API Key
const AGENT_ID = process.env.MISTRAL_AGENT_KEY; // Replace with your Mistral Agent ID

async function getTradeDecision() {
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
                agent_id: AGENT_ID
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Trade Decision:", response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error making trade decision:", error.response ? error.response.data : error.message);
    }
}

getTradeDecision();
