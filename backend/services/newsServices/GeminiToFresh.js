const { insertIntoFreshNews } = require('./redisNews');
const { generateNews } = require('../../utils/stock/fetchGeminiNews');

//function to fetch news from Gemini API and insert into fresh news
const fetchNews = async() => {
    try {
        const news = await generateNews();
        await insertIntoFreshNews(JSON.stringify(news));
        console.log('Fetched news:', news);
    } catch (err) {
        console.error('Error fetching news:', err);
        throw err;
    }
};

module.exports = {
    fetchNews
}