"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import FilterBar from "@/components/FilterBar";
import axios from "axios";

export default function HomeContent() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    useEffect(() => {
        fetchVideos();
    }, [category]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/api/videos`;
            if (category && category !== "All") {
                url += `?category=${category}`;
            }

            const res = await axios.get(url);
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Hero Section - Only show when no category selected or "All" */}
            {(!category || category === "All") && (
                <div className="relative w-full h-[60vh] rounded-[2rem] overflow-hidden group border border-white/5 shadow-2xl">
                    {/* Background Video/Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop"
                            alt="Void Hero"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 max-w-4xl flex flex-col justify-end h-full">
                        <div className="animate-fade-in-up">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Live Transmission
                            </span>
                            <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tighter text-glow drop-shadow-2xl">
                                BREAK THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">VOID</span>
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed font-light border-l-2 border-primary/50 pl-6">
                                Enter the rift. Discover content that defies reality. The next generation of streaming is here.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-3 group">
                                    <span>Enter Rift</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                                <button className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 hover:border-white/30">
                                    View System Logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="sticky top-0 bg-[#09090b]/95 backdrop-blur-md z-30 pt-4 pb-2 -mx-6 px-6 md:-mx-8 md:px-8 border-b border-white/5">
                <FilterBar />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-6xl mb-4 opacity-20">📡</div>
                            <h2 className="text-xl font-bold text-gray-500">No signals found</h2>
                            <p className="text-gray-600 mt-2">Try adjusting your sensors (filters).</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
