const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
    const response = result.response.text();

    // const jsonMatch = response.match(/{.*}/);

}

// generateNews();

const convertToJSONObject = (text) => {
    try {
        const jsonMatch = text.match(/{.*}/s);
        if(jsonMatch) {
            const news = JSON.parse(jsonMatch[0]);
            console.log(news);
        } else {
            console.log("Invalid JSON format");
        }
    } catch (error) {
        console.log("Error parsing JSON:", error);
    }
};

const text = `json
{
  "news": "ByteWave Technologies faces headwinds as broader tech sector sees a slowdown in consumer spending. Reports suggest a possible delay in the launch of their flagship AI product, sparking investor concern. Analysts are closely monitoring the situation for further developments.",
  "sentiment": "Negative",
  "volatility": "Moderate",
  "sector": "Technology",
  "company": "ByteWave Technologies"
}
`;

convertToJSONObject(text);