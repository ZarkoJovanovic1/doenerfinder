import mongoose from "mongoose";

const doenerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  coords: {
    lat: { type: Number },
    lon: { type: Number }
  }
});

const Doener = mongoose.model("Doener", doenerSchema);

export default Doener;
