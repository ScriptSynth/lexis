"use client";

import { useEffect, useState } from "react";
import { LexisLogo } from "@/components/LexisLogo";

export function ProductDemo() {
    const [text, setText] = useState("");
    const fullText = "Global markets are rallying today as inflation data comes in lower than expected, fueling hopes that central banks will begin cutting interest rates sooner than previously forecasted by analysts.";
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovering) {
            let currentIndex = 0;
            interval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setText(fullText.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 10); // Typing speed
        } else {
            setText("");
        }
        return () => clearInterval(interval);
    }, [isHovering]);

    return (
        <div
            className="w-full max-w-2xl mx-auto bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] cursor-default"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Browser Header */}
            <div className="h-8 bg-[#111] border-b border-white/10 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="ml-4 flex-1 text-center">
                    <div className="inline-block px-3 py-0.5 rounded-md bg-[#222] text-[10px] text-gray-500 font-mono">lexis.app</div>
                </div>
            </div>

            {/* Content Content */}
            <div className="p-8 bg-black">
                <div className="flex gap-4">
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                            <LexisLogo size={24} color="white" />
                        </div>
                    </div>
                    <div className="flex-grow space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">Lexis Intelligence</span>
                            <span className="text-gray-500 text-sm">@lexis_ai</span>
                            <span className="text-gray-600 text-sm">·</span>
                            <span className="text-gray-500 text-sm font-mono">JUST NOW</span>
                        </div>

                        <div className="min-h-[80px] text-gray-300 text-lg leading-relaxed font-light">
                            {text}
                            <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-white align-middle" style={{ opacity: isHovering && text.length < fullText.length ? 1 : 0 }} />
                            {!isHovering && <span className="text-gray-600 italic">Hover to analyze...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
