"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import { User, Settings, Bell, Shield, LogOut, ChevronRight, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: "Mahesh C",
        email: "mahesh@example.com"
    });
    const [tempUser, setTempUser] = useState(user);

    const handleSave = () => {
        setUser(tempUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempUser(user);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
            <DashboardHeader />

            <main className="px-6 space-y-6 max-w-2xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative group">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
                    >
                        {isEditing ? <X size={20} className="text-rose-500" onClick={(e) => { e.stopPropagation(); handleCancel(); }} /> : <Edit2 size={18} />}
                    </button>

                    <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 border-4 border-slate-50 overflow-hidden relative shadow-inner">
                        <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" size={40} />
                    </div>

                    {isEditing ? (
                        <div className="space-y-3 w-full max-w-xs animate-in fade-in zoom-in-95 duration-200">
                            <input
                                type="text"
                                value={tempUser.name}
                                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                                className="w-full text-center border border-cyan-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-cyan-200 font-bold text-lg text-slate-800"
                            />
                            <input
                                type="email"
                                value={tempUser.email}
                                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                                className="w-full text-center border border-cyan-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-cyan-200 text-sm text-slate-600"
                            />
                            <button
                                onClick={handleSave}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-full text-xs font-bold w-full hover:bg-cyan-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 border border-emerald-100">Premium Member</span>
                        </>
                    )}

                    <div className="flex gap-8 mt-6 w-full border-t border-slate-50 pt-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800">12</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Streak</p>
                        </div>
                        <div className="flex-1 border-l border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">45</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Check-ins</p>
                        </div>
                    </div>
                </div>

                {/* Settings List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <SettingItem icon={Settings} label="General" />
                    <SettingItem icon={Bell} label="Notifications" toggle />
                    <SettingItem icon={Shield} label="Privacy & Security" />
                </div>

                <button className="w-full bg-white text-rose-500 font-bold py-4 rounded-2xl border border-slate-100 flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </main>
        </div>
    );
}

function SettingItem({ icon: Icon, label, toggle }: any) {
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <div className="w-full flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggle && setIsEnabled(!isEnabled)}>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <Icon size={18} />
            </div>
            <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
            {toggle ? (
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isEnabled ? "bg-cyan-500" : "bg-slate-300"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isEnabled ? "translate-x-4" : "translate-x-0"}`} />
                </div>
            ) : (
                <ChevronRight size={16} className="text-slate-300" />
            )}
        </div>
    )
}
