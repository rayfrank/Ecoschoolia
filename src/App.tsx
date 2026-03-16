import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Circle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Film,
  Globe2,
  Home,
  LayoutDashboard,
  Play,
  School,
  Sparkles,
  User,
  X,
} from "lucide-react";
import "./App.css";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import AuthShell from "./auth/AuthShell";
import { useAuth } from "./auth/useAuth";
import CbcflixTeacherPanel from "./components/CbcflixTeacherPanel";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./components/ui";
import { db, isFirebaseConfigured } from "./firebase";
import {
  loadDemoAssignments,
  loadDemoLibrary,
  loadDemoStats,
  saveDemoAssignments,
  saveDemoStats,
  starterVideos,
  type DemoAssignment,
} from "./lib/demoData";
import type { CbcflixItem } from "./types/cbcflix";

type Tab = "home" | "cbcflix" | "cyberverse" | "assignments" | "profile";
type AppTheme = "liquid" | "jobs";

const THEME_STORAGE_KEY = "ecoschool-ai-theme";
const CONVAI_EXPERIENCE_ID = "fe995afc-c982-47d2-90a6-1fb97043cfa5";

const lessonDetails: Record<string, { objectives: string[]; captions: string[] }> = {
  "fractions-quest": {
    objectives: ["Add fractions with unlike denominators", "Recognize equivalent fractions", "Explain answers visually"],
    captions: ["Start with a pizza model divided into equal parts.", "Convert halves and quarters into a common denominator.", "Check if the final answer can be simplified."],
  },
  "water-cycle-lab": {
    objectives: ["Identify the main stages of the water cycle", "Match weather events to each stage", "Explain the cycle using school examples"],
    captions: ["Heat from the sun turns liquid water into vapor.", "The vapor cools and condenses into clouds.", "Rainfall returns water to rivers, soil and school tanks."],
  },
  "composition-masterclass": {
    objectives: ["Write stronger openings", "Choose vivid verbs", "Build curiosity in the first sentence"],
    captions: ["A hook should make the reader want to know more.", "Specific details are stronger than generic words.", "Use sound, motion or surprise to begin the story."],
  },
  "password-safety": {
    objectives: ["Build stronger passwords", "Avoid risky sharing habits", "Spot unsafe login behavior"],
    captions: ["Strong passwords mix letters, numbers and symbols.", "Never share a password casually with friends.", "Two-step thinking protects your online identity."],
  },
  "budget-challenge": {
    objectives: ["Separate needs and wants", "Track spending choices", "Plan a simple savings goal"],
    captions: ["A budget starts with a list of income and expenses.", "Needs come before wants when money is limited.", "Saving works best when you set a clear target."],
  },
};

type CampusZone = {
  name: string;
  description: string;
  action: string;
  challenge: string;
  options: string[];
  correctIndex: number;
  x: number;
  z: number;
  width: number;
  color: string;
  typeLabel: string;
};

type PixelStreamClientInstance = {
  initializeExperience?: () => Promise<void>;
};

declare global {
  interface Window {
    PixelStreamClient?: new (options: { container: HTMLElement; expId: string }) => PixelStreamClientInstance;
  }
}

const worlds: CampusZone[] = [
  { name: "Administration Block", description: "Welcome center, notices and campus briefing.", action: "Check school briefing", challenge: "Which office keeps student progress records?", options: ["Library desk", "Administration office", "Dining hall"], correctIndex: 1, x: 0, z: -220, width: 220, color: "from-slate-400/80 to-slate-700/90", typeLabel: "Main office" },
  { name: "STEM Lab", description: "Robots, circuits and experiments.", action: "Enter lab mission", challenge: "Choose the best energy source for a school robot.", options: ["Coal battery", "Solar panel", "Plastic waste"], correctIndex: 1, x: -260, z: -400, width: 190, color: "from-cyan-400/80 to-sky-700/90", typeLabel: "Lab building" },
  { name: "Story Hall", description: "Creative writing and reading journeys.", action: "Start story quest", challenge: "Pick the strongest story opening.", options: ["It was nice.", "Thunder cracked as Nia opened the old gate.", "I went there."], correctIndex: 1, x: 260, z: -400, width: 190, color: "from-fuchsia-400/80 to-rose-700/90", typeLabel: "Language block" },
  { name: "ICT Centre", description: "Digital skills, coding and cyber safety.", action: "Open digital task", challenge: "What is the safest login habit?", options: ["Share passwords", "Use strong unique passwords", "Write passwords on desks"], correctIndex: 1, x: -330, z: -660, width: 210, color: "from-indigo-400/80 to-blue-700/90", typeLabel: "Computer lab" },
  { name: "Library", description: "Research, reading and quiet study.", action: "Enter library task", challenge: "What helps you find a nonfiction book faster?", options: ["Book spine labels", "Random guessing", "Skipping the catalog"], correctIndex: 0, x: 0, z: -620, width: 240, color: "from-amber-300/80 to-yellow-700/90", typeLabel: "Learning hub" },
  { name: "Eco Garden", description: "Climate action and sustainability challenges.", action: "Visit green zone", challenge: "Which action reduces waste most?", options: ["Burning plastic", "Reusing bottles", "Throwing items away"], correctIndex: 1, x: 310, z: -660, width: 210, color: "from-emerald-400/80 to-green-700/90", typeLabel: "Outdoor lab" },
  { name: "Dining Hall", description: "Nutrition, budgeting and school life lessons.", action: "Launch food budget task", challenge: "What is the smartest first step in budgeting lunch money?", options: ["Spend first", "Track income and costs", "Borrow more"], correctIndex: 1, x: -240, z: -910, width: 220, color: "from-orange-400/80 to-red-700/90", typeLabel: "Campus services" },
  { name: "Sports Arena", description: "Fitness, teamwork and challenge events.", action: "Start sports challenge", challenge: "Which habit helps a team work better?", options: ["Ignoring teammates", "Clear communication", "Skipping practice"], correctIndex: 1, x: 240, z: -930, width: 240, color: "from-lime-400/80 to-emerald-700/90", typeLabel: "Activity field" },
];

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [teacherView, setTeacherView] = useState(true);
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "liquid";
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "jobs" ? "jobs" : "liquid";
  });

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Loading Ecoschool AI...</div>;
  if (!user) return <AuthShell />;

  const teacherMode = user.role === "teacher" && teacherView;

  return (
    <div className={`app-theme app-theme-${theme} min-h-screen px-4 py-4 text-slate-100 md:px-8 md:py-6`}>
      <BackgroundGlow theme={theme} />
      <div className="mx-auto mb-4 flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="theme-panel rounded-3xl border border-slate-800 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-teal-300">Ecoschool AI Demo</p>
          <h1 className="mt-1 text-lg font-semibold">Working local demo with real interactions</h1>
          <p className="mt-1 text-xs text-slate-400">Signed in as {user.displayName || user.firebaseUser.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="theme-panel inline-flex items-center gap-1 rounded-full border border-slate-700 p-1">
            <button
              className={`theme-toggle-chip ${theme === "liquid" ? "is-active" : ""}`}
              onClick={() => setTheme("liquid")}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Liquid Glass
            </button>
            <button
              className={`theme-toggle-chip ${theme === "jobs" ? "is-active" : ""}`}
              onClick={() => setTheme("jobs")}
            >
              <Circle className="h-3.5 w-3.5" />
              Jobs Mode
            </button>
          </div>
          {user.role === "teacher" && (
            <div className="theme-panel inline-flex items-center rounded-full border border-slate-700 p-0.5">
              <button className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs ${!teacherMode ? "bg-slate-950 text-teal-300" : "text-slate-400"}`} onClick={() => setTeacherView(false)}><Home className="h-3.5 w-3.5" />Learner</button>
              <button className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs ${teacherMode ? "bg-slate-950 text-teal-300" : "text-slate-400"}`} onClick={() => setTeacherView(true)}><LayoutDashboard className="h-3.5 w-3.5" />Teacher</button>
            </div>
          )}
          <button onClick={() => void logout()} className="theme-panel rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-400">Log out</button>
        </div>
      </div>
      {teacherMode ? <TeacherDashboard /> : <LearnerShell />}
    </div>
  );
};

const BackgroundGlow: React.FC<{ theme: AppTheme }> = ({ theme }) => (
  <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
    <div className={`absolute -left-32 top-10 h-72 w-72 rounded-full blur-3xl ${theme === "liquid" ? "bg-teal-500/20" : "bg-white/40"}`} />
    <div className={`absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl ${theme === "liquid" ? "bg-sky-500/15" : "bg-slate-300/60"}`} />
  </div>
);

const LearnerShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { items, status, error } = useCbcflixLibrary();
  const { assignments, startAssignment, submitAssignment, saveAnswers } = useDemoAssignments();
  const { stats, recordVideoWatch, recordMission } = useDemoStats();
  const [selectedVideo, setSelectedVideo] = useState<CbcflixItem | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<(typeof worlds)[number] | null>(null);
  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? null,
    [assignments, selectedAssignmentId]
  );

  const openVideo = (video: CbcflixItem) => {
    recordVideoWatch();
    setSelectedVideo(video);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="theme-shell flex w-full max-w-sm flex-col overflow-hidden rounded-[32px] border border-slate-800/90 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Ecoschool AI</span>
          <span className="flex items-center gap-1.5"><Film className="h-3.5 w-3.5" />AI + 3D school + CBCflix</span>
        </div>
        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-4">
          {activeTab === "home" && <LearnerHome onNavigate={setActiveTab} stats={stats} />}
          {activeTab === "cbcflix" && <CbcflixScreen items={items} status={status} error={error} onPlay={openVideo} />}
          {activeTab === "cyberverse" && <VirtualSchoolHub onMissionStart={(world) => setSelectedWorld(world)} />}
          {activeTab === "assignments" && <AssignmentsScreen assignments={assignments} onOpen={(assignment) => setSelectedAssignmentId(assignment.id)} onStart={startAssignment} onSubmit={submitAssignment} />}
          {activeTab === "profile" && <ProfileScreen stats={stats} assignments={assignments} />}
        </div>
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {selectedVideo && <LessonModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      {selectedAssignment && (
        <AssignmentModal
          key={selectedAssignment.id}
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignmentId(null)}
          onSaveAnswers={saveAnswers}
          onSubmit={submitAssignment}
        />
      )}
      {selectedWorld && (
        <WorldMissionModal
          world={selectedWorld}
          onClose={() => setSelectedWorld(null)}
          onComplete={() => {
            recordMission();
            setSelectedWorld(null);
          }}
        />
      )}
    </div>
  );
};

const LearnerHome: React.FC<{ onNavigate: (tab: Tab) => void; stats: { videosWatched: number; missionsCompleted: number } }> = ({ onNavigate, stats }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <Card className="border-none bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white">
      <CardHeader className="pb-2">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-50/90"><Sparkles className="h-3.5 w-3.5" />Hello, Amani</p>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold">Grade 7 • Explorer</CardTitle>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-900/40 px-2 py-1 text-[10px]"><Clock className="h-3 w-3" />Streak: 5 days</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div>
          <p className="text-[11px] text-emerald-50/90">Today&apos;s focus</p>
          <p className="text-sm font-medium">Digital Literacy, fractions and storytelling</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-2xl bg-slate-950/30 p-3"><p className="text-emerald-100">Missions completed</p><p className="mt-1 text-lg font-semibold">{stats.missionsCompleted}</p></div>
          <div className="rounded-2xl bg-slate-950/30 p-3"><p className="text-emerald-100">CBCflix watched</p><p className="mt-1 text-lg font-semibold">{stats.videosWatched}</p></div>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1.5 bg-slate-950/85 text-xs hover:bg-slate-950" onClick={() => onNavigate("assignments")}><Play className="h-3.5 w-3.5" />Continue Learning</Button>
          <Button className="gap-1 bg-white/15 text-xs hover:bg-white/25" onClick={() => onNavigate("cbcflix")}><Film className="h-4 w-4" />Watch CBCflix</Button>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-4 gap-2 text-xs">
      <QuickAction label="3D School" icon={<Globe2 className="h-4 w-4" />} onClick={() => onNavigate("cyberverse")} />
      <QuickAction label="CBCflix" icon={<Film className="h-4 w-4" />} onClick={() => onNavigate("cbcflix")} />
      <QuickAction label="Tasks" icon={<ClipboardList className="h-4 w-4" />} onClick={() => onNavigate("assignments")} />
      <QuickAction label="Profile" icon={<User className="h-4 w-4" />} onClick={() => onNavigate("profile")} />
    </div>
  </motion.div>
);

const CbcflixScreen: React.FC<{ items: CbcflixItem[]; status: "loading" | "ready" | "fallback"; error: string | null; onPlay: (video: CbcflixItem) => void }> = ({ items, status, error, onPlay }) => {
  const groupedItems = useMemo(() => {
    const groups = new Map<string, CbcflixItem[]>();
    items.forEach((item) => groups.set(item.subject, [...(groups.get(item.subject) ?? []), item]));
    return [...groups.entries()];
  }, [items]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <CardHeader className="pb-2">
          <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-teal-300"><Film className="h-4 w-4" />CBCflix</p>
          <CardTitle className="text-lg text-slate-100">Playable curriculum video hub</CardTitle>
        </CardHeader>
        <CardContent className="pt-1 text-[11px] text-slate-400">{status === "fallback" ? error : "Teacher-added lessons appear here and play in-app."}</CardContent>
      </Card>
      {groupedItems.map(([subject, videos]) => (
        <div key={subject} className="space-y-2">
          <SectionTitle title={subject} subtitle={`${videos.length} lessons`} />
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {videos.map((video) => (
              <Card key={video.id} className="min-w-[170px] max-w-[180px] flex-shrink-0 overflow-hidden border border-slate-800 bg-slate-900/90">
                <div className="flex h-24 items-end bg-gradient-to-br from-emerald-400/50 via-teal-400/40 to-sky-400/40 p-2">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-slate-700 bg-slate-950/70 px-1.5 py-0.5 text-[9px]">{video.grade}</span>
                      <button onClick={() => onPlay(video)} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80">
                        <Play className="h-3.5 w-3.5 text-teal-300" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 p-2.5">
                  <p className="line-clamp-2 text-[11px] font-semibold text-slate-100">{video.title}</p>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500"><Clock className="h-3 w-3" />{video.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const VirtualSchoolHub: React.FC<{ onMissionStart: (world: CampusZone) => void }> = ({ onMissionStart }) => {
  const [player, setPlayer] = useState({ x: 0, z: -80, facing: 0 });
  const [nearbyWorld, setNearbyWorld] = useState<CampusZone | null>(null);
  const movePlayer = (dx: number, dz: number, facing: number) => {
    setPlayer((current) => ({
      x: Math.max(-380, Math.min(380, current.x + dx)),
      z: Math.max(-1080, Math.min(-40, current.z + dz)),
      facing,
    }));
  };

  useEffect(() => {
    const findNearby = () => {
      const found = worlds.find((world) => Math.hypot(world.x - player.x, world.z - player.z) < 180);
      setNearbyWorld(found ?? null);
    };
    findNearby();
  }, [player]);

  useEffect(() => {
    const handleMove = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") movePlayer(0, 22, 0);
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") movePlayer(0, -22, 180);
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") movePlayer(-22, 0, 270);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") movePlayer(22, 0, 90);
    };
    window.addEventListener("keydown", handleMove);
    return () => window.removeEventListener("keydown", handleMove);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-teal-950/70 to-slate-900">
        <CardHeader className="pb-2">
          <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-sky-300"><Globe2 className="h-4 w-4" />3D Virtual School</p>
          <CardTitle className="text-lg text-slate-100">Walk a full campus and unlock activities</CardTitle>
        </CardHeader>
        <CardContent className="pt-1 text-[11px] text-slate-400">
          Use arrow keys or the movement controls below. Walk around the administration block, library, labs, garden, dining hall and sports field.
        </CardContent>
      </Card>

      <Card className="border border-slate-800 bg-slate-900/80">
        <CardContent className="space-y-3 px-3 py-3">
          <div className="relative h-[470px] overflow-hidden rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,_#1e3a5f_0%,_#4da3d9_24%,_#d3e8f7_25%,_#dde7d0_52%,_#7c8e68_100%)]">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute left-8 top-16 h-28 w-16 rounded-[999px] bg-emerald-800/20 blur-2xl" />
            <div className="absolute right-10 top-18 h-28 w-16 rounded-[999px] bg-emerald-800/20 blur-2xl" />
            <div className="absolute left-[8%] top-[19%] h-24 w-10 rounded-[999px] bg-emerald-900/25 blur-sm" />
            <div className="absolute left-[8.5%] top-[12%] h-14 w-14 rounded-full bg-emerald-700/70" />
            <div className="absolute right-[9%] top-[20%] h-24 w-10 rounded-[999px] bg-emerald-900/25 blur-sm" />
            <div className="absolute right-[8%] top-[13%] h-14 w-14 rounded-full bg-emerald-700/70" />
            <div className="absolute left-1/2 top-[18%] h-20 w-1 -translate-x-1/2 bg-slate-200/60" />
            <div className="absolute left-1/2 top-[14%] h-10 w-14 -translate-x-1/2 rounded-sm bg-black/80" />
            <div className="absolute left-1/2 top-[14.5%] h-4 w-10 -translate-x-1/2 bg-red-500/80" />
            <div className="absolute left-1/2 top-[56%] h-[620px] w-[690px] -translate-x-1/2 -translate-y-1/2" style={{ perspective: "980px" }}>
              <div
                className="absolute left-1/2 top-[50%] h-[880px] w-[940px] -translate-x-1/2 origin-top rounded-[88px] border border-slate-700/40 bg-gradient-to-b from-[#7e8a73] via-[#6f7a65] to-[#56604a] shadow-[inset_0_0_80px_rgba(15,23,42,0.35)]"
                style={{ transform: `rotateX(72deg) translate3d(${-player.x}px, ${player.z + 210}px, 0)` }}
              >
                <div className="absolute left-1/2 top-[5%] h-[89%] w-32 -translate-x-1/2 rounded-[34px] bg-[#a6aa9d]" />
                <div className="absolute left-1/2 top-[5%] h-[89%] w-[88px] -translate-x-1/2 rounded-[28px] bg-[#cfd4c4]" />
                <div className="absolute left-1/2 top-[5%] h-[89%] w-1 -translate-x-1/2 bg-white/40" />
                <div className="absolute left-[10%] top-[9%] h-[78%] w-2 rounded-full bg-white/10" />
                <div className="absolute right-[10%] top-[9%] h-[78%] w-2 rounded-full bg-white/10" />
                <div className="absolute left-[6%] right-[6%] bottom-[9%] h-32 rounded-[44px] border border-emerald-900/30 bg-[radial-gradient(circle,_rgba(74,222,128,0.35),_rgba(34,197,94,0.15)_45%,_transparent_46%)]" />
                <div className="absolute left-[16%] bottom-[15%] h-24 w-24 rounded-full border border-emerald-900/20 bg-emerald-600/20" />
                <div className="absolute right-[16%] bottom-[15%] h-24 w-24 rounded-full border border-emerald-900/20 bg-emerald-600/20" />
                <div className="absolute left-[24%] top-[56%] h-16 w-6 rounded-full bg-stone-700/50" />
                <div className="absolute right-[24%] top-[56%] h-16 w-6 rounded-full bg-stone-700/50" />
                <div className="absolute left-[14%] top-[86%] h-[88px] w-[17%] rounded-[24px] border border-stone-500/40 bg-stone-300/70" />
                <div className="absolute right-[14%] top-[86%] h-[88px] w-[17%] rounded-[24px] border border-stone-500/40 bg-stone-300/70" />
                <div className="absolute left-[16%] top-[88%] h-8 w-[13%] rounded-md bg-slate-700/80" />
                <div className="absolute right-[16%] top-[88%] h-8 w-[13%] rounded-md bg-slate-700/80" />
                <div className="absolute left-[6%] top-[30%] h-24 w-[13%] rounded-[18px] border border-stone-500/30 bg-[#d8d1c4]" />
                <div className="absolute left-[7%] top-[33%] grid w-[10%] grid-cols-3 gap-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span key={`annex-left-${index}`} className="h-3 rounded-sm border border-slate-400/30 bg-sky-100/80" />
                  ))}
                </div>
                <div className="absolute right-[6%] top-[30%] h-24 w-[13%] rounded-[18px] border border-stone-500/30 bg-[#d8d1c4]" />
                <div className="absolute right-[7%] top-[33%] grid w-[10%] grid-cols-3 gap-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span key={`annex-right-${index}`} className="h-3 rounded-sm border border-slate-400/30 bg-sky-100/80" />
                  ))}
                </div>
                <div className="absolute left-[22%] top-[12%] h-16 w-[14%] rounded-[16px] border border-stone-500/25 bg-[#d9d3c6]" />
                <div className="absolute right-[22%] top-[12%] h-16 w-[14%] rounded-[16px] border border-stone-500/25 bg-[#d9d3c6]" />
                <div className="absolute left-[22.8%] top-[13.5%] h-3 w-[12%] rounded-sm bg-[#8b3f2f]" />
                <div className="absolute right-[22.8%] top-[13.5%] h-3 w-[12%] rounded-sm bg-[#8b3f2f]" />
                <div className="absolute left-[6%] top-[72%] h-[104px] w-[18%] rounded-[28px] border border-stone-500/40 bg-[#d2caba]" />
                <div className="absolute right-[6%] top-[72%] h-[104px] w-[18%] rounded-[28px] border border-stone-500/40 bg-[#d2caba]" />
                <div className="absolute left-[8%] top-[74%] grid w-[14%] grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={`senior-left-${index}`} className="h-3 rounded-sm border border-slate-400/30 bg-sky-100/80" />
                  ))}
                </div>
                <div className="absolute right-[8%] top-[74%] grid w-[14%] grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={`senior-right-${index}`} className="h-3 rounded-sm border border-slate-400/30 bg-sky-100/80" />
                  ))}
                </div>
                <div className="absolute left-[5%] top-[8%] h-[18%] w-[22%] rounded-[26px] border border-lime-800/30 bg-[repeating-linear-gradient(90deg,_rgba(110,231,183,0.35)_0,_rgba(110,231,183,0.35)_18px,_rgba(74,222,128,0.12)_18px,_rgba(74,222,128,0.12)_36px)]" />
                <div className="absolute right-[5%] top-[8%] h-[18%] w-[22%] rounded-[26px] border border-emerald-900/30 bg-[#6d8b58]/60" />
                <div className="absolute right-[9%] top-[12%] h-[10%] w-[14%] rounded-[20px] border-4 border-white/70" />
                <div className="absolute left-[12%] top-[13%] rounded-full bg-slate-900/70 px-4 py-1 text-[11px] font-medium text-white">Sports Field</div>
                <div className="absolute right-[10%] top-[13%] rounded-full bg-slate-900/70 px-4 py-1 text-[11px] font-medium text-white">Eco Garden</div>
                {worlds.map((world) => (
                  <button
                    key={world.name}
                    onClick={() => onMissionStart(world)}
                    className="absolute rounded-[20px] border border-slate-300/30 bg-[#d6d2c6] px-3 py-3 text-left text-slate-900 shadow-[0_18px_26px_rgba(15,23,42,0.35)]"
                    style={{
                      left: `calc(50% + ${world.x}px)`,
                      top: `${Math.abs(world.z) - 100}px`,
                      width: `${world.width}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className={`mb-2 h-3 rounded-full bg-gradient-to-r ${world.color}`} />
                    <div className="rounded-[14px] border border-slate-500/20 bg-[#e7e2d7] p-2">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">{world.typeLabel}</p>
                      <p className="mt-1 text-xs font-semibold">{world.name}</p>
                      <div className="mt-2 grid grid-cols-4 gap-1">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <span key={index} className="h-3 rounded-sm border border-slate-400/30 bg-sky-100/80" />
                        ))}
                      </div>
                      <div className="mx-auto mt-2 h-4 w-6 rounded-t-md bg-slate-700" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
              <div className="relative h-7 w-7 rounded-full border border-amber-100 bg-[radial-gradient(circle_at_35%_35%,_#fce7c8,_#d4a373)] shadow-[0_0_14px_rgba(255,255,255,0.18)]" />
              <div className="relative mt-1 h-14 w-10 rounded-[14px] border border-slate-200/20 bg-[linear-gradient(180deg,_#2563eb,_#1d4ed8)] shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
                <div className="absolute left-1/2 top-2 h-1 w-4 -translate-x-1/2 rounded-full bg-white/70" />
              </div>
              <div className="relative -mt-1 flex w-16 items-start justify-between">
                <div className="h-9 w-2 origin-top rounded-full bg-slate-800" style={{ transform: `rotate(${player.facing === 90 ? 22 : player.facing === 270 ? -22 : 8}deg)` }} />
                <div className="h-9 w-2 origin-top rounded-full bg-slate-800" style={{ transform: `rotate(${player.facing === 90 ? -22 : player.facing === 270 ? 22 : -8}deg)` }} />
              </div>
              <div className="-mt-1 flex w-10 items-start justify-between">
                <div className="h-10 w-2 origin-top rounded-full bg-slate-950" style={{ transform: `rotate(${player.facing === 180 ? 12 : -6}deg)` }} />
                <div className="h-10 w-2 origin-top rounded-full bg-slate-950" style={{ transform: `rotate(${player.facing === 180 ? -12 : 6}deg)` }} />
              </div>
              <div className="-mt-1 flex w-12 justify-between">
                <div className="h-2 w-4 rounded-full bg-slate-950" />
                <div className="h-2 w-4 rounded-full bg-slate-950" />
              </div>
              <div className="mt-1 text-[10px] text-white/70">Facing {player.facing}&deg;</div>
            </div>
            <div className="absolute bottom-5 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black/35 blur-md" />
            <div className="absolute bottom-3 left-6 text-[10px] text-slate-700">WASD / Arrows to walk</div>
            <div className="absolute right-5 top-4 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] text-slate-800">
              Ecoschool AI Campus
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div />
            <Button className="px-2 py-2 text-[10px]" onClick={() => movePlayer(0, 22, 0)}>Forward</Button>
            <div />
            <Button className="px-2 py-2 text-[10px]" onClick={() => movePlayer(-22, 0, 270)}>Left</Button>
            <Button className="px-2 py-2 text-[10px]" onClick={() => movePlayer(0, -22, 180)}>Back</Button>
            <Button className="px-2 py-2 text-[10px]" onClick={() => movePlayer(22, 0, 90)}>Right</Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            {nearbyWorld ? (
              <>
                <p className="text-xs font-semibold text-slate-100">{nearbyWorld.name}</p>
                <p className="mt-1 text-[11px] text-slate-400">{nearbyWorld.description}</p>
                <Button className="mt-3 px-4 py-2 text-[11px]" onClick={() => onMissionStart(nearbyWorld)}>
                  {nearbyWorld.action}
                </Button>
              </>
            ) : (
              <p className="text-[11px] text-slate-400">Move closer to a room to interact with its mission.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {worlds.map((world) => (
              <button
                key={`${world.name}-activity`}
                onClick={() => onMissionStart(world)}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-left transition hover:border-slate-600 hover:bg-slate-950"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{world.typeLabel}</p>
                <p className="mt-1 text-xs font-semibold text-slate-100">{world.name}</p>
                <p className="mt-1 text-[11px] text-slate-400">{world.description}</p>
                <p className="mt-2 text-[10px] text-teal-300">{world.action}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <ConvaiExperienceCard />
    </motion.div>
  );
};

const ConvaiExperienceCard: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const containerId = "convai-embed-container";

    const mountExperience = () => {
      const container = document.getElementById(containerId);
      if (!container || !window.PixelStreamClient) {
        if (mounted) {
          setStatus("error");
          setError("Convai embed client is not available.");
        }
        return;
      }

      container.innerHTML = "";

      try {
        const client = new window.PixelStreamClient({
          container,
          expId: CONVAI_EXPERIENCE_ID,
        });

        void client.initializeExperience?.();
        if (mounted) {
          setStatus("ready");
          setError(null);
        }
      } catch {
        if (mounted) {
          setStatus("error");
          setError("Convai experience could not be initialized.");
        }
      }
    };

    if (window.PixelStreamClient) {
      mountExperience();
      return () => {
        mounted = false;
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-convai-embed="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", mountExperience, { once: true });
      existingScript.addEventListener("error", () => {
        if (mounted) {
          setStatus("error");
          setError("Failed to load the Convai embed client.");
        }
      }, { once: true });
      return () => {
        mounted = false;
      };
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@convai/experience-embed/dist/convai-embed.umd.js";
    script.async = true;
    script.dataset.convaiEmbed = "true";
    script.onload = mountExperience;
    script.onerror = () => {
      if (mounted) {
        setStatus("error");
        setError("Failed to load the Convai embed client.");
      }
    };
    document.body.appendChild(script);

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900">
      <CardHeader className="pb-2">
        <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-emerald-300"><School className="h-4 w-4" />Live AI Lab</p>
        <CardTitle className="text-lg text-slate-100">Convai science lab experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        <p className="text-[11px] text-slate-400">
          This embeds your published Convai experience directly inside Ecoschool AI using experience ID <span className="font-medium text-slate-300">{CONVAI_EXPERIENCE_ID}</span>.
        </p>
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black/40">
          <div id="convai-embed-container" className="min-h-[340px] w-full" />
          {status !== "ready" && (
            <div className="flex min-h-[340px] w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_rgba(2,6,23,0.95)_62%)] px-5 text-center">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                {status === "loading" ? "Loading embed" : "Embed unavailable"}
              </div>
              <p className="max-w-md text-sm font-medium text-slate-100">
                {status === "loading" ? "Connecting to the live Convai lab experience." : "The live Convai lab could not be shown here yet."}
              </p>
              <p className="max-w-md text-[11px] text-slate-400">
                {error ?? "If this stays blank, whitelist your domain in Convai and make sure the experience is published."}
              </p>
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-500">
          Convai requires the site domain to be whitelisted for this experience before the embed will run.
        </p>
      </CardContent>
    </Card>
  );
};

const AssignmentsScreen: React.FC<{ assignments: DemoAssignment[]; onOpen: (assignment: DemoAssignment) => void; onStart: (id: string) => void; onSubmit: (id: string) => void }> = ({ assignments, onOpen, onStart, onSubmit }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
    <SectionTitle icon={<ClipboardList className="h-4 w-4 text-teal-300" />} title="Assignments" subtitle="Interactive local demo" />
    {assignments.map((assignment) => (
      <Card key={assignment.id} className="border border-slate-800 bg-slate-900/80">
        <CardContent className="flex items-center justify-between gap-3 px-3 py-3">
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-100">{assignment.title}</p>
            <p className="text-[11px] text-slate-400">Due: {assignment.due}</p>
            <p className="text-[10px] text-slate-500">Latest score: {assignment.score}</p>
            <button onClick={() => onOpen(assignment)} className="mt-2 text-[10px] text-teal-300 underline underline-offset-2">Open activity</button>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">{assignment.status}</span>
            {assignment.status === "Not started" && <Button className="h-7 px-3 text-[11px]" onClick={() => onStart(assignment.id)}>Start</Button>}
            {(assignment.status === "In progress" || assignment.status === "Ready to submit") && <Button className="h-7 px-3 text-[11px]" onClick={() => onSubmit(assignment.id)}>Submit</Button>}
          </div>
        </CardContent>
      </Card>
    ))}
  </motion.div>
);

const ProfileScreen: React.FC<{ stats: { videosWatched: number; missionsCompleted: number }; assignments: DemoAssignment[] }> = ({ stats, assignments }) => {
  const submittedAssignments = assignments.filter((assignment) => assignment.status === "Submitted").length;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="overflow-hidden border border-slate-700/80 bg-slate-900/90">
        <div className="h-14 bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500" />
        <CardContent className="-mt-6 flex items-center gap-3 px-4 pb-4 pt-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-300 bg-slate-950 text-lg font-semibold text-white">A</div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Amani</p>
            <p className="text-[11px] text-slate-300">Grade 7 • Explorer</p>
            <p className="mt-1 text-[11px] text-teal-300">Videos watched: {stats.videosWatched} • Missions completed: {stats.missionsCompleted}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <StatPill label="Assignments submitted" value={String(submittedAssignments)} />
        <StatPill label="Videos watched" value={String(stats.videosWatched)} />
        <StatPill label="Mission wins" value={String(stats.missionsCompleted)} />
      </div>
    </motion.div>
  );
};

const TeacherDashboard: React.FC = () => {
  const { assignments, createAssignment } = useDemoAssignments();
  const { stats } = useDemoStats();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-2 max-w-6xl space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        {[
          { label: "Attendance today", value: "92%", icon: <School className="h-4 w-4 text-teal-300" /> },
          { label: "Assignments active", value: String(assignments.length), icon: <ClipboardList className="h-4 w-4 text-amber-300" /> },
          { label: "CBCflix views", value: String(stats.videosWatched), icon: <Film className="h-4 w-4 text-rose-300" /> },
          { label: "Mission completions", value: String(stats.missionsCompleted), icon: <Sparkles className="h-4 w-4 text-sky-300" /> },
        ].map((item) => (
          <Card key={item.label} className="border-slate-800 bg-slate-950">
            <CardContent className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400"><span>{item.label}</span>{item.icon}</div>
              <p className="text-lg font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4 text-teal-300" />Teacher Assignment Studio</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-1 text-[11px]">
            <input className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New assignment title" />
            <select className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>Digital Literacy</option>
              <option>Life Skills</option>
            </select>
            <Button className="px-4 py-2 text-[11px]" onClick={() => { if (title.trim()) { createAssignment(title, subject); setTitle(""); } }}>Create assignment</Button>
            <p className="text-slate-400">New assignments appear immediately in the learner task list.</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Live Demo Proof</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-1 text-[11px] text-slate-300">
            <p>Teacher-created assignments sync into the learner flow.</p>
            <p>Video plays update CBCflix watch counts.</p>
            <p>Mission launches increase learner progress metrics.</p>
          </CardContent>
        </Card>
      </div>
      <CbcflixTeacherPanel />
    </motion.div>
  );
};

const LessonModal: React.FC<{ video: CbcflixItem; onClose: () => void }> = ({ video, onClose }) => {
  const detail = lessonDetails[video.id] ?? {
    objectives: ["Understand the key topic", "Apply the idea in class", "Review with a quick recap"],
    captions: [video.description ?? "Curriculum-aligned lesson clip.", "Pause and reflect on the main idea.", "Use the lesson to answer the related activity."],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{video.title}</p>
            <p className="text-[11px] text-slate-400">{video.subject} • {video.grade}</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-700 p-2 text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-teal-950/60 to-slate-900 p-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-wide text-teal-300">Lesson player</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{video.title}</p>
              <p className="mt-2 text-[11px] text-slate-400">{video.description}</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-black">
                <video controls autoPlay className="aspect-video w-full" src={video.videoUrl} />
              </div>
              <div className="mt-4 space-y-3">
                {detail.captions.map((caption, index) => (
                  <div key={caption} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-[10px] text-slate-500">Clip segment {index + 1}</p>
                    <p className="mt-1 text-[11px] text-slate-200">{caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Learning goals</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-1">
                {detail.objectives.map((objective) => (
                  <div key={objective} className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-300">
                    {objective}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Why this clip matters</CardTitle></CardHeader>
              <CardContent className="pt-1 text-[11px] text-slate-400">
                This lesson content is matched to the topic and is intended to feed directly into the learner assignment flow.
                {video.sourceUrl && (
                  <a href={video.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 block text-teal-300 underline underline-offset-2">
                    Open source video
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentModal: React.FC<{
  assignment: DemoAssignment;
  onClose: () => void;
  onSaveAnswers: (id: string, answers: number[]) => void;
  onSubmit: (id: string) => void;
}> = ({ assignment, onClose, onSaveAnswers, onSubmit }) => {
  const [answers, setAnswers] = useState<number[]>(assignment.answers ?? assignment.questions.map(() => -1));

  const setAnswer = (index: number, value: number) => {
    const next = answers.map((answer, answerIndex) => (answerIndex === index ? value : answer));
    setAnswers(next);
    onSaveAnswers(assignment.id, next);
  };

  const readyToSubmit = answers.every((answer) => answer >= 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{assignment.title}</p>
            <p className="text-[11px] text-slate-400">{assignment.prompt}</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-700 p-2 text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          {assignment.questions.map((question, index) => (
            <div key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="mb-2 text-sm font-medium text-slate-100">{index + 1}. {question.question}</p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    onClick={() => setAnswer(index, optionIndex)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-[11px] ${answers[index] === optionIndex ? "border-teal-400 bg-teal-400/10 text-teal-200" : "border-slate-700 bg-slate-950 text-slate-300"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {answers[index] >= 0 && (
                <p className="mt-2 text-[10px] text-slate-400">{question.explanation}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">{readyToSubmit ? "All questions answered." : "Answer all questions to submit."}</p>
          <Button className="px-4 py-2 text-[11px]" disabled={!readyToSubmit} onClick={() => { onSubmit(assignment.id); onClose(); }}>
            Submit activity
          </Button>
        </div>
      </div>
    </div>
  );
};

const WorldMissionModal: React.FC<{
  world: (typeof worlds)[number];
  onClose: () => void;
  onComplete: () => void;
}> = ({ world, onClose, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{world.name}</p>
            <p className="text-[11px] text-slate-400">{world.description}</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-700 p-2 text-slate-400"><X className="h-4 w-4" /></button>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-sky-950/70 to-slate-900 p-4">
          <p className="text-[11px] uppercase tracking-wide text-sky-300">Mission checkpoint</p>
          <p className="mt-2 text-sm text-slate-100">{world.challenge}</p>
          <div className="mt-4 grid gap-2">
            {world.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelected(index)}
                className={`rounded-2xl border px-3 py-2 text-left text-[11px] ${selected === index ? "border-sky-400 bg-sky-400/10 text-sky-100" : "border-slate-700 bg-slate-950 text-slate-300"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="px-4 py-2 text-[11px]" disabled={selected === null} onClick={() => setRevealed(true)}>
              Check answer
            </Button>
            {revealed && selected === world.correctIndex && (
              <Button className="px-4 py-2 text-[11px]" onClick={onComplete}>
                Complete mission
              </Button>
            )}
          </div>
          {revealed && (
            <p className={`mt-3 text-[11px] ${selected === world.correctIndex ? "text-emerald-300" : "text-rose-300"}`}>
              {selected === world.correctIndex ? "Correct. Mission complete is now available." : "Not quite. Try another option."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-center">
    <p className="text-[10px] text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-semibold">{value}</p>
  </div>
);

const SectionTitle: React.FC<{ icon?: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-center justify-between">
    <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">{icon}{title}</h2>
    {subtitle && <span className="text-[11px] text-slate-400">{subtitle}</span>}
  </div>
);

const BottomNav: React.FC<{ activeTab: Tab; onChange: (tab: Tab) => void }> = ({ activeTab, onChange }) => {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "cbcflix", label: "CBCflix", icon: <Film className="h-5 w-5" /> },
    { id: "cyberverse", label: "3D School", icon: <Globe2 className="h-5 w-5" /> },
    { id: "assignments", label: "Tasks", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];
  return <div className="border-t border-slate-800 bg-slate-950/95 px-2 py-1"><div className="grid grid-cols-5 gap-1">{items.map((item) => <button key={item.id} onClick={() => onChange(item.id)} className={`flex flex-col items-center justify-center rounded-2xl py-1 text-[10px] ${activeTab === item.id ? "bg-slate-800 text-teal-300" : "text-slate-400 hover:bg-slate-900"}`}><div className="mb-0.5">{item.icon}</div><span>{item.label}</span></button>)}</div></div>;
};

const QuickAction: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 py-2 text-[10px] text-slate-200"><div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800">{icon}</div><span>{label}</span></button>
);

const useCbcflixLibrary = () => {
  const [items, setItems] = useState<CbcflixItem[]>(loadDemoLibrary());
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(isFirebaseConfigured && db ? "loading" : "fallback");
  const [error, setError] = useState<string | null>(isFirebaseConfigured ? null : "Running in demo mode with seeded local videos.");
  useEffect(() => {
    const loadLocal = () => { setItems(loadDemoLibrary()); setStatus("fallback"); setError("Running in demo mode with seeded local videos."); };
    window.addEventListener("ecoschoolia:library-updated", loadLocal);
    if (!isFirebaseConfigured || !db) return () => window.removeEventListener("ecoschoolia:library-updated", loadLocal);
    const unsubscribe = onSnapshot(query(collection(db, "cbcflix"), orderBy("createdAt", "desc"), limit(18)), (snapshot) => {
      const liveItems = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as Partial<CbcflixItem>;
        return { id: docSnapshot.id, title: data.title ?? "Untitled lesson", subject: data.subject ?? "General", grade: data.grade ?? "CBC", duration: data.duration ?? "10 min", thumbnailUrl: data.thumbnailUrl ?? "", videoUrl: data.videoUrl ?? starterVideos[0].videoUrl, tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [], createdAt: data.createdAt ?? null };
      });
      setItems(liveItems.length > 0 ? liveItems : loadDemoLibrary());
      setStatus("ready");
      setError(null);
    }, loadLocal);
    return () => { unsubscribe(); window.removeEventListener("ecoschoolia:library-updated", loadLocal); };
  }, []);
  return { items, status, error };
};

const useDemoAssignments = () => {
  const [assignments, setAssignments] = useState<DemoAssignment[]>(loadDemoAssignments());
  useEffect(() => {
    const sync = () => setAssignments(loadDemoAssignments());
    window.addEventListener("ecoschoolia:assignments-updated", sync);
    return () => window.removeEventListener("ecoschoolia:assignments-updated", sync);
  }, []);
  const update = (next: DemoAssignment[]) => {
    setAssignments(next);
    saveDemoAssignments(next);
    window.dispatchEvent(new Event("ecoschoolia:assignments-updated"));
  };
  return {
    assignments,
    createAssignment: (title: string, subject: string) => update([{
      id: `a-${Date.now()}`,
      title,
      subject,
      due: "3 days",
      status: "Not started",
      score: "-",
      prompt: "Teacher-created live demo assignment.",
      questions: [
        { id: "q1", question: `What is the main idea of ${title}?`, options: ["Ignore the lesson", "Complete the task carefully", "Skip all questions"], correctIndex: 1, explanation: "The goal is to complete the learning activity carefully." },
        { id: "q2", question: "What should a learner do before submitting?", options: ["Review answers", "Close the app", "Leave questions blank"], correctIndex: 0, explanation: "Reviewing answers improves accuracy." },
      ],
      answers: [-1, -1],
    }, ...assignments]),
    startAssignment: (id: string) => update(assignments.map((assignment) => assignment.id === id ? { ...assignment, status: "In progress" } : assignment)),
    saveAnswers: (id: string, answers: number[]) => update(assignments.map((assignment) => assignment.id === id ? { ...assignment, answers, status: answers.every((answer) => answer >= 0) ? "Ready to submit" : "In progress" } : assignment)),
    submitAssignment: (id: string) => update(assignments.map((assignment) => assignment.id === id ? { ...assignment, status: "Submitted", score: `${78 + Math.floor(Math.random() * 20)}%` } : assignment)),
  };
};

const useDemoStats = () => {
  const [stats, setStats] = useState(loadDemoStats());
  const update = (next: { videosWatched: number; missionsCompleted: number }) => { setStats(next); saveDemoStats(next); };
  return { stats, recordVideoWatch: () => update({ ...stats, videosWatched: stats.videosWatched + 1 }), recordMission: () => update({ ...stats, missionsCompleted: stats.missionsCompleted + 1 }) };
};

export default App;
