import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function fmt(d: Date) {
  return `${d.getDate()} ${MOIS[d.getMonth()]}`;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

type RendezVous = {
  id: number;
  date: string;
  heure: string;
  titre: string;
  lieu: string;
};

export function WeekCalendar() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [rdvs, setRdvs] = useState<RendezVous[]>([
    { id: 1, date: iso(startOfWeek(new Date())), heure: "09:00", titre: "Réunion de service", lieu: "Salle du conseil" },
    { id: 2, date: iso(addDays(startOfWeek(new Date()), 4)), heure: "16:00", titre: "Bilan MANA NUI", lieu: "Direction Générale" },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formDate, setFormDate] = useState(iso(new Date()));
  const [formHeure, setFormHeure] = useState("08:00");
  const [formTitre, setFormTitre] = useState("");
  const [formLieu, setFormLieu] = useState("");

  const weekEnd = addDays(weekStart, 4);
  const days = JOURS.slice(0, 5).map((label, i) => {
    const date = addDays(weekStart, i);
    return { label, date, iso: iso(date) };
  });

  function resetForm() {
    setEditingId(null);
    setFormDate(iso(new Date()));
    setFormHeure("08:00");
    setFormTitre("");
    setFormLieu("");
  }

  function save() {
    if (!formTitre.trim()) return;
    if (editingId !== null) {
      setRdvs((r) =>
        r.map((x) =>
          x.id === editingId
            ? { ...x, date: formDate, heure: formHeure, titre: formTitre.trim(), lieu: formLieu.trim() }
            : x
        )
      );
    } else {
      setRdvs((r) => [
        ...r,
        { id: Date.now(), date: formDate, heure: formHeure, titre: formTitre.trim(), lieu: formLieu.trim() },
      ]);
    }
    resetForm();
  }

  function edit(r: RendezVous) {
    setEditingId(r.id);
    setFormDate(r.date);
    setFormHeure(r.heure);
    setFormTitre(r.titre);
    setFormLieu(r.lieu);
  }

  function remove(id: number) {
    setRdvs((r) => r.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <Card className="bg-white border-emerald-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-900 flex items-center justify-between flex-wrap gap-2">
          <span>Le calendrier / Semaine du — au</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekStart((w) => addDays(w, -7))}
              className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              ← Précédente
            </Button>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              {fmt(weekStart)} au {fmt(weekEnd)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekStart((w) => addDays(w, 7))}
              className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              Suivante →
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-5 gap-2">
          {days.map((d) => {
            const dayRdvs = rdvs.filter((r) => r.date === d.iso);
            const isToday = d.iso === iso(new Date());
            return (
              <div
                key={d.iso}
                className={`rounded-xl border p-2.5 min-h-28 ${
                  isToday ? "border-emerald-400 bg-emerald-50" : "border-emerald-100 bg-emerald-50/40"
                }`}
              >
                <p className="text-xs font-bold text-emerald-900">{d.label}</p>
                <p className="text-[11px] text-muted-foreground mb-2">{fmt(d.date)}</p>
                <div className="space-y-1">
                  {dayRdvs.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => edit(r)}
                      className="w-full text-left rounded-md bg-emerald-700 text-white px-2 py-1 text-[11px] hover:bg-emerald-800 transition"
                    >
                      <span className="font-semibold">{r.heure}</span> {r.titre}
                    </button>
                  ))}
                  {dayRdvs.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic">Libre</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-3">
          <p className="text-sm font-semibold text-emerald-900">
            {editingId !== null ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </p>
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs">Date</Label>
              <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs">Heure</Label>
              <Select value={formHeure} onValueChange={setFormHeure}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(
                    (h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs">Titre</Label>
              <Input
                placeholder="Objet du rendez-vous"
                value={formTitre}
                onChange={(e) => setFormTitre(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs">Lieu</Label>
              <Input
                placeholder="Lieu"
                value={formLieu}
                onChange={(e) => setFormLieu(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-emerald-700 hover:bg-emerald-800">
              {editingId !== null ? "Enregistrer les modifications" : "Ajouter le rendez-vous"}
            </Button>
            {editingId !== null && (
              <Button variant="outline" onClick={resetForm} className="border-emerald-200 text-emerald-800">
                Annuler
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-900">Rendez-vous de la semaine</p>
          {rdvs
            .slice()
            .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))
            .map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 px-3 py-2"
              >
                <div className="text-sm">
                  <span className="font-semibold text-emerald-900">
                    {new Date(r.date).getDate()} {MOIS[new Date(r.date).getMonth()]} · {r.heure}
                  </span>
                  <span className="text-emerald-950"> — {r.titre}</span>
                  {r.lieu && <span className="text-muted-foreground"> ({r.lieu})</span>}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => edit(r)}
                    className="text-emerald-700 hover:bg-emerald-50"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(r.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          {rdvs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun rendez-vous enregistré.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}