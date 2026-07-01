"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { CoolingSpot } from "@/generated/prisma";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPOT_COLORS: Record<string, string> = {
  fontaine: "#3B82F6",
  gymnase: "#22C55E",
  bibliotheque: "#A855F7",
  commerce: "#F59E0B",
  autre: "#6B7280",
};

function createIcon(type: string) {
  const color = SPOT_COLORS[type] || SPOT_COLORS.autre;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function LocationButton() {
  const map = useMap();

  function handleLocate() {
    map.locate({ setView: true, maxZoom: 16 });
  }

  return (
    <Button
      onClick={handleLocate}
      className="absolute bottom-36 right-4 md:bottom-4 z-[1000] bg-card text-foreground border shadow-lg hover:bg-accent"
      size="lg"
    >
      <Navigation className="w-5 h-5 mr-2" />
      Me géolocaliser
    </Button>
  );
}

type MapContentProps = {
  spots: CoolingSpot[];
  selectedType: string | null;
};

export default function MapContent({ spots, selectedType }: MapContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lat = parseFloat(process.env.NEXT_PUBLIC_MAP_LAT || "50.6942");
  const lng = parseFloat(process.env.NEXT_PUBLIC_MAP_LNG || "3.1746");
  const zoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM || "13");

  const filteredSpots = selectedType
    ? spots.filter((s) => s.type === selectedType)
    : spots;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createIcon(spot.type)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-base text-foreground">{spot.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {spot.address}
              </p>
              {spot.hours && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Horaires :</span> {spot.hours}
                </p>
              )}
              {spot.capacity && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Capacité :</span> {spot.capacity} personnes
                </p>
              )}
              {spot.description && (
                <p className="text-sm text-muted-foreground mt-1">{spot.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      <LocationButton />
    </MapContainer>
  );
}
