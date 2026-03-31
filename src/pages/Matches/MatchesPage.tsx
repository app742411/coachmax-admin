import { useState } from "react";
import { 
  Trophy, 
  Calendar, 
  Plus, 
  LayoutGrid, 
  History
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import MatchStatsComp from "../../components/Matches/MatchStatsComp";
import MatchListComp from "../../components/Matches/MatchListComp";
import ScheduleMatchForm from "../../components/Matches/ScheduleMatchForm";

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "upcoming" | "history">("overview");

  return (
    <>
      <PageMeta
        title="Coach Max | Match Center"
        description="Comprehensive match scheduling, scoring, and performance analytics module."
      />
      <PageBreadcrumb 
        pageTitle="Match Center" 
        items={[
          { name: "Matches", path: "/matches" },
          { name: "Live Dashboard", path: "/matches" }
        ]}
      />

      <div className="space-y-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-500 rounded-2xl shadow-xl shadow-brand-500/20 text-white">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-2 uppercase">Match Intelligence</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Real-time scheduling & point distribution</p>
            </div>
          </div>

          <div className="flex bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <TabBtn 
              active={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")} 
              icon={<LayoutGrid size={14}/>} 
              label="Analytics" 
            />
            <TabBtn 
              active={activeTab === "schedule"} 
              onClick={() => setActiveTab("schedule")} 
              icon={<Plus size={14}/>} 
              label="New Match" 
            />
            <TabBtn 
              active={activeTab === "upcoming"} 
              onClick={() => setActiveTab("upcoming")} 
              icon={<Calendar size={14}/>} 
              label="Fixtures" 
            />
            <TabBtn 
              active={activeTab === "history"} 
              onClick={() => setActiveTab("history")} 
              icon={<History size={14}/>} 
              label="Results" 
            />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="transition-all duration-500">
          {activeTab === "overview" && <MatchStatsComp />}
          {activeTab === "schedule" && <ScheduleMatchForm onCancel={() => setActiveTab("overview")} />}
          {activeTab === "upcoming" && <MatchListComp type="UPCOMING" />}
          {activeTab === "history" && <MatchListComp type="FINISHED" />}
        </div>
      </div>
    </>
  );
};

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
      active 
        ? "bg-white dark:bg-gray-800 text-brand-500 shadow-sm" 
        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default MatchesPage;
