"use client";

import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import { FaFire } from "react-icons/fa";

export default function TrendingPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/trending`);
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching trending:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center">
                    <FaFire className="text-red-500 text-3xl" />
                </div>
                <h1 className="text-2xl font-bold text-white">Trending</h1>
            </div>

            {loading ? (
                <div className="text-white text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}
