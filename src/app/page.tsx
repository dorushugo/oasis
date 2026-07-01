import Link from "next/link";
import {
  AlertTriangle,
  MapPin,
  ArrowRight,
  Droplets,
  Clock,
  Users,
  Thermometer,
  Shield,
  Phone,
  Sun,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import HelpButton from "@/components/public/HelpButton";
import { getOpenSpots, getRecentNotifications, getCriticalAlert } from "@/lib/queries";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  fontaine: "Fontaine",
  gymnase: "Gymnase",
  bibliotheque: "Bibliothèque",
  commerce: "Commerce",
  autre: "Autre",
};

const TYPE_ICONS: Record<string, string> = {
  fontaine: "💧",
  gymnase: "🏋️",
  bibliotheque: "📚",
  commerce: "🏪",
  autre: "📍",
};

export default async function HomePage() {
  const [criticalAlert, notifications, recentSpots] = await Promise.all([
    getCriticalAlert(),
    getRecentNotifications(5),
    getOpenSpots(),
  ]);

  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville";
  const displaySpots = recentSpots.slice(0, 4);
  const openCount = recentSpots.length;

  return (
    <div className="min-h-screen">
      {criticalAlert && (
        <div className="bg-destructive text-white px-4 py-3.5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">{criticalAlert.title}</p>
            <p className="text-sm opacity-90">{criticalAlert.message}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-warning/5" />
        <div className="relative px-4 py-14 md:py-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green rounded-full px-3 py-1 text-xs font-semibold mb-5">
                <Sun className="w-3.5 h-3.5" />
                Plateforme canicule — {cityName}
              </div>
              <h1 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-4">
                Trouvez un lieu<br />
                <span className="text-brand-green">de fraîcheur</span> près de chez vous
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                Carte interactive des fontaines, espaces climatisés et abris ouverts pendant les épisodes de forte chaleur.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/carte"
                  className={buttonVariants({ className: "rounded-full px-6 h-11 text-sm font-semibold shadow-sm" })}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir la carte
                </Link>
                <Link
                  href="#conseils"
                  className={buttonVariants({ variant: "outline", className: "rounded-full px-5 h-11 text-sm font-medium" })}
                >
                  Lire les conseils
                </Link>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border rounded-xl p-4 flex flex-col gap-1">
                <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center mb-1">
                  <Droplets className="w-5 h-5 text-brand-green" />
                </div>
                <span className="text-2xl font-bold">{openCount}</span>
                <span className="text-xs text-muted-foreground">Lieux ouverts</span>
              </div>
              <div className="bg-card border rounded-xl p-4 flex flex-col gap-1">
                <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center mb-1">
                  <Thermometer className="w-5 h-5 text-warning" />
                </div>
                <span className="text-2xl font-bold">{notifications.length}</span>
                <span className="text-xs text-muted-foreground">Alertes actives</span>
              </div>
              <div className="bg-card border rounded-xl p-4 flex flex-col gap-1">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-1">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-2xl font-bold">24h</span>
                <span className="text-xs text-muted-foreground">Mise à jour</span>
              </div>
              <div className="bg-card border rounded-xl p-4 flex flex-col gap-1">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center mb-1">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <span className="text-2xl font-bold">SOS</span>
                <span className="text-xs text-muted-foreground">Aide en 1 clic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section id="conseils" className="px-4 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight">
            Alertes & Conseils
          </h2>
          <Badge variant="secondary" className="rounded-full text-xs font-medium">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""}
          </Badge>
        </div>
        {notifications.length === 0 ? (
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Aucune alerte en cours</p>
              <p className="text-xs mt-1">La situation est normale pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const severity = notif.severity as "info" | "warning" | "critical";
              const borderColor =
                severity === "critical"
                  ? "border-l-destructive"
                  : severity === "warning"
                  ? "border-l-warning"
                  : "border-l-brand-green";
              return (
                <div
                  key={notif.id}
                  className={`bg-card border rounded-xl p-4 border-l-4 ${borderColor} flex gap-4 items-start`}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    severity === "critical"
                      ? "bg-destructive/10"
                      : severity === "warning"
                      ? "bg-warning/10"
                      : "bg-brand-green/10"
                  }`}>
                    {severity === "critical" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    {severity === "warning" && <Thermometer className="w-4 h-4 text-warning" />}
                    {severity === "info" && <Shield className="w-4 h-4 text-brand-green" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{notif.title}</h3>
                      <Badge
                        className={`rounded-full px-2 py-0 text-[10px] font-bold ${
                          severity === "critical"
                            ? "bg-destructive/10 text-destructive"
                            : severity === "warning"
                            ? "bg-warning/10 text-warning"
                            : "bg-brand-green/10 text-brand-green"
                        }`}
                      >
                        {severity === "info" && "INFO"}
                        {severity === "warning" && "VIGILANCE"}
                        {severity === "critical" && "CRITIQUE"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lieux */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight">
            Lieux ouverts
            <span className="text-brand-green ml-2 text-base">({openCount})</span>
          </h2>
          <Link
            href="/carte"
            className="text-sm font-semibold text-brand-green hover:text-brand-green/80 flex items-center gap-1 transition-colors"
          >
            Voir la carte <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {displaySpots.length === 0 ? (
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Droplets className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Aucun lieu ouvert</p>
              <p className="text-xs mt-1">Revenez consulter cette page régulièrement.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {displaySpots.map((spot) => (
              <Link key={spot.id} href="/carte" className="group">
                <div className="bg-card border rounded-xl p-4 h-full transition-all group-hover:border-brand-green/40 group-hover:shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{TYPE_ICONS[spot.type] || "📍"}</span>
                    <Badge className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-brand-green/10 text-brand-green">
                      Ouvert
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-green transition-colors">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {spot.address}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {spot.hours && (
                      <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {spot.hours}
                      </span>
                    )}
                    {spot.capacity && (
                      <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        {spot.capacity} places
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Conseils rapides */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="bg-card border rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-bold tracking-tight mb-5">
            Conseils de prévention
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "💧", title: "Hydratation", desc: "Boire au moins 1,5L d'eau par jour, sans attendre la soif" },
              { icon: "🏠", title: "Rester au frais", desc: "Fermer les volets la journée, aérer la nuit" },
              { icon: "👴", title: "Solidarité", desc: "Prendre des nouvelles des personnes fragiles autour de vous" },
              { icon: "🚿", title: "Se rafraîchir", desc: "Se mouiller le corps plusieurs fois par jour" },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold mb-0.5">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer léger */}
      <footer className="px-4 py-8 max-w-5xl mx-auto border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>Oasis — Plateforme canicule de {cityName}</p>
          <div className="flex items-center gap-4">
            <span>En cas d&apos;urgence : <strong className="text-foreground">15</strong> (SAMU) ou <strong className="text-foreground">114</strong> (SMS)</span>
          </div>
        </div>
      </footer>

      <HelpButton />
    </div>
  );
}
