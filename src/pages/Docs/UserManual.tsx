import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { 
  Calendar, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Tag
} from "lucide-react";

const UserManual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"holiday" | "assign" | "colors">("holiday");

  return (
    <>
      <PageMeta
        title="User Manual | CoachMax Admin"
        description="Step-by-step guide for creating Holiday Programs and assigning players"
      />
      <PageBreadcrumb pageTitle="User Manual & Documentation" />

      <div className="space-y-6 pb-12">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-none border border-slate-200 dark:border-slate-800 bg-[#031549] text-white p-6 sm:p-8 shadow-md">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-none text-xs font-bold text-blue-200 mb-3 border border-white/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CoachMax Admin Guide</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Holiday Programs & Player Assignments
            </h1>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              Complete step-by-step instructions on setting up Holiday Programs, scheduling sessions, and allocating players with payment status color codes.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
            <Sparkles className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("holiday")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === "holiday"
                ? "border-[#0047FF] text-[#0047FF] bg-blue-50/50 dark:bg-blue-950/20"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1. Create Holiday Program</span>
          </button>

          <button
            onClick={() => setActiveTab("assign")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === "assign"
                ? "border-[#0047FF] text-[#0047FF] bg-blue-50/50 dark:bg-blue-950/20"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Assign Players</span>
          </button>

          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === "colors"
                ? "border-[#0047FF] text-[#0047FF] bg-blue-50/50 dark:bg-blue-950/20"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>3. Status & Color Guide</span>
          </button>
        </div>

        {/* TAB 1: CREATE HOLIDAY PROGRAM */}
        {activeTab === "holiday" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0047FF]" />
                Part 1: Create a Holiday Program Term & Class Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Follow these 2 simple sections to set up the seasonal Holiday Program event and create its classes.
              </p>

              {/* STEP 1.1 */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#0047FF] pl-4 py-1 bg-slate-50/50 dark:bg-slate-800/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#031549] text-white flex items-center justify-center text-xs font-extrabold">1</span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Step 1: Schedule Holiday Program Term (Event)</h3>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium ml-2">
                    <li>Navigate to <strong>Audit Logs</strong> or <strong>Clone Term</strong> from the left sidebar.</li>
                    <li>Click the <strong>+ Schedule New Term</strong> button at the top right.</li>
                    <li>
                      In the modal:
                      <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-slate-500 dark:text-slate-400">
                        <li><strong>Term Name:</strong> e.g., <em>"Holiday Football Camp 2026"</em></li>
                        <li><strong>Year:</strong> e.g., <em>2026</em></li>
                        <li><strong>Start Date & End Date:</strong> Choose your holiday camp dates.</li>
                        <li><strong>Checkmark:</strong> Tick the box <strong>"Holiday Program / Event"</strong>.</li>
                      </ul>
                    </li>
                    <li>Click <strong>COMMIT TERM</strong> to save.</li>
                  </ol>
                </div>

                {/* STEP 1.2 */}
                <div className="border-l-4 border-emerald-500 pl-4 py-1 bg-slate-50/50 dark:bg-slate-800/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold">2</span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Step 2: Add Holiday Program Classes</h3>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium ml-2">
                    <li>Go to <strong>Classes</strong> (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[11px] text-blue-600">/classes</code>) from the navigation menu.</li>
                    <li>Click the <strong>HOLIDAY PROGRAM</strong> tab at the top.</li>
                    <li>Select your created Term from the top term selector dropdown (e.g., <em>Holiday Football Camp 2026</em>).</li>
                    <li>Click the <strong>+ ADD CLASS</strong> button at the top right.</li>
                    <li>
                      Fill in the class details:
                      <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-slate-500 dark:text-slate-400">
                        <li><strong>Category:</strong> Select Holiday Program Category.</li>
                        <li><strong>Class Name:</strong> e.g., <em>"Morning Elite Training (09:00 - 11:00)"</em>.</li>
                        <li><strong>Day, Time & Location:</strong> Set the session schedule and venue.</li>
                        <li><strong>Capacity:</strong> Set maximum player limit (e.g. 20).</li>
                        <li><strong>Coach:</strong> Assign a coach to the class.</li>
                      </ul>
                    </li>
                    <li>Click <strong>SAVE CLASS</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGN PLAYERS */}
        {activeTab === "assign" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0047FF]" />
                Part 2: Assigning & Allocating Players to Holiday Classes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Learn how to drag-and-drop or select players to assign them to a Holiday Program class with payment status.
              </p>

              <div className="space-y-6">
                {/* Method 1 */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Method A: Via Program Matrix (Drag & Drop or Direct Assign)</h3>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium ml-2">
                    <li>Go to <strong>Programs</strong> in the main navigation menu.</li>
                    <li>Click on the <strong>Holiday Camps / Holiday Program</strong> category tab.</li>
                    <li>
                      Locate your target Holiday Class section in the Matrix view.
                    </li>
                    <li>
                      <strong>Option A (Drag & Drop):</strong> Click and hold any player card from the <em>Unassigned Roster</em>, then drag and drop them directly onto the Holiday Class table.
                    </li>
                    <li>
                      <strong>Option B (Assign Button):</strong> Click the <strong>+ Assign Player</strong> button above the class table, search for the player by name, and click <strong>Assign</strong>.
                    </li>
                  </ol>
                </div>

                {/* Method 2 Modal Options */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#0047FF]" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Selecting Payment & Allocation Status</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    When assigning a player, select one of the 4 payment statuses in the assignment popup:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-none">
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5" /> TRIAL
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">Temporary trial session player. Name appears in red text.</p>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-none">
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" /> UNPAID
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">Registered player pending payment confirmation.</p>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-none">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PAID (Allocate)
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">Confirmed active player with completed payment.</p>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border border-[#dee08b] dark:border-amber-900/50 rounded-none">
                      <span className="text-xs font-bold text-[#8a8c23] dark:text-[#dee08b] flex items-center gap-1.5 mb-1">
                        <PlusCircle className="w-3.5 h-3.5" /> EXTRA
                      </span>
                      <p className="text-[11px] text-slate-500 leading-tight">Additional or overflow player assigned to holiday class.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COLOR CODE REFERENCE */}
        {activeTab === "colors" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0047FF]" />
                Part 3: Table Status Color Code Reference
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual guide for status badges, player text colors, and icons used in Program Matrix tables.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* PAID */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">PAID / ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Green checkmark icon & standard text. Confirmed attendance.
                </p>
              </div>

              {/* TRIAL */}
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="font-bold text-xs text-rose-600 dark:text-rose-400">TRIAL (RED TEXT)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Rose red clock icon & red player name text. Trial attendee.
                </p>
              </div>

              {/* UNPAID */}
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-400">UNPAID</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Amber warning icon. Payment pending verification.
                </p>
              </div>

              {/* EXTRA / SUBSTITUTE */}
              <div className="p-4 bg-[#dee08b]/20 dark:bg-amber-950/30 border border-[#dee08b] dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#dee08b] border border-amber-400" />
                  <span className="font-bold text-xs text-[#8a8c23] dark:text-[#dee08b]">EXTRA / SUBSTITUTE</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Khaki-yellow Plus Circle (+) icon & olive text. Extra/sub player.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManual;
