const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});

async function connectRedis() {
    if(!redisClient.isOpen) {
        await redisClient.connect();
    }
    console.log('Redis connection established');
};

module.exports = { redisClient, connectRedis };