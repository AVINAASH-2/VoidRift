"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function ReportModal({ isOpen, onClose, onSubmit, title = "Report Content" }) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(reason);
        setReason("");
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
            {/* Ambient background glow inside modal overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 m-4 rift-border shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white tracking-wider uppercase text-glow">{title}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono font-bold text-gray-400 mb-3 uppercase tracking-[0.2em]">
                            Transmission Anomaly Details
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Identify the breach (e.g., spam, hostility, cognitive hazard)..."
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none font-sans text-sm"
                            required
                        />
                    </div>

                    <div className="flex gap-4 items-center pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
