import { useEffect, useState } from "react";
import {
  getDoener,
  addDoener,
  updateDoener,
  deleteDoener,
  geocodeAddress,
} from "./api";

function App() {
  const [doener, setDoener] = useState([]);
  const [form, setForm] = useState({ name: "", address: "" });
  const [editingDoener, setEditingDoener] = useState(null);

  // Alle Döner laden
  const fetchDoener = async () => {
    try {
      const data = await getDoener();
      setDoener(data);
    } catch (e) {
      console.error("fetchDoener failed:", e);
      alert(`Fehler beim Laden: ${e.message}`);
    }
  };

  useEffect(() => {
    fetchDoener();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let coords = null;
      if (form.address) {
        const geo = await geocodeAddress(form.address);
        if (geo?.[0]) {
          coords = { lat: geo[0].lat, lon: geo[0].lon };
        }
      }

      const payload = { ...form, coords };

      if (editingDoener) {
        await updateDoener(editingDoener._id, payload);
        setEditingDoener(null);
      } else {
        await addDoener(payload);
      }

      setForm({ name: "", address: "" });
      fetchDoener();
    } catch (err) {
      console.error("Submit error:", err);
      alert(`Fehler: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Wirklich löschen?")) return;
    await deleteDoener(id);
    fetchDoener();
  };

  const handleEdit = (entry) => {
    setForm({ name: entry.name, address: entry.address || "" });
    setEditingDoener(entry);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🥙 Dönerfinder</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Adresse"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <button type="submit">
          {editingDoener ? "Update" : "Hinzufügen"}
        </button>
      </form>

      <ul>
        {doener.map((d) => (
          <li key={d._id}>
            <b>{d.name}</b> – {d.address || "Keine Adresse"}
            {d.coords && (
              <span> ({d.coords.lat}, {d.coords.lon})</span>
            )}
            <button onClick={() => handleEdit(d)}>✏️</button>
            <button onClick={() => handleDelete(d._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
