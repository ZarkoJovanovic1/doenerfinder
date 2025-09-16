export const API_BASE = (import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

// Alle Döner laden
export async function getDoener() {
  const res = await fetch(`${API_BASE}/api/doener`);
  if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);
  return res.json();
}

// Döner hinzufügen
export async function addDoener(entry) {
  const res = await fetch(`${API_BASE}/api/doener`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Fehler beim Hinzufügen: ${res.status}`);
  return res.json();
}

// Döner updaten
export async function updateDoener(id, entry) {
  const res = await fetch(`${API_BASE}/api/doener/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Fehler beim Update: ${res.status}`);
  return res.json();
}

// Döner löschen
export async function deleteDoener(id) {
  const res = await fetch(`${API_BASE}/api/doener/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Fehler beim Löschen: ${res.status}`);
  return res.json();
}

// Geocoding
export async function geocodeAddress(address) {
  const res = await fetch(`${API_BASE}/api/geocode?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`Geocoding Fehler: ${res.status}`);
  return res.json();
}
