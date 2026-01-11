"use client";

import { useRef, useEffect, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { createClient } from "@supabase/supabase-js";
import { AdPlaceholder } from "@/components/AdPlaceholder";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

const CATEGORIES = ["All", "Tech", "Business", "World", "Science", "Finance", "Entertainment"];

export default function DiscoverPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [userId, setUserId] = useState<string | null>(null);
    const [subscribedSourceIds, setSubscribedSourceIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            // Fetch subscriptions
            const { data: subData } = await supabase
                .from("subscriptions")
                .select("source_id")
                .eq("user_id", user.id);
            if (subData) {
                setSubscribedSourceIds(new Set(subData.map((s: any) => s.source_id)));
            }
        } else if (typeof window !== 'undefined') {
            try {
                const local = localStorage.getItem("subscribed_sources");
                if (local) {
                    setSubscribedSourceIds(new Set(JSON.parse(local)));
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }
        }
        await fetchDiscoverFeed();
        setLoading(false);
    }

    async function fetchDiscoverFeed() {
        // Fetch ALL news from ALL sources in last 24h (simulated by limit for now)
        const { data, error } = await supabase
            .from("news_items")
            .select("*, sources(id, source_name, category, logo_url)")
            .order("published_at", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Error fetching discover feed:", error);
        } else if (data) {
            const mapped = data.map((item: any) => ({
                ...item,
                source_logo_url: item.sources?.logo_url,
                source_id: item.sources?.id,
                category: item.sources?.category
            }));
            setItems(mapped || []);
        }
    }

    async function handleToggleFollow(sourceId: string, currentStatus: boolean) {
        // Optimistic update locally
        const nextSet = new Set(subscribedSourceIds);
        if (currentStatus) {
            nextSet.delete(sourceId); // Unsubscribing
        } else {
            nextSet.add(sourceId); // Subscribing
        }
        setSubscribedSourceIds(nextSet);

        if (!userId) {
            // Local storage update
            try {
                const ids = Array.from(nextSet);
                localStorage.setItem("subscribed_sources", JSON.stringify(ids));
            } catch (e) {
                console.error("Error updating localStorage", e);
            }
            return;
        }

        if (currentStatus) {
            // Unsubscribe
            await supabase.from("subscriptions").delete().eq("user_id", userId).eq("source_id", sourceId);
        } else {
            // Subscribe
            await supabase.from("subscriptions").insert({ user_id: userId, source_id: sourceId });
        }
    }

    // Filter items
    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(i => i.category === activeCategory || (activeCategory === "Tech" && i.category === "Technology")); // Simple mapping

    // Hero Logic: First item of the filtered list
    const heroItem = filteredItems.length > 0 ? filteredItems[0] : null;
    const gridItems = filteredItems.length > 0 ? filteredItems.slice(1) : [];

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="h-12 w-full bg-gray-100 rounded mb-8 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-gray-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative">
            {/* Sticky Category Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-8 overflow-x-auto no-scrollbar">
                <div className="flex space-x-2 mx-auto w-full max-w-7xl">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat
                                ? "bg-black text-white"
                                : "text-gray-500 hover:text-black border border-transparent hover:border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto flex gap-12 p-8">
                {/* Main Feed - Left Column */}
                <div className="flex-1 max-w-[700px]">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-2 text-black tracking-tight">Discover</h1>
                        <p className="text-gray-500">Curated top stories from around the world.</p>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-32 text-gray-400">
                            <p className="text-lg">Quiet hour in {activeCategory}. Check back soon.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <NewsCard
                                    key={item.id}
                                    item={item}
                                    showFollowAction={true}
                                    isSubscribed={subscribedSourceIds.has(item.source_id)}
                                    onToggleFollow={handleToggleFollow}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Ad Space */}
                <div className="hidden xl:block w-[300px] shrink-0">
                    <div className="sticky top-24">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sponsored</div>
                        <AdPlaceholder variant="rectangle" />
                    </div>
                </div>
            </div>
        </div>
    );
}
