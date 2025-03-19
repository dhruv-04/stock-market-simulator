const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

sectors = ["Technology", "HealthCare", "Finance", "Education"];

companies = {
    "Technology": [
        "NovaTech Solutions",
        "CyberDyne Systems"
    ],
    "HealthCare": [
        "Medicorp Innovations",
        "Vitality Pharma"
    ],
    "Finance": [
        "Global Trust Investments",
        "Sterling Bancorp",
    ],
    "Education": [
        "Edulink Learning",
        "EduCorp International"
    ],
}


const convertToJSONObject = (text) => {
    try {
        const jsonMatch = text.match(/{.*}/s);
        // console.log(jsonMatch[0]);
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
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        sectorInp = sectors[Math.floor(Math.random() * sectors.length)];
    
        const prompt = `
    This is simulated stock market environment. The company, sectors and their stock movements are
    fictional. Generate a short stock market news update for a company in ${sectorInp}. The companies names are ${companies[sectorInp][0]} and ${companies[sectorInp][1]}.
    
    Ensure that the sentiment is influenced by both the individual company's situation and the broader
    sector trends. The volatility should reflect the overall impact of the news. 
    
    DO not include exact stock prices or financial figures. Only return a valid JSON response in the following format:-
    
    {
          ${companies[sectorInp][0]} : {
            news : "2-3 lines",
            randomness : "to add uniqueness",
            volatility : "would describe the condition of change of stock price",
            sector sentiment: "would describe the sector sentiment",
            company sentiment : "Would describe the company sentiment",
            sector: ${sectorInp},
        },
        ${companies[sectorInp][1]} : {
            news : "2-3 lines",
            randomness : to add uniqueness
            volatility : would describe the condition of change of stock price
            sector sentiment: would describe the sector sentiment
            company sentiment : Would describe the company sentiment
            sector: ${sectorInp},
        }
    }
    
    The available values for sector sentiment and company sentiment are highly_positive, positive, neutral, negative, and highly negative. The available values for volatility are low, moderate, high, extreme. The available values for randomness are low, moderate and high.
    
    DO NOT DEVIATE FROM THE GIVEN JSON FORMAT. Also make sure, that all the factors listed in the JSON format, should be relatable with the news.
    `;
    
        const result = await model.generateContent(prompt);

        //     if (!result || !result.candidates || result.candidates.length === 0) {
        //     console.error("No valid response from Gemini API");
        //     return null;
        // }

        const responseFromPrompt = result.response.text();
    
        if (!responseFromPrompt || responseFromPrompt.includes('NULL')) {
            console.error("Invalid or NULL response from model");
            return null;
        }
    
        const finalResponse = convertToJSONObject(responseFromPrompt);
        return finalResponse;
    } catch (error) {
        console.error("Error generating news:", error);
        return null;
    }
}

// const test = async() => {
//     const news = await generateNews();
//     console.log(news);
// }
// // console.log(generateNews());
// test();

module.exports = { generateNews };



