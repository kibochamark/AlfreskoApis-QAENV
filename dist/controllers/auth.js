"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testlogout = exports.logoutUser = exports.googlecallback = exports.refreshToken = exports.registerCompany = exports.registerUser = exports.loginUser = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
const db_1 = require("../db");
const HasherPassword_1 = require("../utils/HasherPassword");
const tokenblacklist_1 = require("../utils/tokenblacklist");
const index_1 = require("../db/index");
// controller to handle user login
async function loginUser(req, response, next) {
    try {
        passport_1.default.authenticate('local', async (err, user, info) => {
            if (err)
                return next(err);
            if (!user)
                return response.status(401).json({ message: info.message }).end();
            // if (user[0].company_id){
            // const activeSubscription = await checkActiveSubscription(user[0].company_id);
            // if (!activeSubscription) {
            // return response.status(403).json({ message: 'Company does not have an active subscription' });
            // }}
            const { accessToken, refreshToken } = (0, authenticationUtilities_1.generateTokens)(user[0]);
            await (0, db_1.insertRefreshToken)(refreshToken, user[0].id);
            response.json({ accessToken, refreshToken });
        })(req, response, next);
    }
    catch {
        response.status(400).json({
            message: "Something went wrong, Contact administrator"
        }).end();
    }
}
exports.loginUser = loginUser;
async function registerUser(req, response, next) {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        response.status(500).json({ error: 'Email or password or role is missing in schema' });
    }
    const { hashedPassword, salt } = await (0, HasherPassword_1.createHash)(password);
    try {
        const user = await (0, db_1.createUser)({
            email: email,
            password: hashedPassword,
            salt: salt,
            role_id: parseInt(role),
        });
        response.status(201).json(user).end();
    }
    catch (err) {
        response.status(500).json({ error: err?.message }).end();
    }
}
exports.registerUser = registerUser;
async function registerCompany(req, res, next) {
    const { email, password, companyName, companyAddress, companyPhone, companyEmail, location } = req.body;
    if (!email || !password || !companyName || !companyAddress || !companyPhone || !location || !companyEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const { hashedPassword, salt } = await (0, HasherPassword_1.createHash)(password);
    try {
        const user = await (0, index_1.createCompanywithUser)({
            salt: salt,
            role: 2,
            companyName: companyName,
            companyAddress: companyAddress,
            companyPhone: companyPhone,
            companyEmail: companyEmail,
            email: email,
            location: location,
            hashedPassword: hashedPassword
        });
        if (!user)
            return res.status(400).json({
                error: "failed to create company "
            }).end();
        return res.status(201).json(user).end();
    }
    catch (err) {
        res.status(500).json({ error: err.message }).end();
    }
}
exports.registerCompany = registerCompany;
const refreshToken = async (req, response, next) => {
    const { apprefreshToken } = req.body;
    if (!exports.refreshToken)
        return response.status(403).json({ message: 'Refresh token is required' }).end();
    try {
        const decoded = (0, authenticationUtilities_1.verifyRefreshToken)(apprefreshToken);
        const user = await (0, db_1.getUser)(parseInt(decoded.id));
        if (!user)
            return response.status(403).json({ message: 'User not found' });
        await (0, db_1.deleteRefreshToken)(apprefreshToken);
        const { accessToken, refreshToken } = (0, authenticationUtilities_1.generateTokens)({
            id: user[0].id,
            email: user[0].email
        });
        await (0, db_1.insertRefreshToken)(refreshToken, user[0].id);
        response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken }).end();
    }
    catch (err) {
        response.status(403).json({ message: err.message }).end();
    }
};
exports.refreshToken = refreshToken;
const googlecallback = async (req, response, next) => {
    try {
        passport_1.default.authenticate('google', { failureRedirect: '/' }, async (err, user, info) => {
            console.log(err, user, "usr");
            if (err)
                return next(err);
            if (!user)
                return response.status(401).json({ message: info.message }).end();
            const { accessToken, refreshToken } = (0, authenticationUtilities_1.generateTokens)(user);
            await (0, db_1.insertRefreshToken)(refreshToken, user.id);
            response.json({ accessToken, refreshToken });
        })(req, response, next);
    }
    catch {
        response.status(400).json({
            message: "Something went wrong, Contact administrator"
        }).end();
    }
};
exports.googlecallback = googlecallback;
// Google OAuth Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     async (req, res) => {
//         const user = req.user;
//         const accessToken = generateAccessToken(user);
//         const refreshToken = generateRefreshToken(user);
//         await db.insert(refreshTokens).values({ user_id: user.id, token: refreshToken }).returning('*');
//         res.json({ accessToken, refreshToken });
//     }
// );
async function logoutUser(req, res, next) {
    const { refreshToken, accessToken } = req.body;
    if (!refreshToken || !accessToken)
        return res.status(403).json({ error: "Refresh token or access token not included in schema" });
    try {
        await (0, db_1.deleteRefreshToken)(refreshToken);
        const decodedToken = (0, authenticationUtilities_1.verifyAccessToken)(accessToken); // Ensure decoded token is treated as JwtPayload
        if (typeof decodedToken === 'string' || !decodedToken.exp) {
            return res.status(403).json({ error: "Invalid access token" });
        }
        console.log(decodedToken.exp, "dec");
        const expiryTime = decodedToken.exp - Math.floor(Date.now() / 1000); // Calculate expiry time in seconds
        console.log(expiryTime, "exp");
        await (0, tokenblacklist_1.blacklistToken)(accessToken, expiryTime); // Blacklist the access token
        req.logout((err) => {
            if (err)
                return next(err);
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
exports.logoutUser = logoutUser;
async function testlogout(req, res, next) {
    return res.status(200).json({
        message: "successfull"
    }).end();
}
exports.testlogout = testlogout;
// Middleware to initiate Google OAuth with role as a query parameter
// router.get('/auth/google', (req, res, next) => {
//     const { role } = req.query;
//     passport.authenticate('google', { scope: ['profile', 'email'], state: role })(req, res, next);
// });
// Google OAuth callback route
// router.get('/auth/google/callback', (req, res, next) => {
//     passport.authenticate('google', { failureRedirect: '/' }, async (err, user, info) => {
//         if (err) return next(err);
//         const { accessToken, refreshToken } = generateTokens(user);
//         await insertRefreshToken(refreshToken, user.id);
//         return res.status(200).json({ accessToken, refreshToken });
//     })(req, res, next);
// });
//# sourceMappingURL=auth.js.map