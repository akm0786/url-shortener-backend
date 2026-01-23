import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
    )

    res.cookie("token", token ,{
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 15 * 60 * 1000
    })

}

export default generateToken