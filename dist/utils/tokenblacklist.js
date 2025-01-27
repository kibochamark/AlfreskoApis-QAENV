"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.blacklistToken = void 0;
const redisClient_1 = __importDefault(require("./redisClient")); // The Redis client you set up
const TOKEN_BLACKLIST_PREFIX = 'blacklist:token:';
const blacklistToken = async (token, expiryTime) => {
    await redisClient_1.default.set(TOKEN_BLACKLIST_PREFIX + token, 'true', {
        EX: expiryTime
    });
};
exports.blacklistToken = blacklistToken;
const isTokenBlacklisted = async (token) => {
    const result = await redisClient_1.default.get(TOKEN_BLACKLIST_PREFIX + token);
    return result !== null;
};
exports.isTokenBlacklisted = isTokenBlacklisted;
//# sourceMappingURL=tokenblacklist.js.map