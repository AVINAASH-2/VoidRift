import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VoidRifts",
  description: "Where Content Breaks Through",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-24">
              <Sidebar />
              <main className="flex-1 overflow-y-auto h-[calc(100vh-96px)] md:ml-28 lg:ml-72 transition-all duration-300">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
