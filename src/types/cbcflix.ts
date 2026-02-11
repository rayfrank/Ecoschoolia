// src/types/cbcflix.ts
export interface CbcflixItem {
    id: string;
    title: string;
    subject: string;
    grade: string;
    duration: string;
    thumbnailUrl: string;
    videoUrl: string;
    tags: string[];
    createdAt: number | any; // Firestore timestamp, we can be loose here
}
