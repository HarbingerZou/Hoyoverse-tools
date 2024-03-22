import User from "../../models/userModel"
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import { NextApiRequest, NextApiResponse } from "next";
export default async function(req: NextApiRequest, res: NextApiResponse) {
    const password = sanitize(req.body.password);
    const email = sanitize(req.body.email);

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            // If no user is found with the email, cannot reset password
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        // Generate a new salt and hash for the new password
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        // Update the user's password with the new hash
        await User.updateOne({ email: email }, { $set: { password: hash } });

        // Respond with success message
        res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while resetting the password", success: false });
    }
}