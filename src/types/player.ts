export interface PlayerParentUser {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface PlayerParent {
  _id: string;
  userId: PlayerParentUser;
  phone: string;
  address: string;
  children: string[];
}

export interface PlayerProgram {
  _id: string;
  name: string;
}

export interface PlayerStatistics {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
}

export interface Player {
  _id: string;
  parentId: PlayerParent;
  name: string;
  skillLevel: string;
  group: string;
  currentClub: string;
  additionalComments: string;
  dob: string;
  medicalConditions: string;
  jerseyNumber: number;
  preferredFoot: string;
  height: number;
  weight: number;
  programs: PlayerProgram[];
  statistics: PlayerStatistics;
  attendancePercentage: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PlayersResponse {
  success: boolean;
  message: string;
  data: Player[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
