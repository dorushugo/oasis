"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CoolingSpot } from "@/generated/prisma";
import { Maximize2 } from "lucide-react";

function createIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color:#000091;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

type MapPreviewProps = {
  spots: CoolingSpot[];
};

export default function MapPreview({ spots }: MapPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const lat = parseFloat(process.env.NEXT_PUBLIC_MAP_LAT || "43.7102");
  const lng = parseFloat(process.env.NEXT_PUBLIC_MAP_LNG || "-1.0530");
  const zoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM || "13");

  return (
    <button
      type="button"
      onClick={() => router.push("/carte")}
      aria-label="Ouvrir la carte interactive des lieux de fraîcheur"
      className="group relative block w-full h-full overflow-hidden rounded-lg border text-left"
    >
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          <MapContainer
            center={[lat, lng]}
            zoom={zoom}
            className="h-full w-full"
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            attributionControl={false}
            keyboard={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {spots.map((spot) => (
              <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={createIcon()} />
            ))}
          </MapContainer>
        </div>
      )}

      {/* Voile + invite au clic (au survol) */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/25 transition-colors">
        <span className="flex items-center gap-2 bg-card border rounded-md px-4 py-2.5 text-sm font-semibold shadow-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          <Maximize2 className="w-4 h-4 text-primary" />
          Cliquer pour voir la carte
        </span>
      </div>
    </button>
  );
}
