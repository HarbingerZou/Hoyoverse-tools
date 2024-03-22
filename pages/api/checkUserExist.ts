import User from "../../models/userModel"
import sanitize from 'mongo-sanitize';
import { NextApiRequest, NextApiResponse } from "next";
export default async function(req:NextApiRequest, res:NextApiResponse){
	const email = sanitize(req.body.email);

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            // If a user with the email already exists
            res.status(200).json({ message: "User Exist", success:true });
            return;
        }else{
            res.status(409).json({ message: "User Doesn't Exist", success:false });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while registering the user", success:false });
    }
}