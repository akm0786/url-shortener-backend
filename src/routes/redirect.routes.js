import express from "express";
import { redirectShortUrl } from "../controllers/url.controller.js";
import { redirectLimiter } from "../middleware/rateLimit.middleware.js"

const router = express.Router();

router.get("/:shortCode", redirectLimiter, redirectShortUrl);

export default router