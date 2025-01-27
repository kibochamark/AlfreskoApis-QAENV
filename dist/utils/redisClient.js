"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    password: 'PzViNnmtsimbxkBryzRa39x8aG4ZVzTW',
    socket: {
        host: 'redis-18398.c83.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18398
    }
});
(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    }
    catch (error) {
        console.error('Redis connection error:', error);
    }
})();
exports.default = client;
//# sourceMappingURL=redisClient.js.map