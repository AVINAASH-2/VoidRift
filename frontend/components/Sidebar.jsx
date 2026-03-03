"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaFire, FaHistory, FaThumbsUp } from "react-icons/fa";

const linkItems = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "Trending", href: "/feed/trending", icon: FaFire },
    { name: "History", href: "/feed/history", icon: FaHistory },
    { name: "Liked Videos", href: "/playlist/liked", icon: FaThumbsUp },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-20 lg:w-64 h-[calc(100vh-90px)] fixed left-4 top-[85px] glass-card rounded-2xl overflow-hidden border border-white/5 bg-[#0A0A0F]/60 backdrop-blur-md z-40 transition-all duration-300 group/sidebar hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <div className="flex flex-col py-6 space-y-2">
                {linkItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 lg:px-6 py-3.5 mx-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group ${isActive
                                ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-primary/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`relative p-1 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : ""}`}>
                                <item.icon className="text-xl relative z-10" />
                                {isActive && <div className="absolute inset-0 bg-primary/40 blur-md rounded-full"></div>}
                            </div>

                            <span className="hidden lg:block tracking-wide opacity-0 lg:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {item.name}
                            </span>

                            {/* Hover Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto px-6 pb-6 text-xs text-gray-600 hidden lg:block text-center">
                <p className="font-mono tracking-widest text-[10px]">VOID SYSTEM v2.0</p>
            </div>
        </aside>
    );
}
