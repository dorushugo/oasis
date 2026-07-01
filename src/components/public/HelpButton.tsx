"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle } from "lucide-react";

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setSending(true);
    let lat: number | null = null;
    let lng: number | null = null;

    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        // Pas de géolocalisation
      }
    }

    await fetch("/api/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lat, lng }),
    });

    setSending(false);
    setSent(true);
    setMessage("");
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setSent(false); }}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[9999] bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-md shadow-sm flex items-center gap-2 px-5 py-3 text-sm transition-colors min-w-[48px] min-h-[48px]"
        aria-label="J'ai besoin d'aide"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Besoin d&apos;aide</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signalement d&apos;aide</DialogTitle>
            <DialogDescription>
              Décrivez votre situation. Votre position sera partagée si vous l&apos;autorisez.
            </DialogDescription>
          </DialogHeader>

          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-brand-green" />
              <p className="font-semibold">Signalement envoyé</p>
              <p className="text-sm text-muted-foreground mt-1">
                Les services municipaux vont traiter votre demande.
              </p>
              <Button className="mt-4 rounded-md" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="help-message">Votre message (optionnel)</Label>
                <Textarea
                  id="help-message"
                  placeholder="Décrivez votre besoin..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full rounded-md bg-destructive hover:bg-destructive/90 text-white"
              >
                {sending ? "Envoi..." : "Envoyer le signalement"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
