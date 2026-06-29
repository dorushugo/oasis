"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bell, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HelpRequest = {
  id: string;
  message: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  createdAt: string;
};

type Stats = {
  spotsOpen: number;
  notificationsCount: number;
  helpPending: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ spotsOpen: 0, notificationsCount: 0, helpPending: 0 });
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [spotsRes, notifsRes, helpRes] = await Promise.all([
        fetch("/api/spots"),
        fetch("/api/notifications"),
        fetch("/api/help"),
      ]);

      const spots = spotsRes.ok ? await spotsRes.json() : [];
      const notifs = notifsRes.ok ? await notifsRes.json() : [];
      const helps = helpRes.ok ? await helpRes.json() : [];

      setStats({
        spotsOpen: Array.isArray(spots) ? spots.length : 0,
        notificationsCount: Array.isArray(notifs) ? notifs.length : 0,
        helpPending: Array.isArray(helps) ? helps.filter((h: HelpRequest) => h.status === "pending").length : 0,
      });
      setHelpRequests(Array.isArray(helps) ? helps.filter((h: HelpRequest) => h.status === "pending") : []);
    } catch {
      // DB unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleMarkHandled(id: string) {
    await fetch(`/api/help/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "handled" }),
    });
    fetchData();
  }

  async function handlePublishAlert() {
    if (!alertTitle || !alertMessage) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: alertTitle,
        message: alertMessage,
        severity: "critical",
        target: "all",
      }),
    });
    setAlertOpen(false);
    setAlertTitle("");
    setAlertMessage("");
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">Situation en temps réel</p>
        </div>
        <Button
          className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
          onClick={() => setAlertOpen(true)}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Publier une alerte
        </Button>
      </div>

      {/* KPI */}
      <div className="grid gap-3 md:grid-cols-3 mb-8">
        <Card className="rounded-lg border shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Lieux ouverts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.spotsOpen}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="w-3.5 h-3.5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.notificationsCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Signalements en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.helpPending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Signalements */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Derniers signalements
      </h2>
      {helpRequests.length === 0 ? (
        <Card className="rounded-lg border shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-brand-green" />
            <p className="text-sm font-medium">Aucun signalement en attente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {helpRequests.map((req) => (
            <Card key={req.id} className="rounded-lg border shadow-sm">
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{req.message || "Signalement sans message"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(req.createdAt).toLocaleString("fr-FR")}
                    {req.lat && req.lng && ` — ${req.lat.toFixed(4)}, ${req.lng.toFixed(4)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-warning/10 text-warning">
                    En attente
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleMarkHandled(req.id)}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Traité
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog alerte */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Alerte critique
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alert-title">Titre</Label>
              <Input
                id="alert-title"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="Ex: Alerte canicule extrême"
                className="mt-1.5 rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="alert-message">Message</Label>
              <Textarea
                id="alert-message"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Consignes de sécurité..."
                className="mt-1.5 rounded-md"
                rows={3}
              />
            </div>
            <Button
              className="w-full rounded-full bg-destructive hover:bg-destructive/90 text-white"
              onClick={handlePublishAlert}
              disabled={!alertTitle || !alertMessage}
            >
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
