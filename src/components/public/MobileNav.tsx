"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Bell, Phone } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/carte", label: "Carte", icon: Map },
  { href: "/", label: "Conseils", icon: Bell },
  { href: "#aide", label: "Aide", icon: Phone },
];

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
