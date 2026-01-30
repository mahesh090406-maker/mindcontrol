import { ShieldCheck, Users, Activity, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3 border-b border-slate-700">
                    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                        <ShieldCheck size={18} />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Admin<span className="text-cyan-400">Control</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/admin/dashboard" icon={LayoutDashboard} label="Overview" active />
                    <NavLink href="/admin/users" icon={Users} label="User Management" />
                    <NavLink href="/admin/analytics" icon={Activity} label="System Analytics" />
                    <NavLink href="/admin/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AD</div>
                        <div>
                            <p className="text-xs font-bold text-white">Administrator</p>
                            <p className="text-[10px] text-slate-400">ID: admin</p>
                        </div>
                    </div>
                    <Link href="/admin/login" className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 p-2 transition-colors">
                        <LogOut size={14} /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon: Icon, label, active = false }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
        >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    )
}
