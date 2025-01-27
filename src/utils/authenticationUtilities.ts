import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db  from './connection';
import { User, refreshTokens } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

export const generateTokens = (user: { email: string; id: number; company_id?: number }) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email, company_id: user.company_id }, JWT_SECRET, {
        expiresIn: '1h'
    });

    const refreshToken = jwt.sign({ id: user.id, email: user.email, company_id: user.company_id }, REFRESH_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId: number, refreshToken: string) => {
    await db.insert(refreshTokens).values({ user_id: userId, token: refreshToken });
};

export const hashPassword = async (password: string, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, salt };
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};

export const generateRefreshToken = (user: { id: any; email: any; }) => {
    return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
};


const RESET_SECRET = process.env.RESET_SECRET || 'your_reset_secret';
const RESET_TOKEN_EXPIRATION = '1h'; // Token expires in 1 hour

export const generateResetToken = (userId: number): string => {
    return jwt.sign({ userId }, RESET_SECRET, { expiresIn: RESET_TOKEN_EXPIRATION });
};


export const verifyResetToken = (token: string): { userId: number } | null => {
    try {
        const decoded = jwt.verify(token, RESET_SECRET) as { userId: number };
        return decoded;
    } catch (error) {
        console.error('Reset token verification failed:', error.message);
        return null;
    }
};

//GENERATE OTP
export function generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP code
}



export const getPayloadFromToken = (authHeader: string): JwtPayload | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid or missing authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};
