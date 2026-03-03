"use client";

import { useState, useEffect } from "react";
import { BiListPlus, BiCheck } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function SaveButton({ videoId }) {
    const { user, checkAuth } = useAuth(); // We might need checkAuth to refresh user state
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user && user.savedVideos) {
            setSaved(user.savedVideos.includes(videoId));
        }
    }, [user, videoId]);

    const handleSave = async () => {
        if (!user) {
            toast.error("Please login to save videos");
            return;
        }

        try {
            setSaved(!saved); // Optimistic

            const token = Cookies.get("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/saved/${videoId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Ideally we should update the auth context user state here without a full reload
            // For now, let's just trigger a re-check to keep it in sync eventually
            checkAuth();

            toast.success(saved ? "Removed from saved videos" : "Saved to playlist");
        } catch (error) {
            console.error(error);
            setSaved(!saved); // Revert
            toast.error("Failed to update saved videos");
        }
    };

    return (
        <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#222] hover:bg-[#333] rounded-full transition-colors ml-2"
        >
            {saved ? <BiCheck size={20} /> : <BiListPlus size={20} />}
            <span className="text-sm font-medium">{saved ? "Saved" : "Save"}</span>
        </button>
    );
}
