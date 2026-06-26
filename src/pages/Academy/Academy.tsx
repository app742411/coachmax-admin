import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AcademyHeader from "../../components/academy/AcademyHeader";
import DayTabs from "../../components/academy/DayTabs";
import AttendanceTable from "../../components/academy/AttendanceTable";
import UnallocatedPlayersCard from "../../components/academy/UnallocatedPlayersCard";
import WaitlistCard from "../../components/academy/WaitlistCard";
import TrialsCard from "../../components/academy/TrialsCard";
import { ClassSchedule, UnallocatedPlayer, WaitlistItem, TrialItem } from "../../types/academy";

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

const mockSchedules: ClassSchedule[] = [
  {
    id: 1,
    time: "Monday 4:15pm",
    ageGroup: "U8s",
    coach: "Robbie",
    location: "9 Hurdcotte St",
    players: [
      {
        id: 1,
        playerName: "Siena Zamfirescu",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
        dob: "12/06/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 2,
        playerName: "Isla McKenzie",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
        dob: "03/09/2015",
        medicalConditions: "Peanut Allergy",
        attendance: ["present", "present", "present", "none", "absent", "present", "present", "present", "none", "none"],
      },
      {
        id: 3,
        playerName: "Oliver Matthews",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
        dob: "22/01/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "late", "present", "none", "none"],
      },
      {
        id: 4,
        playerName: "Lucas Martin",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
        dob: "17/03/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 5,
        playerName: "Harvey Wright",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80",
        dob: "30/04/2016",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "absent", "present", "present", "none", "none"],
      },
      {
        id: 6,
        playerName: "Noah Smith",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
        dob: "11/07/2016",
        medicalConditions: "Asthma",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 7,
        playerName: "Arlo Schrauwen",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80",
        dob: "08/02/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "late", "present", "present", "present", "none", "none"],
      },
      {
        id: 8,
        playerName: "Daniel Kim",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
        dob: "25/05/2016",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 9,
        playerName: "Ethan Lee",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
        dob: "19/04/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "late", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 10,
        playerName: "Liam Patel",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
        dob: "21/03/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "late", "present", "none", "none"],
      },
    ],
  },
  {
    id: 2,
    time: "Monday 6:00pm",
    ageGroup: "U10s",
    coach: "Finley",
    location: "9 Hurdcotte St",
    players: [
      {
        id: 1,
        playerName: "Zac Anderson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
        dob: "09/06/2015",
        medicalConditions: "Grass Allergy",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 2,
        playerName: "Mason Brown",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
        dob: "02/06/2016",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
      {
        id: 3,
        playerName: "Jayden Lee",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
        dob: "18/12/2015",
        medicalConditions: "None",
        attendance: ["present", "present", "present", "present", "present", "present", "present", "present", "none", "none"],
      },
    ],
  },
];

interface AcademyProps {
  programType?: "Academy" | "School";
}

export default function Academy({ programType = "Academy" }: AcademyProps) {
  const [activeDay, setActiveDay] = useState("Monday");

  return (
    <>
      <PageMeta
        title={`${programType} Schedule | CoachMax`}
        description={`Fidelity matched primary CoachMax ${programType.toLowerCase()} programs attendance UI`}
      />

      <AcademyHeader programType={programType} />
      <DayTabs activeDay={activeDay} onChangeDay={setActiveDay} />

      <div className="flex flex-col xl:flex-row gap-4 items-start w-full">
        {/* Left Side: Attendance Tables */}
        <div className="flex-1 w-full min-w-0">
          {mockSchedules.map((schedule) => (
            <AttendanceTable key={schedule.id} schedule={schedule} />
          ))}
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
