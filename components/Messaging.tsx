import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Msg = {
  id: number;
  author: string;
  text: string;
  file?: string;
  mine: boolean;
};

const EMOJIS = ["😀", "👍", "✅", "🚨", "📌", "🙏", "💪", "📎"];

export function Messaging({
  agent,
}: {
  agent: { name: string; service: string; email: string; photo: string | null };
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, author: "Direction Générale", text: "Bonjour à tous, bonne semaine Mana Tahi !", mine: false },
    { id: 2, author: "Chef de service", text: "Rappel : bilan MANA NUI vendredi 16h.", mine: false },
  ]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<string | null>(null);

  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function send() {
    if (!text.trim() && !file) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), author: agent.name, text: text.trim(), file: file ?? undefined, mine: true },
    ]);
    setText("");
    setFile(null);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f.name);
  }

  return (
    <Card className="bg-white border-emerald-100 shadow-sm flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-900">Messagerie instantanée</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ScrollArea className="h-64 pr-3">
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.mine ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  {m.mine && agent.photo && <AvatarImage src={agent.photo} alt={agent.name} />}
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {m.mine
                      ? initials
                      : m.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[75%] ${
                    m.mine ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-950"
                  }`}
                >
                  <p className="text-[11px] font-semibold opacity-80">{m.author}</p>
                  {m.text && <p className="text-sm">{m.text}</p>}
                  {m.file && (
                    <p className="text-xs mt-1 underline opacity-90">📎 {m.file}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap gap-1">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setText((t) => t + e)}
              className="text-lg hover:scale-125 transition"
            >
              {e}
            </button>
          ))}
        </div>

        {file && (
          <div className="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5">
            <span className="text-emerald-800">📎 {file}</span>
            <button onClick={() => setFile(null)} className="text-red-500">
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <label className="cursor-pointer flex items-center justify-center rounded-md border border-emerald-200 px-3 hover:bg-emerald-50">
            <span className="text-emerald-700">📎</span>
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png,.doc,.docx"
              className="hidden"
              onChange={onFile}
            />
          </label>
          <Input
            placeholder="Écrire un message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send} className="bg-emerald-700 hover:bg-emerald-800">
            Envoyer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}