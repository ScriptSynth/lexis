"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

import { AdPlaceholder } from "@/components/AdPlaceholder";

export function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Default width for sidebar: 275px (XL), 80px (MD).
    // If collapsed, maybe 80px everywhere?
    // Let's assume on XL if collapsed -> 80px.
    // MD is already "icon only" (80px), so maybe we don't need collapse there?
    // Or maybe the user wants to expand it on MD?
    // For now, let's implement standard collapsible behavior for the large sidebar.

    return (
        <div className="flex justify-center min-h-screen">
            {/* Header/Nav - Left side fixed */}
            {/* We pass state to Sidebar so it can show expand/collapse button */}
            <header className={`fixed left-0 top-0 h-full hidden md:flex flex-col items-end z-10 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[80px] xl:w-[275px]'}`}>
                <Sidebar
                    isCollapsed={isCollapsed}
                    setCollapsed={setIsCollapsed}
                />
            </header>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sidebar />
            </div>

            {/* Main Content Column */}
            <main className={`w-full min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-[80px]' : 'md:ml-[80px] xl:ml-[275px]'}`}>

                {/* Top Navigation Bar with Ad Space */}
                <div className="w-full h-[80px] border-b border-gray-100 flex items-center justify-end px-6 bg-white sticky top-0 z-30">
                    <div className="hidden md:block">
                        <AdPlaceholder variant="leaderboard" />
                    </div>
                    <div className="md:hidden w-full flex justify-center">
                        <AdPlaceholder variant="mobile" />
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
