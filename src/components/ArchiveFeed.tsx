import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BookmarkMinus, ExternalLink } from "lucide-react";

interface SavedItem {
    id: string; // bookmark id
    news_item: {
        id: string;
        title: string;
        summary_text: string;
        published_at: string;
        image_url?: string;
        link: string;
        source_name: string;
        source_logo_url?: string; // Optional if we had it
    };
}

interface ArchiveFeedProps {
    items: SavedItem[];
    onRemove: (bookmarkId: string) => void;
}

export function ArchiveFeed({ items, onRemove }: ArchiveFeedProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-light">Your curated library is empty.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-[650px] mx-auto">
            {items.map((item) => {
                const news = item.news_item;
                let timeAgo = "Just now";
                try {
                    timeAgo = formatDistanceToNow(new Date(news.published_at))
                        .replace("about ", "") + " ago";
                } catch (e) { }

                return (
                    <article key={item.id} className="w-full flex gap-x-4 px-4 py-3 border-b border-gray-100 hover:bg-black/[0.02] transition-colors duration-200 cursor-pointer group">
                        {/* Left Column: Fixed Avatar (50px) */}
                        <div className="shrink-0 w-[50px]">
                            <div className="w-[50px] h-[50px] rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                                {news.source_name.charAt(0)}
                            </div>
                        </div>

                        {/* Right Column: Content Stream */}
                        <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                            {/* Header: Name • Time */}
                            <div className="flex items-center gap-x-1 text-[15px] leading-5 text-[#536471] mb-0.5 w-full">
                                <span className="font-bold text-[#0f1419] truncate hover:underline decoration-1 underline-offset-2">
                                    {news.source_name}
                                </span>
                                <span className="text-[#536471]">·</span>
                                <span className="text-[#536471] hover:underline decoration-1 underline-offset-2">
                                    {timeAgo}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="w-full mb-3">
                                <Link href={news.link} target="_blank" className="block w-full">
                                    {/* Summary Text */}
                                    <div className="text-[15px] text-[#0f1419] leading-6 whitespace-pre-wrap font-normal font-sans">
                                        {news.summary_text}
                                    </div>
                                </Link>
                            </div>

                            {/* Main Media (Inside Right Column) */}
                            {news.image_url && (
                                <div className="relative w-full mb-3">
                                    <img
                                        src={news.image_url}
                                        alt="Article media"
                                        className="w-full h-auto object-cover rounded-[16px] border border-gray-200/60 max-h-[500px]"
                                    />
                                </div>
                            )}

                            {/* Action Bar (Simple Text Links) */}
                            <div className="flex items-center gap-x-6 w-full mt-1">
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-[13px] font-medium text-[#536471] hover:text-red-600 transition-colors duration-200"
                                >
                                    Remove
                                </button>

                                <Link
                                    href={news.link}
                                    target="_blank"
                                    className="text-[13px] font-medium text-[#536471] hover:text-blue-500 transition-colors duration-200"
                                >
                                    Read
                                </Link>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
