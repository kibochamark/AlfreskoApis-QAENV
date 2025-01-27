"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenblacklist_1 = require("../utils/tokenblacklist");
const checkTokenBlacklist = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const isBlacklisted = await (0, tokenblacklist_1.isTokenBlacklisted)(token);
        if (isBlacklisted) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired access token' });
    }
};
exports.default = checkTokenBlacklist;
//# sourceMappingURL=blacklist.js.map