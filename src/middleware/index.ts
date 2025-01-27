// import * as jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";
// import express from 'express';
// import { getuserByKinde } from '../controllers/auth';
// import { createUser, getUserByEmail, getUserByKindeId } from "../db";
// import { updateUser } from '../db/index';

// const client = jwksClient({
//   jwksUri: "https://kibotech.kinde.com/.well-known/jwks.json" as string // Ensure the environment variable is defined as a string
// });

// function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
//   client.getSigningKey(header.kid, (err, key) => {
//     if (err) {
//       callback(err, undefined);
//     } else {
//       const signingKey = key!.getPublicKey();
//       callback(null, signingKey);
//     }
//   });
// }

// const authenticateJWT = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
    

//     jwt.verify(token, getKey, {}, async(err, user:any) => {
      
      
//       if (err) {
//         return res.sendStatus(403);
//       }

//       const email= (user?.email) as string;
//       const getuser= await getUserByEmail(email)
//       if(getuser.length <= 0){
//         try{
//         const newuser=await createUser({ username:user?.email.split("@")[0], kinde_id:user.sub ?? "", email:user?.email, })
//         }catch(e){

//         }
//       }else{
//         const updateduser = await updateUser({kinde_id:user.sub, username:user?.email.split("@")[0], email:user?.email}, getuser[0].id)
//       }



//       // req.user = user as jwt.JwtPayload; // Type assertion to JwtPayload
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// export default authenticateJWT;


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAccessToken } from '../utils/authenticationUtilities';

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Add decoded user info to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

export default authMiddleware;



