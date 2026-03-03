"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { FaUserAstronaut, FaSignal, FaLink } from "react-icons/fa";

export default function ChannelPage({ params }) {
    const { id } = use(params);
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchChannelData();
        }
    }, [id]);

    const fetchChannelData = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`);
            if (res.data.success) {
                setProfile(res.data.data.user);
                setVideos(res.data.data.videos);
            }
        } catch (error) {
            console.error("Error fetching channel:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-500 font-mono text-sm tracking-[0.3em]">Syncing User Frequencies...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-2xl font-heading font-bold text-gray-400 uppercase tracking-widest">Neural Link Severed</h1>
                <p className="text-gray-600 mt-4 font-mono">User identity not found in this sector of the void.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Dynamic Header/Banner */}
            <div className="relative h-48 md:h-72 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-black to-secondary/20 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent"></div>

                {/* Visual Glitch Lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="h-px w-full bg-primary absolute top-1/4 animate-pulse"></div>
                    <div className="h-px w-full bg-secondary absolute top-3/4 animate-pulse"></div>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 md:px-12 -mt-16 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                    {/* Avatar with Glow */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500"></div>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black bg-[#0A0A0F] overflow-hidden relative z-10 ring-2 ring-white/10">
                            <img
                                src={profile.avatar}
                                alt={profile.username}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-widest text-glow uppercase">
                                {profile.username}
                            </h1>
                            <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                Verified Agent
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-mono tracking-wider">
                            <div className="flex items-center gap-2">
                                <FaSignal className="text-secondary text-xs" />
                                <span>{videos.length} RECEPTIONS</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUserAstronaut className="text-primary text-xs" />
                                <span>12.4K NEURAL LINKS</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-4 mb-2">
                        {currentUser?._id === profile._id ? (
                            <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all hover:border-primary/50">
                                Edit Identity
                            </button>
                        ) : (
                            <button className="px-10 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] transform hover:scale-105 flex items-center gap-3">
                                <FaLink className="text-sm" />
                                <span>Establish Link</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Tabs (Simplified for now) */}
                <div className="flex gap-10 border-b border-white/5 pb-4 mb-10 overflow-x-auto scrollbar-hide">
                    {["TRANSMISSIONS", "DATA REELS", "COMMUNITY NODES", "STORAGE"].map((tab, i) => (
                        <button
                            key={tab}
                            className={`text-xs font-mono font-bold tracking-[0.2em] transition-all relative ${i === 0 ? "text-primary" : "text-gray-500 hover:text-white"}`}
                        >
                            {tab}
                            {i === 0 && <div className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(139,92,246,1)]"></div>}
                        </button>
                    ))}
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass-card rounded-3xl border-dashed border-2 border-white/5">
                            <div className="text-6xl mb-4 opacity-20">🕳️</div>
                            <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Void Storage Empty</h2>
                            <p className="text-gray-600 mt-2 font-mono text-sm italic">This agent has not released any transmissions to the void yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
