"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const clickIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color:#ef4444;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.4);animation:pulse 1.5s infinite;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const spotIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color:#16a34a;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

type Spot = {
  id: string;
  lat: number;
  lng: number;
  name: string;
};

type AdminMapPickerProps = {
  spots: Spot[];
  onMapClick: (lat: number, lng: number) => void;
  selectedPosition: { lat: number; lng: number } | null;
};

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.3 });
    }
  }, [map, position]);
  return null;
}

export default function AdminMapPicker({ spots, onMapClick, selectedPosition }: AdminMapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const lat = parseFloat(process.env.NEXT_PUBLIC_MAP_LAT || "43.7102");
  const lng = parseFloat(process.env.NEXT_PUBLIC_MAP_LNG || "-1.0536");
  const zoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM || "13");

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      className="h-full w-full rounded-lg"
      style={{ cursor: "crosshair" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <FlyToPosition position={selectedPosition} />
      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={spotIcon} />
      ))}
      {selectedPosition && (
        <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={clickIcon} />
      )}
    </MapContainer>
  );
}
