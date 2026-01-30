import { Bell, Settings, Activity } from "lucide-react";

export default function DashboardHeader() {
    return (
        <header className="flex justify-between items-center px-6 py-6 bg-slate-50 sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-900 rounded-lg flex items-center justify-center text-teal-400">
                    <Activity size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">MindPulse</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-slate-600 hover:text-slate-900">
                    <Bell size={24} />
                </button>
                <button className="text-slate-600 hover:text-slate-900">
                    <Settings size={24} />
                </button>
            </div>
        </header>
    );
}
