import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AcademyHeader from "../../components/academy/AcademyHeader";
import DayTabs from "../../components/academy/DayTabs";
import ClassFullTable from "../../components/academy/ClassFullTable";
import UnallocatedPlayersCard from "../../components/academy/UnallocatedPlayersCard";
import AllocatedPlayersCard from "../../components/academy/AllocatedPlayersCard";
import WaitlistCard from "../../components/academy/WaitlistCard";
import TrialsCard from "../../components/academy/TrialsCard";
import SidebarPlayersFilter from "../../components/academy/SidebarPlayersFilter";
import { WaitlistItem, TrialItem } from "../../types/academy";
import { useClassFiltersWithTimeSlots } from "../../hooks/usePlayers";
import { useUnallocatedPlayers } from "../../hooks/useUnallocatedPlayers";
import { useAllocatedPlayers } from "../../hooks/useAllocatedPlayers";
import AddClassModal from "../../components/classes/AddClassModal";
import TermManagement from "../../components/management/TermManagement";
import { Modal } from "../../components/ui/modal";

const mockWaitlist: WaitlistItem[] = [
  { id: 1, classTitle: "U8 - Monday 4:15pm Development", count: 1 },
  { id: 2, classTitle: "U10 - Monday 4:15pm Elite", count: 2 },
  { id: 3, classTitle: "U10B - Monday 6:00pm Elite", count: 1 },
];

const mockTrials: TrialItem[] = [
  {
    id: 1,
    name: "Zac Anderson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    details: "U10 - Male",
    requested: "Mon 4:15pm",
    status: "Invite Sent",
  },
  {
    id: 2,
    name: "Jayden Lee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    details: "U10 - Male",
    requested: "Mon 6:00pm",
    status: "Trial Booked",
  },
  {
    id: 3,
    name: "Mason Brown",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
    details: "U10 - Male",
    requested: "Tue 4:30pm",
    status: "Pending",
  },
];


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
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  const { data: filtersData } = useClassFiltersWithTimeSlots(categoryId, programId, activeDay.toUpperCase());
  const timeSlots = filtersData?.timeSlots || [];
  
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
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          {timeSlots.length > 0 ? (
            timeSlots.map((slot: any) => (
              <ClassFullTable
                key={slot.classId}
                classId={slot.classId}
                categoryId={categoryId}
                categoryName={categoryName}
                programId={programId}
                programName={programName}
                timeSlotStr={`${slot.startTime} - ${slot.endTime}`}
              />
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-none">
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
          <WaitlistCard items={mockWaitlist} />
          <TrialsCard items={mockTrials} />
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
