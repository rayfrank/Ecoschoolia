// src/auth/AuthShell.tsx
import React, { useState } from "react";
import { Film, School, Sparkles } from "lucide-react";
import { useAuth } from "./AuthContext";
import type { Role } from "./AuthContext";
import { Card, CardHeader, CardTitle, CardContent, Button } from "../components/ui";

const AuthShell: React.FC = () => {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [role, setRole] = useState<Role>("learner");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setPassword("");
        setError(null);
    };

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
            resetForm();
        } catch (err: any) {
            console.error(err);
            let msg = err.message || "Something went wrong";
            if (err.code === "auth/invalid-credential") msg = "Invalid email or password.";
            if (err.code === "auth/email-already-in-use") msg = "Email already in use.";
            if (err.code === "auth/weak-password") msg = "Password should be at least 6 characters.";
            if (err.code === "auth/network-request-failed") msg = "Network error. Check your connection.";
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
            {/* background glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
                <div className="absolute -left-32 top-10 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full" />
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-sky-500/15 blur-3xl rounded-full" />
            </div>

            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 items-center">
                {/* Left hero */}
                <div className="hidden md:block space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-xs text-teal-300">
                        <Sparkles className="w-4 h-4" /> AI • CBC • 3D Virtual School
                    </div>
                    <h1 className="text-3xl font-semibold leading-tight">
                        Welcome to <span className="text-teal-300">Ecoschoolia</span>
                    </h1>
                    <p className="text-sm text-slate-400">
                        One login for CBC learning, a 3D virtual school and CBCflix – a
                        Netflix-style library of curriculum-aligned videos.
                    </p>
                    <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Learners: personalised missions & CBCflix episodes</li>
                        <li>• Teachers: dashboards, AI insights & upload panel</li>
                    </ul>
                </div>

                {/* Right auth card */}
                <Card className="bg-slate-950/90 border border-slate-800 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                                {mode === "login" ? "Sign in" : "Create an account"}
                            </CardTitle>
                            <div className="flex gap-2 text-slate-400">
                                <Film className="w-5 h-5" />
                                <School className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {mode === "login"
                                ? "Enter your details to access Ecoschoolia."
                                : "Set up your Ecoschoolia account."}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex mb-3 rounded-full bg-slate-900/80 p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className={`flex-1 py-1.5 rounded-full ${mode === "login"
                                    ? "bg-slate-950 text-teal-300"
                                    : "text-slate-400"
                                    }`}
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("signup")}
                                className={`flex-1 py-1.5 rounded-full ${mode === "signup"
                                    ? "bg-slate-950 text-teal-300"
                                    : "text-slate-400"
                                    }`}
                            >
                                Sign up
                            </button>
                        </div>

                        {mode === "signup" && (
                            <div className="mb-3">
                                <p className="text-[11px] text-slate-400 mb-1">I am a:</p>
                                <div className="flex gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setRole("learner")}
                                        className={`flex-1 py-1.5 rounded-full border ${role === "learner"
                                            ? "border-teal-400 bg-teal-400/10 text-teal-300"
                                            : "border-slate-700 bg-slate-900 text-slate-300"
                                            }`}
                                    >
                                        Learner
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("teacher")}
                                        className={`flex-1 py-1.5 rounded-full border ${role === "teacher"
                                            ? "border-teal-400 bg-teal-400/10 text-teal-300"
                                            : "border-slate-700 bg-slate-900 text-slate-300"
                                            }`}
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
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-teal-400"
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
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-teal-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-300">Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-teal-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-2 py-1">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={busy}
                                className="w-full mt-1 rounded-lg text-sm"
                            >
                                {busy
                                    ? "Please wait..."
                                    : mode === "login"
                                        ? "Sign in"
                                        : "Create account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AuthShell;
