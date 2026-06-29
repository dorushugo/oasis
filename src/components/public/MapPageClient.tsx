"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CoolingSpot } from "@/generated/prisma";
import { MapPin, Droplets, Dumbbell, BookOpen, Store, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";

const MapContent = dynamic(() => import("@/components/public/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-oasis-bg">
      <div className="animate-pulse text-oasis-primary text-lg">Chargement de la carte...</div>
    </div>
  ),
});

const TYPE_CONFIG: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  fontaine: { label: "Fontaine", icon: Droplets, color: "bg-blue-500" },
  gymnase: { label: "Gymnase", icon: Dumbbell, color: "bg-green-500" },
  bibliotheque: { label: "Bibliothèque", icon: BookOpen, color: "bg-purple-500" },
  commerce: { label: "Commerce", icon: Store, color: "bg-amber-500" },
  autre: { label: "Autre", icon: Circle, color: "bg-gray-500" },
};

type MapPageClientProps = {
  spots: CoolingSpot[];
};

export default function MapPageClient({ spots }: MapPageClientProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredSpots = selectedType
    ? spots.filter((s) => s.type === selectedType)
    : spots;

  return (
    <div className="h-[calc(100vh-4rem)] relative flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg text-oasis-dark">Filtrer par type</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              Tous ({spots.length})
            </Button>
            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const count = spots.filter((s) => s.type === type).length;
              if (count === 0) return null;
              const Icon = config.icon;
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
        </div>
        <div className="p-4 space-y-3">
          {filteredSpots.map((spot) => {
            const config = TYPE_CONFIG[spot.type] || TYPE_CONFIG.autre;
            return (
              <div
                key={spot.id}
                className="p-3 rounded-lg border border-border hover:border-oasis-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge className={clsx(config.color, "text-white text-xs")}>
                    {config.label}
                  </Badge>
                  {spot.isOpen ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Ouvert
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      Fermé
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mt-2 text-oasis-dark">{spot.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{spot.address}</p>
                {spot.hours && (
                  <p className="text-xs text-muted-foreground mt-1">🕐 {spot.hours}</p>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContent spots={spots} selectedType={selectedType} />
      </div>

      {/* Mobile sheet */}
      <div className="md:hidden absolute bottom-20 left-4 z-[1000]">
        <Sheet>
          <SheetTrigger className="shadow-lg inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 gap-1.5 px-2.5 font-medium text-sm">
            <MapPin className="w-5 h-5 mr-2" />
            Liste ({filteredSpots.length})
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
            <div className="p-4">
              <h2 className="font-bold text-lg text-oasis-dark mb-3">Lieux de fraîcheur</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(null)}
                >
                  Tous
                </Button>
                {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                  const count = spots.filter((s) => s.type === type).length;
                  if (count === 0) return null;
                  return (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                    >
                      {config.label}
                    </Button>
                  );
                })}
              </div>
              <div className="space-y-3">
                {filteredSpots.map((spot) => {
                  const config = TYPE_CONFIG[spot.type] || TYPE_CONFIG.autre;
                  return (
                    <div key={spot.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <Badge className={clsx(config.color, "text-white text-xs")}>
                          {config.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mt-2">{spot.name}</h3>
                      <p className="text-xs text-muted-foreground">{spot.address}</p>
                      {spot.hours && (
                        <p className="text-xs text-muted-foreground">🕐 {spot.hours}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
