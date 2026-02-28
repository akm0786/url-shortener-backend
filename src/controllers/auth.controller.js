import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// For signup

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    // if(!email || !password) return res.status(400).json({msg: "All fields are required"});

    if (!fullName || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");

        //when throw an error express caches it and look for the function with 4 parameters (my errorHandler)
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ fullName, email, password });


    generateToken(res, user._id);

    user.password = undefined;
    res.status(201).json({
        success: true,
        user
    });

}

//Login

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        res.status(400);
        throw new Error("User does not exist");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    generateToken(res, user._id);
    user.password = undefined;

    res.status(200).json({
        success: true,
        user
    });

}

// Google Auth
export const googleAuth = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(400);
        throw new Error("Token is required");
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name: fullName, picture: avatar } = payload;

        let user = await User.findOne({ email }).select("+password");

        if (user) {
            // Link googleId if not linked
            if (!user.googleId) {
                user.googleId = googleId;
                if (avatar) user.avatar = avatar;
                // Since this user was created with a password originally, 
                // we don't want the password validation to trigger if they don't provide it here
                await user.save({ validateModifiedOnly: true });
            }
        } else {
            // Create a new user
            // We need to bypass the password required validation specifically
            const newUser = new User({
                fullName,
                email,
                googleId,
                avatar
            });
            user = await newUser.save({ validateBeforeSave: false });
        }

        generateToken(res, user._id);
        user.password = undefined;

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error verifying Google Token", error);
        res.status(401);
        throw new Error("Invalid Google Token");
    }
}

//logout
export const logout = async (req, res) => {

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // it sets the expiration date to January 1, 1970. Since that date is long in the past, the browser sees the cookie and immediately deletes it.
        secure: true
    })

    res.status(200).json({ message: "Logged out successfully" });
}

//get current user
export const getMe = (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
        success: true,
        user: req.user
    });
}