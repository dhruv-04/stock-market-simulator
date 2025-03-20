const { insertIntoFreshNews } = require('./redisNews');
const { generateNews } = require('../../utils/stock/fetchGeminiNews');

//function to fetch news from Gemini API and insert into fresh news
const fetchNews = async() => {
    try {
        const news = await generateNews();
        if(news) {
            // console.log(news);
            for (const [key, value] of Object.entries(news)) {
                console.log(`Movement of news about ${key} to fresh news : ${value}\n`);
                await insertIntoFreshNews(JSON.stringify({ [key]: value }));
            }
        } else if (news === null) {
            const failMessage = {
                news: "The stock market is stable, with no significant changes reported. Investors are monitoring global trends.",
                sentiment: "Neutral",
                volatility: "Low",
                sector: "General Market",
                company: "Global Index",
            };
            await insertIntoFreshNews(JSON.stringify({ ['General'] : failMessage }));
        }
    } catch (err) {
        console.error('Error fetching news:', err);
        throw err;
    }
};

const test = async() => {
    await fetchNews();
    console.log('Fetched news');
};

test();

module.exports = {
    fetchNews
}