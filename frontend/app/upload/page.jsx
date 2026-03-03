"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function UploadPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            toast.error("You must be logged in to upload videos");
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title || !description) return;

        setUploading(true);
        const toastId = toast.loading("Uploading video...");

        try {
            // 1. Upload video to Cloudinary via backend (or direct if configured, but user said backend auth is working)
            // The previous code used /api/upload.
            const formData = new FormData();
            formData.append("file", file);

            // We need to send the token if the upload endpoint is protected, or mostly just for the video metadata.
            // The user said "Video upload requires authentication".
            const token = Cookies.get("token");

            const uploadRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!uploadRes.data.success) {
                throw new Error(uploadRes.data.message || "Upload failed");
            }

            const videoUrl = uploadRes.data.data.secure_url;
            const thumbnailUrl = uploadRes.data.data.secure_url.replace(
                /\.[^/.]+$/,
                ".jpg"
            );

            // 2. Save video metadata to backend
            const videoRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos`,
                {
                    title,
                    description,
                    videoUrl,
                    thumbnailUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (videoRes.data.success) {
                toast.success("Video uploaded successfully!", { id: toastId });
                router.push("/");
            } else {
                throw new Error(videoRes.data.error || "Failed to save video metadata");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                "Error: " + (error.response?.data?.message || error.message),
                { id: toastId }
            );
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f0f0f] text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="max-w-2xl mx-auto p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
            <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center relative hover:border-gray-500 transition-colors">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <p className="text-blue-400">Selected: {file.name}</p>
                    ) : (
                        <div className="text-gray-400">
                            <p>Drag and drop video files here</p>
                            <p className="text-sm mt-2">or click to upload</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-300">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-700 bg-[#121212] p-2 rounded text-white focus:outline-none focus:border-blue-500"
                        placeholder="Video Title"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-300">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-700 bg-[#121212] p-2 rounded text-white focus:outline-none focus:border-blue-500"
                        rows="4"
                        placeholder="Video Description"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full bg-blue-600 text-white p-2 rounded font-medium ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload Video"}
                </button>
            </form>
        </div>
    );
}
