import { getUserByEmail, setOtpCode, updatePassword, verifyOtpCode } from '../db';
import { Request, Response } from 'express';
import { generateResetToken, verifyResetToken } from '../utils/authenticationUtilities';
import sendEmail from '../utils/sendMail';
import { generateOtpCode } from '../utils/authenticationUtilities';




// export async function forgotPassword(req: Request, res: Response) {
//     const { email } = req.body;

//     if (!email) {
//         res.status(400).json({
//             error: "Email not available in schema"
//         })
//     }

//     try {
//         const user = await getUserByEmail(email)
//         if (!user) return res.status(403).json({
//             error: "User Not Found"
//         })
//         // Generate reset token
//         const resetToken = generateResetToken(user[0]?.id);

//         // Send reset token to user's email
//         await sendEmail(email, resetToken);

//         res.status(200).json({ message: `Reset token sent to ${email}` });

//     } catch (err) {
//         res.status(403).json({
//             error: err?.message
//         })
//     }



// }

// export async function resetpassword(req:Request, res:Response) {
//     const { token, newPassword } = req.body;
    
//     // Verify reset token
//     const decodedToken = verifyResetToken(token);
//     if (!decodedToken) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//     }
    
//     // Update user's password
//     const userId = decodedToken.userId;
//     const success = await updatePassword(userId, newPassword);
    
//     if (success) {
//         return res.status(200).json({ message: 'Password updated successfully' });
//     } else {
//         return res.status(500).json({ message: 'Failed to update password' });
//     }
// }




export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            error: "Email not available in schema"
        });
    }

    try {
        const [user] = await getUserByEmail(email);
        if (!user) return res.status(403).json({
            error: "User Not Found"
        });

        // Generate OTP code
        const otpCode = generateOtpCode();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Store OTP code and expiration time in the database
        await setOtpCode(email, otpCode, otpExpiresAt);

        // Send OTP code to user's email
        await sendEmail(email, `Your OTP code is ${otpCode}. This code will expire in 5 minutes.`);

        res.status(200).json({ message: `OTP code sent to ${email}` });

    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to send OTP code"
        });
    }
}

export async function resetPassword(req: Request, res: Response) {
    const { email, otpCode, newPassword } = req.body;

    try {
        // Verify OTP code
        const user = await verifyOtpCode(email, otpCode);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP code' });
        }

        // Update user's password
        const success = await updatePassword(user.id, newPassword);

        if (success) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to update password' });
        }
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to reset password"
        });
    }
}
