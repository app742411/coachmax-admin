import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import AttendanceComp from "../../components/TrainingTracker/AttendanceComp";
import PerformanceComp from "../../components/TrainingTracker/PerformanceComp";
import { Dumbbell, Activity, Calendar } from "lucide-react";

const TrainingTrackerPage = () => {
  const [activeTab, setActiveTab] = useState<"performance" | "attendance">("attendance");

  return (
    <>
      <PageMeta
        title="Coach Max | Training Tracker"
        description="Monitor player daily attendance and technical performance metrics in real-time."
      />
      <PageBreadcrumb 
        pageTitle="Training Tracker" 
        items={[
          { name: "Dashboard", path: "/" },
          { name: "Training Tracker", path: "/training-tracker" }
        ]}
      />

      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-500 rounded-2xl shadow-xl shadow-brand-500/20 text-white">
              <Dumbbell size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-2">Development Analytics</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Complete roster tracking & performance monitoring</p>
            </div>
          </div>

          <div className="flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm max-w-fit self-start md:self-center">
            <button 
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "attendance" 
                  ? "bg-white dark:bg-gray-800 text-brand-500 shadow-sm" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <Calendar size={14} />
              Attendance
            </button>
            <button 
              onClick={() => setActiveTab("performance")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "performance" 
                  ? "bg-white dark:bg-gray-800 text-brand-500 shadow-sm" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <Activity size={14} />
              Performance
            </button>
          </div>
        </div>

        <div className="min-h-[500px]">
          {activeTab === "attendance" ? <AttendanceComp /> : <PerformanceComp />}
        </div>
      </div>
    </>
  );
};

export default TrainingTrackerPage;
