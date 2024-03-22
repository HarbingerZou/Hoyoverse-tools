import User from "../../models/userModel"
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import { NextApiRequest, NextApiResponse } from "next";
export default async function(req:NextApiRequest, res:NextApiResponse){

    const username = sanitize(req.body.username);
	const password = sanitize(req.body.password);
	const email = sanitize(req.body.email);
    const user = await User.findOne({email:email});

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            // If a user with the email already exists
            res.status(409).json({ message: "Email already registered", success:false });
            return;
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const date = new Date();

        const newUser = new User({
            username: username,
            password: hash,
            email: email,
            signUpTime: date
        });

        await newUser.save(); // Ensure newUser is saved before responding
        res.status(200).json({ message: "User registered successfully", success:true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while registering the user", success:false });
    }
}