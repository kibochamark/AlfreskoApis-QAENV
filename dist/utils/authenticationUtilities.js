"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadFromToken = exports.generateOtpCode = exports.verifyResetToken = exports.generateResetToken = exports.generateRefreshToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.verifyPassword = exports.hashPassword = exports.storeRefreshToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("./connection"));
const schema_1 = require("../db/schema");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, company_id: user.company_id }, JWT_SECRET, {
        expiresIn: '1h'
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, company_id: user.company_id }, REFRESH_SECRET, {
        expiresIn: '7d'
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const storeRefreshToken = async (userId, refreshToken) => {
    await connection_1.default.insert(schema_1.refreshTokens).values({ user_id: userId, token: refreshToken });
};
exports.storeRefreshToken = storeRefreshToken;
const hashPassword = async (password, saltRounds = 10) => {
    const salt = await bcrypt_1.default.genSalt(saltRounds);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    return { hashedPassword, salt };
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const RESET_SECRET = process.env.RESET_SECRET || 'your_reset_secret';
const RESET_TOKEN_EXPIRATION = '1h'; // Token expires in 1 hour
const generateResetToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, RESET_SECRET, { expiresIn: RESET_TOKEN_EXPIRATION });
};
exports.generateResetToken = generateResetToken;
const verifyResetToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, RESET_SECRET);
        return decoded;
    }
    catch (error) {
        console.error('Reset token verification failed:', error.message);
        return null;
    }
};
exports.verifyResetToken = verifyResetToken;
//GENERATE OTP
function generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP code
}
exports.generateOtpCode = generateOtpCode;
const getPayloadFromToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid or missing authorization header');
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return payload;
    }
    catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};
exports.getPayloadFromToken = getPayloadFromToken;
//# sourceMappingURL=authenticationUtilities.js.map