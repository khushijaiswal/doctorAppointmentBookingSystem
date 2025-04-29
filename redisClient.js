const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
