import mongoose from "mongoose";
import dotenv from "dotenv";
import Doener from "./models/Doener.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/doenerfinder";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB verbunden");

    await Doener.deleteMany({});
    console.log("🗑️ Alte Einträge gelöscht");

    const doenerList = [
      {
        name: "City Kebab",
        address: "Bahnhofstrasse 80, 8001 Zürich, Schweiz",
        coords: { lat: 47.3768866, lon: 8.541694 },
      },
      {
        name: "Sternen Grill",
        address: "Theaterstrasse 22, 8001 Zürich, Schweiz",
        coords: { lat: 47.3662553, lon: 8.545097 },
      },
      {
        name: "Döner Haus Bern",
        address: "Marktgasse 45, 3011 Bern, Schweiz",
        coords: { lat: 46.9482713, lon: 7.4474393 },
      },
      {
        name: "Basel Kebap Haus",
        address: "Steinenvorstadt 23, 4051 Basel, Schweiz",
        coords: { lat: 47.553081, lon: 7.5876 },
      },
      {
        name: "Luzerner Kebap",
        address: "Pilatusstrasse 20, 6003 Luzern, Schweiz",
        coords: { lat: 47.050169, lon: 8.309307 },
      },
    ];

    await Doener.insertMany(doenerList);
    console.log("🥙 Schweizer Test-Döner eingefügt ✅");

    process.exit(0);
  } catch (err) {
    console.error("❌ Fehler beim Seeden:", err);
    process.exit(1);
  }
}

seed();
