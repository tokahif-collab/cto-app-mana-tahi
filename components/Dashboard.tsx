import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManaTahiLogo } from "@/components/Logo";
import { Messaging } from "@/components/Messaging";
import { WeekCalendar } from "@/components/WeekCalendar";
import { ProfileEditor, type AgentProfile } from "@/components/ProfileEditor";

type Status = "À traiter" | "En cours" | "Terminé";

type Task = { id: number; label: string; status: Status; priority: boolean };

const STATUS_STYLES: Record<Status, string> = {
  "À traiter": "bg-amber-100 text-amber-800 border-amber-200",
  "En cours": "bg-sky-100 text-sky-800 border-sky-200",
  Terminé: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const INITIAL_TASKS: Task[] = [
  { id: 1, label: "Valider les congés du service technique", status: "En cours", priority: true },
  { id: 2, label: "Préparer le rapport MANA NUI du vendredi", status: "À traiter", priority: true },
  { id: 3, label: "Mettre à jour les dossiers état civil", status: "Terminé", priority: false },
  { id: 4, label: "Réunion coordination Guichet Unique", status: "À traiter", priority: false },
];

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
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

export function Dashboard({
  agent,
  onLogout,
}: {
  agent: { name: string; service: string; email: string };
  onLogout: () => void;
}) {
  const [profile, setProfile] = useState<AgentProfile>({
    name: agent.name,
    service: agent.service,
    email: agent.email,
    phone: "",
    poste: "",
    matricule: "",
    photo: null,
  });

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<Status>("À traiter");
  const [observation, setObservation] = useState("");
  const [reussite, setReussite] = useState("");
  const [difficulte, setDifficulte] = useState("");
  const [sujet, setSujet] = useState("");
  const [urgence, setUrgence] = useState("");
  const [urgenceType, setUrgenceType] = useState("");
  const [manaNui, setManaNui] = useState("");
  const [manaNuiRole, setManaNuiRole] = useState("");

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 4);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function addTask() {
    if (!newTask.trim()) return;
    setTasks((t) => [
      ...t,
      { id: Date.now(), label: newTask.trim(), status: newTaskStatus, priority: false },
    ]);
    setNewTask("");
  }

  function cycleStatus(id: number) {
    const order: Status[] = ["À traiter", "En cours", "Terminé"];
    setTasks((t) =>
      t.map((task) =>
        task.id === id
          ? { ...task, status: order[(order.indexOf(task.status) + 1) % order.length] }
          : task
      )
    );
  }

  const done = tasks.filter((t) => t.status === "Terminé").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ManaTahiLogo className="w-14 h-14 rounded-2xl shadow-md" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none">
                MANA <span className="text-white">TAHI</span>
              </h1>
              <div className="mt-1.5 bg-white px-2.5 py-0.5 rounded inline-block">
                <p className="text-emerald-800 font-bold uppercase tracking-widest text-[10px]">
                  RAVE 'OHIPA A TE 'OIRE
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-emerald-300">{profile.service}</p>
            </div>
            <Avatar className="border-2 border-emerald-600">
              {profile.photo && <AvatarImage src={profile.photo} alt={profile.name} />}
              <AvatarFallback className="bg-emerald-700 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="bg-transparent border-emerald-600 text-emerald-100 hover:bg-emerald-800 hover:text-white"
            >
              Déconnexion
            </Button>
          </div>
        </div>
        <div className="bg-emerald-800/60 border-t border-emerald-700">
          <div className="max-w-7xl mx-auto px-6 py-2.5">
            <p className="text-emerald-100 text-sm italic">
              « Agir plus vite, communiquer mieux : notre feuille de route — Mana Tahi ! »
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Semaine du</p>
                <p className="text-base font-bold text-emerald-900 mt-1">{fmt(weekStart)}</p>
                <p className="text-sm font-semibold text-emerald-700">au {fmt(weekEnd)}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-emerald-100 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-extrabold text-emerald-700 mt-1">
                  {done}
                  <span className="text-base text-muted-foreground font-medium">/{tasks.length}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-700 text-white border-emerald-700 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-200">Objectif atteint</p>
                <p className="text-3xl font-extrabold mt-1">{progress}%</p>
                <div className="mt-2 h-1.5 bg-emerald-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-300" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <ProfileEditor profile={profile} onSave={setProfile} />

          <WeekCalendar />

          <Card className="bg-white border-emerald-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900 flex items-center justify-between">
                <span>Tâches prioritaires de la semaine</span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Objectif à atteindre
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Ajouter une mission demandée..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <Select value={newTaskStatus} onValueChange={(v) => setNewTaskStatus(v as Status)}>
                  <SelectTrigger className="sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À traiter">À traiter</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTask} className="bg-emerald-700 hover:bg-emerald-800">
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => cycleStatus(t.id)}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 px-4 py-3 text-left transition"
                  >
                    <span className="flex items-center gap-2">
                      {t.priority && <span className="text-amber-500">★</span>}
                      <span className="text-sm font-medium text-emerald-950">{t.label}</span>
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </button>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Aucune tâche pour le moment.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-emerald-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900">Observations de l'agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Notez ici vos observations pour la semaine..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-emerald-800">Mes réussites</Label>
                  <Textarea
                    value={reussite}
                    onChange={(e) => setReussite(e.target.value)}
                    rows={3}
                    placeholder="Ce qui a bien fonctionné..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800">Mes difficultés</Label>
                  <Textarea
                    value={difficulte}
                    onChange={(e) => setDifficulte(e.target.value)}
                    rows={3}
                    placeholder="Les points de blocage..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800">Un sujet dont tu souhaites parler ?</Label>
                  <Textarea
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    rows={3}
                    placeholder="Exprimez-vous librement..."
                  />
                </div>
              </div>
              <Button className="bg-emerald-700 hover:bg-emerald-800">Enregistrer mes notes</Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-emerald-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                MANA NUI
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  Bilan du vendredi — {fmt(weekEnd)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Bilan hebdomadaire réservé à la Direction Générale, la Directrice et les Chefs.
              </p>
              <div className="space-y-2">
                <Label>Votre rôle</Label>
                <Select value={manaNuiRole} onValueChange={setManaNuiRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direction Générale">Direction Générale</SelectItem>
                    <SelectItem value="Directrice">Directrice</SelectItem>
                    <SelectItem value="Chef de service">Chef de service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Synthèse de la semaine, points clés, décisions..."
                value={manaNui}
                onChange={(e) => setManaNui(e.target.value)}
                rows={4}
              />
              <Button className="bg-emerald-700 hover:bg-emerald-800">Soumettre le bilan MANA NUI</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center gap-2">
                🚨 Signaux d'urgence
                <Badge className="bg-red-200 text-red-900 border-red-300">Direction Générale</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-red-700">
                Case dédiée uniquement à la Direction Générale pour les alertes urgentes.
              </p>
              <div className="space-y-2">
                <Label className="text-red-800">Type d'urgence</Label>
                <Select value={urgenceType} onValueChange={setUrgenceType}>
                  <SelectTrigger className="w-full border-red-200">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sécurité">Sécurité</SelectItem>
                    <SelectItem value="Incendie / Pompiers">Incendie / Pompiers</SelectItem>
                    <SelectItem value="Voirie / Technique">Voirie / Technique</SelectItem>
                    <SelectItem value="Population">Population</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Décrivez l'urgence..."
                value={urgence}
                onChange={(e) => setUrgence(e.target.value)}
                rows={3}
                className="border-red-200 focus-visible:ring-red-400"
              />
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Envoyer le signal
              </Button>
            </CardContent>
          </Card>

          <Messaging
            agent={{
              name: profile.name,
              service: profile.service,
              email: profile.email,
              photo: profile.photo,
            }}
          />
        </div>
      </main>
    </div>
  );
}