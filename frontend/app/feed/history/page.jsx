"use client";

import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { FaHistory } from "react-icons/fa";
import Cookies from "js-cookie";

export default function HistoryPage() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!Cookies.get("token")) {
            setLoading(false);
            return;
        }

        try {
            const token = Cookies.get("token");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user && !loading) {
        return <div className="p-8 text-center text-white">Please login to view history.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Watch History</h1>
            </div>

            {loading ? (
                <div className="text-white text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {videos.length > 0 ? videos.map((video) => (
                        video ? <VideoCard key={video._id} video={video} /> : null
                    )) : (
                        <p className="text-gray-500">No watch history found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
