import React, { useState } from "react";
import type { FirebaseError } from "firebase/app";
import { Film, School, Sparkles } from "lucide-react";
import { useAuth } from "./useAuth";
import type { Role } from "./types";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui";

const AuthShell: React.FC = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("learner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("teacher@ecoschoolia.demo");
  const [password, setPassword] = useState("demo123");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup({ name, email, password, role });
      }
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="grid w-full max-w-5xl items-center gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-teal-300">
            <Sparkles className="h-4 w-4" /> Pitch-ready demo mode
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            Ecoschool AI demo with learner and teacher journeys
          </h1>
          <p className="text-sm text-slate-400">
            Use the built-in demo accounts below. CBCflix, assignments, analytics and the teacher
            upload panel all work without backend setup.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setEmail("teacher@ecoschoolia.demo");
                setPassword("demo123");
              }}
              className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-left"
            >
              <p className="text-sm font-semibold text-teal-300">Teacher Demo</p>
              <p className="mt-1 text-xs text-slate-400">teacher@ecoschoolia.demo</p>
              <p className="text-xs text-slate-500">See dashboard, uploads and learner toggle.</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setEmail("learner@ecoschoolia.demo");
                setPassword("demo123");
              }}
              className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-left"
            >
              <p className="text-sm font-semibold text-sky-300">Learner Demo</p>
              <p className="mt-1 text-xs text-slate-400">learner@ecoschoolia.demo</p>
              <p className="text-xs text-slate-500">See missions, assignments and CBCflix.</p>
            </button>
          </div>
        </div>

        <Card className="border border-slate-800 bg-slate-950/90 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {mode === "login" ? "Enter demo" : "Create demo account"}
              </CardTitle>
              <div className="flex gap-2 text-slate-400">
                <Film className="h-5 w-5" />
                <School className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex rounded-full bg-slate-900/80 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full py-1.5 ${mode === "login" ? "bg-slate-950 text-teal-300" : "text-slate-400"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full py-1.5 ${mode === "signup" ? "bg-slate-950 text-teal-300" : "text-slate-400"}`}
              >
                Sign up
              </button>
            </div>

            {mode === "signup" && (
              <div className="mb-3">
                <p className="mb-1 text-[11px] text-slate-400">I am a:</p>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole("learner")}
                    className={`flex-1 rounded-full border py-1.5 ${role === "learner" ? "border-teal-400 bg-teal-400/10 text-teal-300" : "border-slate-700 bg-slate-900 text-slate-300"}`}
                  >
                    Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`flex-1 rounded-full border py-1.5 ${role === "teacher" ? "border-teal-400 bg-teal-400/10 text-teal-300" : "border-slate-700 bg-slate-900 text-slate-300"}`}
                  >
                    Teacher
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Full name</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-400">{error}</p>}
              <Button type="submit" disabled={busy} className="mt-1 w-full rounded-lg text-sm">
                {busy ? "Loading demo..." : mode === "login" ? "Enter demo" : "Create demo account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthShell;
