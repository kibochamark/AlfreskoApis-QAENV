import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import redisClient from './redisClient'; // The Redis client you set up
import { SetOptions } from 'redis';

const TOKEN_BLACKLIST_PREFIX = 'blacklist:token:';

export const blacklistToken = async (token: string, expiryTime: number) => {
    await redisClient.set(TOKEN_BLACKLIST_PREFIX + token, 'true', {
        EX: expiryTime
    } as SetOptions);
};

export const isTokenBlacklisted = async (token: string) => {
    const result = await redisClient.get(TOKEN_BLACKLIST_PREFIX + token);
    return result !== null;
};
