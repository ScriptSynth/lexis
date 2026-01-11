"use client";

import { useEffect, useState } from "react";

export function TimelineDemo() {
    const [items, setItems] = useState([
        { id: 1, source: "TC", title: "OpenAI releases new model...", time: "2m" },
        { id: 2, source: "B", title: "Markets rally on inflation data...", time: "15m" },
        { id: 3, source: "V", title: "Apple Vision Pro update...", time: "42m" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Rotate items to simulate feed
            setItems(prev => {
                const [first, ...rest] = prev;
                return [...rest, { ...first, id: Date.now() }]; // Cycle logic
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-black/5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-black/5" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-black/5" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold uppercase">LIVE FEED</div>
                </div>
            </div>

            <div className="space-y-4 min-h-[160px]">
                {items.slice(0, 3).map((item, i) => (
                    <div
                        key={item.id}
                        className={`flex gap-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                            ${i === 0 ? 'translate-y-0 opacity-100' : ''}
                            ${i === 1 ? 'translate-y-0 opacity-70' : ''}
                            ${i === 2 ? 'translate-y-2 opacity-30 scale-[0.98] blur-[0.5px]' : ''}
                        `}
                    >
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-lg shadow-black/20">
                            {item.source}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs font-bold text-gray-900 truncate tracking-tight">Source</span>
                                <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                            </div>
                            <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed font-medium">
                                {item.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fade for infinite feel */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
    );
}
