"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, Compass, Layers, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { LexisLogo } from "@/components/LexisLogo";

interface SidebarProps {
    isCollapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
    toggleCollapse?: () => void; // Keep for backward compat if needed, or remove
}

export function Sidebar({ isCollapsed = false, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 md:hidden text-gray-500 hover:text-black transition-colors"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-white/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => setCollapsed?.(false)}
                onMouseLeave={() => setCollapsed?.(true)}
                className={`
                fixed left-0 top-0 h-screen flex flex-col py-4 px-2
                bg-white z-40 transition-all duration-300
                ${isMobileOpen ? "translate-x-0 w-[275px] border-r border-gray-100" : "-translate-x-full md:translate-x-0"}
                ${isCollapsed ? "md:w-[80px] md:items-center" : "md:w-[275px] md:items-end"}
                md:bg-transparent md:border-none
            `}>
                <div className={`w-full px-3 mb-6 transition-all duration-300 ${isCollapsed ? "flex justify-center" : "max-w-[240px]"}`}>
                    <Link href="/home" className="block hover:bg-gray-50 rounded-full transition-colors p-2">
                        <LexisLogo size={32} />
                    </Link>
                </div>

                <nav className={`w-full space-y-1 flex-1 ${isCollapsed ? "items-center flex flex-col" : "max-w-[240px]"}`}>
                    <NavItem href="/home" icon={<Home size={26} />} label="Home" active={pathname === "/home"} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
                    <NavItem href="/discover" icon={<Compass size={26} />} label="Explore" active={pathname === "/discover"} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
                    <NavItem href="/sources" icon={<Layers size={26} />} label="Sources" active={pathname === "/sources"} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />

                </nav>

                <div className={`w-full mt-auto mb-4 px-3 ${isCollapsed ? "flex justify-center" : "max-w-[240px]"}`}>
                    <NavItem href="/settings" icon={<Settings size={26} />} label="Settings" active={pathname === "/settings"} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
                </div>
            </aside>
        </>
    );
}

function NavItem({ href, icon, label, active = false, isCollapsed = false, onClick }: { href: string; icon: React.ReactNode; label: string; active?: boolean; isCollapsed?: boolean; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            title={isCollapsed ? label : ""}
            className={`
                group flex items-center p-3 rounded-full transition-all duration-200
                ${active ? "font-bold" : "font-normal hover:bg-gray-100"}
                ${isCollapsed ? "justify-center w-12 h-12" : "w-fit pr-6"}
            `}
        >
            <span className={`transition-colors ${active ? "text-black" : "text-[rgb(15,20,25)]"}`}>
                {icon}
            </span>
            {!isCollapsed && (
                <span className={`text-xl ml-4 hidden xl:block ${active ? "text-black" : "text-[rgb(15,20,25)]"}`}>
                    {label}
                </span>
            )}
        </Link>
    );
}
