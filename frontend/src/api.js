// Central API base URL helper
// In production (Vercel), set VITE_API_BASE_URL to your Render URL, e.g. https://meine-d-ner-app.onrender.com
// Locally, it falls back to http://localhost:5000
export const API_BASE = (import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
