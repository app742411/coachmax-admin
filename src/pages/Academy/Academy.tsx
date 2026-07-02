import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AcademyHeader from "../../components/academy/AcademyHeader";
import DayTabs from "../../components/academy/DayTabs";
import ClassFullTable from "../../components/academy/ClassFullTable";
import UnallocatedPlayersCard from "../../components/academy/UnallocatedPlayersCard";
import WaitlistCard from "../../components/academy/WaitlistCard";
import TrialsCard from "../../components/academy/TrialsCard";
import { UnallocatedPlayer, WaitlistItem, TrialItem } from "../../types/academy";
import { useClassFiltersWithTimeSlots } from "../../hooks/usePlayers";

const mockUnallocatedPlayers: UnallocatedPlayer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    details: "U10 - Male",
    rating: 2,
    requested: "Mon 4:30pm, Thu 4:30pm",
    programCode: "AC",
  },
  {
    id: 2,
    name: "Zac Anderson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    details: "U10 - Male",
    rating: 3,
    requested: "Mon 4:15pm",
    programCode: "AC",
  },
  {
    id: 3,
    name: "Noah Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    details: "U9 - Male",
    rating: 4,
    requested: "Mon 4:15pm",
    programCode: "AC",
  },
  {
    id: 4,
    name: "Liam Carter",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80",
    details: "U9 - Male",
    rating: 3,
    requested: "Tue 6:00pm",
    programCode: "AC",
  },
];

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
  const [activeDay, setActiveDay] = useState("Monday");
  const [categoryId, setCategoryId] = useState("");
  const [programId, setProgramId] = useState("");

  const { data: filtersData } = useClassFiltersWithTimeSlots(categoryId, programId, activeDay.toUpperCase());
  const timeSlots = filtersData?.timeSlots || [];

  return (
    <>
      <PageMeta
        title={`${programType} Schedule | CoachMax`}
        description={`Fidelity matched primary CoachMax ${programType.toLowerCase()} programs attendance UI`}
      />

      <AcademyHeader
        programType={programType}
        onCategoryChange={(id) => { setCategoryId(id); }}
        onProgramChange={(id) => { setProgramId(id); }}
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
                timeSlotStr={`${slot.startTime} - ${slot.endTime}`}
              />
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
              No classes scheduled for this day.
            </div>
          )}
        </div>

        {/* Right Side: Sidebar Cards Panel */}
        <div className="w-full xl:w-[350px] shrink-0">
          <UnallocatedPlayersCard players={mockUnallocatedPlayers} />
          <WaitlistCard items={mockWaitlist} />
          <TrialsCard items={mockTrials} />
        </div>
      </div>
    </>
  );
}
