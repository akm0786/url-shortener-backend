// controllers/url.controller.js
import Url from "../models/url.model.js";
import { nanoid } from 'nanoid';
import { isValidUrl, normalizeUrl } from "../utils/validateUrl.js";

export const createShortUrl = async (req, res, next) => {
  try {
    let { originalUrl, customAlias } = req.body;

    if (!originalUrl) {
      res.status(400);
      throw new Error("Original URL is required");
    }

    originalUrl = normalizeUrl(originalUrl);

    if (!originalUrl || !isValidUrl(originalUrl)) {
      res.status(400);
      throw new Error("Please enter a valid URL (example: google.com or https://example.com)");
    }

    let shortCode;

    if (customAlias) {
      shortCode = customAlias.trim();

      // Validation regex: letters, numbers, hyphen only
      if (!/^[a-zA-Z0-9-]+$/.test(shortCode)) {
        res.status(400);
        throw new Error("Custom alias can only contain letters (a-z A-Z), numbers (0-9), and hyphen (-)");
      }

      // Clean consecutive and edge hyphens (recommended for clean URLs)
      shortCode = shortCode
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (shortCode.length === 0) {
        res.status(400);
        throw new Error("Custom alias contains only invalid characters");
      }

      if (shortCode.length < 3 || shortCode.length > 20) {
        res.status(400);
        throw new Error("Custom alias must be 3-20 characters long");
      }

      // Case stays exactly as user provided it
    } else {
      shortCode = nanoid(8);  // random, case-sensitive by default (nanoid uses a-zA-Z0-9_)
    }

    const exists = await Url.findOne({ shortCode });
    if (exists) {
      res.status(409);
      throw new Error("Short code / custom alias already in use");
    }

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      userId: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: {
        shortCode: newUrl.shortCode,
        shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
        originalUrl: newUrl.originalUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

export const redirectShortUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      res.status(404);
      throw new Error("Short URL not found");
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getUserUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("originalUrl shortCode clicks createdAt");

    res.status(200).json({
      success: true,
      data: urls
    });
  } catch (error) {
    next(error);
  }
};


export const getUrlCount = async (req, res, next) => {
  try {
    const count = await Url.countDocuments({
      userId: req.user._id
    });

    res.status(200).json({
      success: true,
      data: { totalUrls: count }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id);

    if (!url) {
      res.status(404);
      throw new Error("Short URL not found");
    }

    if (url.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Unauthorized to delete this URL");
    }

    await url.deleteOne();

    res.status(200).json({
      success: true,
      message: "Short URL deleted successfully"
    })

  } catch (error) {
    next(error);
  }


}

