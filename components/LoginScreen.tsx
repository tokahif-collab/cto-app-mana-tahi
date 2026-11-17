import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManaTahiLogo } from "@/components/Logo";

const SERVICES = [
  "Direction Ressources humaines",
  "Direction des Finances",
  "Direction Générale",
  "Etat Civil",
  "Guichet Unique",
  "Police Municipale",
  "Caserne des Pompiers",
  "Direction Service Technique",
  "Direction de Restauration Scolaire",
  "Direction Bureau des Taxes",
  "Direction Marché Public & Projet",
  "Régie",
  "Service à la Population & Urbanisme",
  "Mairie de Teahupoo",
  "Mairie de Toahotu",
];

export function LoginScreen({
  onLogin,
}: {
  onLogin: (a: { name: string; service: string; email: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !service) {
      setError("Veuillez renseigner votre identifiant, mot de passe et service.");
      return;
    }
    const name = email
      .split("@")[0]
      .split(/[._]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    onLogin({ name: name || "Agent", service, email });
  }

  return (
    <div className="min-h-screen w-full bg-emerald-950 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-emerald-800">
        <div className="bg-emerald-900 p-10 flex flex-col items-center justify-center text-center gap-6">
          <ManaTahiLogo className="w-36 h-36 rounded-3xl shadow-lg" />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              MANA <span className="text-white">TAHI</span>
            </h1>
            <div className="mt-3 bg-white px-4 py-1.5 rounded-md">
              <p className="text-emerald-800 font-bold uppercase tracking-widest text-xs">
                RAVE 'OHIPA A TE 'OIRE
              </p>
            </div>
          </div>
          <p className="text-emerald-200 text-sm max-w-xs">
            Agir plus vite, communiquer mieux : notre feuille de route — Mana Tahi !
          </p>
          <p className="text-emerald-400 text-xs">Commune de Taiarapu-Ouest</p>
        </div>

        <div className="bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-emerald-950">Connexion agent</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Identifiez-vous avec votre mail professionnel ou personnel.
          </p>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Identifiant (mail)</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@taiarapu-ouest.pf"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Service / Direction</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez votre service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Accéder à mon Mana Tahi
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}