"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await login(email, password);

        if (res.success) {
            toast.success("Logged in successfully");
            router.push("/");
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center relative overflow-hidden">
            {/* Background blobs for login page specifically */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 m-4 rift-border">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/50 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-widest text-glow uppercase">VoidRifts Access</h1>
                    <p className="text-gray-400 font-mono text-sm"> Authenticate to breach the void.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="flex items-center justify-between text-sm">
                        <Link
                            href="/forgot-password"
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            Lost access key?
                        </Link>
                    </div>

                    <div className="space-y-6 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0f0f0f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:scale-[1.02]"
                        >
                            {loading ? "Authenticating..." : "Initialize Session"}
                        </button>

                        <div className="text-center text-sm text-gray-500">
                            New to the network?{" "}
                            <Link
                                href="/register"
                                className="text-white hover:text-primary font-bold transition-colors ml-1"
                            >
                                Register Identity
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
