"use client";

import { Home, BarChart2, BookOpen, User, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomNav() {
    const pathname = usePathname();

    if (pathname.startsWith("/assessment") || pathname.startsWith("/pathways")) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 py-2 px-4 pb-6 z-50 lg:hidden">
            <div className="flex justify-between items-end">
                <NavItem name="Home" href="/" icon={Home} isActive={pathname === "/"} />
                <NavItem name="Trends" href="/trends" icon={BarChart2} isActive={pathname === "/trends"} />

                <div className="relative -top-5">
                    <Link href="/assessment" className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500 shadow-lg shadow-cyan-200 text-white hover:bg-cyan-600 transition-colors">
                        <Plus size={28} strokeWidth={2.5} />
                    </Link>
                </div>

                <NavItem name="Resources" href="/resources" icon={BookOpen} isActive={pathname === "/resources"} />
                <NavItem name="Profile" href="/profile" icon={User} isActive={pathname === "/profile"} />
            </div>
        </nav>
    );
}

function NavItem({ name, href, icon: Icon, isActive }: { name: string, href: string, icon: any, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={clsx(
                "flex flex-col items-center gap-1 transition-colors duration-200 w-16",
                isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
            )}
        >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{name}</span>
        </Link>
    );
}
