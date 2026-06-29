"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, MapPin, Bell, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { useSession, signOut } from "@/lib/auth-client";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/spots", label: "Lieux", icon: MapPin },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && pathname !== "/admin" && mounted) {
      router.push("/admin");
    }
  }, [isPending, session, pathname, router, mounted]);

  async function handleLogout() {
    await signOut();
    router.push("/admin");
  }

  if (!mounted || isPending) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session && pathname !== "/admin") {
    return null;
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 flex-col bg-background border-r border-border p-3">
        <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground px-3 mb-3">
          Menu
        </p>
        <nav className="space-y-0.5 flex-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {session?.user && (
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground px-3 mb-2 truncate">
              {session.user.email}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-around h-14">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
