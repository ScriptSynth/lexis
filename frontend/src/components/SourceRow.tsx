import React from "react";
// import { Switch } from "@/components/ui/switch"; // Removed unused import to fix lint
import { Check } from "lucide-react";

interface Source {
    id: string;
    source_name: string;
    category: string;
    is_subscribed?: boolean;
}

interface SourceRowProps {
    source: Source;
    onToggle: (id: string, current: boolean) => void;
}

export function SourceRow({ source, onToggle }: SourceRowProps) {
    // Mock data for the "Stats"
    const storiesCount = Math.floor(Math.random() * 40) + 5;

    return (
        <div className="group flex items-center justify-between py-5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-2">
            {/* LEFT: Logo + Info */}
            <div className="flex items-center gap-5">
                {/* Logo */}
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {/* If we had a real logo URL, we'd use an img with grayscale filter.
               Since we don't, we use the initial in a sleek black circle. */}
                    <span className="text-xl font-bold font-mono">{source.source_name.charAt(0)}</span>
                </div>

                {/* Name & Bio */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                        {source.source_name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                        Global News & Updates • {source.category}
                    </p>
                </div>
            </div>

            {/* CENTER/RIGHT: Stats & Toggle */}
            <div className="flex items-center gap-8">
                {/* Stats - Hidden on small screens */}
                <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-gray-400 tracking-wider">
                    <span>[ {storiesCount} STORIES TODAY ]</span>
                    <span>[ UPDATE: 2H AGO ]</span>
                </div>

                {/* Toggle Switch */}
                {/* Custom Toggle UI matching "High-end" feel */}
                <button
                    onClick={() => onToggle(source.id, !!source.source_name)} // logic handled by parent
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${source.is_subscribed ? "bg-black" : "bg-gray-200"
                        }`}
                >
                    <div
                        className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${source.is_subscribed ? "translate-x-6" : "translate-x-0"
                            }`}
                    >
                        {source.is_subscribed && <Check size={12} className="text-black stroke-[3px]" />}
                    </div>
                </button>
            </div>
        </div>
    );
}
