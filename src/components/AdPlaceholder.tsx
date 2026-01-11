"use client";

import Link from "next/link";

interface AdPlaceholderProps {
    variant?: "leaderboard" | "rectangle" | "mobile";
    className?: string;
    adActive?: boolean;
}

export function AdPlaceholder({ variant = "rectangle", className, adActive = false }: AdPlaceholderProps) {
    // If ad is active, we would strictly render the ad content here or elsewhere. 
    // For now, per instructions, if ad_active is FALSE, we display the available placeholder.
    if (adActive) return null; // Or render actual ad component

    // Dimensions based on variant
    // Leaderboard: 468x60 (Desktop Nav)
    // Rectangle: 300x250 (Sidebar)
    // Mobile: 320x50 (Mobile Nav)

    const sizeClasses = {
        leaderboard: "w-[468px] h-[60px]",
        rectangle: "w-[300px] h-[250px]",
        mobile: "w-[320px] h-[50px]",
    };

    return (
        <Link
            href="/advertise"
            className={`group flex flex-col items-center justify-center bg-[#f9fafb] border border-[#e5e7eb] overflow-hidden transition-all duration-200 hover:bg-[#f3f4f6] relative ${sizeClasses[variant]} ${className || ""}`}
        >
            <div className="flex flex-col items-center gap-1 z-10 transition-opacity duration-200 group-hover:opacity-0">
                <span className="font-mono text-[10px] tracking-widest text-gray-400 font-bold">
                    AD SPACE AVAILABLE
                </span>
                {variant !== "mobile" && (
                    <span className="text-[10px] text-gray-400 font-medium uppercase">
                        PURCHASE THIS SPOT FOR $149/mo
                    </span>
                )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/5">
                <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Purchase Now
                </span>
            </div>
        </Link>
    );
}
