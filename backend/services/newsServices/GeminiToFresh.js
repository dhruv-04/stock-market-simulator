const { insertIntoFreshNews } = require('./redisNews');
const { generateNews } = require('../../utils/stock/fetchGeminiNews');

//function to fetch news from Gemini API and insert into fresh news
const fetchNews = async() => {
    try {
        const news = await generateNews();
        if(news) {
            await insertIntoFreshNews(JSON.stringify(news));
            console.log('Fetched news:', news);
        } else if (news === null) {
            const failMessage = {
                news: "The stock market is stable, with no significant changes reported. Investors are monitoring global trends.",
                sentiment: "Neutral",
                volatility: "Low",
                sector: "General Market",
                company: "Global Index",
                createdAt: new Date().toISOString()
            };
            await insertIntoFreshNews(JSON.stringify(failMessage));
        }
    } catch (err) {
        console.error('Error fetching news:', err);
        throw err;
    }
};

// const test = async() => {
//     await fetchNews();
//     console.log('Fetched news');
// };

// test();

module.exports = {
    fetchNews
}