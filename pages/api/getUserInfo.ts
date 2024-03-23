import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth'; 
import User from '../../models/userModel'; 
import { authOptions } from './auth/[...nextauth]';
export default async function(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: "No session" }); // 401 Unauthorized might be more appropriate
    }

    const session_user = session.user;
    if (!session_user) {
        return res.status(401).json({ message: "No user in session" }); // 401 Unauthorized might be more appropriate
    }

    const session_user_email = session_user.email;
    if (!session_user_email) {
        return res.status(404).json({ message: "User email not found" }); // 404 Not Found, if email is expected but not present
    }

    try {
        const db_user = await User.findOne({ email: session_user_email });
        if (!db_user) {
            return res.status(404).json({ message: "Invalid User" }); // 404 Not Found, if user does not exist in the database
        }

        return res.status(200).json({ message: "Success", infos:db_user });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error" }); // 500 Internal Server Error, for any database errors
    }
}

