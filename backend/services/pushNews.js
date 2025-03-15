const generateNews = require('../utils/stock/fetchGeminiNews');
const { db } = require('../config/firebaseConfig');

const pushNews = async() => {
    try {
        const newsContent = await generateNews();
        if(newsContent) {
            const newsRef = db.collection('news').doc();
            newsContent.createdAt = new Date().toISOString();
            await newsRef.set(newsContent);
        } else {
           const failMessage = {
            news: "The stock market is stable, with no significant changes reported. Investors are monitoring global trends.",
            sentiment: "Neutral",
            volatility: "Low",
            sector: "General Market",
            company: "Global Index",
            createdAt: new Date().toISOString()
          };

          const newsRef = db.collection('news').doc();
          await newsRef.set(failMessage);
          
        }
    } catch (error) {
        console.error("Error pushing news:", error);
    }
}

module.exports = pushNews;