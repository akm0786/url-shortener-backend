import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    )

    // res.cookie("token", token ,{
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",  // Only secure in production
    //     sameSite: "None",
    //     maxAge: 30 * 60 * 1000,
    // })

    const expires = new Date(Date.now() + 30 * 60 * 1000); // 15 minutes from now
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: expires, // Expiration date
    });


}

export default generateToken