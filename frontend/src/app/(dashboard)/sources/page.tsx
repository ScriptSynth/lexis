"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SourceRow } from "@/components/SourceRow";

// Make sure to use environment variables for public client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Source {
    id: string;
    source_name: string;
    category: string;
    is_subscribed?: boolean; // We'll compute this manually for now since we lack a joint view
}

export default function SourcesPage() {
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        checkUser();
        fetchSources();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
        }
    }

    async function fetchSources() {
        setLoading(true);
        // 1. Get all sources
        const { data: sourcesData, error: sourcesError } = await supabase
            .from("sources")
            .select("*")
            .order("source_name");

        if (sourcesError) {
            console.error("Error fetching sources:", sourcesError);
            setLoading(false);
            return;
        }

        // 2. Get user subscriptions
        let subscribedIds = new Set<string>();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: subData } = await supabase
                .from("subscriptions")
                .select("source_id")
                .eq("user_id", user.id);

            subData?.forEach((sub: any) => subscribedIds.add(sub.source_id));
            setUserId(user.id);
        } else if (typeof window !== 'undefined') {
            try {
                const local = localStorage.getItem("subscribed_sources");
                if (local) {
                    JSON.parse(local).forEach((id: string) => subscribedIds.add(id));
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }
        }

        // 3. Merge
        const merged = sourcesData.map((s: any) => ({
            ...s,
            is_subscribed: subscribedIds.has(s.id)
        }));

        setSources(merged);
        setLoading(false);
    }

    async function toggleSubscription(sourceId: string, currentStatus: boolean) {
        // Optimistic UI update
        setSources(prev => prev.map(s =>
            s.id === sourceId ? { ...s, is_subscribed: !currentStatus } : s
        ));

        // Logic handled in helper or here safely
        // Replicating logic for safety as in original file
        if (!userId) {
            try {
                const stored = localStorage.getItem("subscribed_sources");
                let ids: string[] = stored ? JSON.parse(stored) : [];

                if (currentStatus) { // if currently true, we remove
                    ids = ids.filter(id => id !== sourceId);
                } else {
                    if (!ids.includes(sourceId)) ids.push(sourceId);
                }
                localStorage.setItem("subscribed_sources", JSON.stringify(ids));
            } catch (e) { console.error(e); }
            return;
        }

        if (currentStatus) {
            // Unsubscribe
            const { error } = await supabase.from("subscriptions").delete().eq("user_id", userId).eq("source_id", sourceId);
            if (error) {
                console.error("Error unsubscribing:", error);
                // Revert
                setSources(prev => prev.map(s => s.id === sourceId ? { ...s, is_subscribed: currentStatus } : s));
            }
        } else {
            // Subscribe
            const { error } = await supabase.from("subscriptions").insert({ user_id: userId, source_id: sourceId });
            if (error) {
                console.error("Error subscribing:", error);
                // Revert
                setSources(prev => prev.map(s => s.id === sourceId ? { ...s, is_subscribed: currentStatus } : s));
            }
        }
    }

    // Filter sources
    const filteredSources = sources.filter(s =>
        s.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[800px] mx-auto min-h-screen">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-3 text-black tracking-tighter">Sources</h1>
                <p className="text-gray-500 text-lg">Manage your global news feed.</p>

                {/* Minimalist Search Bar */}
                <div className="mt-8 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search sources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-gray-300 py-2 px-0 text-center text-lg font-medium focus:ring-0 focus:border-black transition-colors placeholder:text-gray-300 placeholder:font-normal"
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col">
                    {filteredSources.length > 0 ? (
                        filteredSources.map((source) => (
                            <SourceRow
                                key={source.id}
                                source={source}
                                onToggle={() => toggleSubscription(source.id, !!source.is_subscribed)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            No sources found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
