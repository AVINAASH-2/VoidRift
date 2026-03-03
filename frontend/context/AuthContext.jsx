"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if user is logged in
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = Cookies.get("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Backend returns the user object directly for /me
            if (res.data) {
                setUser(res.data);
            } else {
                Cookies.remove("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            Cookies.remove("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                { email, password }
            );

            if (res.data.success) {
                Cookies.set("token", res.data.token, { expires: 7 }); // Expires in 7 days
                // Backend returns user fields at top level
                const userData = {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    avatar: res.data.avatar
                };
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Login failed",
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                { username, email, password }
            );

            if (res.data.success) {
                Cookies.set("token", res.data.token, { expires: 7 });
                // Backend returns user fields at top level
                const userData = {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    avatar: res.data.avatar
                };
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            console.error("Register error:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Registration failed",
            };
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
