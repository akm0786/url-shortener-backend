import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createShortUrl, getUserUrls, getUrlCount } from "../controllers/url.controller.js";
import { deleteUrl } from "../controllers/url.controller.js";

const router = express.Router();

router.post("/", protect, createShortUrl)
router.get("/", protect, getUserUrls)
router.get("/count", protect, getUrlCount)
router.delete("/:id", protect, deleteUrl)

export default router