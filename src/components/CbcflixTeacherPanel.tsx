import React, { useState } from "react";
import type { FirebaseError } from "firebase/app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, isFirebaseConfigured, storage } from "../firebase";
import { loadDemoLibrary, sampleVideoUrls, saveDemoLibrary } from "../lib/demoData";
import type { CbcflixItem } from "../types/cbcflix";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui";

const CbcflixTeacherPanel: React.FC = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Digital Literacy");
  const [grade, setGrade] = useState("Grade 7");
  const [duration, setDuration] = useState("10 min");
  const [tags, setTags] = useState("cbc,video");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pushDemoLesson = (item: CbcflixItem) => {
    const current = loadDemoLibrary();
    saveDemoLibrary([item, ...current]);
    window.dispatchEvent(new Event("ecoschoolia:library-updated"));
  };

  const addDemoLesson = () => {
    const item: CbcflixItem = {
      id: `demo-${Date.now()}`,
      title: title || "Teacher Demo Lesson",
      subject,
      grade,
      duration,
      thumbnailUrl: "",
      videoUrl: sampleVideoUrls[Date.now() % sampleVideoUrls.length],
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    pushDemoLesson(item);
    setTitle("");
    setDuration("10 min");
    setTags("cbc,video");
    setMessage("Demo lesson added to CBCflix.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      setMessage("Title is required.");
      return;
    }

    if (!isFirebaseConfigured || !db || !storage) {
      addDemoLesson();
      return;
    }

    if (!thumbFile || !videoFile) {
      setMessage("Thumbnail and video are required for live Firebase uploads.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const thumbRef = ref(storage, `cbcflix/thumbnails/${Date.now()}_${thumbFile.name}`);
      await uploadBytes(thumbRef, thumbFile);
      const thumbnailUrl = await getDownloadURL(thumbRef);

      const videoRef = ref(storage, `cbcflix/videos/${Date.now()}_${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
      const videoUrl = await getDownloadURL(videoRef);

      await addDoc(collection(db, "cbcflix"), {
        title,
        subject,
        grade,
        duration,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        thumbnailUrl,
        videoUrl,
        createdAt: serverTimestamp(),
      });

      setMessage("Content uploaded to CBCflix.");
      setTitle("");
      setDuration("10 min");
      setTags("cbc,video");
      setThumbFile(null);
      setVideoFile(null);
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setMessage(firebaseError.message || "Upload failed. Falling back to demo mode.");
      addDemoLesson();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 border-slate-800 bg-slate-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">CBCflix Library - Teacher Studio</CardTitle>
        <p className="text-[11px] text-slate-400">
          For the pitch, this works in demo mode even without Firebase. New lessons appear instantly.
        </p>
      </CardHeader>
      <CardContent className="pt-1">
        <form onSubmit={handleSubmit} className="space-y-3 text-[11px]">
          <div>
            <label className="mb-1 block text-slate-300">Title</label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Safe Passwords Mission"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-slate-300">Subject</label>
              <select className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option>Digital Literacy</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Life Skills</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-slate-300">Grade</label>
              <select className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1" value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-slate-300">Duration</label>
              <input className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Tags</label>
            <input className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          {isFirebaseConfigured && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-slate-300">Thumbnail (image)</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} className="w-full text-[11px]" />
              </div>
              <div>
                <label className="mb-1 block text-slate-300">Video file</label>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} className="w-full text-[11px]" />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <Button type="submit" className="rounded-full px-4 py-1.5 text-[11px]" disabled={loading}>
              {loading ? "Publishing..." : isFirebaseConfigured ? "Publish lesson" : "Add demo lesson"}
            </Button>
            {message && <p className="max-w-xs text-[11px] text-slate-400">{message}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CbcflixTeacherPanel;
