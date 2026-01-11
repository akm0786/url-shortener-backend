import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createShortUrl } from "../controllers/url.controller.js";


const router = express.Router();

router.post("/", protect, createShortUrl)

export default router