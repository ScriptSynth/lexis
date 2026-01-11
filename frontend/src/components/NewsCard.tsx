import Link from "next/link";
import { ExternalLink, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
    id: string;
    title: string;
    source_name: string;
    summary_text: string;
    image_url?: string;
    published_at: string;
    link: string;
    // Extended properties
    source_logo_url?: string;
    source_id?: string;
    is_bookmarked?: boolean;
}

interface NewsCardProps {
    item: NewsItem;


    // Extensions for Discover Page
    showFollowAction?: boolean;
    isSubscribed?: boolean;
    onToggleFollow?: (sourceId: string, currentStatus: boolean) => void;
}

export function NewsCard({ item, showFollowAction, isSubscribed, onToggleFollow }: NewsCardProps) {
    // 1. Time formatting
    let timeAgo = "Just now";
    try {
        // twitter style: "12m", "2h"
        const distance = formatDistanceToNow(new Date(item.published_at));
        timeAgo = distance
            .replace("less than a minute", "1m")
            .replace(" minutes", "m")
            .replace(" minute", "m")
            .replace(" hours", "h")
            .replace(" hour", "h")
            .replace(" days", "d")
            .replace(" day", "d")
            .replace("about ", "");
    } catch (e) {
        // fallback
    }

    // 2. Generate Handle (fake for now based on source name)
    const handle = `@${item.source_name.replace(/\s+/g, '').replace(/[^\w]/g, '')}`;



    return (
        <article className="w-full flex gap-x-4 px-4 py-3 border-b border-gray-100 hover:bg-black/[0.02] transition-colors duration-200 cursor-pointer group">
            {/* Left Column: Fixed Avatar (50px) */}
            <div className="shrink-0 w-[50px]">
                {item.source_logo_url ? (
                    <img
                        src={item.source_logo_url}
                        alt={item.source_name}
                        className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                ) : (
                    <div className="w-[50px] h-[50px] rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                        {item.source_name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Right Column: Content Stream */}
            <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                {/* Header: Name • Time */}
                <div className="flex items-center justify-between w-full mb-0.5">
                    <div className="flex items-center gap-x-1 text-[15px] leading-5 text-[#536471]">
                        <span className="font-bold text-[#0f1419] truncate hover:underline decoration-1 underline-offset-2">
                            {item.source_name}
                        </span>
                        <span className="text-[#536471]">·</span>
                        <span className="text-[#536471] hover:underline decoration-1 underline-offset-2">
                            {timeAgo}
                        </span>
                    </div>

                    {showFollowAction && onToggleFollow && item.source_id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFollow(item.source_id!, !!isSubscribed);
                            }}
                            className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${isSubscribed
                                ? "bg-transparent text-gray-500 hover:text-red-500 border border-gray-200"
                                : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            {isSubscribed ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                {/* Summary Text */}
                <div className="text-[15px] text-[#0f1419] leading-6 whitespace-pre-wrap mb-3 w-full font-normal font-sans">
                    {item.summary_text}
                </div>

                {/* Main Media (Inside Right Column) */}
                {item.image_url && (
                    <div className="relative w-full mb-3">
                        <img
                            src={item.image_url}
                            alt="Article preview"
                            className="w-full h-auto object-cover rounded-[16px] border border-gray-200/60 max-h-[500px]"
                        />
                    </div>
                )}

                {/* Action Bar (Simple Text Links) */}
                <Link
                    href={item.link}
                    target="_blank"
                    className="text-[13px] font-medium text-[#536471] hover:text-blue-500 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    Read
                </Link>
            </div>

        </article >
    );
}
