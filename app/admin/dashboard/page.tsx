"use client";

import { Users, AlertTriangle, TrendingUp, Clock, Search, MoreVertical, FileText, Edit, Trash, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [recentUsers, setRecentUsers] = useState([
        { id: "1", name: "Sarah Miller", email: "sarah.m@example.com", status: "Active", lastActive: "2 hours ago", risk: "Low", riskColor: "text-emerald-400" },
        { id: "2", name: "David Chen", email: "d.chen88@example.com", status: "Active", lastActive: "5 hours ago", risk: "Moderate", riskColor: "text-yellow-400" },
        { id: "3", name: "Jessica Wong", email: "jwong@design.co", status: "Offline", lastActive: "1 day ago", risk: "Low", riskColor: "text-emerald-400" },
        { id: "4", name: "Michael Ross", email: "mike.ross@law.com", status: "Active", lastActive: "10 mins ago", risk: "High", riskColor: "text-rose-400" },
        { id: "5", name: "Alex Johnson", email: "alex.j@tech.io", status: "Active", lastActive: "Just now", risk: "Low", riskColor: "text-emerald-400" },
    ]);

    // Filter Logic
    const filteredUsers = recentUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Close menu when clicking elsewhere
    const handleOutsideClick = () => {
        if (openMenuId) setOpenMenuId(null);
    };

    return (
        <div className="space-y-8" onClick={handleOutsideClick}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-slate-400 text-sm mt-1">Real-time system monitoring and user insights.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        Export Report
                    </button>
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-cyan-900/20"
                    >
                        + Add User
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
                <StatCard label="Total Users" value="1,248" change="+12%" icon={Users} color="indigo" />
                <StatCard label="Active Alerts" value="3" change="+1" icon={AlertTriangle} color="rose" />
                <StatCard label="Avg. Well-being" value="76%" change="+2.4%" icon={TrendingUp} color="emerald" />
                <StatCard label="Assessments" value="532" change="+18%" icon={FileText} color="cyan" />
            </div>

            {/* Recent Users Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-visible shadow-xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-white">Recent Activity</h3>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 text-slate-200 uppercase tracking-wider text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Assessment</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={14} />
                                                <span>{user.lastActive}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            <span className={user.riskColor}>{user.risk}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => toggleMenu(user.id, e)}
                                                className={`text-slate-400 hover:text-white transition-colors p-2 rounded-lg ${openMenuId === user.id ? "bg-slate-700 text-white" : ""}`}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openMenuId === user.id && (
                                                <div className="absolute right-8 top-8 w-40 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                                    <button onClick={() => alert(`Viewing profile for ${user.name}`)} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                                                        <Eye size={14} /> View Details
                                                    </button>
                                                    <button onClick={() => alert(`Editing restricted for ${user.name}`)} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 border-t border-slate-700/50">
                                                        <Edit size={14} /> Edit User
                                                    </button>
                                                    <button onClick={() => alert("Delete Restricted")} className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-slate-700/50">
                                                        <Trash size={14} /> Disable
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, icon: Icon, color }: any) {
    const colors = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    };

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colors[color as keyof typeof colors]}`}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{change}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        </div>
    )
}
