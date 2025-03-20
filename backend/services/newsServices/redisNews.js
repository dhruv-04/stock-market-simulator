const { redisClient, connectRedis } = require('../../config/redisConfig');

//connecting to redis
connectRedis();

//general template to insert news
const insertNews = async(keyName, news) => {
    try {
        await redisClient.rPush(keyName, news);
        console.log(`Insertion into ${keyName} successful\n\n`);
    } catch (err) {
        console.error('Error inserting news:', err);
        throw err;
    }
};

//function to insert news in fresh news which would be coming from the Gemini API
const insertIntoFreshNews = async(news) => {
    await insertNews('fresh_news', news);
};

//function to push news from fresh news to unseen news
const pushFreshToSeen = async() => {
    try {
        const fetchFreshNews = await redisClient.lPop('fresh_news');
        if (fetchFreshNews) {
            await redisClient.rPush('seen_news', fetchFreshNews);
            await redisClient.rPush('current_news', fetchFreshNews);
            console.log('Moved fresh news to seen news:', fetchFreshNews);
        }
        const { fetchNews } = require('./GeminiToFresh');
        await fetchNews();
    } catch (err) {
        console.error('Error pushing fresh news to seen news:', err);
        throw err;
    }
};

//function to fetch from current news
const fetchFromCurrentNews = async() => {
    try {
        const currentNews = await redisClient.lPop('current_news');
        if (currentNews) {
            const parsedNews = JSON.parse(currentNews);
            const company = Object.keys(parsedNews);
            return [company[0], parsedNews[company[0]]];
        };
        console.log('Current News:', currentNews);
    } catch (err) {
        console.error('Error fetching current news:', err);
        throw err;
    }
}

//function to push news from redis seen to firestore
const redisToFireStore = async() => {
    try {
        const fetchSeenNews = await redisClient.lRange('seen_news', 0, -1);
        if(fetchSeenNews.length === 0) return;
        const parsedNews = fetchSeenNews.reduce((acc, news) => {
            // console.log('news:', news.);
            const parsed = JSON.parse(news);
            // console.log('pars:', parsed);
            // console.log('parsed:', parsed);
            const company = Object.keys(parsed)[0];
            console.log('Company:', company);
            if (!acc[company]) {
              acc[company] = [];
            }
            acc[company].push(parsed[company]);
            return acc;
          }, {});
        console.log('parsedNews:', parsedNews);
        // redisClient.del('seen_news');
        const { pushNews } = require('../fireStoreServices/pushNews');
        await pushNews(parsedNews);
    } catch (err) {
        console.error('Error pushing seen news to firestore:', err);
        throw err;
    }
};

module.exports = { insertIntoFreshNews, pushFreshToSeen, redisToFireStore, fetchFromCurrentNews };



// const test = async() => {
//     await redisToFireStore();
//     // const currentNews = await redisClient.lRange('seen_news', 0, -1);
//     // await pushFreshToSeen();
//     // console.log('currentNews: ', currentNews);
//     // parsedNews = JSON.parse(currentNews[0]);
//     // console.log('parsedNews: ', parsedNews);    
//     // const company = Object.keys(parsedNews);
//     // console.log('Company Name : ', company[0]);
//     // console.log('currentNews: ', parsedNews[company[0]]);
//     // redisClient.del('current_news');
//     // redisClient.del('seen_news');
//     // redisClient.del('fresh_news');
// };

// test();
