"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import axios from "axios";

function SearchContent() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos?search=${query}`);
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 md:p-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <p className="text-primary font-mono text-xs font-bold uppercase tracking-[0.3em] mb-3">Void Scan Result</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tighter text-glow">
                        IDENTIFIED: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">"{query}"</span>
                    </h1>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-gray-500 uppercase tracking-widest leading-none">
                    Frequencies Scanned: 1,244
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-mono text-sm animate-pulse uppercase tracking-widest">Reconstructing Data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-center glass-card rounded-[2rem] border-dashed border-2 border-white/5">
                            <div className="text-8xl mb-6 opacity-20 filter grayscale">📡</div>
                            <h2 className="text-2xl font-heading font-bold text-gray-400 mb-2 uppercase tracking-wide">Signal Lost</h2>
                            <p className="text-gray-600 max-w-sm">No transmissions match this frequency in the current sector of the void.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="p-12 text-center">
                <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                <div className="text-primary font-mono text-sm uppercase tracking-[0.5em] animate-pulse">Scanning Frequencies...</div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
