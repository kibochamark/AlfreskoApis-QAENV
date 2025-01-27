"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
const index_1 = require("../db/index"); // Import the function to check active subscription
const checkActiveSubscriptionMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }
    try {
        const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
        if (!payload || !payload.company_id) {
            return res.status(403).json({ message: 'Invalid or expired access token' });
        }
        const hasActiveSubscription = await (0, index_1.checkActiveSubscription)(payload.company_id);
        if (!hasActiveSubscription) {
            return res.status(403).json({ message: 'Company does not have an active subscription' });
        }
        next();
    }
    catch (error) {
        console.error('Error checking active subscription:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.default = checkActiveSubscriptionMiddleware;
//# sourceMappingURL=checksubscription.js.map