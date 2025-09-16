import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Marker-Icons fixen (Vite/React)
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function FitBounds({ points }) {
  const map = useMap();

  // Nach dem ersten Render kurz warten und Größe neu berechnen (häufiger Fix)
  useEffect(() => {
    const t = setTimeout(() => {
      try { map.invalidateSize(); } catch {}
    }, 50);
    return () => clearTimeout(t);
  }, [map]);

  useMemo(() => {
    const coords = points
      .filter((p) => p?.coords?.lat && p?.coords?.lon)
      .map((p) => [Number(p.coords.lat), Number(p.coords.lon)]);
    if (!coords.length) return;
    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(coords), { padding: [30, 30] });
    }
  }, [points, map]);

  return null;
}

export default function MapView({ items = [] }) {
  // Stelle sicher, dass der Container eine feste Höhe hat!
  return (
    <div style={{ height: 420, width: "100%", borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
      <MapContainer
        center={[46.8182, 8.2275]} // Schweiz
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={items} />

        {items
          .filter((d) => d?.coords?.lat && d?.coords?.lon)
          .map((d) => (
            <Marker key={d._id} position={[Number(d.coords.lat), Number(d.coords.lon)]}>
              <Popup>
                <b>{d.name}</b>
                <br />
                {d.address || "Keine Adresse"}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
