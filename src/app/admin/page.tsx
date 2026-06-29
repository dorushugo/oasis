"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const result = await signUp.email({
          email,
          password,
          name: email.split("@")[0],
        });
        if (result.error) {
          setError(result.error.message || "Erreur lors de l'inscription");
          setLoading(false);
          return;
        }
      }

      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message || "Identifiants incorrects");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Erreur de connexion au serveur");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm rounded-lg border shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3">
            <Shield className="w-8 h-8 text-foreground" />
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Administration
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === "login" ? "Connectez-vous à l'espace admin" : "Créer un compte"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 rounded-md"
                placeholder="admin@mairie.fr"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 rounded-md"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                "Se connecter"
              ) : (
                "Créer le compte"
              )}
            </Button>
          </form>

          <Separator className="my-4" />

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            {mode === "login"
              ? "Première connexion ? Créer un compte"
              : "Déjà un compte ? Se connecter"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
