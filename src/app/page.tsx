import Link from "next/link";
import { AlertTriangle, MapPin, Bell, ArrowRight, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function HomePage() {
  const [criticalAlert, notifications, recentSpots] = await Promise.all([
    getCriticalAlert(),
    getRecentNotifications(3),
    getOpenSpots(),
  ]);

  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville";
  const displaySpots = recentSpots.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Bannière alerte critique */}
      {criticalAlert && (
        <div className="bg-destructive text-primary-foreground px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{criticalAlert.title}</p>
            <p className="text-sm opacity-90">{criticalAlert.message}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="px-4 py-12 md:py-20 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-4">
          Plateforme canicule — {cityName}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          Trouvez un lieu de fraîcheur
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Carte interactive des points d&apos;eau, espaces climatisés et abris ouverts pendant les épisodes caniculaires.
        </p>
        <div className="mt-8">
          <Link
            href="/carte"
            className={buttonVariants({ className: "rounded-full px-6 h-10 text-sm font-medium" })}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Ouvrir la carte
          </Link>
        </div>
      </section>

      {/* Conseils */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Alertes & Conseils
            </h2>
          </div>
        </div>
        {notifications.length === 0 ? (
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="py-10 text-center text-muted-foreground">
              <p className="text-sm">Aucune notification pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {notifications.map((notif) => {
              const severity = notif.severity as "info" | "warning" | "critical";
              return (
                <Card key={notif.id} className="rounded-lg border shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {severity === "critical" && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          severity === "critical"
                            ? "bg-destructive/10 text-destructive"
                            : severity === "warning"
                            ? "bg-warning/10 text-warning"
                            : "bg-brand-green/10 text-brand-green"
                        }`}
                      >
                        {severity === "info" && "Info"}
                        {severity === "warning" && "Vigilance"}
                        {severity === "critical" && "Alerte"}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold mt-2">{notif.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Lieux */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Lieux ouverts
            </h2>
          </div>
          <Link
            href="/carte"
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Tout voir <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {displaySpots.length === 0 ? (
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="py-10 text-center text-muted-foreground">
              <p className="text-sm">Aucun lieu ouvert pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {displaySpots.map((spot) => (
              <Card key={spot.id} className="rounded-lg border shadow-sm hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full text-xs font-semibold">
                      {TYPE_LABELS[spot.type] || spot.type}
                    </Badge>
                    <Badge className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-brand-green/10 text-brand-green">
                      Ouvert
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-2">{spot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {spot.address}
                  </p>
                  {spot.hours && (
                    <p className="text-sm text-muted-foreground mt-1">Horaires : {spot.hours}</p>
                  )}
                  {spot.capacity && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Capacité : {spot.capacity} places
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <HelpButton />
    </div>
  );
}
