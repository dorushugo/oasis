import Link from "next/link";
import { Droplets } from "lucide-react";

export default function Header() {
  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville";

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-brand-green" />
          <span className="font-semibold text-lg tracking-tight">Oasis</span>
          <span className="text-xs text-muted-foreground font-medium ml-1 hidden sm:inline">
            {cityName}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/carte"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
          >
            Carte
          </Link>
          <Link
            href="/admin"
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
