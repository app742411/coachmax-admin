export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  club: string;
  contactName: string;
  preferredFoot: string;
  skillLevel: number;
  medicalCondition: string;
  comments: string;
  status: string;
  programType: string;
  shirtNumber?: string;
  rejectReason?: string;
  createdAt: string;
  isOtpVerified?: boolean;
  isBlocked?: boolean;
  profile?: string;
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  rejectedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvedAt?: string;
  rejectedAt?: string;
  updatedAt?: string;
}
