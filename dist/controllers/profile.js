"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.getUserWithProfileHandler = exports.getUsersWithProfilesHandler = exports.deleteProfileHandler = exports.updateProfileHandler = exports.createProfileHandler = void 0;
const db_1 = require("../db");
const db_2 = require("../db");
const db_3 = require("../db");
const db_4 = require("../db");
const db_5 = require("../db");
const db_6 = require("../db");
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
async function createProfileHandler(req, res) {
    const { userType, name, phone, address } = req.body;
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    if (!userType || !name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (userType, name, phone, address) are required"
        });
    }
    try {
        const profile = await (0, db_1.createProfile)(userType, name, phone, address);
        await (0, db_1.updateUser)({ profile_id: profile[0].id }, payload?.id);
        res.status(201).json({
            message: "Profile created successfully",
            profile: profile[0]
        });
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create profile"
        });
    }
}
exports.createProfileHandler = createProfileHandler;
//update profile
async function updateProfileHandler(req, res) {
    const { name, phone, address } = req.body;
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    if (!name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (name, phone, address) are required"
        });
    }
    try {
        const profile = await (0, db_2.updateProfile)(payload?.profile_id, { name, phone, address });
        res.status(200).json({
            message: "Profile updated successfully",
            profile: profile[0]
        });
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update profile"
        });
    }
}
exports.updateProfileHandler = updateProfileHandler;
//Delete Profile
async function deleteProfileHandler(req, res) {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "Profile ID is missing in query"
            });
        }
        // Nullify the profile_id in users table before deleting the profile
        await (0, db_1.nullifyProfileInUsers)(parseInt(id));
        const profile = await (0, db_3.deleteProfile)(parseInt(id));
        if (!profile.length) {
            return res.status(404).json({
                error: "Profile not found"
            });
        }
        return res.status(204).json().end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete profile"
        });
    }
}
exports.deleteProfileHandler = deleteProfileHandler;
//Getting the users with their profile
async function getUsersWithProfilesHandler(req, res) {
    try {
        const usersWithProfiles = await (0, db_4.getUsersWithProfiles)();
        return res.status(200).json({
            users: usersWithProfiles
        });
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to get users with profiles"
        });
    }
}
exports.getUsersWithProfilesHandler = getUsersWithProfilesHandler;
//get a single user
async function getUserWithProfileHandler(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }
        const userWithProfile = await (0, db_5.getUserWithProfile)(parseInt(id));
        if (!userWithProfile.length) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        return res.status(200).json({
            user: userWithProfile[0]
        });
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to get user with profile"
        });
    }
}
exports.getUserWithProfileHandler = getUserWithProfileHandler;
//DELETE A USER
async function deleteUserHandler(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }
        // Delete refresh tokens for the user
        await (0, db_6.deleteRefreshTokensByUserId)(parseInt(id));
        // Delete the user
        const user = await (0, db_6.deleteUser)(parseInt(id));
        if (!user.rowCount) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        return res.status(204).json().end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete user"
        });
    }
}
exports.deleteUserHandler = deleteUserHandler;
//# sourceMappingURL=profile.js.map