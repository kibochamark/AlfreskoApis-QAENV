import { isTokenBlacklisted } from '../utils/tokenblacklist';
import express from 'express';

const checkTokenBlacklist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];

    try{

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }
    
        next();
    }catch (err) {
        res.status(403).json({ message: 'Invalid or expired access token' });
      }

};

export default checkTokenBlacklist;
