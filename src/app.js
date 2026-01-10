import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json()); //parse JSON body
app.use(cookieParser()); //needed for JWT

app.use(cors(
    {

        origin: process.env.CLIENT_URL,
        credentials: true //mandatory for cookies
    }
))

// Health check

app.use("/health", (req, res) => res.status(200).json({ status: "ok" }));

export default app