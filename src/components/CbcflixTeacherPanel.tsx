// src/components/CbcflixTeacherPanel.tsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent, Button } from "../components/ui";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !thumbFile || !videoFile) {
            setMessage("Title, thumbnail and video are required.");
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            // Upload thumbnail
            const thumbRef = ref(
                storage,
                `cbcflix/thumbnails/${Date.now()}_${thumbFile.name}`
            );
            await uploadBytes(thumbRef, thumbFile);
            const thumbnailUrl = await getDownloadURL(thumbRef);

            // Upload video
            const videoRef = ref(
                storage,
                `cbcflix/videos/${Date.now()}_${videoFile.name}`
            );
            await uploadBytes(videoRef, videoFile);
            const videoUrl = await getDownloadURL(videoRef);

            // Save metadata
            await addDoc(collection(db, "cbcflix"), {
                title,
                subject,
                grade,
                duration,
                tags: tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                thumbnailUrl,
                videoUrl,
                createdAt: serverTimestamp(),
            });

            setMessage("✅ Content uploaded to CBCflix.");
            setTitle("");
            setDuration("10 min");
            setTags("cbc,video");
            setThumbFile(null);
            setVideoFile(null);
            (document.getElementById("cbcflix-thumb") as HTMLInputElement).value = "";
            (document.getElementById("cbcflix-video") as HTMLInputElement).value = "";
        } catch (err) {
            console.error(err);
            setMessage("❌ Upload failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-slate-950 border-slate-800 mt-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">CBCflix Library – Upload</CardTitle>
                <p className="text-[11px] text-slate-400">
                    Upload lesson videos & resources. Think Netflix for CBC.
                </p>
            </CardHeader>
            <CardContent className="pt-1">
                <form onSubmit={handleSubmit} className="space-y-3 text-[11px]">
                    <div>
                        <label className="block mb-1 text-slate-300">Title</label>
                        <input
                            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-[11px]"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Digital Citizenship – Safe Passwords"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block mb-1 text-slate-300">Subject</label>
                            <select
                                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option>Digital Literacy</option>
                                <option>Mathematics</option>
                                <option>Science</option>
                                <option>English</option>
                                <option>Life Skills</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-300">Grade</label>
                            <select
                                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                            >
                                <option>Grade 4</option>
                                <option>Grade 5</option>
                                <option>Grade 6</option>
                                <option>Grade 7</option>
                                <option>Grade 8</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-300">Duration</label>
                            <input
                                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="10 min"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-slate-300">
                            Tags (comma-separated)
                        </label>
                        <input
                            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="cbc,digital literacy,passwords"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block mb-1 text-slate-300">
                                Thumbnail (image)
                            </label>
                            <input
                                id="cbcflix-thumb"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
                                className="w-full text-[11px]"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-300">Video file</label>
                            <input
                                id="cbcflix-video"
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                                className="w-full text-[11px]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <Button
                            type="submit"
                            className="text-[11px] px-4 py-1.5 rounded-full"
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Upload to CBCflix"}
                        </Button>
                        {message && (
                            <p className="text-[11px] text-slate-400 max-w-xs">{message}</p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CbcflixTeacherPanel;
