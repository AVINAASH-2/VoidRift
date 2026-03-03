"use client";

import { useState, useEffect } from "react";
import { BiSolidLike, BiLike, BiSolidDislike, BiDislike } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function LikeDislike({ videoId, initialLikes = [], initialDislikes = [] }) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);

    const userId = user?._id;
    const isLiked = userId && likes.includes(userId);
    const isDisliked = userId && dislikes.includes(userId);

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like videos");
            return;
        }

        try {
            // Optimistic update
            if (isLiked) {
                setLikes(prev => prev.filter(id => id !== userId));
            } else {
                setLikes(prev => [...prev, userId]);
                if (isDisliked) setDislikes(prev => prev.filter(id => id !== userId));
            }

            const token = Cookies.get("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update like");
            // Revert optimization on error (simplified for now)
        }
    };

    const handleDislike = async () => {
        if (!user) {
            toast.error("Please login to dislike videos");
            return;
        }

        try {
            // Optimistic update
            if (isDisliked) {
                setDislikes(prev => prev.filter(id => id !== userId));
            } else {
                setDislikes(prev => [...prev, userId]);
                if (isLiked) setLikes(prev => prev.filter(id => id !== userId));
            }

            const token = Cookies.get("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/dislike`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update dislike");
        }
    };

    return (
        <div className="flex items-center bg-[#222] rounded-full overflow-hidden">
            <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#333] border-r border-[#333] transition-colors"
            >
                {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                <span className="text-sm font-medium">{likes.length}</span>
            </button>
            <button
                onClick={handleDislike}
                className="px-4 py-2 hover:bg-[#333] transition-colors"
            >
                {isDisliked ? <BiSolidDislike size={20} /> : <BiDislike size={20} />}
            </button>
        </div>
    );
}
