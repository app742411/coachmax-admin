import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AcademyHeader from "../../components/academy/AcademyHeader";
import DayTabs from "../../components/academy/DayTabs";
import ClassFullTable from "../../components/academy/ClassFullTable";
import UnallocatedPlayersCard from "../../components/academy/UnallocatedPlayersCard";
import AllocatedPlayersCard from "../../components/academy/AllocatedPlayersCard";
import SidebarPlayersFilter from "../../components/academy/SidebarPlayersFilter";
import { useClassFiltersWithTimeSlots, useAssignClassesToPlayer } from "../../hooks/usePlayers";
import { useUnallocatedPlayers } from "../../hooks/useUnallocatedPlayers";
import { useAllocatedPlayers } from "../../hooks/useAllocatedPlayers";
import AddClassModal from "../../components/classes/AddClassModal";
import PlayersListModal from "../../components/academy/PlayersListModal";
import TermManagement from "../../components/management/TermManagement";
import { Modal } from "../../components/ui/modal";



interface AcademyProps {
  programType?: string;
}

export default function Academy({ programType = "Academy" }: AcademyProps) {
  const location = useLocation();
  const state = location.state as any;

  const [activeDay, setActiveDay] = useState(() => {
    if (state?.day) return state.day.charAt(0).toUpperCase() + state.day.slice(1).toLowerCase();
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
  });
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [, setYear] = useState("");
  const [termId, setTermId] = useState("");
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const assignClassesMutation = useAssignClassesToPlayer();

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  const { data: filtersData } = useClassFiltersWithTimeSlots(categoryId, programId, activeDay.toUpperCase(), termId);
  const timeSlots = filtersData?.timeSlots || [];

  const hasInitializedFromState = useRef(false);

  useEffect(() => {
    if (timeSlots && timeSlots.length > 0) {
      if (state?.classId && !hasInitializedFromState.current) {
        setExpandedClassId(state.classId);
        hasInitializedFromState.current = true;
        return;
      }

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let closestSlot = timeSlots[0];
      let minDiff = Infinity;

      for (const slot of timeSlots) {
        if (!slot.startTime) continue;
        const [time, modifier] = slot.startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotMinutes = hours * 60 + (minutes || 0);
        const diff = slotMinutes - currentMinutes;

        if (diff >= -90 && diff < minDiff) {
          minDiff = diff;
          closestSlot = slot;
        }
      }

      setExpandedClassId(closestSlot.classId);
    }
  }, [timeSlots, activeDay]);

  const [pendingAssignPlayer, setPendingAssignPlayer] = useState<any | null>(null);
  const [selectedAssignClassId, setSelectedAssignClassId] = useState<string>("");
  const [selectedAssignStatus, setSelectedAssignStatus] = useState<string>("TRIAL");

  useEffect(() => {
    if (pendingAssignPlayer) {
      const matchesExpanded = timeSlots.some((slot: any) => slot.classId === expandedClassId);
      if (matchesExpanded && expandedClassId) {
        setSelectedAssignClassId(expandedClassId);
      } else if (timeSlots.length > 0) {
        setSelectedAssignClassId(timeSlots[0].classId);
      } else {
        setSelectedAssignClassId("");
      }
      setSelectedAssignStatus(pendingAssignPlayer.paymentStatus || "TRIAL");
    }
  }, [pendingAssignPlayer, timeSlots, expandedClassId]);

  const [sidebarCategory, setSidebarCategory] = useState("");
  const [sidebarProgram, setSidebarProgram] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    const stored = localStorage.getItem("show_players_sidebar");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [showAllocated, setShowAllocated] = useState<boolean>(() => {
    const stored = localStorage.getItem("show_allocated_players");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [showUnallocated, setShowUnallocated] = useState<boolean>(() => {
    const stored = localStorage.getItem("show_unallocated_players");
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("show_players_sidebar", JSON.stringify(showSidebar));
  }, [showSidebar]);

  useEffect(() => {
    localStorage.setItem("show_allocated_players", JSON.stringify(showAllocated));
  }, [showAllocated]);

  useEffect(() => {
    localStorage.setItem("show_unallocated_players", JSON.stringify(showUnallocated));
  }, [showUnallocated]);

  const effectivePlayerType = (() => {
    if (showAllocated && showUnallocated) return "BOTH";
    if (showAllocated) return "ALLOCATED";
    if (showUnallocated) return "UNALLOCATED";
    return "BOTH"; // unselected -> show all data
  })();

  const [unallocatedLimit, setUnallocatedLimit] = useState(5);
  const [allocatedLimit, setAllocatedLimit] = useState(5);

  const [isUnallocatedModalOpen, setIsUnallocatedModalOpen] = useState(false);
  const [isAllocatedModalOpen, setIsAllocatedModalOpen] = useState(false);

  useEffect(() => {
    setUnallocatedLimit(5);
    setAllocatedLimit(5);
  }, [sidebarCategory, sidebarProgram, sidebarSearch, effectivePlayerType]);

  const { data: unallocatedData, isFetching: isUnallocatedFetching } = useUnallocatedPlayers(
    sidebarCategory,
    sidebarProgram,
    sidebarSearch,
    1,
    unallocatedLimit,
    effectivePlayerType === "BOTH" || effectivePlayerType === "UNALLOCATED"
  );

  const { data: allocatedData, isFetching: isAllocatedFetching } = useAllocatedPlayers(
    sidebarCategory,
    sidebarProgram,
    sidebarSearch,
    1,
    allocatedLimit,
    effectivePlayerType === "BOTH" || effectivePlayerType === "ALLOCATED"
  );

  const { data: allUnallocatedData } = useUnallocatedPlayers(
    sidebarCategory,
    sidebarProgram,
    sidebarSearch,
    1,
    1000,
    isUnallocatedModalOpen
  );

  const { data: allAllocatedData } = useAllocatedPlayers(
    sidebarCategory,
    sidebarProgram,
    sidebarSearch,
    1,
    1000,
    isAllocatedModalOpen
  );

  return (
    <>
      <PageMeta
        title={`${programType} Schedule | CoachMax`}
        description={`Fidelity matched primary CoachMax ${programType.toLowerCase()} programs attendance UI`}
      />

      <AcademyHeader
        programType={programType}
        onCategoryChange={(id, name) => {
          setCategoryId(id);
          if (name) setCategoryName(name);
        }}
        onProgramChange={(id, name) => {
          setProgramId(id);
          if (name) setProgramName(name);
        }}
        onYearChange={(year) => { setYear(year); }}
        onTermChange={setTermId}
        onOpenCreateClass={() => setIsClassModalOpen(true)}
        onOpenTermSettings={() => setIsTermModalOpen(true)}
        showSidebar={showSidebar}
        onShowSidebarChange={setShowSidebar}
        showAllocated={showAllocated}
        onShowAllocatedChange={setShowAllocated}
        showUnallocated={showUnallocated}
        onShowUnallocatedChange={setShowUnallocated}
      />
      <DayTabs activeDay={activeDay} onChangeDay={(day) => { setActiveDay(day); }} />

      <div className="flex flex-col xl:flex-row gap-4 items-start w-full">
        {/* Left Side: Attendance Tables */}
        <div className="flex-1 w-full min-w-0">
          {timeSlots.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 md:p-6 shadow-sm flex flex-col gap-3">
              {timeSlots.map((slot: any, idx: number) => (
                <ClassFullTable
                  key={slot.classId}
                  classId={slot.classId}
                  index={idx + 1}
                  categoryId={categoryId}
                  categoryName={categoryName}
                  programId={programId}
                  programName={programName}
                  timeSlotStr={`${slot.startTime} - ${slot.endTime}`}
                  isExpanded={expandedClassId === slot.classId}
                  onToggle={() => setExpandedClassId(expandedClassId === slot.classId ? null : slot.classId)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
              No classes scheduled for this day.
            </div>
          )}
        </div>

        {/* Right Side: Sidebar Cards Panel */}
        {(() => {
          if (!showSidebar) return null;

          const userStr = localStorage.getItem("user");
          let isCoach = false;
          if (userStr) {
            try {
              const parsed = JSON.parse(userStr);
              if (parsed?.role === "COACH") {
                isCoach = true;
              }
            } catch (e) {
              console.error(e);
            }
          }

          if (isCoach) return null;

          return (
            <div className="w-full xl:w-[350px] shrink-0 xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-110px)] xl:overflow-y-auto pr-1.5 custom-scrollbar flex flex-col gap-4">
              <SidebarPlayersFilter
                category={sidebarCategory}
                program={sidebarProgram}
                search={sidebarSearch}
                onCategoryChange={setSidebarCategory}
                onProgramChange={setSidebarProgram}
                onSearchChange={setSidebarSearch}
              />
              {(effectivePlayerType === "BOTH" || effectivePlayerType === "UNALLOCATED") && (
                <UnallocatedPlayersCard
                  players={unallocatedData?.players || []}
                  totalCount={unallocatedData?.pagination?.total || 0}
                  hasMore={unallocatedData ? unallocatedData.players.length < (unallocatedData.pagination?.total ?? 0) : false}
                  onLoadMore={() => setUnallocatedLimit(prev => prev + 5)}
                  isLoadingMore={isUnallocatedFetching && unallocatedData.players.length > 0}
                  onAssignPlayer={(player) => setPendingAssignPlayer(player)}
                  onViewAll={() => setIsUnallocatedModalOpen(true)}
                />
              )}
              {(effectivePlayerType === "BOTH" || effectivePlayerType === "ALLOCATED") && (
                <AllocatedPlayersCard
                  players={allocatedData?.players || []}
                  totalCount={allocatedData?.pagination?.total || 0}
                  hasMore={allocatedData ? allocatedData.players.length < (allocatedData.pagination?.total ?? 0) : false}
                  onLoadMore={() => setAllocatedLimit(prev => prev + 5)}
                  isLoadingMore={isAllocatedFetching && allocatedData.players.length > 0}
                  onAssignPlayer={(player) => setPendingAssignPlayer(player)}
                  onViewAll={() => setIsAllocatedModalOpen(true)}
                />
              )}
              {/* <WaitlistCard items={mockWaitlist} /> */}
              {/* <TrialsCard items={mockTrials} /> */}
            </div>
          );
        })()}
      </div>

      <AddClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSuccess={() => { /* re-fetch could be handled via query invalidation if needed */ }}
        prefilledCategoryId={categoryId}
        prefilledProgramId={programId}
        prefilledDayOfWeek={activeDay.toUpperCase()}
        prefilledTermId={termId}
      />

      <Modal
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-none shadow-sm">
          <TermManagement />
        </div>
      </Modal>

      <Modal isOpen={!!pendingAssignPlayer} onClose={() => setPendingAssignPlayer(null)} className="max-w-2xl p-6">
        <div className="w-full bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Confirm Assignment</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {categoryId && programId && pendingAssignPlayer?.categoryId && pendingAssignPlayer?.programId &&
              (categoryId !== pendingAssignPlayer.categoryId || programId !== pendingAssignPlayer.programId)
              ? "The player requested a different program or category than the one you are assigning them to. Please review the details below, choose status, and confirm assignment."
              : "Please select the player's status and confirm assignment of the player to this class."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Requested</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{pendingAssignPlayer?.categoryName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Program:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{pendingAssignPlayer?.fullProgramName || pendingAssignPlayer?.programName || "N/A"}</span>
                </div>
                {pendingAssignPlayer?.preferredClasses && pendingAssignPlayer.preferredClasses.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Preferred Classes:</span>
                    <ul className="space-y-1">
                      {pendingAssignPlayer.preferredClasses.map((c: any) => (
                        <li key={c.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1">
                          {c.dayOfWeek.substring(0, 3)} {c.startTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
              <h4 className="text-xs font-bold text-[#0047FF] mb-3 uppercase">Assigning To</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{categoryName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Program:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{programName || "N/A"}</span>
                </div>
                <div className="pt-3 border-t border-blue-200 dark:border-blue-800/50 mt-3 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Class:</span>
                  <select
                    value={selectedAssignClassId}
                    onChange={(e) => setSelectedAssignClassId(e.target.value)}
                    className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    {timeSlots.map((slot: any) => (
                      <option key={slot.classId} value={slot.classId}>
                        {slot.startTime} - {slot.endTime} - {activeDay} ({slot.startTime} - {slot.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-widest">Select Assignment Status</label>
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: "TRIAL", label: "Trial", desc: "Trial Session", activeClass: "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400", inactiveClass: "border-slate-200 hover:border-rose-300/50 hover:bg-rose-500/[0.02] text-slate-500 dark:border-slate-800" },
                { value: "UNPAID", label: "Unpaid", desc: "Requires Payment", activeClass: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400", inactiveClass: "border-slate-200 hover:border-amber-300/50 hover:bg-amber-500/[0.02] text-slate-500 dark:border-slate-800" },
                { value: "PAID", label: "Paid (Allocate)", desc: "Payment Completed", activeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", inactiveClass: "border-slate-200 hover:border-emerald-300/50 hover:bg-emerald-500/[0.02] text-slate-500 dark:border-slate-800" },
                { value: "EXTRA", label: "Extra", desc: "Extra Status", activeClass: "border-[#dee08b] bg-[#dee08b]/20 text-[#8a8c23] dark:text-[#dee08b]", inactiveClass: "border-slate-200 hover:border-[#dee08b]/50 hover:bg-[#dee08b]/10 text-slate-500 dark:border-slate-800" }
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setSelectedAssignStatus(status.value)}
                  className={`p-4 border text-center rounded-none transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none ${selectedAssignStatus === status.value ? status.activeClass + " ring-1 ring-offset-0 font-extrabold" : status.inactiveClass
                    }`}
                >
                  <span className="text-xs font-black uppercase tracking-wide">{status.label}</span>
                  <span className="text-[9px] font-bold opacity-80">{status.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setPendingAssignPlayer(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border border-transparent hover:border-slate-300 rounded-none"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!pendingAssignPlayer || !selectedAssignClassId) return;
                assignClassesMutation.mutate({
                  playerId: pendingAssignPlayer.id || pendingAssignPlayer.playerId,
                  classIds: [selectedAssignClassId],
                  paymentStatus: selectedAssignStatus,
                  registrationRequestId: pendingAssignPlayer.registrationRequestId,
                }, {
                  onSuccess: () => {
                    setPendingAssignPlayer(null);
                  }
                });
              }}
              disabled={assignClassesMutation.isPending}
              className="px-6 py-2 text-sm font-bold bg-[#0047FF] text-white rounded-none hover:bg-blue-700 transition-colors shadow-theme-xs disabled:opacity-50"
            >
              {assignClassesMutation.isPending ? "Assigning..." : "Assign Player"}
            </button>
          </div>
        </div>
      </Modal>

      <PlayersListModal
        isOpen={isUnallocatedModalOpen}
        onClose={() => setIsUnallocatedModalOpen(false)}
        title="Unallocated Players"
        players={allUnallocatedData?.players || []}
        onAssignPlayer={(player) => {
          setPendingAssignPlayer(player);
          setIsUnallocatedModalOpen(false);
        }}
      />

      <PlayersListModal
        isOpen={isAllocatedModalOpen}
        onClose={() => setIsAllocatedModalOpen(false)}
        title="Allocated Players"
        players={allAllocatedData?.players || []}
        onAssignPlayer={(player) => {
          setPendingAssignPlayer(player);
          setIsAllocatedModalOpen(false);
        }}
      />
    </>
  );
}
