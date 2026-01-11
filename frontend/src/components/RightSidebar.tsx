"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AdPlaceholder } from "@/components/AdPlaceholder";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export function RightSidebar() {
    const [sources, setSources] = useState<any[]>([]);

    useEffect(() => {
        async function fetchSidebarData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get subscriptions
            const { data: subs } = await supabase
                .from("subscriptions")
                .select("sources(id, source_name, logo_url)")
                .eq("user_id", user.id)
                .limit(5);

            if (subs) {
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

                // For each source, check if they posted recently
                const processed = await Promise.all(subs.map(async (s: any) => {
                    const source = s.sources;
                    // Check for recent post
                    const { count } = await supabase
                        .from("news_items")
                        .select("*", { count: 'exact', head: true })
                        .eq("source_id", source.id)
                        .gte("published_at", oneHourAgo);

                    return {
                        ...source,
                        isActive: (count || 0) > 0
                    };
                }));

                setSources(processed);
            }
        }

        fetchSidebarData();
    }, []);

    // Always render sidebar for ads, even if no sources
    // if (sources.length === 0) return null;

    return (
        <aside className="fixed right-0 top-0 h-screen w-80 border-l border-gray-200 bg-white hidden xl:flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">Source Overview</h3>
                <p className="text-gray-400 text-sm">Your active channels</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {sources.map((source) => (
                    <div key={source.id} className="border-b border-gray-100 p-6 flex flex-col justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                {source.logo_url ? (
                                    <img src={source.logo_url} className="w-8 h-8 rounded-full grayscale opacity-80" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {source.source_name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold tracking-tight text-sm">{source.source_name}</span>
                                    {source.isActive && (
                                        <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Active now
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Ad Placements: 1 Medium Rectangle */}
            <div className="p-6 border-t border-gray-100 space-y-6 overflow-y-auto max-h-[50vh]">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sponsored</div>
                <AdPlaceholder variant="rectangle" />
            </div>
        </aside>
    );
}

