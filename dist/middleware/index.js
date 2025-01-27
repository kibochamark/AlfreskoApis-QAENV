"use strict";
// import * as jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";
// import express from 'express';
// import { getuserByKinde } from '../controllers/auth';
// import { createUser, getUserByEmail, getUserByKindeId } from "../db";
// import { updateUser } from '../db/index';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, authenticationUtilities_1.verifyAccessToken)(token);
        req.user = decoded; // Add decoded user info to request
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired access token' });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=index.js.map