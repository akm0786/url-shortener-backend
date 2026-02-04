import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json()); //parse JSON body
app.use(cookieParser()); //needed for JWT
app.set("trust proxy", 1)

app.use(cors({
    origin: "http://localhost:5173",
    // origin: process.env.CLIENT_URL,
    credentials: true, //mandatory for cookies 
}))



// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// app.get("/", (req, res) => {
//     res.status(200).json({ status: "OK" });
// });

app.use("/auth", authRoutes);
app.use("/api/urls", urlRoutes)
app.use("/", redirectRoutes)

// If the request didn't match any route above, it falls into these:
app.use(notFound);      // Catches anything that isn't a route
app.use(errorHandler);  // Processes the error and sends JSON
export default app