import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  // 1. Check if token exists
  if (!token) {
    res.status(401); 
    return next(new Error("Not authorized, no token found"));
  } 

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and exclude password from the object for safety
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      res.status(401);
      return next(new Error("User not found"));
    }

    // 4. Attach user to the request object
    req.user = user;

    next();
  } catch (error) {
    // 5. Handle invalid/expired tokens
    res.status(401);
    next(new Error("Token invalid or expired"));
  }
};

export default protect;