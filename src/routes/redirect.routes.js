import express from "express";
import {redirectShortUrl} from "../controllers/url.controller.js";

const router = express.Router();

router.get("/:shortCode", redirectShortUrl);

export default router