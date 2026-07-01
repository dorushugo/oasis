"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, MapPin, MousePointerClick } from "lucide-react";

const AdminMapPicker = dynamic(() => import("@/components/admin/AdminMapPicker"), { ssr: false });

type CoolingSpot = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  capacity: number | null;
  hours: string | null;
  isOpen: boolean;
  description: string | null;
};

const TYPE_OPTIONS = [
  { value: "fontaine", label: "Fontaine" },
  { value: "gymnase", label: "Gymnase" },
  { value: "bibliotheque", label: "Bibliothèque" },
  { value: "commerce", label: "Commerce" },
  { value: "autre", label: "Autre" },
];

export default function AdminSpotsPage() {
  const [spots, setSpots] = useState<CoolingSpot[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [form, setForm] = useState({
    name: "", address: "", lat: "", lng: "",
    type: "fontaine", capacity: "", hours: "", description: "",
  });

  const fetchSpots = useCallback(async () => {
    try {
      const res = await fetch("/api/spots");
      const data = await res.json();
      if (Array.isArray(data)) setSpots(data);
    } catch { /* DB unavailable */ }
  }, []);

  useEffect(() => { fetchSpots(); }, [fetchSpots]);

  function handleMapClick(lat: number, lng: number) {
    const roundedLat = lat.toFixed(6);
    const roundedLng = lng.toFixed(6);
    setSelectedPosition({ lat, lng });
    setForm((p) => ({ ...p, lat: roundedLat, lng: roundedLng }));
    setDialogOpen(true);
  }

  async function handleToggle(id: string, isOpen: boolean) {
    await fetch(`/api/spots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen }),
    });
    fetchSpots();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce lieu ?")) return;
    await fetch(`/api/spots/${id}`, { method: "DELETE" });
    fetchSpots();
  }

  async function handleGeolocate() {
    if (!form.address) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`
      );
      const results = await res.json();
      if (results.length > 0) {
        setForm((prev) => ({ ...prev, lat: results[0].lat, lng: results[0].lon }));
        setSelectedPosition({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
      }
    } catch { /* geocoding unavailable */ }
  }

  async function handleCreate() {
    if (!form.name || !form.address || !form.lat || !form.lng) return;
    await fetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setDialogOpen(false);
    setSelectedPosition(null);
    setForm({ name: "", address: "", lat: "", lng: "", type: "fontaine", capacity: "", hours: "", description: "" });
    fetchSpots();
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setSelectedPosition(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Gestion des lieux</h1>
        <Button className="rounded-md" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm bg-card overflow-hidden mb-6">
        <div className="p-3 border-b bg-muted/30 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Cliquez sur la carte pour ajouter un point de fraîcheur
          </span>
        </div>
        <div className="h-[350px]">
          <AdminMapPicker
            spots={spots.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, name: s.name }))}
            onMapClick={handleMapClick}
            selectedPosition={selectedPosition}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-card overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Nom</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Adresse</TableHead>
              <TableHead className="text-xs">Horaires</TableHead>
              <TableHead className="text-xs">Statut</TableHead>
              <TableHead className="text-xs w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id} className="hover:bg-accent">
                <TableCell className="text-sm font-medium">{spot.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-full text-xs font-semibold">
                    {TYPE_OPTIONS.find((t) => t.value === spot.type)?.label || spot.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{spot.address}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{spot.hours || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={spot.isOpen}
                      onCheckedChange={(checked) => handleToggle(spot.id, checked)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {spot.isOpen ? "Ouvert" : "Fermé"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(spot.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un lieu de fraîcheur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="spot-name">Nom</Label>
              <Input id="spot-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1.5 rounded-md" />
            </div>
            <div>
              <Label htmlFor="spot-address">Adresse</Label>
              <div className="flex gap-2 mt-1.5">
                <Input id="spot-address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="flex-1 rounded-md" />
                <Button type="button" variant="outline" className="rounded-md" onClick={handleGeolocate}>
                  <MapPin className="w-4 h-4 mr-1" />
                  Géolocaliser
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="spot-lat">Latitude</Label>
                <Input id="spot-lat" value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))} className="mt-1.5 rounded-md" readOnly={!!selectedPosition} />
              </div>
              <div>
                <Label htmlFor="spot-lng">Longitude</Label>
                <Input id="spot-lng" value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))} className="mt-1.5 rounded-md" readOnly={!!selectedPosition} />
              </div>
            </div>
            {selectedPosition && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Position sélectionnée sur la carte
              </p>
            )}
            <div>
              <Label htmlFor="spot-type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v ?? "fontaine" }))}>
                <SelectTrigger id="spot-type" className="mt-1.5 rounded-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="spot-capacity">Capacité</Label>
                <Input id="spot-capacity" type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} className="mt-1.5 rounded-md" placeholder="Optionnel" />
              </div>
              <div>
                <Label htmlFor="spot-hours">Horaires</Label>
                <Input id="spot-hours" value={form.hours} onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))} className="mt-1.5 rounded-md" placeholder="9h-18h" />
              </div>
            </div>
            <div>
              <Label htmlFor="spot-desc">Description</Label>
              <Textarea id="spot-desc" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-1.5 rounded-md" rows={2} placeholder="Optionnel" />
            </div>
            <Button className="w-full rounded-md" onClick={handleCreate} disabled={!form.name || !form.address || !form.lat || !form.lng}>
              Créer le lieu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
