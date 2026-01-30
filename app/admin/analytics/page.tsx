"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, Server, Database, ArrowUp, ArrowDown } from "lucide-react";

const trafficData = [
    { time: '00:00', users: 120 }, { time: '04:00', users: 80 },
    { time: '08:00', users: 450 }, { time: '12:00', users: 980 },
    { time: '16:00', users: 850 }, { time: '20:00', users: 600 },
    { time: '23:59', users: 300 },
];

const serverLoadData = [
    { name: 'Server A', load: 65, color: '#0ea5e9' },
    { name: 'Server B', load: 45, color: '#8b5cf6' },
    { name: 'Server C', load: 80, color: '#f43f5e' },
    { name: 'DB 1', load: 30, color: '#10b981' },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">System Analytics</h2>
                <p className="text-slate-400 text-sm mt-1">Real-time performance metrics and traffic analysis.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard icon={Activity} label="System Load" value="42%" status="Normal" color="emerald" />
                <MetricCard icon={Server} label="Requests/sec" value="845" status="High" color="amber" />
                <MetricCard icon={Database} label="DB Latency" value="12ms" status="Excellent" color="cyan" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white">Live Traffic</h3>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+12% vs last hour</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col">
                    <h3 className="font-bold text-white mb-6">Server Distribution</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serverLoadData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                                <Bar dataKey="load" radius={[0, 4, 4, 0]} barSize={32}>
                                    {serverLoadData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Logs Preview */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="font-bold text-white">Recent System Logs</h3>
                </div>
                <div className="p-4 space-y-2">
                    <LogEntry time="10:42 AM" type="INFO" message="Backup started successfully." />
                    <LogEntry time="10:40 AM" type="WARN" message="High latency detected on US-East node." color="text-amber-400" />
                    <LogEntry time="10:35 AM" type="ERROR" message="Failed login attempt from IP 192.168.1.1" color="text-rose-400" />
                    <LogEntry time="10:30 AM" type="INFO" message="User #1248 registered." />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, status, color }: any) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-400",
        amber: "bg-amber-500/10 text-amber-400",
        cyan: "bg-cyan-500/10 text-cyan-400",
    };

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color as keyof typeof colors]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    <span className="text-xs text-slate-500 mb-1 font-medium">{status}</span>
                </div>
            </div>
        </div>
    )
}

function LogEntry({ time, type, message, color = "text-cyan-400" }: any) {
    return (
        <div className="flex items-start gap-4 p-2 hover:bg-slate-700/30 rounded-lg transition-colors font-mono text-sm">
            <span className="text-slate-500 min-w-[70px]">{time}</span>
            <span className={`font-bold ${color} min-w-[50px]`}>{type}</span>
            <span className="text-slate-300">{message}</span>
        </div>
    )
}
