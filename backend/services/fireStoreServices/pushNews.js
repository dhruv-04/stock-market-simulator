// const generateNews = require('../utils/stock/fetchGeminiNews');
const { db } = require('../../config/firebaseConfig');

//pushing the news to the firestore
//news content batch is a js object containing multiple objects of news
//each object contains news, sentiment, volatility, sector, company
const pushNews = async(newsContentBatch) => {
    try {
            const newsRef = db.collection('news').doc();
            newsContentBatch.createdAt = new Date().toISOString();
            await newsRef.set(newsContentBatch);
            console.log('Insertion in fireStore successful!');
    } catch (error) {
        console.error("Error pushing news:", error);
    }
};

module.exports = { pushNews };



// else {
//     const failMessage = {
//      news: "The stock market is stable, with no significant changes reported. Investors are monitoring global trends.",
//      sentiment: "Neutral",
//      volatility: "Low",
//      sector: "General Market",
//      company: "Global Index",
//      createdAt: new Date().toISOString()
//    };

//    const newsRef = db.collection('news').doc();
//    await newsRef.set(failMessage);
   
//  }