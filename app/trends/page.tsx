import DashboardHeader from "@/components/layout/DashboardHeader";
import MoodHistoryChart from "@/components/dashboard/MoodHistoryChart";
import StatGrid from "@/components/dashboard/StatGrid";

export default function TrendsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
            <DashboardHeader />

            <main className="px-6 space-y-6 max-w-5xl mx-auto">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Analysis</h2>
                        <p className="text-slate-500 text-sm">Insights from your last 30 days.</p>
                    </div>
                    <select className="bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg px-3 py-2 outline-none shadow-sm">
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>All Time</option>
                    </select>
                </div>

                <StatGrid />

                <MoodHistoryChart />

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Correlations</h3>
                    <p className="text-sm text-slate-500 mb-4">We found that your mood is strongly correlated with:</p>

                    <div className="space-y-3">
                        <CorrelationBar label="Sleep Quality" score={85} color="bg-indigo-500" />
                        <CorrelationBar label="Social Interaction" score={60} color="bg-sky-500" />
                        <CorrelationBar label="Physical Activity" score={45} color="bg-emerald-500" />
                    </div>
                </div>
            </main>
        </div>
    );
}

function CorrelationBar({ label, score, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>{label}</span>
                <span>{score > 70 ? "High" : score > 40 ? "Moderate" : "Low"} Impact</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    )
}
