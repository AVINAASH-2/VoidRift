'use client';

import Link from 'next/link';
import { FaInfinity, FaSearch, FaUserCircle, FaBell, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${searchTerm}`);
        }
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 glass-nav fixed top-0 w-full z-50 text-foreground">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="relative p-2">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:bg-primary/50 transition-all duration-300 animate-pulse"></div>
                    <FaInfinity className="text-3xl text-primary relative z-10" />
                </div>
                <span className="text-2xl font-heading font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent group-hover:text-glow transition-all">
                    VoidRifts
                </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center w-1/3 max-w-xl">
                <form onSubmit={handleSearch} className="flex w-full items-center bg-[#0A0A0F]/80 border border-primary/20 rounded-full overflow-hidden focus-within:border-primary focus-within:box-glow transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <input
                        type="text"
                        placeholder="Search the Void..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-2.5 bg-transparent outline-none text-sm placeholder-gray-500 text-white font-sans"
                    />
                    <button type="submit" className="px-6 py-2.5 hover:bg-primary/20 border-l border-primary/20 transition-colors group">
                        <FaSearch className="text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-6">
                <Link href="/upload" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 hover:text-primary border border-primary/20 transition-all duration-300 font-medium text-sm group">
                    <FaUpload className="group-hover:scale-110 transition-transform" />
                    <span>Upload</span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-white/5 rounded-full">
                            <FaBell className="text-lg" />
                        </button>

                        <div className="relative">
                            <button
                                className="flex items-center gap-3 focus:outline-none"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 ring-2 ring-transparent hover:ring-primary/50 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-64 glass-card rounded-xl overflow-hidden py-2 text-sm z-50 rift-border">
                                    <div className="px-4 py-4 border-b border-white/5 mb-2 bg-gradient-to-r from-primary/10 to-transparent">
                                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Identity</p>
                                        <p className="font-bold text-white truncate text-lg">{user.username}</p>
                                    </div>
                                    <Link
                                        href={`/channel/${user._id}`}
                                        className="block px-4 py-2.5 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        My Channel
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2.5 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        System Settings
                                    </Link>
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-105">
                        <FaUserCircle className="text-lg" />
                        <span>Initialize</span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
