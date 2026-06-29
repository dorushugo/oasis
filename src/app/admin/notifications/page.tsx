"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, AlertTriangle, Bell, Info } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  target: string;
  severity: string;
  publishedAt: string;
};

const SEVERITY_CONFIG = {
  info: { label: "Info", icon: Info, badgeClass: "bg-brand-green/10 text-brand-green" },
  warning: { label: "Vigilance", icon: AlertTriangle, badgeClass: "bg-warning/10 text-warning" },
  critical: { label: "Alerte", icon: AlertTriangle, badgeClass: "bg-destructive/10 text-destructive" },
};

const TARGET_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "seniors", label: "Seniors" },
  { value: "sportifs", label: "Sportifs" },
  { value: "parents", label: "Parents" },
];

const SEVERITY_OPTIONS = [
  { value: "info", label: "Information" },
  { value: "warning", label: "Vigilance" },
  { value: "critical", label: "Alerte critique" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", message: "", target: "all", severity: "info",
  });

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch { /* DB unavailable */ }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  async function handleCreate() {
    if (!form.title || !form.message) return;
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setDialogOpen(false);
    setForm({ title: "", message: "", target: "all", severity: "info" });
    fetchNotifications();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
        <Button className="rounded-full" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const config = SEVERITY_CONFIG[notif.severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.info;
          const Icon = config.icon;
          return (
            <Card key={notif.id} className="rounded-lg border shadow-sm">
              <CardContent className="py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeClass}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full text-xs font-semibold">
                        {TARGET_OPTIONS.find((t) => t.value === notif.target)?.label || notif.target}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold">{notif.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(notif.publishedAt).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {notifications.length === 0 && (
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune notification</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notif-title">Titre</Label>
              <Input id="notif-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5 rounded-md" placeholder="Conseils hydratation" />
            </div>
            <div>
              <Label htmlFor="notif-message">Message</Label>
              <Textarea id="notif-message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="mt-1.5 rounded-md" rows={3} placeholder="Décrivez le conseil ou l'alerte..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="notif-target">Cible</Label>
                <Select value={form.target} onValueChange={(v) => setForm((p) => ({ ...p, target: v ?? "all" }))}>
                  <SelectTrigger id="notif-target" className="mt-1.5 rounded-md"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TARGET_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notif-severity">Sévérité</Label>
                <Select value={form.severity} onValueChange={(v) => setForm((p) => ({ ...p, severity: v ?? "info" }))}>
                  <SelectTrigger id="notif-severity" className="mt-1.5 rounded-md"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full rounded-full" onClick={handleCreate} disabled={!form.title || !form.message}>
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
