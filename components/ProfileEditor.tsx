import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AgentProfile = {
  name: string;
  service: string;
  email: string;
  phone: string;
  poste: string;
  matricule: string;
  photo: string | null;
};

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

export function ProfileEditor({
  profile,
  onSave,
}: {
  profile: AgentProfile;
  onSave: (p: AgentProfile) => void;
}) {
  const [draft, setDraft] = useState<AgentProfile>(profile);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = draft.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, photo: reader.result as string }));
    reader.readAsDataURL(f);
  }

  function save() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="bg-white border-emerald-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-900">Ma fiche agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-emerald-200">
            {draft.photo && <AvatarImage src={draft.photo} alt={draft.name} />}
            <AvatarFallback className="bg-emerald-700 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              Changer ma photo
            </Button>
            {draft.photo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDraft((d) => ({ ...d, photo: null }))}
                className="text-red-600 hover:bg-red-50"
              >
                Retirer
              </Button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={onPhoto}
            />
            <p className="text-xs text-muted-foreground">PNG ou JPEG</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-emerald-800">Nom complet</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-emerald-800">Matricule</Label>
            <Input
              placeholder="Ex : TO-2024-001"
              value={draft.matricule}
              onChange={(e) => setDraft((d) => ({ ...d, matricule: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-emerald-800">Poste occupé</Label>
            <Input
              placeholder="Ex : Secrétaire, Chef de service..."
              value={draft.poste}
              onChange={(e) => setDraft((d) => ({ ...d, poste: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-emerald-800">Téléphone</Label>
            <Input
              placeholder="Ex : 87 00 00 00"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-emerald-800">Mail</Label>
            <Input
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-emerald-800">Service / Direction</Label>
            <Select
              value={draft.service}
              onValueChange={(v) => setDraft((d) => ({ ...d, service: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} className="bg-emerald-700 hover:bg-emerald-800">
            Enregistrer ma fiche
          </Button>
          {saved && <span className="text-sm text-emerald-700 font-medium">✓ Fiche enregistrée</span>}
        </div>
      </CardContent>
    </Card>
  );
}