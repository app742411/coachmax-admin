import leagueService, { CreateFixturePayload } from "../../../services/leagueService";
import {
  League,
  Match,
  LeagueTeam,
  TeamStanding,
  LeagueStats,
  LeagueGraphs,
  BackendLeagueData,
  RoundSchedule,
  TeamRecord,
  GenerateFixturesResponse,
} from "../types/league";

// Sample initial data matching screenshots for EJL 9
export const INITIAL_EJL9_TEAMS: LeagueTeam[] = [
  {
    _id: "t1",
    teamName: "U7/8 DM Football Academy (GF)",
    coach: { name: "David Miller", email: "dm@academy.com" },
    playersCount: 14,
    status: "ACTIVE",
    record: { played: 8, won: 8, drawn: 0, lost: 0, goalsFor: 42, goalsAgainst: 7, goalDifference: 35, points: 24 },
  },
  {
    _id: "t2",
    teamName: "Coach Max Tyrian Purple (GF)",
    coach: { name: "Sarah Jenkins", email: "sarah@coachmax.com" },
    playersCount: 12,
    status: "ACTIVE",
    record: { played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 28, goalsAgainst: 15, goalDifference: 13, points: 15 },
  },
  {
    _id: "t3",
    teamName: "Coach Max KOBI",
    coach: { name: "Marcus Vance", email: "marcus@coachmax.com" },
    playersCount: 13,
    status: "ACTIVE",
    record: { played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 24, goalsAgainst: 19, goalDifference: 5, points: 15 },
  },
  {
    _id: "t4",
    teamName: "Coach Max GOLD",
    coach: { name: "Liam Gallagher", email: "liam@coachmax.com" },
    playersCount: 12,
    status: "ACTIVE",
    record: { played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 22, goalsAgainst: 19, goalDifference: 3, points: 15 },
  },
  {
    _id: "t5",
    teamName: "U9 QSA GOLD",
    coach: { name: "Antonio Silva", email: "antonio@qsa.org" },
    playersCount: 11,
    status: "ACTIVE",
    record: { played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 23, goalsAgainst: 14, goalDifference: 9, points: 13 },
  },
  {
    _id: "t6",
    teamName: "U9 QSA RED",
    coach: { name: "Carlos Mendez", email: "carlos@qsa.org" },
    playersCount: 12,
    status: "ACTIVE",
    record: { played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 18, goalsAgainst: 21, goalDifference: -3, points: 13 },
  },
  {
    _id: "t7",
    teamName: "Coach Max SIENNA",
    coach: { name: "Elena Rostov", email: "elena@coachmax.com" },
    playersCount: 14,
    status: "ACTIVE",
    record: { played: 8, won: 2, drawn: 1, lost: 5, goalsFor: 15, goalsAgainst: 22, goalDifference: -7, points: 7 },
  },
  {
    _id: "t8",
    teamName: "Coach Max KERMES",
    coach: { name: "Oliver Stone", email: "oliver@coachmax.com" },
    playersCount: 13,
    status: "ACTIVE",
    record: { played: 8, won: 2, drawn: 0, lost: 6, goalsFor: 14, goalsAgainst: 24, goalDifference: -10, points: 6 },
  },
  {
    _id: "t9",
    teamName: "Coach Max GREEN",
    coach: { name: "Ben Cooper", email: "ben@coachmax.com" },
    playersCount: 12,
    status: "ACTIVE",
    record: { played: 8, won: 2, drawn: 0, lost: 6, goalsFor: 9, goalsAgainst: 40, goalDifference: -31, points: 6 },
  },
  {
    _id: "t10",
    teamName: "Coach Max MIKADO",
    coach: { name: "James Wilson", email: "james@coachmax.com" },
    playersCount: 11,
    status: "ACTIVE",
    record: { played: 8, won: 1, drawn: 1, lost: 6, goalsFor: 12, goalsAgainst: 26, goalDifference: -14, points: 4 },
  },
];

export const INITIAL_EJL9_MATCHES: Match[] = [
  // Round 1
  {
    _id: "m1",
    league: "ejl9",
    round: 1,
    roundName: "Round 1",
    kickoffTime: "2026-07-25T14:00:00.000Z",
    matchDate: "2026-07-25",
    matchDateFormatted: "Saturday 25 July 2026",
    time: "2:00 pm",
    field: "Field 1",
    venue: "Field 1",
    homeTeam: { _id: "t1", teamName: "U7/8 DM Football Academy (GF)" },
    awayTeam: { _id: "t5", teamName: "U9 QSA GOLD" },
    score: { homeScore: 4, awayScore: 1 },
    homeScore: 4,
    awayScore: 1,
    status: "COMPLETED",
    referee: "David Miller",
  },
  {
    _id: "m2",
    league: "ejl9",
    round: 1,
    roundName: "Round 1",
    kickoffTime: "2026-07-25T14:00:00.000Z",
    matchDate: "2026-07-25",
    matchDateFormatted: "Saturday 25 July 2026",
    time: "2:00 pm",
    field: "Field 2",
    venue: "Field 2",
    homeTeam: { _id: "t3", teamName: "Coach Max KOBI" },
    awayTeam: { _id: "t6", teamName: "U9 QSA RED" },
    score: { homeScore: 6, awayScore: 2 },
    homeScore: 6,
    awayScore: 2,
    status: "COMPLETED",
    referee: "Emily Davis",
  },
  {
    _id: "m3",
    league: "ejl9",
    round: 1,
    roundName: "Round 1",
    kickoffTime: "2026-07-25T14:00:00.000Z",
    matchDate: "2026-07-25",
    matchDateFormatted: "Saturday 25 July 2026",
    time: "2:00 pm",
    field: "Field 3",
    venue: "Field 3",
    homeTeam: { _id: "t4", teamName: "Coach Max GOLD" },
    awayTeam: { _id: "t10", teamName: "Coach Max MIKADO" },
    score: { homeScore: 4, awayScore: 2 },
    homeScore: 4,
    awayScore: 2,
    status: "COMPLETED",
    referee: "Michael Chang",
  },
  {
    _id: "m4",
    league: "ejl9",
    round: 1,
    roundName: "Round 1",
    kickoffTime: "2026-07-25T15:00:00.000Z",
    matchDate: "2026-07-25",
    matchDateFormatted: "Saturday 25 July 2026",
    time: "3:00 pm",
    field: "Field 1",
    venue: "Field 1",
    homeTeam: { _id: "t9", teamName: "Coach Max GREEN" },
    awayTeam: { _id: "t8", teamName: "Coach Max KERMES" },
    score: { homeScore: 2, awayScore: 3 },
    homeScore: 2,
    awayScore: 3,
    status: "COMPLETED",
    referee: "Sam Taylor",
  },
  {
    _id: "m5",
    league: "ejl9",
    round: 1,
    roundName: "Round 1",
    kickoffTime: "2026-07-25T16:00:00.000Z",
    matchDate: "2026-07-25",
    matchDateFormatted: "Saturday 25 July 2026",
    time: "4:00 pm",
    field: "Field 3",
    venue: "Field 3",
    homeTeam: { _id: "t7", teamName: "Coach Max SIENNA" },
    awayTeam: { _id: "t2", teamName: "Coach Max Tyrian Purple (GF)" },
    score: { homeScore: 0, awayScore: 3 },
    homeScore: 0,
    awayScore: 3,
    status: "COMPLETED",
    referee: "David Miller",
  },

  // Round 2
  {
    _id: "m6",
    league: "ejl9",
    round: 2,
    roundName: "Round 2",
    kickoffTime: "2026-08-01T14:00:00.000Z",
    matchDate: "2026-08-01",
    matchDateFormatted: "Saturday 1 August 2026",
    time: "2:00 pm",
    field: "Field 1",
    venue: "Field 1",
    homeTeam: { _id: "t5", teamName: "U9 QSA GOLD" },
    awayTeam: { _id: "t3", teamName: "Coach Max KOBI" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "Michael Chang",
  },
  {
    _id: "m7",
    league: "ejl9",
    round: 2,
    roundName: "Round 2",
    kickoffTime: "2026-08-01T14:00:00.000Z",
    matchDate: "2026-08-01",
    matchDateFormatted: "Saturday 1 August 2026",
    time: "2:00 pm",
    field: "Field 2",
    venue: "Field 2",
    homeTeam: { _id: "t6", teamName: "U9 QSA RED" },
    awayTeam: { _id: "t4", teamName: "Coach Max GOLD" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "Emily Davis",
  },
  {
    _id: "m8",
    league: "ejl9",
    round: 2,
    roundName: "Round 2",
    kickoffTime: "2026-08-01T14:00:00.000Z",
    matchDate: "2026-08-01",
    matchDateFormatted: "Saturday 1 August 2026",
    time: "2:00 pm",
    field: "Field 3",
    venue: "Field 3",
    homeTeam: { _id: "t10", teamName: "Coach Max MIKADO" },
    awayTeam: { _id: "t9", teamName: "Coach Max GREEN" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "Sam Taylor",
  },
  {
    _id: "m9",
    league: "ejl9",
    round: 2,
    roundName: "Round 2",
    kickoffTime: "2026-08-01T15:00:00.000Z",
    matchDate: "2026-08-01",
    matchDateFormatted: "Saturday 1 August 2026",
    time: "3:00 pm",
    field: "Field 1",
    venue: "Field 1",
    homeTeam: { _id: "t8", teamName: "Coach Max KERMES" },
    awayTeam: { _id: "t7", teamName: "Coach Max SIENNA" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "David Miller",
  },
  {
    _id: "m10",
    league: "ejl9",
    round: 2,
    roundName: "Round 2",
    kickoffTime: "2026-08-01T16:00:00.000Z",
    matchDate: "2026-08-01",
    matchDateFormatted: "Saturday 1 August 2026",
    time: "4:00 pm",
    field: "Field 3",
    venue: "Field 3",
    homeTeam: { _id: "t2", teamName: "Coach Max Tyrian Purple (GF)" },
    awayTeam: { _id: "t1", teamName: "U7/8 DM Football Academy (GF)" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "Michael Chang",
  },

  // Round 3
  {
    _id: "m11",
    league: "ejl9",
    round: 3,
    roundName: "Round 3",
    kickoffTime: "2026-08-08T14:00:00.000Z",
    matchDate: "2026-08-08",
    matchDateFormatted: "Saturday 8 August 2026",
    time: "2:00 pm",
    field: "Field 1",
    venue: "Field 1",
    homeTeam: { _id: "t3", teamName: "Coach Max KOBI" },
    awayTeam: { _id: "t2", teamName: "Coach Max Tyrian Purple (GF)" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "David Miller",
  },
  {
    _id: "m12",
    league: "ejl9",
    round: 3,
    roundName: "Round 3",
    kickoffTime: "2026-08-08T14:00:00.000Z",
    matchDate: "2026-08-08",
    matchDateFormatted: "Saturday 8 August 2026",
    time: "2:00 pm",
    field: "Field 2",
    venue: "Field 2",
    homeTeam: { _id: "t4", teamName: "Coach Max GOLD" },
    awayTeam: { _id: "t1", teamName: "U7/8 DM Football Academy (GF)" },
    score: { homeScore: null, awayScore: null },
    homeScore: null,
    awayScore: null,
    status: "SCHEDULED",
    referee: "Emily Davis",
  },
];

export const INITIAL_EJL9_STANDINGS: TeamStanding[] = [
  { rank: 1, position: 1, team: { _id: "t1", teamName: "U7/8 DM Football Academy (GF)" }, played: 8, won: 8, drawn: 0, draw: 0, lost: 0, goalsFor: 42, goalsAgainst: 7, goalDifference: 35, points: 24 },
  { rank: 2, position: 2, team: { _id: "t2", teamName: "Coach Max Tyrian Purple (GF)" }, played: 8, won: 5, drawn: 0, draw: 0, lost: 3, goalsFor: 28, goalsAgainst: 15, goalDifference: 13, points: 15 },
  { rank: 3, position: 3, team: { _id: "t3", teamName: "Coach Max KOBI" }, played: 8, won: 5, drawn: 0, draw: 0, lost: 3, goalsFor: 24, goalsAgainst: 19, goalDifference: 5, points: 15 },
  { rank: 4, position: 4, team: { _id: "t4", teamName: "Coach Max GOLD" }, played: 8, won: 5, drawn: 0, draw: 0, lost: 3, goalsFor: 22, goalsAgainst: 19, goalDifference: 3, points: 15 },
  { rank: 5, position: 5, team: { _id: "t5", teamName: "U9 QSA GOLD" }, played: 8, won: 4, drawn: 1, draw: 1, lost: 3, goalsFor: 23, goalsAgainst: 14, goalDifference: 9, points: 13 },
  { rank: 6, position: 6, team: { _id: "t6", teamName: "U9 QSA RED" }, played: 8, won: 4, drawn: 1, draw: 1, lost: 3, goalsFor: 18, goalsAgainst: 21, goalDifference: -3, points: 13 },
  { rank: 7, position: 7, team: { _id: "t7", teamName: "Coach Max SIENNA" }, played: 8, won: 2, drawn: 1, draw: 1, lost: 5, goalsFor: 15, goalsAgainst: 22, goalDifference: -7, points: 7 },
  { rank: 8, position: 8, team: { _id: "t8", teamName: "Coach Max KERMES" }, played: 8, won: 2, drawn: 0, draw: 0, lost: 6, goalsFor: 14, goalsAgainst: 24, goalDifference: -10, points: 6 },
  { rank: 9, position: 9, team: { _id: "t9", teamName: "Coach Max GREEN" }, played: 8, won: 2, drawn: 0, draw: 0, lost: 6, goalsFor: 9, goalsAgainst: 40, goalDifference: -31, points: 6 },
  { rank: 10, position: 10, team: { _id: "t10", teamName: "Coach Max MIKADO" }, played: 8, won: 1, drawn: 1, draw: 1, lost: 6, goalsFor: 12, goalsAgainst: 26, goalDifference: -14, points: 4 },
];

function getLocalLeagueData(leagueId: string): BackendLeagueData | null {
  try {
    const raw = localStorage.getItem(`coachmax_league_${leagueId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local league data", e);
  }
  return null;
}

function saveLocalLeagueData(leagueId: string, data: BackendLeagueData) {
  try {
    localStorage.setItem(`coachmax_league_${leagueId}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save local league data", e);
  }
}

export function initLeagueState(leagueId: string, existingData?: any): BackendLeagueData {
  const local = getLocalLeagueData(leagueId);
  if (local) return local;

  const leagueInfo: League = existingData?.league || {
    _id: leagueId,
    name: "EJL 9",
    season: "Season 2026",
    type: "NATIONAL",
    competitionScope: "NATIONAL",
    description: "Elite Junior League 2026",
    startDate: "2026-07-25T00:00:00.000Z",
    endDate: "2026-09-12T00:00:00.000Z",
    registrationStartDate: "2026-05-01T00:00:00.000Z",
    registrationEndDate: "2026-07-15T00:00:00.000Z",
    status: "ACTIVE",
    visibility: "PUBLIC",
    allowDraws: true,
    automaticLadderRecalculation: true,
    pointsForWin: 3,
    pointsForDraw: 1,
    pointsForLoss: 0,
  };

  const scheduleRounds: RoundSchedule[] = [
    { round: 1, roundName: "Round 1", matches: INITIAL_EJL9_MATCHES.filter((m) => m.round === 1) },
    { round: 2, roundName: "Round 2", matches: INITIAL_EJL9_MATCHES.filter((m) => m.round === 2) },
    { round: 3, roundName: "Round 3", matches: INITIAL_EJL9_MATCHES.filter((m) => m.round === 3) },
  ];

  const teamGoals = INITIAL_EJL9_STANDINGS.map((s) => ({
    teamName: s.team?.teamName || s.teamName || "",
    goals: s.goalsFor,
  }));

  const initialData: BackendLeagueData = {
    league: leagueInfo,
    details: leagueInfo,
    kpis: {
      totalTeams: INITIAL_EJL9_TEAMS.length,
      totalMatches: INITIAL_EJL9_MATCHES.length,
      matchesPlayed: INITIAL_EJL9_MATCHES.filter((m) => m.status === "COMPLETED" || m.status === "Completed").length,
      goalsScored: 27,
      avgGoalsPerMatch: 5.4,
    },
    ladder: INITIAL_EJL9_STANDINGS,
    schedule: scheduleRounds,
    teams: INITIAL_EJL9_TEAMS,
    stats: {
      totalTeams: INITIAL_EJL9_TEAMS.length,
      totalMatches: INITIAL_EJL9_MATCHES.length,
      matchesPlayed: 5,
      goalsScored: 27,
      avgGoalsPerMatch: 5.4,
      teamVsGoals: teamGoals,
      resultsDistribution: {
        decisiveWins: 5,
        draws: 0,
        competitiveGames: 5,
        totalCompleted: 5,
      },
      topScoringTeams: teamGoals.slice(0, 5),
    },
    graphs: {
      goalsPerRoundTrend: [
        { round: 1, roundLabel: "Round 1", totalGoals: 27 },
        { round: 2, roundLabel: "Round 2", totalGoals: 18 },
        { round: 3, roundLabel: "Round 3", totalGoals: 21 },
      ],
      pointsProgression: [
        {
          teamName: "Coach Max KOBI",
          progression: [
            { round: 1, roundLabel: "R1", points: 3 },
            { round: 2, roundLabel: "R2", points: 6 },
            { round: 3, roundLabel: "R3", points: 9 },
          ],
        },
      ],
      teamWinEfficiency: INITIAL_EJL9_STANDINGS.slice(0, 8).map((s) => ({
        teamName: s.team?.teamName || s.teamName || "",
        played: s.played,
        won: s.won,
        winEfficiency: Math.round((s.won / (s.played || 1)) * 100),
      })),
    },
    teamManagement: INITIAL_EJL9_TEAMS,
  };

  saveLocalLeagueData(leagueId, initialData);
  return initialData;
}

// Master Fetch Endpoint
export const getLeagueMasterData = async (leagueId: string): Promise<BackendLeagueData> => {
  try {
    const res = await leagueService.getLeagueData(leagueId);
    const data = res?.data || res;
    if (data && (data.league || data.details || data.teams || data.ladder)) {
      if (!data.league && data.details) data.league = data.details;
      if (!data.details && data.league) data.details = data.league;
      return data;
    }
  } catch (e) {
    // fallback to local/cached state
  }
  return initLeagueState(leagueId);
};

export const getLeagueById = async (leagueId: string): Promise<League> => {
  const master = await getLeagueMasterData(leagueId);
  return master.league || master.details;
};

export const updateLeagueDetails = async (
  leagueId: string,
  payload: Partial<League>,
  file?: File
): Promise<any> => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.season) formData.append("season", payload.season);
  if (payload.type || payload.competitionScope) {
    formData.append("competitionScope", payload.type || payload.competitionScope || "NATIONAL");
    formData.append("type", payload.type || payload.competitionScope || "NATIONAL");
  }
  if (payload.description) formData.append("description", payload.description);
  if (payload.startDate) formData.append("startDate", payload.startDate);
  if (payload.endDate) formData.append("endDate", payload.endDate);
  if (payload.registrationStartDate || payload.registrationOpenDate) {
    formData.append(
      "registrationStartDate",
      payload.registrationStartDate || payload.registrationOpenDate || ""
    );
  }
  if (payload.registrationEndDate || payload.registrationCloseDate) {
    formData.append(
      "registrationEndDate",
      payload.registrationEndDate || payload.registrationCloseDate || ""
    );
  }
  if (payload.status) formData.append("status", payload.status);
  if (payload.visibility) formData.append("visibility", payload.visibility);
  if (payload.pointsForWin !== undefined) formData.append("pointsForWin", String(payload.pointsForWin));
  if (payload.pointsForDraw !== undefined) formData.append("pointsForDraw", String(payload.pointsForDraw));
  if (payload.allowDraws !== undefined) formData.append("allowDraws", String(payload.allowDraws));
  if (payload.automaticLadderRecalculation !== undefined) {
    formData.append(
      "automaticLadderRecalculation",
      String(payload.automaticLadderRecalculation)
    );
  }
  if (file) {
    formData.append("leagueLogo", file);
  }

  try {
    const res = await leagueService.updateLeagueConfig(leagueId, formData);
    return res;
  } catch (e) {
    // update local state
    const state = initLeagueState(leagueId);
    const updatedLeague = { ...state.league, ...payload };
    state.league = updatedLeague;
    state.details = updatedLeague;
    saveLocalLeagueData(leagueId, state);
    return updatedLeague;
  }
};

export const getLeagueLadder = async (leagueId: string): Promise<TeamStanding[]> => {
  const master = await getLeagueMasterData(leagueId);
  if (Array.isArray(master.ladder) && master.ladder.length > 0) {
    return master.ladder;
  }

  // If ladder array is empty, construct standings from participating teams
  const teams = master.teams || master.teamManagement || [];
  if (Array.isArray(teams) && teams.length > 0) {
    return teams.map((t: any, idx: number) => {
      const rec = t.record || {};
      const teamName = t.teamName || t.name || `Team ${idx + 1}`;
      return {
        rank: idx + 1,
        position: idx + 1,
        teamId: t._id,
        teamName,
        teamLogo: t.logo || "",
        team: {
          _id: t._id,
          teamName,
          logo: t.logo || "",
          ageGroup: t.ageGroup || "",
        },
        played: rec.played ?? 0,
        won: rec.won ?? 0,
        drawn: rec.drawn ?? rec.draw ?? 0,
        draw: rec.drawn ?? rec.draw ?? 0,
        lost: rec.lost ?? 0,
        goalsFor: rec.goalsFor ?? 0,
        goalsAgainst: rec.goalsAgainst ?? 0,
        goalDifference: rec.goalDifference ?? 0,
        points: rec.points ?? 0,
      };
    });
  }

  return [];
};

export const getLeagueSchedule = async (leagueId: string, round?: number): Promise<RoundSchedule[]> => {
  const master = await getLeagueMasterData(leagueId);
  let sched = master.schedule || [];
  if (Array.isArray(sched) && sched.length > 0) {
    if (round) {
      sched = sched.filter((s) => s.round === round);
    }
    return sched;
  }

  // Check if fixtures are returned at top level
  const fixtures: Match[] = (master as any).fixtures || [];
  if (Array.isArray(fixtures) && fixtures.length > 0) {
    const roundsMap: { [key: number]: Match[] } = {};
    fixtures.forEach((f) => {
      const r = f.round || 1;
      if (!roundsMap[r]) roundsMap[r] = [];
      roundsMap[r].push(f);
    });
    return Object.keys(roundsMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map((rNum) => ({
        round: rNum,
        roundName: `Round ${rNum}`,
        matches: roundsMap[rNum],
      }));
  }

  return [];
};

export const getLeagueMatches = async (leagueId: string): Promise<Match[]> => {
  const master = await getLeagueMasterData(leagueId);
  if (Array.isArray((master as any).fixtures) && (master as any).fixtures.length > 0) {
    return (master as any).fixtures;
  }
  const schedules = await getLeagueSchedule(leagueId);
  const allMatches: Match[] = [];
  schedules.forEach((round) => {
    if (Array.isArray(round.matches)) {
      round.matches.forEach((m) => {
        allMatches.push({
          ...m,
          round: m.round || round.round,
          roundName: m.roundName || round.roundName,
        });
      });
    }
  });

  if (allMatches.length > 0) return allMatches;
  // Only use mock data for ejl9 demo
  if (leagueId === "ejl9") return INITIAL_EJL9_MATCHES;
  return [];
};

export const generateRandomFixtures = async (
  leagueId: string,
  forceRegenerate = false
): Promise<GenerateFixturesResponse> => {
  try {
    const res = await leagueService.generateRandomFixtures(leagueId, forceRegenerate);
    return res;
  } catch (err: any) {
    if (err?.response?.data) {
      throw err;
    }
    // Local state fallback for demo / offline
    const state = initLeagueState(leagueId);
    const teams = state.teams || [];
    if (teams.length >= 2) {
      const numRounds = 9;
      const roundsMap: { [r: number]: Match[] } = {};
      for (let r = 1; r <= numRounds; r++) {
        roundsMap[r] = [];
        const shuffled = [...teams].sort(() => Math.random() - 0.5);
        for (let i = 0; i < shuffled.length - 1; i += 2) {
          roundsMap[r].push({
            _id: `m_rnd_${r}_${i}_${Date.now()}`,
            leagueId,
            round: r,
            roundName: `Round ${r}`,
            homeTeam: { _id: shuffled[i]._id, teamName: shuffled[i].teamName, logo: shuffled[i].logo },
            awayTeam: { _id: shuffled[i + 1]._id, teamName: shuffled[i + 1].teamName, logo: shuffled[i + 1].logo },
            matchDate: new Date(Date.now() + (r - 1) * 7 * 86400000).toISOString().split("T")[0],
            time: "10:00 am",
            field: `Field ${Math.floor(i / 2) + 1}`,
            venue: "Main Stadium",
            status: "Scheduled",
            fixtureSource: "GENERATED",
            isManuallyModified: false,
          });
        }
      }
      state.schedule = Object.keys(roundsMap).map((rKey) => ({
        round: Number(rKey),
        roundName: `Round ${rKey}`,
        matches: roundsMap[Number(rKey)],
      }));
      saveLocalLeagueData(leagueId, state);
      return {
        success: true,
        message: "Fixtures generated locally",
        data: {
          leagueId,
          teams: teams.length,
          rounds: numRounds,
          fixtures: Math.floor(teams.length / 2) * numRounds,
          created: 0,
          updated: Math.floor(teams.length / 2) * numRounds,
          manualFixturesPreserved: 0,
          byes: teams.length % 2 === 1 ? numRounds : 0,
        },
      };
    }
    throw err;
  }
};

export const createManualFixture = async (
  leagueId: string,
  matchData: any
): Promise<any> => {
  return createLeagueMatch(leagueId, {
    ...matchData,
    fixtureSource: "MANUAL",
    isManuallyModified: true,
  });
};

export const updateFixtureManually = async (
  leagueId: string,
  fixtureId: string,
  payload: any
): Promise<any> => {
  try {
    const res = await leagueService.updateFixtureManually(leagueId, fixtureId, {
      ...payload,
      fixtureSource: "MANUAL",
      isManuallyModified: true,
    });
    return res;
  } catch (e) {
    return updateLeagueMatch(leagueId, fixtureId, {
      ...payload,
      fixtureSource: "MANUAL",
      isManuallyModified: true,
    });
  }
};

export const deleteFixture = async (
  leagueId: string,
  fixtureId: string
): Promise<any> => {
  return deleteLeagueMatch(leagueId, fixtureId);
};

export const createLeagueMatch = async (
  leagueId: string,
  matchData: Partial<Match>
): Promise<any> => {
  const fixturePayload: CreateFixturePayload = {
    league: leagueId,
    round: matchData.round || 1,
    kickoffTime: matchData.kickoffTime || matchData.matchDate || new Date().toISOString(),
    sessionDate: matchData.sessionDate,
    venue: matchData.venue || matchData.field || "Field 1",
    field: matchData.field || "Field 1",
    referee: matchData.referee,
    homeTeam: matchData.homeTeam?._id || "",
    awayTeam: matchData.awayTeam?._id || "",
  };

  try {
    return await leagueService.createFixture(fixturePayload);
  } catch (e) {
    // local state update
    const state = initLeagueState(leagueId);
    const newMatch: Match = {
      _id: "m_" + Date.now(),
      leagueId,
      round: matchData.round || 1,
      roundName: `Round ${matchData.round || 1}`,
      kickoffTime: fixturePayload.kickoffTime,
      sessionDate: matchData.sessionDate,
      matchDate: matchData.matchDate || new Date().toISOString().split("T")[0],
      matchDateFormatted: matchData.matchDateFormatted || "Upcoming",
      time: matchData.time || "2:00 pm",
      field: matchData.field || fixturePayload.venue,
      venue: fixturePayload.venue,
      homeTeam: matchData.homeTeam || { _id: "h", name: "Home" },
      awayTeam: matchData.awayTeam || { _id: "a", name: "Away" },
      score: { homeScore: matchData.homeScore ?? null, awayScore: matchData.awayScore ?? null },
      homeScore: matchData.homeScore ?? null,
      awayScore: matchData.awayScore ?? null,
      status: matchData.status || "SCHEDULED",
      referee: matchData.referee,
      fixtureSource: matchData.fixtureSource || "MANUAL",
      isManuallyModified: matchData.isManuallyModified ?? true,
    };

    let targetRound = state.schedule.find((r) => r.round === newMatch.round);
    if (!targetRound) {
      targetRound = { round: newMatch.round, roundName: `Round ${newMatch.round}`, matches: [] };
      state.schedule.push(targetRound);
    }
    targetRound.matches.push(newMatch);
    saveLocalLeagueData(leagueId, state);
    return newMatch;
  }
};

export const updateLeagueMatch = async (
  leagueId: string,
  matchId: string,
  matchData: Partial<Match>
): Promise<any> => {
  try {
    return await leagueService.updateFixtureManually(leagueId, matchId, matchData);
  } catch (e) {
    const state = initLeagueState(leagueId);
    state.schedule.forEach((round) => {
      round.matches = round.matches.map((m) => {
        if (m._id === matchId) {
          return { ...m, ...matchData };
        }
        return m;
      });
    });
    saveLocalLeagueData(leagueId, state);
    return matchData;
  }
};

export const deleteLeagueMatch = async (leagueId: string, matchId: string): Promise<any> => {
  try {
    return await leagueService.deleteLeagueFixture(leagueId, matchId);
  } catch (e) {
    const state = initLeagueState(leagueId);
    state.schedule.forEach((round) => {
      round.matches = round.matches.filter((m) => m._id !== matchId);
    });
    saveLocalLeagueData(leagueId, state);
    return true;
  }
};

export const getLeagueTeams = async (leagueId: string): Promise<LeagueTeam[]> => {
  const master = await getLeagueMasterData(leagueId);
  return master.teams || master.teamManagement || [];
};

export const addTeamToLeague = async (leagueId: string, teamIds: string[]): Promise<any> => {
  try {
    return await leagueService.addTeamToLeague(leagueId, teamIds);
  } catch (e) {
    const state = initLeagueState(leagueId);
    teamIds.forEach((tId) => {
      if (!state.teams.some((t) => t._id === tId)) {
        state.teams.push({
          _id: tId,
          teamName: "Enrolled Academy Team",
          playersCount: 12,
          status: "ACTIVE",
          record: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
        });
      }
    });
    saveLocalLeagueData(leagueId, state);
    return true;
  }
};

export const removeTeamFromLeague = async (leagueId: string, teamId: string): Promise<any> => {
  try {
    return await leagueService.removeTeamFromLeague(leagueId, teamId);
  } catch (e) {
    const state = initLeagueState(leagueId);
    state.teams = state.teams.filter((t) => t._id !== teamId);
    if (state.teamManagement) {
      state.teamManagement = state.teamManagement.filter((t) => t._id !== teamId);
    }
    saveLocalLeagueData(leagueId, state);
    return true;
  }
};

export const toggleTeamStatus = async (
  leagueId: string,
  teamId: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<any> => {
  const state = initLeagueState(leagueId);
  state.teams = state.teams.map((t) => (t._id === teamId ? { ...t, status } : t));
  if (state.teamManagement) {
    state.teamManagement = state.teamManagement.map((t) =>
      t._id === teamId ? { ...t, status } : t
    );
  }
  saveLocalLeagueData(leagueId, state);
  return true;
};

export const getLeagueStats = async (leagueId: string): Promise<LeagueStats> => {
  const master = await getLeagueMasterData(leagueId);
  return master.stats;
};

export const getLeagueGraphs = async (leagueId: string): Promise<LeagueGraphs> => {
  const master = await getLeagueMasterData(leagueId);
  return master.graphs;
};

export const recalculateLeagueLadder = async (leagueId: string): Promise<any> => {
  try {
    return await leagueService.recalculateLadder(leagueId);
  } catch (e) {
    return true;
  }
};

export const updateLeagueTeamStats = async (
  leagueId: string,
  teamId: string,
  stats: Partial<TeamRecord>
): Promise<any> => {
  try {
    return await leagueService.updateLeagueTeamStats(leagueId, teamId, stats);
  } catch (e) {
    const state = initLeagueState(leagueId);
    state.teams = state.teams.map((t) => {
      if (t._id === teamId) {
        return { ...t, record: { ...(t.record || {}), ...stats } as any };
      }
      return t;
    });
    if (state.teamManagement) {
      state.teamManagement = state.teamManagement.map((t) => {
        if (t._id === teamId) {
          return { ...t, record: { ...(t.record || {}), ...stats } as any };
        }
        return t;
      });
    }
    saveLocalLeagueData(leagueId, state);
    return stats;
  }
};

export const updateTeamGlobalStats = async (
  teamId: string,
  stats: Partial<TeamRecord>
): Promise<any> => {
  return await leagueService.updateTeamStats(teamId, stats);
};
