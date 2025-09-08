const { urls } = require("../data/store");
const Log = require("../../logging-middleware/logger");
const { v4: uuidv4 } = require("uuid");

// Helper to generate random shortcode
function generateShortCode() {
  return uuidv4().slice(0, 6);
}

async function createShortUrl(req, res) {
  const { url, validity, shortcode } = req.body;

  if (!url || !/^https?:\/\/\S+/.test(url)) {
    await Log("backend", "error", "handler", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const code = shortcode || generateShortCode();

  if (urls[code]) {
    await Log("backend", "warn", "handler", "Shortcode collision");
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  const expiryMinutes = validity || 30;
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  urls[code] = {
    url,
    createdAt: new Date(),
    expiresAt,
    clicks: [],
  };

  await Log("backend", "info", "service", `Created short URL: ${code}`);

  return res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry: expiresAt.toISOString(),
  });
}

async function redirectShortUrl(req, res) {
  const code = req.params.shortcode;
  const entry = urls[code];

  if (!entry) {
    await Log("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found", message: "No such shortcode." });
  }

  if (new Date() > entry.expiresAt) {
    await Log("backend", "warn", "handler", "Shortcode expired");
    return res.status(410).json({ error: "Link expired" });
  }

  entry.clicks.push({
    timestamp: new Date(),
    referrer: req.get("referer") || "direct",
    location: req.ip,
  });

  await Log("backend", "info", "service", `Redirected to ${entry.url}`);
  return res.redirect(entry.url);
}

async function getStats(req, res) {
  const code = req.params.shortcode;
  const entry = urls[code];

  if (!entry) {
    await Log("backend", "error", "handler", "Stats requested for invalid shortcode");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  return res.json({
    shortcode: code,
    url: entry.url,
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt,
    clickCount: entry.clicks.length,
    clicks: entry.clicks,
  });
}

module.exports = { createShortUrl, redirectShortUrl, getStats };
