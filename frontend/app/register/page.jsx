"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await register(username, email, password);

        if (res.success) {
            toast.success("Account created successfully");
            router.push("/");
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center relative overflow-hidden">
            {/* Background blobs for register page specifically - slightly different positions */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 m-4 rift-border">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/50 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 012.654 15a17.968 17.968 0 01-1.272.164.75.75 0 01-.132.015h-.25z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-widest text-glow uppercase">Initialize Identity</h1>
                    <p className="text-gray-400 font-mono text-sm">Join the VoidRifts network.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                            placeholder="Agent Name"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                            placeholder="agent@nexus.com"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider"
                        >
                            Passcode
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-6 pt-2">
                        <div className="flex items-center justify-between pt-4">
                            <Link
                                href="/login"
                                className="text-white hover:text-primary font-bold transition-colors text-sm"
                            >
                                ← Back to Login
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0f0f0f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:scale-[1.02]"
                            >
                                {loading ? "Registering..." : "Create Identity"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
