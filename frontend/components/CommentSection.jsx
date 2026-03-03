"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// ... imports
import ReportModal from "@/components/ReportModal";

export default function CommentSection({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    useEffect(() => {
        if (videoId) {
            fetchComments();
        }
    }, [videoId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${videoId}`
            );
            if (res.data.success) {
                setComments(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            toast.error("Please login to comment");
            return;
        }

        try {
            const token = Cookies.get("token");
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${videoId}`,
                { text: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                setComments([res.data.data, ...comments]);
                setNewComment("");
                toast.success("Comment added");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to add comment");
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const token = Cookies.get("token");
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setComments(comments.filter((c) => c._id !== commentId));
            toast.success("Comment deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete comment");
        }
    };

    const handleReportClick = (commentId) => {
        if (!user) {
            toast.error("Please login to report");
            return;
        }
        setSelectedCommentId(commentId);
        setReportModalOpen(true);
    };

    const handleReportSubmit = async (reason) => {
        try {
            const token = Cookies.get("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${selectedCommentId}/report`,
                { reason },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Comment reported");
        } catch (error) {
            console.error("Error reporting comment:", error);
            toast.error(error.response?.data?.error || "Failed to report comment");
        }
    };

    return (
        <div className="mt-6">
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => {
                    setReportModalOpen(false);
                    setSelectedCommentId(null);
                }}
                onSubmit={handleReportSubmit}
                title="Report Comment"
            />

            <h3 className="text-xl font-heading font-bold mb-6 text-white text-glow flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                {comments.length} TRANSMISSIONS SOURCE
            </h3>

            {/* Add Comment Form */}
            {/* ... keep existing form ... */}
            <div className="flex gap-4 mb-10 group">
                {user ? (
                    <>
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 group-focus-within:border-primary transition-all duration-300">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black animate-pulse"></div>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Enter your transmission..."
                                    className="w-full bg-black/40 border-b-2 border-white/5 py-3 px-1 focus:border-primary focus:outline-none transition-all duration-500 text-white placeholder-gray-600 font-sans"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-focus-within:w-full"></div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transform hover:scale-[1.02]"
                                >
                                    Transmit
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-gray-400 font-mono text-sm">
                            <Link href="/login" className="text-primary hover:text-glow font-bold transition-all">
                                [ AUTHENTICATE ]
                            </Link>{" "}
                            to sync with the feed.
                        </p>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                                src={comment.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"}
                                alt={comment.user?.username || "Deleted User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                    @{comment.user?.username || "Deleted User"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-200">{comment.text}</p>

                            <div className="flex gap-4 mt-3">
                                {user && user._id === comment.user?._id ? (
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="text-xs font-mono font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-tighter"
                                    >
                                        [ PURGE ]
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReportClick(comment._id)}
                                        className="text-xs font-mono font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-tighter"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                        </svg>
                                        Report Signal
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
