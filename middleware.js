import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging Middleware
export function logger(req, res, next) {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Image Serving Middleware
// Serves static images from uploads folder
export const serveImages = express.static(path.join(__dirname, "uploads"));
