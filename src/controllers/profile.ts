import { Request, Response } from 'express';
import { createProfile, nullifyProfileInUsers, updateUser } from '../db';
import { updateProfile } from '../db';
import { deleteProfile } from '../db';
import { getUsersWithProfiles } from '../db';
import { getUserWithProfile } from '../db';
import { deleteUser, deleteRefreshTokensByUserId } from '../db';
import { getPayloadFromToken } from '../utils/authenticationUtilities';

export async function createProfileHandler(req: Request, res: Response) {
    const { userType, name, phone, address } = req.body;
    const authHeader = req.headers.authorization;
    const payload= getPayloadFromToken(authHeader)


    if (!userType || !name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (userType, name, phone, address) are required"
        });
    }

    try {
        const profile = await createProfile(userType, name, phone, address);
        await updateUser({profile_id:profile[0].id}, payload?.id)
        res.status(201).json({
            message: "Profile created successfully",
            profile: profile[0]
        });
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create profile"
        });
    }
}

//update profile
export async function updateProfileHandler(req: Request, res: Response) {
    const { name, phone, address } = req.body;
    const authHeader = req.headers.authorization;
    const payload = getPayloadFromToken(authHeader);

    if (!name || !phone || !address) {
        return res.status(400).json({
            error: "All fields (name, phone, address) are required"
        });
    }

    try {
        const profile = await updateProfile(payload?.profile_id, { name, phone, address });
        res.status(200).json({
            message: "Profile updated successfully",
            profile: profile[0]
        });
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update profile"
        });
    }
}
//Delete Profile
export async function deleteProfileHandler(req: Request, res: Response) {
    try {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).json({
                error: "Profile ID is missing in query"
            });
        }

        // Nullify the profile_id in users table before deleting the profile
        await nullifyProfileInUsers(parseInt(id));

        const profile = await deleteProfile(parseInt(id));

        if (!profile.length) {
            return res.status(404).json({
                error: "Profile not found"
            });
        }

        return res.status(204).json().end();

    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete profile"
        });
    }
}
//Getting the users with their profile
export async function getUsersWithProfilesHandler(req: Request, res: Response) {
    try {
        const usersWithProfiles = await getUsersWithProfiles();

        return res.status(200).json({
            users: usersWithProfiles
        });

    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to get users with profiles"
        });
    }
}
//get a single user
export async function getUserWithProfileHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }

        const userWithProfile = await getUserWithProfile(parseInt(id));

        if (!userWithProfile.length) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json({
            user: userWithProfile[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to get user with profile"
        });
    }
}
//DELETE A USER
export async function deleteUserHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "User ID is required"
            });
        }

        // Delete refresh tokens for the user
        await deleteRefreshTokensByUserId(parseInt(id));

        // Delete the user
        const user = await deleteUser(parseInt(id));

        if (!user.rowCount) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(204).json().end();

    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete user"
        });
    }
}