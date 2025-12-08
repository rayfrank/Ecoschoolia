import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Globe2,
  ClipboardList,
  User,
  Clock,
  ChevronRight,
  Star,
  Sparkles,
  Trophy,
  LayoutDashboard,
  BarChart3,
  Users,
  School,
  Calendar,
  MessageCircle,
  AlertTriangle,
  Film,
  Play,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
} from "./components/ui";

// ---------- TYPES ----------

type Tab = "home" | "cbcflix" | "cyberverse" | "assignments" | "profile";
type ViewMode = "learner" | "teacher";

const learnerName = "Amani";
const learnerGrade = "Grade 7";
const learnerLevel = "Explorer";
const todayFocus = "Digital Literacy & Fractions";

// ---------- ROOT APP ----------

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("learner");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-4 md:px-8 md:py-6">
      {/* Soft background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute -left-32 top-10 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-sky-500/15 blur-3xl rounded-full" />
      </div>

      {/* Top bar / mode switch */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold bg-gradient-to-br from-teal-300 to-sky-300 bg-clip-text text-transparent">
                ES
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400/80 flex items-center justify-center text-[8px] font-bold text-slate-900">
              AI
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
              Ecoschoolia
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[10px] text-teal-300">
                <Sparkles className="w-3 h-3" />
                CBC • Kenya
              </span>
            </p>
            <p className="text-xs text-slate-400">
              AI-powered CBC learning, 3D school & CBCflix
            </p>
          </div>
        </div>

        <div className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 p-0.5 shadow-lg shadow-slate-900/40">
          <button
            className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition ${viewMode === "learner"
              ? "bg-slate-950 text-teal-300 shadow-sm shadow-slate-900/40"
              : "text-slate-400"
              }`}
            onClick={() => setViewMode("learner")}
          >
            <Home className="w-3.5 h-3.5" />
            Learner app
          </button>
          <button
            className={`px-3.5 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition ${viewMode === "teacher"
              ? "bg-slate-950 text-teal-300 shadow-sm shadow-slate-900/40"
              : "text-slate-400"
              }`}
            onClick={() => setViewMode("teacher")}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Teacher dashboard
          </button>
        </div>
      </div>

      {/* Main content */}
      {viewMode === "learner" ? <LearnerShell /> : <TeacherDashboard />}
    </div>
  );
};

// ---------- LEARNER SHELL (PHONE UI) ----------

const LearnerShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-sm bg-slate-950/80 rounded-[32px] shadow-[0_24px_80px_rgba(15,23,42,0.9)] border border-slate-800/90 overflow-hidden flex flex-col backdrop-blur">
        {/* Status Bar / Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ecoschoolia
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            AI • 3D School • CBCflix
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-4 space-y-4">
          {activeTab === "home" && <LearnerHome />}
          {activeTab === "cbcflix" && <CBCFlixScreen />}
          {activeTab === "cyberverse" && <VirtualSchoolHub />}
          {activeTab === "assignments" && <AssignmentsScreen />}
          {activeTab === "profile" && <ProfileScreen />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
};

/* ------------------- Learner Home ------------------- */

const LearnerHome: React.FC = () => {
  const recommended = [
    {
      id: 1,
      title: "Math – Fractions Mission",
      description: "Practice adding and subtracting fractions using a mini-quest.",
      subject: "Math",
      competency: "Critical Thinking",
      difficulty: 2,
      duration: "20 min",
    },
    {
      id: 2,
      title: "Science – Water Cycle Video",
      description: "Watch and answer quick questions about evaporation & rain.",
      subject: "Science",
      competency: "Learning to Learn",
      difficulty: 1,
      duration: "15 min",
    },
    {
      id: 3,
      title: "Weekend Project – Build a Budget",
      description: "Plan a simple shopping list with a fixed amount of money.",
      subject: "Life Skills",
      competency: "Financial Literacy",
      difficulty: 3,
      duration: "30–40 min",
    },
  ];

  const subjectEmoji: Record<string, string> = {
    Math: "➗",
    Science: "🔬",
    "Life Skills": "🧠",
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Hero Card */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 border-none text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 bg-white/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 w-36 h-36 bg-sky-300/30 rounded-full blur-3xl" />

        <CardHeader className="pb-2 relative">
          <p className="text-xs uppercase tracking-wide text-emerald-50/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hello, {learnerName} 👋
          </p>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-semibold">
              {learnerGrade}
              <span className="mx-1.5">•</span>
              {learnerLevel}
            </CardTitle>
            <div className="px-2 py-1 rounded-full bg-emerald-900/40 text-[10px] flex items-center gap-1.5 border border-emerald-300/40">
              <Clock className="w-3 h-3" />
              <span>Streak: 5 days</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 relative">
          <p className="text-[11px] text-emerald-50/90 mb-1">Today&apos;s focus</p>
          <p className="text-sm font-medium mb-4 flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-900/40 text-[11px] border border-emerald-200/40">
              📚
            </span>
            {todayFocus}
          </p>
          <div className="flex items-center justify-between gap-2">
            <Button className="bg-slate-950/85 hover:bg-slate-950 text-xs rounded-full px-4 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              Continue Learning
            </Button>
            <Button className="bg-white/15 hover:bg-white/25 text-xs rounded-full px-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <QuickAction
          label="3D Virtual School"
          icon={<Globe2 className="w-4 h-4" />}
        />
        <QuickAction label="CBCflix" icon={<Film className="w-4 h-4" />} />
        <QuickAction
          label="Assignments"
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <QuickAction label="Profile" icon={<User className="w-4 h-4" />} />
      </div>

      {/* Recommended by AI */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-300" />
            Recommended by AI
          </h2>
          <span className="text-[11px] text-slate-400">
            Personalised for you
          </span>
        </div>

        <div className="space-y-2">
          {recommended.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/80 transition-colors overflow-hidden"
            >
              <CardContent className="py-3 px-3 flex gap-3">
                {/* Left visual strip */}
                <div className="w-10 shrink-0 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center text-lg">
                    {subjectEmoji[item.subject] ?? "📘"}
                  </div>
                  <DifficultyDots level={item.difficulty} />
                </div>
                {/* Text */}
                <div className="flex-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-100 mb-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80">
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80">
                        {item.competency}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    </div>
                  </div>
                  <Button className="rounded-full text-[11px] px-3 h-7 mt-1">
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------- CBCflix – Learner Netflix-style screen ------------------- */

const CBCFlixScreen: React.FC = () => {
  // Later plug this into your backend
  const sections = [
    {
      id: "math",
      title: "Math & STEM",
      tagline: "Short episodes that make numbers feel easy.",
      color: "from-emerald-400/50 via-teal-400/40 to-sky-400/40",
      videos: [
        {
          id: "fractions-quest",
          title: "Fractions Quest – Episode 1",
          gradeBand: "G5–G7",
          duration: "12 min",
          subject: "Math",
          tag: "Fractions",
        },
        {
          id: "algebra-codes",
          title: "Algebra Codes – Intro",
          gradeBand: "G7–G8",
          duration: "10 min",
          subject: "Math",
          tag: "Patterns",
        },
        {
          id: "science-lab",
          title: "Science Lab: Forces",
          gradeBand: "G6–G8",
          duration: "14 min",
          subject: "Science",
          tag: "Forces",
        },
      ],
    },
    {
      id: "literacy",
      title: "Language & Stories",
      tagline: "Animated stories, comprehension & composition tips.",
      color: "from-fuchsia-400/50 via-purple-400/40 to-sky-300/40",
      videos: [
        {
          id: "story-africa",
          title: "StoryTime: The Market Day",
          gradeBand: "G4–G6",
          duration: "9 min",
          subject: "English",
          tag: "Reading",
        },
        {
          id: "writing-hooks",
          title: "How to Start a Great Composition",
          gradeBand: "G6–G8",
          duration: "8 min",
          subject: "English",
          tag: "Writing",
        },
      ],
    },
    {
      id: "life-skills",
      title: "Life Skills & Digital Safety",
      tagline: "CBC life skills, cyber safety & money skills.",
      color: "from-amber-400/50 via-orange-400/40 to-rose-400/40",
      videos: [
        {
          id: "cyber-safe",
          title: "Cyber-Safe Kid – Passwords",
          gradeBand: "G5–G8",
          duration: "11 min",
          subject: "Digital Literacy",
          tag: "Online Safety",
        },
        {
          id: "money-moves",
          title: "Money Moves: Saving with a Goal",
          gradeBand: "G6–G8",
          duration: "13 min",
          subject: "Life Skills",
          tag: "Financial Literacy",
        },
      ],
    },
  ];

  return (
    <motion.div
      key="cbcflix"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <p className="text-xs text-teal-300 uppercase tracking-wide flex items-center gap-1">
            <Film className="w-4 h-4" />
            CBCflix – Curriculum Video Hub
          </p>
          <CardTitle className="text-lg text-slate-100">
            Watch lessons like your favourite shows
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <p className="text-[11px] text-slate-400">
            Rows of CBC-aligned videos. Tap a card to open the lesson player
            (later this will connect to real video content).
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">
                {section.title}
              </h3>
              <span className="text-[11px] text-slate-500">
                {section.tagline}
              </span>
            </div>

            {/* Netflix-style horizontal row */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {section.videos.map((video) => (
                <motion.button
                  key={video.id}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="min-w-[150px] max-w-[170px] bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex-shrink-0 text-left shadow-lg shadow-slate-950/40"
                >
                  {/* Poster */}
                  <div
                    className={`h-24 bg-gradient-to-br ${section.color} relative flex items-end p-2`}
                  >
                    <div className="absolute inset-0 bg-slate-950/30 mix-blend-multiply" />
                    <div className="relative flex items-center justify-between w-full">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-950/70 border border-slate-700 text-slate-100">
                        {video.gradeBand}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center shadow-md shadow-slate-900/70">
                        <Play className="w-3.5 h-3.5 text-teal-300" />
                      </div>
                    </div>
                    <div className="absolute left-2 top-2 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/60 text-slate-100">
                      {video.subject}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-2.5 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-100 line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {video.tag}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ------------------- 3D Virtual School Hub ------------------- */

const VirtualSchoolHub: React.FC = () => {
  const worlds = [
    {
      id: 1,
      name: "STEM Lab",
      description: "Robots, circuits, experiments & problem-solving.",
      competencies: ["Critical Thinking", "Digital Literacy"],
      icon: "🤖",
    },
    {
      id: 2,
      name: "Story Realm",
      description: "Reading, writing, drama & creativity.",
      competencies: ["Communication", "Creativity"],
      icon: "📖",
    },
    {
      id: 3,
      name: "Eco Planet",
      description: "Environment, climate action & responsibility.",
      competencies: ["Citizenship", "Collaboration"],
      icon: "🌍",
    },
    {
      id: 4,
      name: "Money City",
      description: "Budgeting, saving & real-life maths.",
      competencies: ["Financial Literacy", "Self-Efficacy"],
      icon: "💰",
    },
  ];

  return (
    <motion.div
      key="virtual-school"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <p className="text-xs text-teal-300 uppercase tracking-wide">
            3D Virtual School
          </p>
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            Choose your world
            <Globe2 className="w-5 h-5 text-teal-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-[11px] text-slate-400 mb-3">
            Each world is a 3D classroom with missions, quests & mini-games
            aligned with CBC competencies.
          </p>
          <Button className="w-full rounded-full text-xs mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Let AI pick a mission for me
          </Button>
          <p className="text-[10px] text-slate-500 text-center">
            NURU AI Mentor will choose based on your recent progress.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {worlds.map((world) => (
          <motion.div
            key={world.id}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/80 cursor-pointer overflow-hidden">
              <CardContent className="py-3 px-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500/80 to-emerald-500/70 flex items-center justify-center text-2xl shadow-md shadow-teal-900/60">
                  {world.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-100">
                    {world.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-1">
                    {world.description}
                  </p>
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                    {world.competencies.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-full bg-slate-800/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ------------------- Assignments Screen ------------------- */

const AssignmentsScreen: React.FC = () => {
  const assignments = [
    {
      id: 1,
      title: "English – Short Story Reflection",
      dueIn: "2 days",
      status: "In progress",
    },
    {
      id: 2,
      title: "Science – Water Cycle Quiz",
      dueIn: "Today",
      status: "Not started",
    },
    {
      id: 3,
      title: "Math – Fractions Practice",
      dueIn: "5 days",
      status: "Submitted",
    },
  ];

  const statusColor = (status: string) => {
    if (status === "Not started") return "bg-rose-500/15 text-rose-300";
    if (status === "In progress") return "bg-amber-500/15 text-amber-300";
    return "bg-emerald-500/15 text-emerald-300";
  };

  return (
    <motion.div
      key="assignments"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
        <ClipboardList className="w-4 h-4 text-teal-300" />
        My Assignments
      </h2>
      <p className="text-[11px] text-slate-400 mb-1">
        Keep track of what&apos;s due and what you&apos;ve submitted.
      </p>

      <div className="space-y-2">
        {assignments.map((a) => (
          <Card
            key={a.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/80"
          >
            <CardContent className="py-3 px-3 flex items-center justify-between gap-2">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[13px]">
                  📘
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100 mb-1">
                    {a.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Due: <span className="font-medium">{a.dueIn}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>
                <Button className="rounded-full text-[11px] h-7 px-3 border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800">
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

/* ------------------- Profile Screen ------------------- */

const ProfileScreen: React.FC = () => {
  const competencies = [
    { name: "Digital Literacy", level: "Strong", value: 80 },
    { name: "Communication", level: "Improving", value: 65 },
    { name: "Critical Thinking", level: "Needs practice", value: 50 },
  ];

  const badges = [
    { name: "Cyber-Safe Kid", category: "Safety" },
    { name: "Math Ninja", category: "STEM" },
    { name: "Creative Writer", category: "Language" },
  ];

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Card className="bg-slate-900/90 border border-slate-700/80 overflow-hidden">
        <div className="relative">
          <div className="h-14 bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500" />
          <CardContent className="pt-0 pb-4 px-4 flex items-center gap-3 -mt-6">
            <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-emerald-300 flex items-center justify-center text-lg font-semibold text-white shadow-md shadow-emerald-900/60">
              {learnerName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                {learnerName}
              </p>
              <p className="text-[11px] text-slate-300">{learnerGrade}</p>
              <p className="text-[11px] text-teal-300 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                Level: {learnerLevel}
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Competencies */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-teal-300" />
          CBC Competencies
        </h3>
        {competencies.map((c) => (
          <div key={c.name} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">{c.name}</span>
              <span className="text-slate-400">{c.level}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                style={{ width: `${c.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1">
          Badges & Achievements <Trophy className="w-3 h-3 text-amber-400" />
        </h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/80 border border-slate-700"
            >
              <Star className="w-3 h-3 text-amber-300" />
              <span className="text-[10px] text-slate-100">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------- Teacher / School Dashboard (Desktop) ------------------- */

const TeacherDashboard: React.FC = () => {
  return (
    <motion.div
      key="teacher"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto mt-2 grid grid-cols-12 gap-4"
    >
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col col-span-3 lg:col-span-2 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 gap-2 backdrop-blur shadow-[0_18px_50px_rgba(15,23,42,0.85)]">
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80">
          <LayoutDashboard className="w-4 h-4 text-teal-300" />
          <span className="text-xs font-medium">Dashboard</span>
        </div>
        <NavItem icon={<School className="w-4 h-4" />} label="Classes" />
        <NavItem icon={<Users className="w-4 h-4" />} label="Learners" />
        <NavItem
          icon={<ClipboardList className="w-4 h-4" />}
          label="Assignments"
        />
        <NavItem
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analytics & AI"
        />
        <NavItem
          icon={<MessageCircle className="w-4 h-4" />}
          label="Communication"
        />
        <NavItem icon={<Calendar className="w-4 h-4" />} label="Timetable" />
      </aside>

      {/* Main content */}
      <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-4">
        {/* Top row cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DashboardStat
            label="Attendance today"
            value="92%"
            badge="Stable"
            tone="teal"
          />
          <DashboardStat
            label="Average engagement"
            value="High"
            badge="↑ vs last week"
            tone="amber"
          />
          <DashboardStat
            label="Assignments this week"
            value="14"
            badge="3 due today"
            tone="sky"
          />
        </div>

        {/* Middle: AI Insights + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="col-span-2 bg-slate-950 border-slate-800">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-300" />
                AI Insights – This Week
              </CardTitle>
              <span className="text-[11px] text-slate-400">
                3D Virtual School & CBCflix
              </span>
            </CardHeader>
            <CardContent className="pt-1 space-y-2 text-[11px]">
              <InsightItem
                grade="Grade 6"
                issue="Many learners struggle with Fractions."
                suggestion="Assign Fractions Mission in the 3D Virtual School & recommend CBCflix Fractions episodes."
              />
              <InsightItem
                grade="Grade 4"
                issue="Strong in Reading, weaker in Composition."
                suggestion="Use Story Realm writing quests and CBCflix writing tips twice this week."
              />
              <InsightItem
                grade="Grade 8"
                issue="Engagement drops after 10 min in Science videos."
                suggestion="Split long videos into shorter CBCflix clips and add quick quizzes."
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                Alerts
              </CardTitle>
              <span className="text-[11px] text-slate-400">
                Early warning flags
              </span>
            </CardHeader>
            <CardContent className="pt-1 space-y-2 text-[11px]">
              <AlertItem
                name="Aisha (G7)"
                detail="Engagement low for 7 days; missing 3 assignments."
              />
              <AlertItem
                name="Brian (G5)"
                detail="Attendance dropped below 80% this month."
              />
              <AlertItem
                name="Class 4 Emerald"
                detail="Digital literacy tasks not attempted this week."
              />
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Class overview table */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <School className="w-4 h-4 text-teal-300" />
              Class overview
            </CardTitle>
            <span className="text-[11px] text-slate-400">
              Snapshot of key classes
            </span>
          </CardHeader>
          <CardContent className="pt-1 overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2 pr-3 font-normal">Class</th>
                  <th className="text-left py-2 pr-3 font-normal">Learners</th>
                  <th className="text-left py-2 pr-3 font-normal">Attendance</th>
                  <th className="text-left py-2 pr-3 font-normal">
                    Engagement
                  </th>
                  <th className="text-left py-2 pr-3 font-normal">
                    Weak competency
                  </th>
                  <th className="text-left py-2 pr-3 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                <ClassRow
                  name="Grade 6 Sapphire"
                  learners={32}
                  attendance="94%"
                  engagement="High"
                  weak="Fractions"
                />
                <ClassRow
                  name="Grade 4 Emerald"
                  learners={29}
                  attendance="90%"
                  engagement="Medium"
                  weak="Writing"
                />
                <ClassRow
                  name="Grade 8 Topaz"
                  learners={35}
                  attendance="88%"
                  engagement="Low"
                  weak="Science videos"
                />
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
};

/* ---------- Teacher dashboard helpers ---------- */

const NavItem: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <button className="flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900/80 transition">
    {icon}
    <span>{label}</span>
  </button>
);

const DashboardStat: React.FC<{
  label: string;
  value: string;
  badge: string;
  tone: "teal" | "amber" | "sky";
}> = ({ label, value, badge, tone }) => {
  const toneMap: Record<typeof tone, string> = {
    teal: "from-teal-500/18 to-emerald-500/10 text-teal-300",
    amber: "from-amber-500/18 to-orange-500/10 text-amber-300",
    sky: "from-sky-500/18 to-cyan-500/10 text-sky-300",
  };
  return (
    <Card className={`bg-gradient-to-br ${toneMap[tone]} border-slate-800`}>
      <CardContent className="px-4 py-3 space-y-2">
        <p className="text-[11px] text-slate-200/80 mb-1 flex items-center justify-between">
          <span>{label}</span>
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{value}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/40 border border-slate-700">
            {badge}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-900/60 overflow-hidden">
          <div className="h-full w-3/4 bg-slate-50/30" />
        </div>
      </CardContent>
    </Card>
  );
};

const InsightItem: React.FC<{
  grade: string;
  issue: string;
  suggestion: string;
}> = ({ grade, issue, suggestion }) => (
  <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2">
    <p className="text-[10px] text-teal-300 font-medium mb-0.5">{grade}</p>
    <p className="text-[11px] mb-1">{issue}</p>
    <p className="text-[10px] text-slate-400">{suggestion}</p>
  </div>
);

const AlertItem: React.FC<{ name: string; detail: string }> = ({
  name,
  detail,
}) => (
  <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2 flex flex-col gap-0.5">
    <p className="text-[11px] font-medium text-slate-100">{name}</p>
    <p className="text-[10px] text-slate-400">{detail}</p>
  </div>
);

const ClassRow: React.FC<{
  name: string;
  learners: number;
  attendance: string;
  engagement: "High" | "Medium" | "Low" | string;
  weak: string;
}> = ({ name, learners, attendance, engagement, weak }) => {
  const engagementColor =
    engagement === "High"
      ? "text-emerald-300"
      : engagement === "Low"
        ? "text-rose-300"
        : "text-amber-300";

  return (
    <tr className="border-t border-slate-800">
      <td className="py-2 pr-3">{name}</td>
      <td className="py-2 pr-3 text-slate-300">{learners}</td>
      <td className="py-2 pr-3 text-slate-300">{attendance}</td>
      <td className={`py-2 pr-3 ${engagementColor}`}>{engagement}</td>
      <td className="py-2 pr-3 text-slate-300">{weak}</td>
      <td className="py-2 pr-3">
        <button className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800">
          View details
        </button>
      </td>
    </tr>
  );
};

/* ------------------- Re-usable bits (learner) ------------------- */

const BottomNav: React.FC<{
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}> = ({ activeTab, onChange }) => {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    {
      id: "cbcflix",
      label: "CBCflix",
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: "cyberverse",
      label: "3D School",
      icon: <Globe2 className="w-5 h-5" />,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur px-2 py-1">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl text-[10px] transition-all ${isActive
                ? "bg-slate-800 text-teal-300 shadow-inner shadow-black/40"
                : "text-slate-400 hover:bg-slate-900"
                }`}
            >
              <div className="mb-0.5">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ label: string; icon: React.ReactNode }> = ({
  label,
  icon,
}) => (
  <button className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-200 py-2 hover:border-teal-500/80 hover:bg-slate-900 transition-colors shadow-sm shadow-slate-950/40">
    <div className="w-8 h-8 rounded-2xl bg-slate-800 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[10px] leading-tight text-center">{label}</span>
  </button>
);

const DifficultyDots: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-amber-400" : "bg-slate-700"
            }`}
        />
      ))}
    </div>
  );
};

export default App;
