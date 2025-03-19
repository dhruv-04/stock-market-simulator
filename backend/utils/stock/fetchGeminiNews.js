const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const convertToJSONObject = (text) => {
    try {
        const jsonMatch = text.match(/{.*}/s);
        if(jsonMatch) {
            const news = JSON.parse(jsonMatch[0]);
            // console.log(news);
            return news;
        } else {
            console.log("Invalid JSON format");
        }
    } catch (error) {
        console.log("Error parsing JSON:", error);
    }
};

const generateNews = async() => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `This is a **simulated stock market environment**. The company and its stock movements are **fictional**. 
    Generate a short stock market news update for a company in the **Technology** sector. The company name is **ByteWave Technologies**.
    
    Ensure that the **sentiment** (Positive, Negative, or Neutral) is influenced by **both the individual company’s situation and the broader sector trends**. 
    The **volatility** (Low, Moderate, or High) should reflect the overall impact of the news.  
    
    Do **not** include exact stock price changes or financial figures. Only return a **valid JSON response** with the following fields:
    - **news** (2-3 lines)
    - **sentiment**
    - **volatility**
    - **sector**
    - **company**.`;

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    const response = result.response.toString();
    if (!response || response.includes('NULL')) {
        console.error("Invalid or NULL response from model");
        return null;
    }

    return convertToJSONObject(response);


    // const jsonMatch = response.match(/{.*}/);

}

module.exports = { generateNews };




// `
// This is simulated stock market environment. The company, sectors and their stock movements are
// fictional. Generate a short stock market news update for a company in either healthcare structure. The companies names are Medicorp Innovations and vitality pharma.

// Ensure that the sentiment is influenced by both the indivisual company's situation and the broader
// sector trends. The volatility should refeclt the overall impace of the news. 

// DO not include exact stock prices or financial figures. Only return a valid JSOn response in the following format:-

// {
//   Sector_Name : {
//   	Company_One : {
// 		news : "2-3 lines",
// 		randomness : to add uniqueness
// 		volatility : would describe the condition of change of stock price
// 		sector sentiment: would describe the sector sentiment
// 		company sentiment : Would describe the company sentiment
// 	},
// 	Company_TWO : {
// 		news : "2-3 lines",
// 		randomness : to add uniqueness
// 		volatility : would describe the condition of change of stock price
// 		sector sentiment: would describe the sector sentiment
// 		company sentiment : Would describe the company sentiment
// 	}
//     }
// }

// The available values for sector sentiment and company sentiment are highly_positive, positive, neutral, negative, and highly negative. The available values for volatility are low, moderate, high, extreme. The available values for randomness are low, moderate and high.

// DO NOT DEVIATE FROM THE GIVEN JSON FORMAT. Also make sure, that all the factors listed in the JSON format, should be relatable with the news.
// `