// backend/server.js
import "dotenv/config";            // lädt .env (MONGO_URI, PORT)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Doener from "./models/Doener.js";

const app = express();

// CORS: in DEV alles offen, in PROD über ENV einschränken
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: FRONTEND_ORIGIN.length ? FRONTEND_ORIGIN : true }));

app.use(express.json());
app.set("trust proxy", 1);

// ------ MongoDB verbinden ------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/doenerfinder";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => {
    console.error("❌ MongoDB Fehler:", err?.message || err);
    process.exit(1);
  });

// ------ Healthcheck ------
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// ------ API ------
app.get("/api/doener", async (_req, res) => {
  try {
    const list = await Doener.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/doener", async (req, res) => {
  try {
    const saved = await new Doener(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/doener/:id", async (req, res) => {
  try {
    const updated = await Doener.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/doener/:id", async (req, res) => {
  try {
    await Doener.findByIdAndDelete(req.params.id);
    res.json({ message: "Döner gelöscht" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Optionales Geocoding (OSM Nominatim)
app.get("/api/geocode", async (req, res) => {
  try {
    const q = req.query.address;
    if (!q) return res.status(400).json({ message: "address required" });
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { "User-Agent": process.env.GEOCODE_UA || "doenerfinder/1.0 (contact@example.com)" } });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ------ Start ------
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend läuft auf Port ${PORT}`);
});
