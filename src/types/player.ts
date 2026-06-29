export interface PlayerParent {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  emergencyContact: string;
  relationship: string;
}

export interface PlayerCategory {
  _id: string;
  name: string;
}

export interface PlayerProgram {
  _id: string;
  name: string;
}

export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  dob: string;
  gender: string;
  profile: string;
  profileImage: string;
  parentId: PlayerParent | null;
  preferredFoot: string;
  weakFootRating: number;
  school: string;
  status: string;
  category?: PlayerCategory;
  program?: PlayerProgram;
  term?: string;
  jerseyNumber: number;
  goals: number;
  assists: number;
  appearances: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  rejectReason: string | null;
  approvedBy: string | null;
  rejectedBy: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  isBlocked: boolean;
  adminNote: string;
  assignedClasses: any[];
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PlayersResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  users: Player[];
}
