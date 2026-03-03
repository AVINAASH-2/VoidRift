"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import LikeDislike from "@/components/LikeDislike";
import SaveButton from "@/components/SaveButton";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import ReportModal from "@/components/ReportModal";

// Module-level set to prevent double-counting in React Strict Mode (Development)
const viewedSession = new Set();

// ... existing code

export default function WatchPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchVideo(id);
            incrementView(id);
        }
    }, [id]);

    const incrementView = async (videoId) => {
        // Prevent double counting in this session (fixes React Strict Mode +2 issue)
        if (viewedSession.has(videoId)) return;

        viewedSession.add(videoId);

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/view`);
            // We don't strictly need to update state here as fetchVideo gets the authoritative count
            // unless we want instant update. Let's rely on fetchVideo or optimistic update if needed.
            // Actually, if we want to show the NEW count, we should update state.
            setVideo(prev => prev ? { ...prev, views: prev.views + 1 } : null);
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    };

    const fetchVideo = async (videoId) => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}`
            );
            if (res.data.success) {
                setVideo(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;

        try {
            const token = Cookies.get("token");
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Video deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error(error.response?.data?.error || "Failed to delete video");
        }
    };

    const handleReport = async (reason) => {
        try {
            const token = Cookies.get("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/report`,
                { reason },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Video reported. Thank you for your feedback.");
        } catch (error) {
            console.error("Error reporting video:", error);
            toast.error(error.response?.data?.error || "Failed to report video");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-white">Loading video...</div>;
    }

    if (!video) {
        return <div className="p-8 text-center text-white">Video not found</div>;
    }

    const isOwner = user && video.uploader && user._id === video.uploader._id;

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8 max-w-[1800px] mx-auto text-white relative">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px]" />
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
                title="Report Transmission"
            />

            {/* Main Content */}
            <div className="flex-1 lg:max-w-[1280px] z-10">
                {/* Video Player Container - Theater Mode */}
                <div className="relative group mb-6">
                    {/* Ambient Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>

                    <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10 rift-border">
                        {video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") ? (
                            <iframe
                                src={video.videoUrl}
                                title={video.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                src={video.videoUrl}
                                poster={video.thumbnailUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </div>

                {/* Video Info Card */}
                <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                    <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight text-glow">
                        {video.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-6">
                        {/* Uploader Info */}
                        <div className="flex items-center gap-4">
                            <div className="relative p-0.5 rounded-full bg-gradient-to-r from-primary to-secondary">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-black ring-2 ring-black">
                                    <img
                                        src={video.uploader?.avatar || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                                        alt={video.uploader?.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg hover:text-primary transition-colors cursor-pointer tracking-wide flex items-center gap-2">
                                    {video.uploader?.username}
                                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                </h3>
                                <p className="text-xs text-gray-400 font-mono tracking-widest uppercase text-secondary/80">Net Linked // 1.2M Subs</p>
                            </div>
                            <button className="ml-4 px-6 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300">
                                Connect
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="bg-[#0A0A0F]/50 rounded-full p-1.5 flex items-center gap-1 border border-white/5 shadow-inner">
                                <LikeDislike
                                    videoId={video._id}
                                    initialLikes={video.likes}
                                    initialDislikes={video.dislikes}
                                />
                            </div>

                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0F]/50 hover:bg-white/5 rounded-full transition-all duration-300 border border-white/5 hover:border-white/20 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-primary transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                                <span className="text-sm font-medium">Share Transmission</span>
                            </button>

                            <SaveButton videoId={video._id} />

                            {isOwner ? (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-all border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    <span className="text-sm font-medium">Purge</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast.error("Please login to report");
                                            return;
                                        }
                                        setShowReportModal(true);
                                    }}
                                    className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                    title="Report"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description Box */}
                    <div className="bg-[#0A0A0F]/40 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors group">
                        <div className="flex gap-4 text-sm font-bold mb-3 text-gray-400 font-mono">
                            <span className="text-white bg-white/10 px-2 py-0.5 rounded flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {video.views} INTERACTIONS
                            </span>
                            <span className="text-gray-600">|</span>
                            <span>
                                {formatDistanceToNow(new Date(video.createdAt), {
                                    addSuffix: true,
                                }).toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap text-gray-300 group-hover:text-white transition-colors leading-relaxed font-light">
                            {video.description}
                        </p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <CommentSection videoId={video._id} />
                </div>
            </div>

            {/* Sidebar (Recommendations) */}
            <div className="lg:w-[380px] xl:w-[420px] flex-shrink-0 z-10">
                <h3 className="text-xl font-heading font-bold mb-6 px-2 text-glow flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Incoming Feeds
                </h3>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="flex gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-[1.02]">
                            <div className="relative w-44 h-28 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg">
                                <img src={`https://picsum.photos/seed/${item + 120}/320/180`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="thumbnail" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold rounded text-white backdrop-blur-sm font-mono border border-white/10">10:05</span>
                            </div>
                            <div className="flex flex-col gap-1 pr-2 pt-1">
                                <h4 className="font-bold text-sm line-clamp-2 leading-tight text-gray-200 group-hover:text-primary transition-colors text-glow">
                                    Suggested Stream {item} - Neural Link
                                </h4>
                                <p className="text-xs text-gray-400 font-medium hover:text-white transition-colors">Channel {item}</p>
                                <div className="flex gap-1 text-[10px] text-gray-500 uppercase tracking-wide font-mono mt-1">
                                    <span>50K views</span>
                                    <span>•</span>
                                    <span>2 days ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
