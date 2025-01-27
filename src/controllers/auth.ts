import express from 'express';
import passport from 'passport';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../utils/authenticationUtilities';
import { refreshTokens } from '../db/schema';
import { checkActiveSubscription, createUser, deleteRefreshToken, getUser, insertRefreshToken } from '../db';
import { createHash } from '../utils/HasherPassword';
import { Request } from 'express';
import { blacklistToken } from '../utils/tokenblacklist';
import { JwtPayload } from 'jsonwebtoken';
import db from 'utils/connection';
import { createCompanywithUser } from '../db/index';


// controller to handle user login
export async function loginUser(req: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        passport.authenticate('local', async (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) return response.status(401).json({ message: info.message }).end();
            
            // if (user[0].company_id){
            // const activeSubscription = await checkActiveSubscription(user[0].company_id);
            // if (!activeSubscription) {
            // return response.status(403).json({ message: 'Company does not have an active subscription' });
            // }}
            

        
            
            const { accessToken, refreshToken } = generateTokens(user[0]);
            await insertRefreshToken(refreshToken, user[0].id)

            response.json({ accessToken, refreshToken });
        })(req, response, next);
    } catch {
        response.status(400).json({
            message: "Something went wrong, Contact administrator"
        }).end()
    }
}

export async function registerUser(req: express.Request, response: express.Response, next: express.NextFunction) {
    const { email, password, role } = req.body;


    if (!email || !password || !role) {
        response.status(500).json({ error: 'Email or password or role is missing in schema' });
    }

    const { hashedPassword, salt } = await createHash(password);


    

    try {
        const user = await createUser({
            email: email,
            password: hashedPassword,
            salt: salt,
            role_id: parseInt(role),
           
        })

        

        response.status(201).json(user).end();
    } catch (err) {
        response.status(500).json({ error: err?.message }).end();
    }
}


export async function registerCompany(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { email, password, companyName, companyAddress, companyPhone, 
        companyEmail,location } = req.body;
    

    if (!email || !password || !companyName || !companyAddress || !companyPhone || !location || !companyEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const { hashedPassword, salt } = await createHash(password);

    try {
        const user = await createCompanywithUser({
            salt:salt,
            role:2,
            companyName:companyName,
            companyAddress:companyAddress,
            companyPhone:companyPhone,
            companyEmail:companyEmail,
            email:email,
            location:location,
            hashedPassword:hashedPassword
        })

        if(!user) return res.status(400).json({
            error:"failed to create company "
        }).end()

        return res.status(201).json(user).end()
    } catch (err) {
        res.status(500).json({ error: err.message }).end();
    }
}


export const refreshToken = async (req: express.Request, response: express.Response, next: express.NextFunction) => {
    const { apprefreshToken } = req.body;
    if (!refreshToken) return response.status(403).json({ message: 'Refresh token is required' }).end();

    try {
        const decoded = verifyRefreshToken(apprefreshToken);
        
        const user = await getUser(parseInt(decoded.id));
        if (!user) return response.status(403).json({ message: 'User not found' });



        await deleteRefreshToken(apprefreshToken);
        const { accessToken, refreshToken } = generateTokens({
            id: user[0].id,
            email: user[0].email
        });

        await insertRefreshToken(refreshToken, user[0].id)


        response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken }).end();
    } catch (err) {
        response.status(403).json({ message: err.message }).end();
    }
}


export const googlecallback = async (req: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
       
        passport.authenticate('google', { failureRedirect: '/' }, async (err: any, user: any, info: any) => {
            console.log(err, user, "usr")
            if (err) return next(err);
            if (!user) return response.status(401).json({ message: info.message }).end();
            
            
            
            const { accessToken, refreshToken } = generateTokens(user);
            await insertRefreshToken(refreshToken, user.id)
    
            response.json({ accessToken, refreshToken });
        })(req, response, next)
    } catch {
        response.status(400).json({
            message: "Something went wrong, Contact administrator"
        }).end()
    }
    
    
}
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

export async function logoutUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { refreshToken, accessToken } = req.body;
    if (!refreshToken || !accessToken) return res.status(403).json({ error: "Refresh token or access token not included in schema" });

    try {
        await deleteRefreshToken(refreshToken);

        const decodedToken = verifyAccessToken(accessToken) as JwtPayload; // Ensure decoded token is treated as JwtPayload
        if (typeof decodedToken === 'string' || !decodedToken.exp) {
            return res.status(403).json({ error: "Invalid access token" });
        }

        console.log(decodedToken.exp, "dec")

        const expiryTime = decodedToken.exp - Math.floor(Date.now() / 1000); // Calculate expiry time in seconds
        console.log(expiryTime, "exp")
        await blacklistToken(accessToken, expiryTime); // Blacklist the access token

        req.logout((err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Logged out successfully" });
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function testlogout(req: express.Request, res: express.Response, next: express.NextFunction){
    return res.status(200).json({
        message:"successfull"
    }).end()
}


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




