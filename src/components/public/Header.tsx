import Link from "next/link";

export default function Header() {
  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville";

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm tracking-tight">Ville de {cityName}</span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Plateforme canicule · Oasis
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/carte"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            Carte
          </Link>
          <Link
            href="/admin"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            Espace agent
          </Link>
        </nav>
      </div>
    </header>
  );
}
