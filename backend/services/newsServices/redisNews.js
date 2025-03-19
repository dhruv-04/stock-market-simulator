const { redisClient, connectRedis } = require('../../config/redisConfig');

//connecting to redis
connectRedis();

//general template to insert news
const insertNews = async(keyName, news) => {
    try {
        await redisClient.rPush(keyName, news);
    } catch (err) {
        console.error('Error inserting news:', err);
        throw err;
    }
};

//function to insert news in seen_news
const insertIntoSeenNews = async(news) => {
    await insertNews('seen_news', news);
};

//function to insert news in fresh news which would be coming from the Gemini API
const insertIntoFreshNews = async(news) => {
    await insertNews('fresh_news', news);
};

//function to insert news in unseen news from fresh news
const insertIntoUnseenNews = async(news) => {
    await insertNews('unseen_news', news);
};

//function to push news from fresh news to unseen news
const pushFreshToUnseen = async() => {
    try {
        const fetchFreshNews = await redisClient.lRange('fresh_news', 0, -1);
        if (fetchFreshNews.length > 0) {
            await redisClient.rpush('unseen_news', ...fetchFreshNews);
            console.log('Moved fresh news to unseen news:', fetchFreshNews);
        }
        redisClient.del('fresh_news');
        const { fetchNews } = require('../GeminiToFresh');
        await fetchNews();
    } catch (err) {
        console.error('Error pushing fresh news to unseen news:', err);
        throw err;
    }
};

//function to push news from unseen news to seen news (one by one process)
const pushUnseenToSeen = async() => {
    try {
        const fetchUnseenNews = await redisClient.lPop('unseen_news'); //pops the very first news
        if (fetchUnseenNews) {
            await redisClient.rPush('seen_news', fetchUnseenNews);
            console.log('Moved unseen news to seen news:', fetchUnseenNews);
        }
        const length = await redisClient.lLen('unseen_news');
        if (length === 0) {
            await pushFreshToUnseen();
        }
        return fetchUnseenNews;
    } catch (err) {
        console.error('Error pushing unseen news to seen news:', err);
        throw err;
    }
};


//function to push news from redis seen to firestore
const redisToFireStore = async() => {
    try {
        const fetchSeenNews = await redisClient.lRange('seen_news', 0, -1);
        if(fetchSeenNews.length === 0) return;
        // const parsedNews = fetchSeenNews.reduce((acc, news) => {
        //     const parsed = JSON.parse(news); // Parse the current news JSON string
        //     acc[parsed.company] = parsed; // Use the 'company' field as the key
        //     return acc;
        // }, {});
        const parsedNews = fetchSeenNews.reduce((acc, news) => {
            const parsed = JSON.parse(news);
            if (!acc[parsed.company]) {
              acc[parsed.company] = [];
            }
            acc[parsed.company].push(parsed);
            return acc;
          }, {});
        console.log('parsedNews:', parsedNews);
        redisClient.del('seen_news');
        const { pushNews } = require('../fireStoreServices/pushNews');
        await pushNews(parsedNews);
    } catch (err) {
        console.error('Error pushing seen news to firestore:', err);
        throw err;
    }
};

module.exports = { insertNews, insertIntoSeenNews, insertIntoFreshNews, insertIntoUnseenNews, pushFreshToUnseen, pushUnseenToSeen, redisToFireStore };



// newsData = [
//         {
//           "title": "Tech Titan Innovex Launches AI-powered Assistant",
//           "sector": "Technology",
//           "sentiment": "Positive",
//           "volatility": "Moderate",
//           "company": "Innovex"
//         },
//         {
//             "title": "Tech Titan Innovex Launches AI-powered Assistant",
//             "sector": "Technology",
//             "sentiment": "Positive",
//             "volatility": "Moderate",
//             "company": "Innovex"
//           },
//         {
//           "title": "GreenVolt Reports Unexpected Quarterly Losses",
//           "sector": "Energy",
//           "sentiment": "Negative",
//           "volatility": "High",
//           "company": "GreenVolt"
//         },
//         {
//           "title": "AutoNova Sees Steady Growth Amidst EV Boom",
//           "sector": "Automobile",
//           "sentiment": "Positive",
//           "volatility": "Low",
//           "company": "AutoNova"
//         },
//         {
//           "title": "PharmaCure’s New Drug Faces Regulatory Hurdles",
//           "sector": "Healthcare",
//           "sentiment": "Negative",
//           "volatility": "Moderate",
//           "company": "PharmaCure"
//         },
//         {
//           "title": "SwiftBank Expands Digital Payment Solutions",
//           "sector": "Finance",
//           "sentiment": "Positive",
//           "volatility": "Low",
//           "company": "SwiftBank"
//         },
//         {
//           "title": "AgroFuture’s Crop Yield Technology Gains Investor Interest",
//           "sector": "Agriculture",
//           "sentiment": "Positive",
//           "volatility": "Moderate",
//           "company": "AgroFuture"
//         },
//         {
//           "title": "CyberShield Faces Backlash Over Data Breach Incident",
//           "sector": "Cybersecurity",
//           "sentiment": "Negative",
//           "volatility": "High",
//           "company": "CyberShield"
//         },
//         {
//           "title": "Retail Giant ShopEase Announces Expansion Plans",
//           "sector": "Retail",
//           "sentiment": "Positive",
//           "volatility": "Low",
//           "company": "ShopEase"
//         },
//         {
//           "title": "CloudWave Reports Lower-than-Expected Revenue Growth",
//           "sector": "Cloud Computing",
//           "sentiment": "Negative",
//           "volatility": "Moderate",
//           "company": "CloudWave"
//         },
//         {
//           "title": "SolarGen’s Renewable Energy Projects Gain Government Backing",
//           "sector": "Energy",
//           "sentiment": "Positive",
//           "volatility": "Moderate",
//           "company": "SolarGen"
//         }
//       ];

// const trialMethod = async() => {
//     // const newsDataJson = JSON.stringify(newsData);
//     // await newsData.map(async(news) => {
//     //     await insertIntoSeenNews(JSON.stringify(news));
//     // });
//     redisClient.del('seen_news');
//     await newsData.forEach(async (news) => {
//         await insertIntoSeenNews(JSON.stringify(news));
//     });
//     // await insertIntoSeenNews(newsDataJson);
//     await redisToFireStore();
//     console.log('Trial method executed successfully');
// };

// trialMethod();