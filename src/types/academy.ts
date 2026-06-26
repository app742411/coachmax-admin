export interface AttendanceRecord {
  id: number;
  playerName: string;
  avatar: string;
  dob: string;
  medicalConditions: string;
  attendance: ("present" | "absent" | "late" | "none")[]; // 10 days of record
}

export interface ClassSchedule {
  id: number;
  time: string;
  ageGroup: string;
  coach: string;
  location: string;
  players: AttendanceRecord[];
}

export interface UnallocatedPlayer {
  id: number;
  name: string;
  avatar: string;
  details: string; // e.g. "U10 - Male"
  rating: number;
  requested: string;
  programCode: string;
}

export interface WaitlistItem {
  id: number;
  classTitle: string;
  count: number;
}

export interface TrialItem {
  id: number;
  name: string;
  avatar: string;
  details: string;
  requested: string;
  status: "Invite Sent" | "Trial Booked" | "Pending";
}
