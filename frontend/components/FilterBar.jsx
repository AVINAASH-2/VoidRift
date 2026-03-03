"use client";

import { useSearchParams, useRouter } from "next/navigation";

const categories = [
    "All",
    "Music",
    "Gaming",
    "News",
    "Sports",
    "Education",
    "Entertainment",
    "Technology",
    "Travel"
];
import { useState, useRef, useEffect } from "react"; // Added useState, useRef, useEffect

const FilterBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scrollRef = useRef(null); // Added scrollRef

    // Initialize selectedCategory from URL or default to "All"
    const initialCategory = searchParams.get("category") || "All";
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const categories = [
        "All", "Gaming", "Cyberpunk", "Tech", "Sci-Fi", "Music", "Live", "Space", "Coding", "AI", "Futurism", "Hardware", "Software"
    ];

    // Update URL when selectedCategory changes
    useEffect(() => {
        if (selectedCategory === "All") {
            router.push("/");
        } else {
            router.push(`/?category=${selectedCategory}`);
        }
    }, [selectedCategory, router]);

    // Update selectedCategory if URL changes externally (e.g., back/forward button)
    useEffect(() => {
        const currentCategoryFromUrl = searchParams.get("category") || "All";
        if (currentCategoryFromUrl !== selectedCategory) {
            setSelectedCategory(currentCategoryFromUrl);
        }
    }, [searchParams, selectedCategory]);


    return (
        <div className="relative w-full overflow-hidden group">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide px-4 mask-fade"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                            px-5 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300
                            ${selectedCategory === category
                                ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-primary/50"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {/* Fade Effect on Edges */}
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A0A0F] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0A0A0F] to-transparent pointer-events-none" />
        </div>
    );
};

export default FilterBar;
