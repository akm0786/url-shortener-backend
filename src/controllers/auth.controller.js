import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

// For signup

export const signup = async (req, res) => {
    const {fullName, email, password } = req.body;

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

    const user = await User.create({ fullName,email, password });


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
    res.status(200).json({
        success: true,
        user: req.user
    });
}