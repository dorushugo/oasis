"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CoolingSpot } from "@/generated/prisma";
import { MapPin, Droplets, Dumbbell, BookOpen, Store, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import HelpButton from "@/components/public/HelpButton";

const MapContent = dynamic(() => import("@/components/public/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground text-sm">Chargement de la carte…</div>
    </div>
  ),
});

const TYPE_CONFIG: Record<string, { label: string; icon: typeof MapPin }> = {
  fontaine: { label: "Fontaine", icon: Droplets },
  gymnase: { label: "Gymnase", icon: Dumbbell },
  bibliotheque: { label: "Bibliothèque", icon: BookOpen },
  commerce: { label: "Commerce", icon: Store },
  autre: { label: "Autre", icon: Circle },
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
      <aside className="hidden md:flex flex-col w-80 bg-card border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-base text-foreground">Filtrer par type</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              className="rounded-md"
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
                  className="rounded-md"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
        </div>
        <div className="p-4 space-y-2">
          {filteredSpots.map((spot) => {
            const config = TYPE_CONFIG[spot.type] || TYPE_CONFIG.autre;
            return (
              <div
                key={spot.id}
                className="p-3 rounded-md border border-border hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium rounded">
                    {config.label}
                  </Badge>
                  {spot.isOpen ? (
                    <span className="text-[11px] font-semibold text-brand-green">Ouvert</span>
                  ) : (
                    <span className="text-[11px] font-semibold text-destructive">Fermé</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mt-2 text-foreground">{spot.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{spot.address}</p>
                {spot.hours && (
                  <p className="text-xs text-muted-foreground mt-1">{spot.hours}</p>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        {/* Bouton retour */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-[1000] inline-flex items-center gap-2 bg-card border rounded-md shadow-sm px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
        <MapContent spots={spots} selectedType={selectedType} />
      </div>

      {/* Mobile sheet */}
      <div className="md:hidden absolute bottom-20 left-4 z-[1000]">
        <Sheet>
          <SheetTrigger className="shadow-lg inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 gap-1.5 px-2.5 font-medium text-sm">
            <MapPin className="w-5 h-5 mr-2" />
            Liste ({filteredSpots.length})
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
            <div className="p-4">
              <h2 className="font-bold text-base text-foreground mb-3">Lieux de fraîcheur</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  size="sm"
                  className="rounded-md"
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
                      className="rounded-md"
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                    >
                      {config.label}
                    </Button>
                  );
                })}
              </div>
              <div className="space-y-2">
                {filteredSpots.map((spot) => {
                  const config = TYPE_CONFIG[spot.type] || TYPE_CONFIG.autre;
                  return (
                    <div key={spot.id} className="p-3 rounded-md border border-border">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium rounded">
                          {config.label}
                        </Badge>
                        {spot.isOpen ? (
                          <span className="text-[11px] font-semibold text-brand-green">Ouvert</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-destructive">Fermé</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mt-2">{spot.name}</h3>
                      <p className="text-xs text-muted-foreground">{spot.address}</p>
                      {spot.hours && (
                        <p className="text-xs text-muted-foreground">{spot.hours}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <HelpButton />
    </div>
  );
}
