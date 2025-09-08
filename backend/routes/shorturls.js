const express = require("express");
const { createShortUrl, redirectShortUrl, getStats } = require("../services/shortener");

const router = express.Router();

// POST /shorturls
router.post("/shorturls", createShortUrl);

// GET /shorturls/:shortcode (stats)
router.get("/shorturls/:shortcode", getStats);

// GET /:shortcode (redirect)
router.get("/:shortcode", redirectShortUrl);

module.exports = router;
