"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { NewsCard } from "./NewsCard";
import { createClient } from "@supabase/supabase-js";
import { Layers, ArrowUp, CheckCircle2 } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ITEMS_PER_PAGE = 20;

export function Feed() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasSubscriptions, setHasSubscriptions] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [newStoriesCount, setNewStoriesCount] = useState(0);
    const [totalTodayCount, setTotalTodayCount] = useState(0);

    // Track the latest published_at time to check for updates
    const lastFetchTimeRef = useRef<string | null>(null);
    const observerTarget = useRef(null);
    const offsetRef = useRef(0);

    // Initial load
    useEffect(() => {
        fetchInitialFeed();

        // Polling for new stories every 30 seconds
        const interval = setInterval(checkForNewStories, 30000);
        return () => clearInterval(interval);
    }, []);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, loadingMore]);

    async function getUserAndSubs() {
        const { data: { user } } = await supabase.auth.getUser();
        // Allow unauthenticated fetch for sources stored in local storage? 
        // For now, Feed is mostly auth-based for subscriptions. 
        // But let's keep return null if no user for strictness unless we want guest mode.
        // Prompt implies "Log in page not opening" -> User is trying to login.
        if (!user) return null;

        const { data: subData } = await supabase
            .from("subscriptions")
            .select("source_id")
            .eq("user_id", user.id);

        if (!subData || subData.length === 0) return [];
        return subData.map((s: any) => s.source_id);
    }



    async function fetchInitialFeed() {
        setLoading(true);
        const sourceIds = await getUserAndSubs();

        if (sourceIds === null || sourceIds.length === 0) {
            setHasSubscriptions(false);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("news_items")
            .select("*, sources!inner(id, source_name, logo_url)")
            .in("sources.id", sourceIds)
            .order("published_at", { ascending: false })
            .range(0, ITEMS_PER_PAGE - 1);

        // Fetch count for today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const { count: todayCount } = await supabase
            .from("news_items")
            .select("*", { count: 'exact', head: true })
            .in("sources.id", sourceIds)
            .gte("published_at", todayStart.toISOString());

        if (todayCount) setTotalTodayCount(todayCount);

        if (error) {
            console.error("Error fetching feed:", error);
        } else if (data) {
            const mapped = data.map((item: any) => ({
                ...item,
                source_logo_url: item.sources?.logo_url,
                source_id: item.sources?.id
            }));
            setItems(mapped);
            offsetRef.current = ITEMS_PER_PAGE;

            if (mapped.length > 0) {
                lastFetchTimeRef.current = mapped[0].published_at;
            }

            if (data.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }
        }
        setLoading(false);
    }

    async function loadMore() {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);

        const sourceIds = await getUserAndSubs();
        if (!sourceIds || sourceIds.length === 0) {
            setLoadingMore(false);
            return;
        }

        const start = offsetRef.current;
        const end = start + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
            .from("news_items")
            .select("*, sources!inner(id, source_name, logo_url)")
            .in("sources.id", sourceIds)
            .order("published_at", { ascending: false })
            .range(start, end);

        if (error) {
            console.error("Error loading more:", error);
        } else if (data) {
            if (data.length === 0) {
                setHasMore(false);
            } else {
                const mapped = data.map((item: any) => ({
                    ...item,
                    source_logo_url: item.sources?.logo_url,
                    source_id: item.sources?.id
                }));
                const newItems = [...items, ...mapped];
                // Remove duplicates by ID
                const uniqueItems = Array.from(new Map(newItems.map(item => [item['id'], item])).values());

                setItems(uniqueItems);
                offsetRef.current = end + 1;

                if (data.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                }
            }
        }
        setLoadingMore(false);
    }

    async function checkForNewStories() {
        if (!lastFetchTimeRef.current) return;

        const sourceIds = await getUserAndSubs();
        if (!sourceIds || sourceIds.length === 0) return;

        const { count, error } = await supabase
            .from("news_items")
            .select("*", { count: 'exact', head: true })
            .in("sources.id", sourceIds)
            .gt("published_at", lastFetchTimeRef.current);

        if (!error && count !== null) {
            setNewStoriesCount(count);
        }
    }

    const handleShowNewStories = async () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setItems([]);
        offsetRef.current = 0;
        setHasMore(true);
        await fetchInitialFeed();
        setNewStoriesCount(0);
    };

    async function followAllStarterPack() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch 2 available sources (dummy logic, getting top 2)
        const { data: sources } = await supabase.from("sources").select("id").limit(2);
        if (sources) {
            const inserts = sources.map(s => ({ user_id: user.id, source_id: s.id }));
            await supabase.from("subscriptions").insert(inserts);
            window.location.reload();
        }
    }



    // Processed Items: Grouping and Headers
    const processedFeed = useMemo(() => {
        const result: any[] = [];
        let lastDateHeader = "";

        items.forEach((item) => {
            const date = new Date(item.published_at);
            let header = "";

            if (isToday(date)) header = "Today";
            else if (isYesterday(date)) header = "Yesterday";
            else header = format(date, "MMMM d");

            if (header !== lastDateHeader) {
                result.push({ type: "header", label: header });
                lastDateHeader = header;
            }

            result.push({ type: "item", data: item });
        });

        return result;
    }, [items]);

    // Progress Calculation
    const progress = totalTodayCount > 0
        ? Math.min(items.length, totalTodayCount)
        : 0;

    if (loading) {
        return (
            <div className="space-y-0 divide-y divide-gray-100 max-w-[650px] mx-auto border-x border-gray-100 min-h-screen bg-white pt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-1/4" />
                            <div className="h-4 bg-gray-100 rounded w-full" />
                            <div className="h-4 bg-gray-100 rounded w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!hasSubscriptions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 max-w-[650px] mx-auto">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Layers size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to your timeline</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Follow sources to see stories here.
                </p>

                {/* Starter Pack */}
                <div className="w-full max-w-sm border border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold mb-4">Starter Pack</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-xs">A</div>
                            <div className="text-left"><div className="font-bold text-sm">Tech Daily</div><div className="text-xs text-gray-500">Technology</div></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-xs">B</div>
                            <div className="text-left"><div className="font-bold text-sm">World Now</div><div className="text-xs text-gray-500">Global News</div></div>
                        </div>
                    </div>
                    <button
                        onClick={followAllStarterPack}
                        className="w-full bg-black text-white py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        Follow All
                    </button>
                </div>

                <Link href="/sources" className="text-black font-semibold text-sm hover:underline">
                    Browse all sources
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[650px] mx-auto border-x border-gray-100 min-h-screen bg-white relative">
            {/* Daily Progress Bar Removed by User Request */}

            {/* New Stories Pill */}
            {newStoriesCount > 0 && (
                <div className="sticky top-16 z-50 flex justify-center mb-4 cursor-pointer pointer-events-none">
                    <button
                        onClick={handleShowNewStories}
                        className="pointer-events-auto bg-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
                    >
                        <ArrowUp size={16} />
                        <span>Show {newStoriesCount} new items</span>
                    </button>
                </div>
            )}

            <div className="divide-y divide-gray-100">
                {items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>No stories found from your sources today.</p>
                    </div>
                ) : (
                    processedFeed.map((item, index) => {
                        if (item.type === "header") {
                            return (
                                <div key={`header-${index}`} className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                                    {item.label}
                                </div>
                            );
                        }
                        return <NewsCard key={item.data.id} item={{ ...item.data }} />;
                    })
                )}
            </div>

            {/* Loading Indicator for Infinite Scroll */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {loadingMore && (
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                )}
            </div>
        </div>
    );
}
