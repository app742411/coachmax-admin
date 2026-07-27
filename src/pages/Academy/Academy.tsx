import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AcademyHeader from "../../components/academy/AcademyHeader";
import DayTabs from "../../components/academy/DayTabs";
import ClassFullTable from "../../components/academy/ClassFullTable";
import UnallocatedPlayersCard from "../../components/academy/UnallocatedPlayersCard";
import AllocatedPlayersCard from "../../components/academy/AllocatedPlayersCard";
import SidebarPlayersFilter from "../../components/academy/SidebarPlayersFilter";
import { useClassFiltersWithTimeSlots } from "../../hooks/usePlayers";
import { useUnallocatedPlayers } from "../../hooks/useUnallocatedPlayers";
import { useAllocatedPlayers } from "../../hooks/useAllocatedPlayers";
import AddClassModal from "../../components/classes/AddClassModal";
import TermManagement from "../../components/management/TermManagement";
import { Modal } from "../../components/ui/modal";


interface AcademyProps {
  programType?: string;
}

export default function Academy({ programType = "Academy" }: AcademyProps) {
  const [activeDay, setActiveDay] = useState(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [, setYear] = useState("");
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  const { data: filtersData } = useClassFiltersWithTimeSlots(categoryId, programId, activeDay.toUpperCase());
  const timeSlots = filtersData?.timeSlots || [];
  
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0) {
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
  
  const [sidebarCategory, setSidebarCategory] = useState("");
  const [sidebarProgram, setSidebarProgram] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [playerType, setPlayerType] = useState<"BOTH" | "ALLOCATED" | "UNALLOCATED">("UNALLOCATED");

  const { data: unallocatedPlayers } = useUnallocatedPlayers(
    sidebarCategory, 
    sidebarProgram, 
    sidebarSearch, 
    playerType === "BOTH" || playerType === "UNALLOCATED"
  );
  
  const { data: allocatedPlayers } = useAllocatedPlayers(
    sidebarCategory, 
    sidebarProgram, 
    sidebarSearch,
    playerType === "BOTH" || playerType === "ALLOCATED"
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
        onOpenCreateClass={() => setIsClassModalOpen(true)}
        onOpenTermSettings={() => setIsTermModalOpen(true)}
        playerType={playerType}
        onPlayerTypeChange={setPlayerType}
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
        <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-4">
          <SidebarPlayersFilter
            category={sidebarCategory}
            program={sidebarProgram}
            search={sidebarSearch}
            onCategoryChange={setSidebarCategory}
            onProgramChange={setSidebarProgram}
            onSearchChange={setSidebarSearch}
          />
          {(playerType === "BOTH" || playerType === "UNALLOCATED") && (
            <UnallocatedPlayersCard players={unallocatedPlayers || []} />
          )}
          {(playerType === "BOTH" || playerType === "ALLOCATED") && (
            <AllocatedPlayersCard players={allocatedPlayers || []} />
          )}
          {/* <WaitlistCard items={mockWaitlist} /> */}
          {/* <TrialsCard items={mockTrials} /> */}
        </div>
      </div>

      <AddClassModal 
        isOpen={isClassModalOpen} 
        onClose={() => setIsClassModalOpen(false)} 
        onSuccess={() => { /* re-fetch could be handled via query invalidation if needed */ }} 
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
    </>
  );
}
