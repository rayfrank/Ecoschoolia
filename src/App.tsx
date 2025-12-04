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
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
} from "./components/ui";

// ---------- TYPES ----------

type Tab = "home" | "cyberverse" | "assignments" | "profile";
type ViewMode = "learner" | "teacher";

const learnerName = "Amani";
const learnerGrade = "Grade 7";
const learnerLevel = "Explorer";
const todayFocus = "Digital Literacy & Fractions";

// ---------- ROOT APP ----------

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("learner");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-4 md:px-8 md:py-6">
      {/* Top bar / mode switch */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
            ES
          </div>
          <div>
            <p className="text-sm font-semibold">Ecoschoolia</p>
            <p className="text-xs text-slate-400">
              AI-powered CBC learning & 3D Virtual School
            </p>
          </div>
        </div>

        <div className="inline-flex items-center rounded-full bg-slate-800/80 border border-slate-700 p-0.5">
          <button
            className={`px-3 py-1.5 text-xs rounded-full transition ${
              viewMode === "learner"
                ? "bg-slate-900 text-teal-300"
                : "text-slate-400"
            }`}
            onClick={() => setViewMode("learner")}
          >
            Learner app
          </button>
          <button
            className={`px-3 py-1.5 text-xs rounded-full transition ${
              viewMode === "teacher"
                ? "bg-slate-900 text-teal-300"
                : "text-slate-400"
            }`}
            onClick={() => setViewMode("teacher")}
          >
            Teacher / School dashboard
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
      <div className="w-full max-w-sm bg-slate-950 rounded-[32px] shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Status Bar / Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
          <span className="text-xs text-slate-400 font-medium">
            Ecoschoolia
          </span>
          <span className="text-xs text-slate-400">AI • 3D Virtual School</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-4 space-y-4">
          {activeTab === "home" && <LearnerHome />}
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

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Hero Card */}
      <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 border-none text-white">
        <CardHeader className="pb-2">
          <p className="text-xs uppercase tracking-wide text-emerald-100/90">
            Hello, {learnerName} 👋
          </p>
          <CardTitle className="text-xl font-semibold">
            {learnerGrade} • {learnerLevel}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-xs text-emerald-100/90 mb-3">Today&apos;s focus:</p>
          <p className="text-sm font-medium mb-4">{todayFocus}</p>
          <div className="flex items-center justify-between gap-2">
            <Button className="bg-slate-950/80 hover:bg-slate-950 text-xs rounded-full px-4">
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
        <QuickAction
          label="Assignments"
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <QuickAction label="Badges" icon={<Trophy className="w-4 h-4" />} />
        <QuickAction label="Profile" icon={<User className="w-4 h-4" />} />
      </div>

      {/* Recommended by AI */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
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
              className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/80 transition-colors"
            >
              <CardContent className="py-3 px-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-100 mb-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
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
                  <div className="flex flex-col items-end justify-between gap-2">
                    <DifficultyDots level={item.difficulty} />
                    <Button className="rounded-full text-[11px] px-3 h-7">
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    },
    {
      id: 2,
      name: "Story Realm",
      description: "Reading, writing, drama & creativity.",
      competencies: ["Communication", "Creativity"],
    },
    {
      id: 3,
      name: "Eco Planet",
      description: "Environment, climate action & responsibility.",
      competencies: ["Citizenship", "Collaboration"],
    },
    {
      id: 4,
      name: "Money City",
      description: "Budgeting, saving & real-life maths.",
      competencies: ["Financial Literacy", "Self-Efficacy"],
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
          <Button className="w-full rounded-full text-xs mb-1">
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
            <Card className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/80 cursor-pointer">
              <CardContent className="py-3 px-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-white" />
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
      <h2 className="text-sm font-semibold text-slate-100">
        My Assignments 📚
      </h2>
      <p className="text-[11px] text-slate-400 mb-1">
        Keep track of what&apos;s due and what you&apos;ve submitted.
      </p>

      <div className="space-y-2">
        {assignments.map((a) => (
          <Card
            key={a.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/80"
          >
            <CardContent className="py-3 px-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-100 mb-1">
                  {a.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  Due: <span className="font-medium">{a.dueIn}</span>
                </p>
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
      <Card className="bg-slate-900/80 border border-slate-700">
        <CardContent className="py-4 px-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {learnerName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {learnerName}
            </p>
            <p className="text-[11px] text-slate-400">{learnerGrade}</p>
            <p className="text-[11px] text-teal-300 flex items-center gap-1 mt-1">
              <Star className="w-3 h-3" />
              Level: {learnerLevel}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Competencies */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-200">
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
      <aside className="hidden md:flex md:flex-col col-span-3 lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-3 gap-2">
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-slate-900/80">
          <LayoutDashboard className="w-4 h-4 text-teal-300" />
          <span className="text-xs font-medium">Dashboard</span>
        </div>
        <NavItem icon={<School className="w-4 h-4" />} label="Classes" />
        <NavItem icon={<Users className="w-4 h-4" />} label="Learners" />
        <NavItem icon={<ClipboardList className="w-4 h-4" />} label="Assignments" />
        <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytics & AI" />
        <NavItem icon={<MessageCircle className="w-4 h-4" />} label="Communication" />
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
              <span className="text-[11px] text-slate-400">3D Virtual School</span>
            </CardHeader>
            <CardContent className="pt-1 space-y-2 text-[11px]">
              <InsightItem
                grade="Grade 6"
                issue="Many learners struggle with Fractions."
                suggestion="Assign Fractions Mission in the 3D Virtual School & schedule 20 min revision."
              />
              <InsightItem
                grade="Grade 4"
                issue="Strong in Reading, weaker in Composition."
                suggestion="Use Story Realm writing quests twice this week."
              />
              <InsightItem
                grade="Grade 8"
                issue="Engagement drops after 10 min in Science videos."
                suggestion="Split long videos into shorter clips and add quick quizzes."
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
                  <th className="text-left py-2 pr-3 font-normal">Engagement</th>
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
    teal: "from-teal-500/20 to-emerald-500/10 text-teal-300",
    amber: "from-amber-500/20 to-orange-500/10 text-amber-300",
    sky: "from-sky-500/20 to-cyan-500/10 text-sky-300",
  };
  return (
    <Card className={`bg-gradient-to-br ${toneMap[tone]} border-slate-800`}>
      <CardContent className="px-4 py-3">
        <p className="text-[11px] text-slate-200/80 mb-1">{label}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{value}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/40 border border-slate-700">
            {badge}
          </span>
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
    <div className="border-t border-slate-800 bg-slate-950/90 backdrop-blur px-2 py-1">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl text-[10px] transition-all ${
                isActive
                  ? "bg-slate-800 text-teal-300"
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
  <button className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-200 py-2 hover:border-teal-500/80 transition-colors">
    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

const DifficultyDots: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= level ? "bg-amber-400" : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
};

export default App;
