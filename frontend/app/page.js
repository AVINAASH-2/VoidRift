import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-white">Initialize Void...</div>}>
      <HomeContent />
    </Suspense>
  );
}
