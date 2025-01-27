import express from 'express';
import { getPayloadFromToken } from '../utils/authenticationUtilities';
import { checkActiveSubscription } from '../db/index'; // Import the function to check active subscription

const checkActiveSubscriptionMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }

    try {
        const payload = getPayloadFromToken(authHeader);

        if (!payload || !payload.company_id) {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }

        const hasActiveSubscription = await checkActiveSubscription(payload.company_id);

        if (!hasActiveSubscription) {
            return res.status(403).json({ message: 'Company does not have an active subscription' });
        }

        next();
    } catch (error) {
        console.error('Error checking active subscription:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default checkActiveSubscriptionMiddleware;
