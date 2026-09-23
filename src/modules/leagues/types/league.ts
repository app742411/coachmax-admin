export type LeagueType = "NATIONAL" | "STATE" | "LOCAL" | "INTERNAL" | "INTERNATIONAL";

export type MatchStatus =
  | "Scheduled"
  | "SCHEDULED"
  | "Live"
  | "LIVE"
  | "Completed"
  | "COMPLETED"
  | "Cancelled"
  | "CANCELLED"
  | "Postponed"
  | "POSTPONED";

export interface League {
  _id: string;
  name: string;
  season: string;
  type: LeagueType | string;
  competitionScope?: string;
  description?: string;
  logo?: string;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  status?: "Active" | "ACTIVE" | "Upcoming" | "Completed" | "Draft" | string;
  visibility?: "Public" | "PUBLIC" | "Internal" | "INTERNAL" | string;
  allowDraws?: boolean;
  automaticLadderRecalculation?: boolean;
  autoLadderCalculation?: boolean;
  pointsForWin?: number;
  pointsForDraw?: number;
  pointsForLoss?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoachRef {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
}

export interface TeamRecord {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
}

export interface LeagueTeam {
  _id: string;
  name?: string;
  teamName?: string;
  logo?: string;
  ageGroup?: string;
  teamType?: string;
  coach?: CoachRef | string;
  coachEmail?: string;
  playersCount: number;
  wins?: number;
  losses?: number;
  draws?: number;
  status: "ACTIVE" | "INACTIVE" | string;
  record?: TeamRecord;
}

export interface MatchTeamRef {
  _id: string;
  name?: string;
  teamName?: string;
  logo?: string;
}

export interface MatchScore {
  homeScore: number | null;
  awayScore: number | null;
}

export interface MatchStatistics {
  homePossession?: number;
  awayPossession?: number;
  homeShots?: number;
  awayShots?: number;
  homeShotsOnTarget?: number;
  awayShotsOnTarget?: number;
  homeCorners?: number;
  awayCorners?: number;
  homeFouls?: number;
  awayFouls?: number;
  homeYellowCards?: number;
  awayYellowCards?: number;
}

export interface Match {
  _id: string;
  leagueId?: string;
  league?: string;
  round: number;
  roundName?: string;
  kickoffTime?: string;
  matchDate?: string;
  matchDateFormatted?: string;
  time?: string;
  field?: string;
  venue?: string;
  referee?: string;
  homeTeam: MatchTeamRef;
  awayTeam: MatchTeamRef;
  score?: MatchScore;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  matchStatistics?: MatchStatistics;
  notes?: string;
}

export interface RoundSchedule {
  round: number;
  roundName: string;
  matches: Match[];
}

export interface TeamStanding {
  rank?: number;
  position?: number;
  standingId?: string;
  teamId?: string;
  teamName?: string;
  teamLogo?: string;
  team?: {
    _id: string;
    teamName: string;
    logo?: string;
  };
  played: number;
  won: number;
  drawn?: number;
  draw?: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LeagueStats {
  totalTeams: number;
  totalMatches: number;
  matchesPlayed: number;
  goalsScored: number;
  avgGoalsPerMatch: number;
  teamVsGoals?: {
    teamId?: string;
    teamName: string;
    logo?: string;
    goals: number;
  }[];
  resultsDistribution: {
    decisiveWins?: number;
    draws: number;
    competitiveGames?: number;
    wins?: number;
    losses?: number;
    totalCompleted?: number;
  };
  topScoringTeams: {
    teamId?: string;
    teamName: string;
    goals: number;
    logo?: string;
  }[];
  teamGoals?: {
    teamName: string;
    goals: number;
  }[];
}

export interface LeagueGraphs {
  goalsPerRoundTrend: {
    round: number;
    roundLabel: string;
    totalGoals: number;
  }[];
  pointsProgression: {
    teamId?: string;
    teamName: string;
    logo?: string;
    progression: {
      round: number;
      roundLabel: string;
      points: number;
    }[];
  }[];
  teamWinEfficiency: {
    teamId?: string;
    teamName: string;
    logo?: string;
    played: number;
    won: number;
    winEfficiency: number;
  }[];
}

export interface BackendLeagueData {
  league: League;
  kpis?: {
    totalTeams: number;
    totalMatches: number;
    matchesPlayed: number;
    goalsScored: number;
    avgGoalsPerMatch: number;
  };
  ladder: TeamStanding[];
  schedule: RoundSchedule[];
  teams: LeagueTeam[];
  stats: LeagueStats;
  graphs: LeagueGraphs;
  details: League;
  teamManagement?: LeagueTeam[];
}
