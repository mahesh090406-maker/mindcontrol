"use client";

import { Save, Bell, Shield, Download, FileText, Database, User } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
                <p className="text-slate-400 text-sm mt-1">Configure system preferences and export data.</p>
            </div>

            {/* Profile Settings */}
            <Section title="Administrator Profile" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                        <input type="text" defaultValue="Administrator" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input type="email" defaultValue="admin@mindconnect.com" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                </div>
            </Section>

            {/* System Config */}
            <Section title="System Configuration" icon={Shield}>
                <div className="space-y-4">
                    <Toggle label="Enable Maintenance Mode" description="Prevent users from accessing the platform temporarily." />
                    <Toggle label="Strict IP Filtering" description="Only allow access from whitelisted IP blocks." active />
                    <Toggle label="Two-Factor Authentication (Employees)" description="Force 2FA for all admin/moderator accounts." active />
                </div>
            </Section>

            {/* Notifications */}
            <Section title="Alerts & Notifications" icon={Bell}>
                <div className="space-y-4">
                    <Toggle label="High Load Alerts" description="Notify when server CPU usage exceeds 80%." active />
                    <Toggle label="New User Signups" description="Receive a daily digest of new registrations." />
                    <Toggle label="Error Logging" description="Send critical errors to the developer team immediately." active />
                </div>
            </Section>

            {/* Export Data */}
            <Section title="Data Export" icon={Download}>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-white font-bold mb-1">Generate System Report</h4>
                        <p className="text-slate-400 text-sm">Download a complete CSV dump of user activity and system logs.</p>
                    </div>
                    <button
                        onClick={() => alert("Report generation started. You will receive an email shortly.")}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
                    >
                        <FileText size={18} /> Download CSV
                    </button>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                    <div>
                        <h4 className="text-white font-bold mb-1">Backup Database</h4>
                        <p className="text-slate-400 text-sm">Create a snapshot of the current database state.</p>
                    </div>
                    <button
                        onClick={() => alert("Backup started! This process takes ~2 minutes.")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
                    >
                        <Database size={18} /> Start Backup
                    </button>
                </div>
            </Section>

            <div className="pt-4 flex justify-end">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all">
                    <Save size={18} /> Save All Changes
                </button>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }: any) {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
                    <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    )
}

function Toggle({ label, description, active = false }: any) {
    const [isOn, setIsOn] = useState(active);

    return (
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsOn(!isOn)}>
            <div>
                <h4 className="text-slate-200 font-medium group-hover:text-white transition-colors">{label}</h4>
                <p className="text-slate-500 text-xs">{description}</p>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ${isOn ? "bg-cyan-500" : "bg-slate-600"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${isOn ? "translate-x-5" : "translate-x-0"}`} />
            </div>
        </div>
    )
}
