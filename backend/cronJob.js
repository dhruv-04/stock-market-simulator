const cron = require('node-cron');
const { pushFreshToSeen, redisToFireStore, fetchFromCurrentNews } = require('./services/newsServices/redisNews');

//cron job to run every 5 minutes 
cron.schedule('*/5 * * * *', async() => {
    try {
        await pushFreshToSeen();
    } catch (err) {
        console.error('Error pushing fresh news to seen or fetching news from gemini:', err);
    }
});

//cron job to run every 1 hour
cron.schedule('0 */1 * * *', async() => {
    try {
        await redisToFireStore();
    } catch (err) {
        console.error('Error pushing seen news to firestore:', err);
    }
});

//cron job to run every 7 minutes
cron.schedule('*/7 * * * *', async() => {
    try {
        await fetchFromCurrentNews();
    } catch (err) {
        console.error('Error fetching current news:', err);
    }
});