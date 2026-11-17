import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";

export default function App() {
  const [agent, setAgent] = useState<{ name: string; service: string; email: string } | null>(null);

  return (
    <div className="min-h-screen bg-emerald-950">
      {agent ? (
        <Dashboard agent={agent} onLogout={() => setAgent(null)} />
      ) : (
        <LoginScreen onLogin={setAgent} />
      )}
    </div>
  );
}