import type { CbcflixItem } from "../types/cbcflix";

export const DEMO_LIBRARY_KEY = "ecoschoolia.demo.library";
export const DEMO_LIBRARY_VERSION_KEY = "ecoschoolia.demo.library.version";
export const DEMO_USER_KEY = "ecoschoolia.demo.user";
export const DEMO_ASSIGNMENTS_KEY = "ecoschoolia.demo.assignments";
export const DEMO_STATS_KEY = "ecoschoolia.demo.stats";
export const DEMO_LIBRARY_VERSION = "2";

export interface DemoAssignment {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: "Not started" | "In progress" | "Ready to submit" | "Submitted";
  score: string;
  prompt: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  answers?: number[];
}

export interface DemoStats {
  videosWatched: number;
  missionsCompleted: number;
}

export const sampleVideoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];

export const starterVideos: CbcflixItem[] = [
  {
    id: "fractions-quest",
    title: "Fractions Quest - Episode 1",
    subject: "Mathematics",
    grade: "Grade 5 to 7",
    duration: "12 min",
    thumbnailUrl: "",
    videoUrl: sampleVideoUrls[0],
    sourceUrl: sampleVideoUrls[0],
    tags: ["fractions", "cbc", "math"],
    description: "Learn how to add and compare fractions using simple visual models.",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "water-cycle-lab",
    title: "Water Cycle Lab Adventure",
    subject: "Science",
    grade: "Grade 4 to 6",
    duration: "10 min",
    thumbnailUrl: "",
    videoUrl: sampleVideoUrls[1],
    sourceUrl: sampleVideoUrls[1],
    tags: ["science", "water cycle", "quiz"],
    description: "Follow evaporation, condensation and rainfall through a school lab story.",
    createdAt: "2026-03-02T08:00:00.000Z",
  },
  {
    id: "composition-masterclass",
    title: "How to Start a Great Composition",
    subject: "English",
    grade: "Grade 6 to 8",
    duration: "8 min",
    thumbnailUrl: "",
    videoUrl: sampleVideoUrls[2],
    sourceUrl: sampleVideoUrls[2],
    tags: ["writing", "language", "story"],
    description: "Build stronger hooks and topic sentences for compositions.",
    createdAt: "2026-03-03T08:00:00.000Z",
  },
  {
    id: "password-safety",
    title: "Cyber-Safe Kid - Passwords",
    subject: "Digital Literacy",
    grade: "Grade 5 to 8",
    duration: "11 min",
    thumbnailUrl: "",
    videoUrl: sampleVideoUrls[0],
    sourceUrl: sampleVideoUrls[0],
    tags: ["safety", "passwords", "digital"],
    description: "Understand how strong passwords and privacy choices keep learners safe online.",
    createdAt: "2026-03-04T08:00:00.000Z",
  },
  {
    id: "budget-challenge",
    title: "Budget Challenge - Smart Spending",
    subject: "Life Skills",
    grade: "Grade 6 to 8",
    duration: "9 min",
    thumbnailUrl: "",
    videoUrl: sampleVideoUrls[1],
    sourceUrl: sampleVideoUrls[1],
    tags: ["budget", "money", "project"],
    description: "Plan a simple budget and separate needs from wants.",
    createdAt: "2026-03-05T08:00:00.000Z",
  },
];

export const loadDemoLibrary = (): CbcflixItem[] => {
  if (typeof window === "undefined") {
    return starterVideos;
  }

  const version = window.localStorage.getItem(DEMO_LIBRARY_VERSION_KEY);
  const raw = window.localStorage.getItem(DEMO_LIBRARY_KEY);
  if (!raw || version !== DEMO_LIBRARY_VERSION) {
    window.localStorage.setItem(DEMO_LIBRARY_VERSION_KEY, DEMO_LIBRARY_VERSION);
    window.localStorage.setItem(DEMO_LIBRARY_KEY, JSON.stringify(starterVideos));
    return starterVideos;
  }

  try {
    const parsed = JSON.parse(raw) as CbcflixItem[];
    return parsed.length > 0 ? parsed : starterVideos;
  } catch {
    window.localStorage.setItem(DEMO_LIBRARY_VERSION_KEY, DEMO_LIBRARY_VERSION);
    window.localStorage.setItem(DEMO_LIBRARY_KEY, JSON.stringify(starterVideos));
    return starterVideos;
  }
};

export const saveDemoLibrary = (items: CbcflixItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_LIBRARY_KEY, JSON.stringify(items));
  window.localStorage.setItem(DEMO_LIBRARY_VERSION_KEY, DEMO_LIBRARY_VERSION);
};

const starterAssignments: DemoAssignment[] = [
  {
    id: "a1",
    title: "Math - Fractions Sprint",
    subject: "Mathematics",
    due: "Today",
    status: "Ready to submit",
    score: "92%",
    prompt: "Complete the fractions checkpoint before afternoon prep.",
    questions: [
      { id: "q1", question: "What is 1/2 + 1/4?", options: ["2/6", "3/4", "1/6"], correctIndex: 1, explanation: "Convert to quarters first: 2/4 + 1/4 = 3/4." },
      { id: "q2", question: "Which fraction is equivalent to 3/6?", options: ["1/2", "2/3", "3/5"], correctIndex: 0, explanation: "Divide numerator and denominator by 3." },
    ],
    answers: [1, 0],
  },
  {
    id: "a2",
    title: "Science - Water Cycle Quiz",
    subject: "Science",
    due: "Tomorrow",
    status: "In progress",
    score: "64%",
    prompt: "Use the video recap and answer both science questions.",
    questions: [
      { id: "q1", question: "Which process turns liquid water into vapor?", options: ["Condensation", "Evaporation", "Collection"], correctIndex: 1, explanation: "Heat causes evaporation." },
      { id: "q2", question: "Clouds form mainly because of:", options: ["Evaporation", "Condensation", "Runoff"], correctIndex: 1, explanation: "Water vapor cools and condenses into droplets." },
    ],
    answers: [1, -1],
  },
  {
    id: "a3",
    title: "English - Composition Hook",
    subject: "English",
    due: "2 days",
    status: "Not started",
    score: "-",
    prompt: "Choose the strongest opening ideas for a composition.",
    questions: [
      { id: "q1", question: "Which opening is strongest?", options: ["I woke up.", "The market exploded with color before sunrise.", "It was good."], correctIndex: 1, explanation: "Strong hooks are vivid and specific." },
      { id: "q2", question: "A hook should make the reader want to:", options: ["Stop reading", "Ask questions", "Skip ahead"], correctIndex: 1, explanation: "Good openings create curiosity." },
    ],
    answers: [-1, -1],
  },
  {
    id: "a4",
    title: "Digital Safety Poster",
    subject: "Digital Literacy",
    due: "4 days",
    status: "Submitted",
    score: "88%",
    prompt: "Review the cyber-safety poster checklist.",
    questions: [
      { id: "q1", question: "A strong password should include:", options: ["Your name only", "Mixed characters and numbers", "Your birth year"], correctIndex: 1, explanation: "Mixed characters are harder to guess." },
      { id: "q2", question: "You should share passwords with:", options: ["Friends", "Nobody except trusted guardian/teacher when required", "Anyone online"], correctIndex: 1, explanation: "Passwords should stay private." },
    ],
    answers: [1, 1],
  },
];

export const loadDemoAssignments = (): DemoAssignment[] => {
  if (typeof window === "undefined") {
    return starterAssignments;
  }

  const raw = window.localStorage.getItem(DEMO_ASSIGNMENTS_KEY);
  if (!raw) {
    window.localStorage.setItem(DEMO_ASSIGNMENTS_KEY, JSON.stringify(starterAssignments));
    return starterAssignments;
  }

  try {
    const parsed = JSON.parse(raw) as DemoAssignment[];
    return parsed.length > 0 ? parsed : starterAssignments;
  } catch {
    window.localStorage.setItem(DEMO_ASSIGNMENTS_KEY, JSON.stringify(starterAssignments));
    return starterAssignments;
  }
};

export const saveDemoAssignments = (items: DemoAssignment[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_ASSIGNMENTS_KEY, JSON.stringify(items));
};

export const loadDemoStats = (): DemoStats => {
  if (typeof window === "undefined") {
    return { videosWatched: 14, missionsCompleted: 5 };
  }

  const raw = window.localStorage.getItem(DEMO_STATS_KEY);
  if (!raw) {
    const initialStats = { videosWatched: 14, missionsCompleted: 5 };
    window.localStorage.setItem(DEMO_STATS_KEY, JSON.stringify(initialStats));
    return initialStats;
  }

  try {
    return JSON.parse(raw) as DemoStats;
  } catch {
    const initialStats = { videosWatched: 14, missionsCompleted: 5 };
    window.localStorage.setItem(DEMO_STATS_KEY, JSON.stringify(initialStats));
    return initialStats;
  }
};

export const saveDemoStats = (stats: DemoStats) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_STATS_KEY, JSON.stringify(stats));
};
