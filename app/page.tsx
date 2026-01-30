import DashboardHeader from "@/components/layout/DashboardHeader";
import WellbeingIndex from "@/components/dashboard/WellbeingIndex";
import InteractionChart from "@/components/dashboard/InteractionChart";
import ActiveInsights from "@/components/dashboard/ActiveInsights";
import BiofeedbackWidget from "@/components/dashboard/BiofeedbackWidget";
import MoodHistoryChart from "@/components/dashboard/MoodHistoryChart";
import StatGrid from "@/components/dashboard/StatGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <DashboardHeader />

      <main className="px-6 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 max-w-7xl mx-auto">
        <div className="lg:col-span-2">
            <StatGrid />
        </div>

        <div className="space-y-6">
          <WellbeingIndex />
          <div className="lg:hidden space-y-6">
            <BiofeedbackWidget />
            <MoodHistoryChart />
            <InteractionChart />
          </div>
          <ActiveInsights />
        </div>

        <div className="hidden lg:block space-y-6">
          <BiofeedbackWidget />
          <InteractionChart />
          <MoodHistoryChart />
        </div>
      </main>
    </div>
  );
}
