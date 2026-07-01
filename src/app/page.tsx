import Link from "next/link";
import {
  AlertTriangle,
  MapPin,
  ArrowRight,
  Clock,
  Users,
  Info,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import HelpButton from "@/components/public/HelpButton";
import MapPreviewWrapper from "@/components/public/MapPreviewWrapper";
import { getOpenSpots, getRecentNotifications, getCriticalAlert } from "@/lib/queries";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  fontaine: "Fontaine",
  gymnase: "Gymnase",
  bibliotheque: "Bibliothèque",
  commerce: "Commerce",
  autre: "Autre",
};

const SEVERITY_LABELS: Record<string, string> = {
  info: "Information",
  warning: "Vigilance",
  critical: "Alerte",
};

export default async function HomePage() {
  const [criticalAlert, notifications, recentSpots] = await Promise.all([
    getCriticalAlert(),
    getRecentNotifications(5),
    getOpenSpots(),
  ]);

  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville";
  const displaySpots = recentSpots.slice(0, 6);
  const openCount = recentSpots.length;

  return (
    <div className="min-h-screen bg-background">
      {criticalAlert && (
        <div className="bg-destructive text-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">{criticalAlert.title}</p>
              <p className="text-sm opacity-90">{criticalAlert.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero institutionnel */}
      <section className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Ville de {cityName} · Prévention canicule
              </p>
              <h1 className="text-2xl md:text-[2rem] font-bold tracking-tight leading-tight mb-3">
                Trouvez un lieu de fraîcheur près de chez vous
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                La municipalité recense les fontaines, espaces climatisés et lieux
                d&apos;accueil ouverts au public pendant les épisodes de forte chaleur.
                Un service gratuit, mis à jour en continu par les agents de la ville.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/carte"
                  className={buttonVariants({ className: "rounded-md px-6 h-11 text-sm font-semibold" })}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Consulter la carte
                </Link>
                <Link
                  href="#conseils"
                  className={buttonVariants({ variant: "outline", className: "rounded-md px-5 h-11 text-sm font-medium" })}
                >
                  Conseils de prévention
                </Link>
              </div>
            </div>

            {/* Aperçu de la carte (élément principal du service) */}
            <div className="h-64 md:h-80 order-first md:order-none">
              <MapPreviewWrapper spots={recentSpots} />
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-px mt-8 md:mt-10 border rounded-lg overflow-hidden bg-border">
            <div className="bg-card px-3 py-3 md:px-5 md:py-4">
              <dt className="text-[11px] md:text-xs text-muted-foreground mb-1">Lieux ouverts</dt>
              <dd className="text-xl md:text-2xl font-bold tabular-nums">{openCount}</dd>
            </div>
            <div className="bg-card px-3 py-3 md:px-5 md:py-4">
              <dt className="text-[11px] md:text-xs text-muted-foreground mb-1">Alertes en cours</dt>
              <dd className="text-xl md:text-2xl font-bold tabular-nums">{notifications.length}</dd>
            </div>
            <div className="bg-card px-3 py-3 md:px-5 md:py-4">
              <dt className="text-[11px] md:text-xs text-muted-foreground mb-1">Disponibilité</dt>
              <dd className="text-xl md:text-2xl font-bold">24 h/24</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Alertes & informations */}
      <section id="conseils" className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <h2 className="text-base font-bold tracking-tight mb-4 pb-2 border-b">
          Informations et alertes en cours
        </h2>
        {notifications.length === 0 ? (
          <div className="border rounded-lg bg-card px-5 py-8 text-center">
            <Info className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Aucune alerte en cours</p>
            <p className="text-xs text-muted-foreground mt-1">
              La situation est normale pour le moment.
            </p>
          </div>
        ) : (
          <ul className="divide-y border rounded-lg bg-card overflow-hidden">
            {notifications.map((notif) => {
              const severity = notif.severity as "info" | "warning" | "critical";
              const barColor =
                severity === "critical"
                  ? "bg-destructive"
                  : severity === "warning"
                  ? "bg-warning"
                  : "bg-muted-foreground";
              return (
                <li key={notif.id} className="flex">
                  <span className={`w-1 flex-shrink-0 ${barColor}`} aria-hidden />
                  <div className="px-5 py-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {SEVERITY_LABELS[severity]}
                      </span>
                      <h3 className="font-semibold text-sm">{notif.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Lieux ouverts */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-base font-bold tracking-tight">
            Lieux ouverts au public
          </h2>
          <Link
            href="/carte"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Voir sur la carte <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {displaySpots.length === 0 ? (
          <div className="border rounded-lg bg-card px-5 py-8 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Aucun lieu ouvert actuellement</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consultez cette page régulièrement.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg bg-card divide-y overflow-hidden">
            {displaySpots.map((spot) => (
              <Link
                key={spot.id}
                href="/carte"
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {spot.name}
                    </h3>
                    <span className="text-[11px] text-muted-foreground border rounded px-1.5 py-0.5 flex-shrink-0">
                      {TYPE_LABELS[spot.type] || "Lieu"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {spot.address}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                  {spot.hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {spot.hours}
                    </span>
                  )}
                  {spot.capacity && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {spot.capacity} pl.
                    </span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Conseils de prévention */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <h2 className="text-base font-bold tracking-tight mb-4 pb-2 border-b">
          Recommandations sanitaires
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { title: "Hydratez-vous régulièrement", desc: "Buvez au moins 1,5 L d'eau par jour, sans attendre d'avoir soif." },
            { title: "Gardez votre logement au frais", desc: "Fermez volets et fenêtres la journée, aérez la nuit." },
            { title: "Prenez soin des plus fragiles", desc: "Contactez régulièrement vos proches isolés ou âgés." },
            { title: "Rafraîchissez votre corps", desc: "Mouillez-vous la peau plusieurs fois par jour, évitez l'effort." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer institutionnel */}
      <footer className="border-t bg-muted/30 mt-4">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="font-bold text-sm">Ville de {cityName}</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Plateforme Oasis — dispositif municipal d&apos;information et de
                prévention face aux épisodes de forte chaleur.
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground mb-1">Numéros utiles</p>
              <p>SAMU : <strong className="text-foreground">15</strong></p>
              <p>Sourds et malentendants : <strong className="text-foreground">114</strong> (SMS)</p>
              <p>Canicule info service : <strong className="text-foreground">0 800 06 66 66</strong></p>
            </div>
          </div>
          <div className="border-t mt-6 pt-4 text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Ville de {cityName} — Une initiative de la municipalité.
          </div>
        </div>
      </footer>

      <HelpButton />
    </div>
  );
}
