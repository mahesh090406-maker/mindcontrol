"use client";

import { Home, BarChart2, BookOpen, User, Plus, Activity, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
    const pathname = usePathname();

    // Hide sidebar on specific routes if needed (e.g. auth)
    // if (pathname === "/login") return null;

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-900 rounded-xl flex items-center justify-center text-teal-400 shadow-md shadow-teal-900/20">
                    <Activity size={24} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">MindConnect</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavItem name="Home" href="/" icon={Home} isActive={pathname === "/"} />
                <NavItem name="Trends" href="/trends" icon={BarChart2} isActive={pathname === "/trends"} />
                <NavItem name="Resources" href="/resources" icon={BookOpen} isActive={pathname === "/resources"} />
                <NavItem name="Profile" href="/profile" icon={User} isActive={pathname === "/profile"} />

                <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                        href="/assessment"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-200 hover:shadow-cyan-300 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        <span className="font-semibold">New Check-in</span>
                    </Link>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

function NavItem({ name, href, icon: Icon, isActive }: { name: string, href: string, icon: any, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                    ? "bg-teal-50 text-teal-700 font-medium shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
        >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={clsx(isActive ? "text-teal-600" : "text-slate-400")} />
            <span>{name}</span>
        </Link>
    );
}
