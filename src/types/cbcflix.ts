import type { Timestamp } from "firebase/firestore";

export interface CbcflixItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  sourceUrl?: string;
  tags: string[];
  description?: string;
  createdAt: Timestamp | string | number | null;
}
