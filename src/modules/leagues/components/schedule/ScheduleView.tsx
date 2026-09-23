import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit2,
  Trash2,
  Trophy,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Match, MatchStatus } from "../../types/league";
import {
  useLeagueMatches,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
} from "../../hooks/useLeagueMatches";
import { useLeagueTeams } from "../../hooks/useLeagueTeams";
import { useLeaguePermissions } from "../../hooks/useLeaguePermissions";
import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import { toast } from "react-hot-toast";

interface ScheduleViewProps {
  leagueId: string;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ leagueId }) => {
  const { data: matches = [], isLoading } = useLeagueMatches(leagueId);
  const { data: teams = [] } = useLeagueTeams(leagueId);
  const { canManageMatches, canEnterResults } = useLeaguePermissions();

  const createMatchMutation = useCreateMatch(leagueId);
  const updateMatchMutation = useUpdateMatch(leagueId);
  const deleteMatchMutation = useDeleteMatch(leagueId);

  // Filter & Accordion State
  const [roundFilter, setRoundFilter] = useState<string>("ALL");
  const [collapsedRounds, setCollapsedRounds] = useState<Record<number, boolean>>({});
  const [activeActionMatchId, setActiveActionMatchId] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Add Match Form
  const [addForm, setAddForm] = useState({
    round: 1,
    matchDate: new Date().toISOString().split("T")[0],
    matchDateFormatted: "",
    time: "2:00 pm",
    field: "Field 1",
    venue: "Main Stadium",
    homeTeamId: "",
    awayTeamId: "",
    referee: "",
    status: "Scheduled" as MatchStatus,
    notes: "",
  });

  // Edit Match Form
  const [editForm, setEditForm] = useState({
    round: 1,
    matchDate: "",
    time: "",
    field: "",
    venue: "",
    homeTeamId: "",
    awayTeamId: "",
    homeScore: 0,
    awayScore: 0,
    status: "Scheduled" as MatchStatus,
    referee: "",
    notes: "",
  });

  // Result Entry Form with Statistics
  const [resultForm, setResultForm] = useState({
    homeScore: 0,
    awayScore: 0,
    status: "Completed" as MatchStatus,
    showStats: false,
    homePossession: 50,
    awayPossession: 50,
    homeShots: 0,
    awayShots: 0,
    homeShotsOnTarget: 0,
    awayShotsOnTarget: 0,
    homeCorners: 0,
    awayCorners: 0,
    homeFouls: 0,
    awayFouls: 0,
    homeYellowCards: 0,
    awayYellowCards: 0,
  });

  // Group matches by round
  const groupedRounds = useMemo(() => {
    const map: Record<number, { round: number; roundName: string; dateFormatted: string; matches: Match[] }> = {};

    matches.forEach((m) => {
      if (!map[m.round]) {
        map[m.round] = {
          round: m.round,
          roundName: m.roundName || `Round ${m.round}`,
          dateFormatted: m.matchDateFormatted || m.matchDate || "Upcoming",
          matches: [],
        };
      }
      map[m.round].matches.push(m);
    });

    return Object.values(map).sort((a, b) => a.round - b.round);
  }, [matches]);

  const roundsList = useMemo(() => {
    return Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  }, [matches]);

  const filteredRounds = useMemo(() => {
    if (roundFilter === "ALL") return groupedRounds;
    return groupedRounds.filter((r) => r.round.toString() === roundFilter);
  }, [groupedRounds, roundFilter]);

  const toggleRoundCollapse = (round: number) => {
    setCollapsedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
  };

  // Open Edit Match
  const handleOpenEdit = (match: Match) => {
    setSelectedMatch(match);
    setEditForm({
      round: match.round,
      matchDate: match.matchDate || match.kickoffTime?.split("T")[0] || "",
      time: match.time || "",
      field: match.field || match.venue || "",
      venue: match.venue || "",
      homeTeamId: match.homeTeam._id,
      awayTeamId: match.awayTeam._id,
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
      status: match.status,
      referee: match.referee || "",
      notes: match.notes || "",
    });
    setActiveActionMatchId(null);
    setIsEditModalOpen(true);
  };

  // Open Result Entry
  const handleOpenResult = (match: Match) => {
    setSelectedMatch(match);
    const ms = match.matchStatistics;
    setResultForm({
      homeScore: match.score?.homeScore ?? match.homeScore ?? 0,
      awayScore: match.score?.awayScore ?? match.awayScore ?? 0,
      status: match.status || "Completed",
      showStats: !!ms,
      homePossession: ms?.homePossession ?? 50,
      awayPossession: ms?.awayPossession ?? 50,
      homeShots: ms?.homeShots ?? 0,
      awayShots: ms?.awayShots ?? 0,
      homeShotsOnTarget: ms?.homeShotsOnTarget ?? 0,
      awayShotsOnTarget: ms?.awayShotsOnTarget ?? 0,
      homeCorners: ms?.homeCorners ?? 0,
      awayCorners: ms?.awayCorners ?? 0,
      homeFouls: ms?.homeFouls ?? 0,
      awayFouls: ms?.awayFouls ?? 0,
      homeYellowCards: ms?.homeYellowCards ?? 0,
      awayYellowCards: ms?.awayYellowCards ?? 0,
    });
    setActiveActionMatchId(null);
    setIsResultModalOpen(true);
  };

  // Submit Add Match
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.homeTeamId === addForm.awayTeamId) {
      toast.error("Home and Away team cannot be the same");
      return;
    }

    const homeTeamObj = teams.find((t) => t._id === addForm.homeTeamId);
    const awayTeamObj = teams.find((t) => t._id === addForm.awayTeamId);

    const dateObj = new Date(addForm.matchDate);
    const dateFormatted = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : addForm.matchDate;

    let kickoffIso = new Date().toISOString();
    try {
      const combined = new Date(`${addForm.matchDate} ${addForm.time}`);
      if (!isNaN(combined.getTime())) {
        kickoffIso = combined.toISOString();
      } else if (!isNaN(dateObj.getTime())) {
        kickoffIso = dateObj.toISOString();
      }
    } catch {
      kickoffIso = new Date().toISOString();
    }

    createMatchMutation.mutate(
      {
        round: Number(addForm.round),
        roundName: `Round ${addForm.round}`,
        kickoffTime: kickoffIso,
        matchDate: addForm.matchDate,
        matchDateFormatted: dateFormatted,
        time: addForm.time,
        field: addForm.field,
        venue: addForm.venue || addForm.field || "Field 1",
        homeTeam: {
          _id: homeTeamObj?._id || addForm.homeTeamId,
          name: homeTeamObj?.name || "Home Team",
          logo: homeTeamObj?.logo,
        },
        awayTeam: {
          _id: awayTeamObj?._id || addForm.awayTeamId,
          name: awayTeamObj?.name || "Away Team",
          logo: awayTeamObj?.logo,
        },
        status: addForm.status,
        referee: addForm.referee,
        notes: addForm.notes,
        homeScore: addForm.status === "Completed" ? 0 : null,
        awayScore: addForm.status === "Completed" ? 0 : null,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setAddForm({
            round: 1,
            matchDate: new Date().toISOString().split("T")[0],
            matchDateFormatted: "",
            time: "2:00 pm",
            field: "Field 1",
            venue: "Main Stadium",
            homeTeamId: "",
            awayTeamId: "",
            referee: "",
            status: "Scheduled",
            notes: "",
          });
        },
      }
    );
  };

  // Submit Edit Match
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    if (editForm.homeTeamId === editForm.awayTeamId) {
      toast.error("Home and Away team cannot be the same");
      return;
    }

    const homeTeamObj = teams.find((t) => t._id === editForm.homeTeamId);
    const awayTeamObj = teams.find((t) => t._id === editForm.awayTeamId);

    let kickoffIso: string | undefined = undefined;
    if (editForm.matchDate) {
      try {
        const combined = new Date(`${editForm.matchDate} ${editForm.time}`);
        if (!isNaN(combined.getTime())) {
          kickoffIso = combined.toISOString();
        } else {
          const d = new Date(editForm.matchDate);
          if (!isNaN(d.getTime())) kickoffIso = d.toISOString();
        }
      } catch {
        // fallback
      }
    }

    updateMatchMutation.mutate(
      {
        matchId: selectedMatch._id,
        data: {
          round: Number(editForm.round),
          roundName: `Round ${editForm.round}`,
          kickoffTime: kickoffIso,
          matchDate: editForm.matchDate,
          time: editForm.time,
          field: editForm.field,
          venue: editForm.venue || editForm.field,
          homeTeam: {
            _id: homeTeamObj?._id || editForm.homeTeamId,
            name: homeTeamObj?.name || selectedMatch.homeTeam.name,
            logo: homeTeamObj?.logo,
          },
          awayTeam: {
            _id: awayTeamObj?._id || editForm.awayTeamId,
            name: awayTeamObj?.name || selectedMatch.awayTeam.name,
            logo: awayTeamObj?.logo,
          },
          homeScore: editForm.status === "Completed" ? Number(editForm.homeScore) : null,
          awayScore: editForm.status === "Completed" ? Number(editForm.awayScore) : null,
          status: editForm.status,
          referee: editForm.referee,
          notes: editForm.notes,
        },
      },
      {
        onSuccess: () => setIsEditModalOpen(false),
      }
    );
  };

  // Submit Result Entry
  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const matchStatisticsPayload = resultForm.showStats
      ? {
          homePossession: Number(resultForm.homePossession),
          awayPossession: Number(resultForm.awayPossession),
          homeShots: Number(resultForm.homeShots),
          awayShots: Number(resultForm.awayShots),
          homeShotsOnTarget: Number(resultForm.homeShotsOnTarget),
          awayShotsOnTarget: Number(resultForm.awayShotsOnTarget),
          homeCorners: Number(resultForm.homeCorners),
          awayCorners: Number(resultForm.awayCorners),
          homeFouls: Number(resultForm.homeFouls),
          awayFouls: Number(resultForm.awayFouls),
          homeYellowCards: Number(resultForm.homeYellowCards),
          awayYellowCards: Number(resultForm.awayYellowCards),
        }
      : undefined;

    updateMatchMutation.mutate(
      {
        matchId: selectedMatch._id,
        data: {
          homeScore: Number(resultForm.homeScore),
          awayScore: Number(resultForm.awayScore),
          status: resultForm.status || "COMPLETED",
          matchStatistics: matchStatisticsPayload,
        },
      },
      {
        onSuccess: () => {
          setIsResultModalOpen(false);
          toast.success("Match result & statistics updated! Standings automatically refreshed.");
        },
      }
    );
  };

  // Download Schedule
  const handleExport = (type: "CSV" | "EXCEL" | "PDF") => {
    setIsDownloadOpen(false);
    if (type === "CSV" || type === "EXCEL") {
      const headers = ["Round", "Date", "Time", "Field", "Home Team", "Home Score", "Away Score", "Away Team", "Status", "Venue", "Referee"];
      const rows = matches.map((m) => {
        const hName = m.homeTeam?.teamName || m.homeTeam?.name || "Home Team";
        const aName = m.awayTeam?.teamName || m.awayTeam?.name || "Away Team";
        return [
          m.round,
          `"${m.matchDateFormatted || m.matchDate || ""}"`,
          `"${m.time || ""}"`,
          `"${m.field || m.venue || ""}"`,
          `"${hName.replace(/"/g, '""')}"`,
          m.homeScore ?? "-",
          m.awayScore ?? "-",
          `"${aName.replace(/"/g, '""')}"`,
          m.status,
          `"${m.venue || ""}"`,
          `"${m.referee || ""}"`,
        ];
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `League_Schedule_${type === "EXCEL" ? "Export.csv" : "Export.csv"}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${type} schedule exported successfully`);
    } else {
      window.print();
    }
  };

  const getTeamInitials = (name: string) => {
    const clean = name.replace(/Coach\s*Max/gi, "").trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase() || "TM";
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "Completed":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
            Completed
          </span>
        );
      case "Scheduled":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
            Scheduled
          </span>
        );
      case "Live":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 animate-pulse">
            Live
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300">
            Cancelled
          </span>
        );
      case "Postponed":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
            Postponed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      {/* Top Header & Actions Bar (Matches Screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Schedule
          </h2>

          {/* All Rounds Dropdown Selector */}
          <div className="relative">
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Rounds</option>
              {roundsList.map((r) => (
                <option key={r} value={r.toString()}>
                  Round {r}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Right Buttons: Download & Add Match */}
        <div className="flex items-center gap-2.5">
          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-xs cursor-pointer transition-all"
            >
              <Download size={13} className="text-slate-500" />
              <span>Download</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {isDownloadOpen && (
              <div className="absolute right-0 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1 text-xs">
                <button
                  onClick={() => handleExport("CSV")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileText size={13} className="text-blue-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExport("EXCEL")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileSpreadsheet size={13} className="text-emerald-500" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => handleExport("PDF")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <FileText size={13} className="text-rose-500" />
                  <span>Print / PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Match Button */}
          {canManageMatches && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>Add Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Rounds Grouping Accordions */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-2" />
            <span className="text-xs font-semibold">Loading Schedule...</span>
          </div>
        ) : filteredRounds.length === 0 ? (
          <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <CalendarDays size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matches found</p>
            <p className="text-xs text-slate-400">Add fixtures to get started with the league schedule.</p>
          </div>
        ) : (
          filteredRounds.map((roundGroup) => {
            const isCollapsed = !!collapsedRounds[roundGroup.round];

            return (
              <div
                key={roundGroup.round}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-900"
              >
                {/* Accordion Header (Matches Screenshot 2: "Round 1 - Saturday 25 July 2026") */}
                <div
                  onClick={() => toggleRoundCollapse(roundGroup.round)}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {roundGroup.roundName}
                    </span>
                    <span className="text-slate-400 font-bold">-</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {roundGroup.dateFormatted}
                    </span>
                  </div>

                  <div className="text-slate-400 hover:text-slate-600">
                    {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </div>

                {/* Match Table inside Round */}
                {!isCollapsed && (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[90px]">Time</th>
                          <th className="py-3 px-4 min-w-[90px]">Field</th>
                          <th className="py-3 px-4 min-w-[200px]">Home Team</th>
                          <th className="py-3 px-4 min-w-[90px] text-center">Score</th>
                          <th className="py-3 px-4 min-w-[200px]">Away Team</th>
                          <th className="py-3 px-4 min-w-[110px]">Status</th>
                          <th className="py-3 px-4 w-12 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {roundGroup.matches.map((match) => {
                          const homeName = match.homeTeam.teamName || match.homeTeam.name || "Home";
                          const awayName = match.awayTeam.teamName || match.awayTeam.name || "Away";
                          const homeLogo = match.homeTeam.logo;
                          const awayLogo = match.awayTeam.logo;
                          const fieldVenue = match.venue || match.field || "Field 1";
                          const matchTime =
                            match.time ||
                            (match.kickoffTime
                              ? new Date(match.kickoffTime).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "2:00 pm");
                          const homeScore = match.score?.homeScore ?? match.homeScore;
                          const awayScore = match.score?.awayScore ?? match.awayScore;
                          const isCompleted =
                            match.status === "COMPLETED" ||
                            match.status === "Completed" ||
                            (homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined);

                          return (
                            <tr
                              key={match._id}
                              className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              {/* Time */}
                              <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {matchTime}
                              </td>

                              {/* Field */}
                              <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {fieldVenue}
                              </td>

                              {/* Home Team */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-[9px] font-bold text-slate-700 dark:text-slate-200">
                                    {homeLogo ? (
                                      <img
                                        src={homeLogo}
                                        alt={homeName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{getTeamInitials(homeName)}</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                    {homeName}
                                  </span>
                                </div>
                              </td>

                              {/* Score (Matches Screenshot 2: e.g. "4 - 1" or "- - -") */}
                              <td className="py-4 px-4 text-center">
                                {isCompleted &&
                                homeScore !== null &&
                                awayScore !== null &&
                                homeScore !== undefined &&
                                awayScore !== undefined ? (
                                  <span className="font-black text-sm text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                    {homeScore} - {awayScore}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-bold tracking-widest text-xs">
                                    - - -
                                  </span>
                                )}
                              </td>

                              {/* Away Team */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-[9px] font-bold text-slate-700 dark:text-slate-200">
                                    {awayLogo ? (
                                      <img
                                        src={awayLogo}
                                        alt={awayName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{getTeamInitials(awayName)}</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                    {awayName}
                                  </span>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                {getStatusBadge(match.status)}
                              </td>

                            {/* Actions Dropdown */}
                            <td className="py-4 px-4 text-right relative">
                              <button
                                onClick={() =>
                                  setActiveActionMatchId(
                                    activeActionMatchId === match._id ? null : match._id
                                  )
                                }
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {activeActionMatchId === match._id && (
                                <div className="absolute right-4 top-10 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1 text-xs text-left animate-in fade-in zoom-in-95 duration-75">
                                  {canEnterResults && (
                                    <button
                                      onClick={() => handleOpenResult(match)}
                                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-emerald-600 font-semibold"
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>Enter Result</span>
                                    </button>
                                  )}

                                  {canManageMatches && (
                                    <>
                                      <button
                                        onClick={() => handleOpenEdit(match)}
                                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold"
                                      >
                                        <Edit2 size={13} className="text-blue-500" />
                                        <span>Edit Match</span>
                                      </button>

                                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                                        <button
                                          onClick={() => {
                                            setActiveActionMatchId(null);
                                            if (confirm("Are you sure you want to delete this match?")) {
                                              deleteMatchMutation.mutate(match._id);
                                            }
                                          }}
                                          className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 font-semibold"
                                        >
                                          <Trash2 size={13} />
                                          <span>Delete Match</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= ADD MATCH MODAL ================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="max-w-[600px] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Match Fixture</h3>
            <p className="text-xs text-slate-500">Schedule a new match between participating teams.</p>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Round Number *
              </label>
              <input
                type="number"
                min={1}
                value={addForm.round}
                onChange={(e) => setAddForm({ ...addForm, round: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Match Date *
              </label>
              <input
                type="date"
                value={addForm.matchDate}
                onChange={(e) => setAddForm({ ...addForm, matchDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Kickoff Time *
              </label>
              <input
                type="text"
                placeholder="e.g. 2:00 pm"
                value={addForm.time}
                onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Field / Pitch
              </label>
              <input
                type="text"
                placeholder="e.g. Field 1"
                value={addForm.field}
                onChange={(e) => setAddForm({ ...addForm, field: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Home Team *
              </label>
              <select
                value={addForm.homeTeamId}
                onChange={(e) => setAddForm({ ...addForm, homeTeamId: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              >
                <option value="">Select Home Team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Away Team *
              </label>
              <select
                value={addForm.awayTeamId}
                onChange={(e) => setAddForm({ ...addForm, awayTeamId: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              >
                <option value="">Select Away Team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Referee
              </label>
              <input
                type="text"
                placeholder="Referee name"
                value={addForm.referee}
                onChange={(e) => setAddForm({ ...addForm, referee: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Initial Status
              </label>
              <select
                value={addForm.status}
                onChange={(e) => setAddForm({ ...addForm, status: e.target.value as MatchStatus })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Ground rules, weather check"
              value={addForm.notes}
              onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={createMatchMutation.isPending}>
              {createMatchMutation.isPending ? "Creating..." : "Schedule Match"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= EDIT MATCH MODAL ================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-w-[600px] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
            <Edit2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Match Details</h3>
            <p className="text-xs text-slate-500">Update match timings, teams, venue, and score.</p>
          </div>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Round
              </label>
              <input
                type="number"
                value={editForm.round}
                onChange={(e) => setEditForm({ ...editForm, round: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as MatchStatus })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Match Date
              </label>
              <input
                type="date"
                value={editForm.matchDate}
                onChange={(e) => setEditForm({ ...editForm, matchDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Kickoff Time
              </label>
              <input
                type="text"
                value={editForm.time}
                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Field
              </label>
              <input
                type="text"
                value={editForm.field}
                onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Referee
              </label>
              <input
                type="text"
                value={editForm.referee}
                onChange={(e) => setEditForm({ ...editForm, referee: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {editForm.status === "Completed" && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 mb-2">
                Match Score
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Home Score
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={editForm.homeScore}
                    onChange={(e) => setEditForm({ ...editForm, homeScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Away Score
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={editForm.awayScore}
                    onChange={(e) => setEditForm({ ...editForm, awayScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={updateMatchMutation.isPending}>
              {updateMatchMutation.isPending ? "Saving..." : "Save Match"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= MATCH RESULT ENTRY MODAL ================= */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        className="max-w-[560px] p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Match Result & Statistics</h3>
            <p className="text-xs text-slate-500">
              Entering scores automatically updates standings, points, and statistics.
            </p>
          </div>
        </div>

        {selectedMatch && (
          <form onSubmit={handleResultSubmit} className="space-y-5">
            {/* Status Select */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Match Status
              </label>
              <select
                value={resultForm.status}
                onChange={(e) => setResultForm({ ...resultForm, status: e.target.value as MatchStatus })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              >
                <option value="COMPLETED">Completed</option>
                <option value="LIVE">Live</option>
                <option value="POSTPONED">Postponed</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>

            {/* Score Entry Box */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2 line-clamp-1">
                  {selectedMatch.homeTeam.teamName || selectedMatch.homeTeam.name}
                </span>
                <input
                  type="number"
                  min={0}
                  value={resultForm.homeScore}
                  onChange={(e) => setResultForm({ ...resultForm, homeScore: Number(e.target.value) })}
                  className="w-16 h-12 text-center text-xl font-black rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Home</span>
              </div>

              <div className="px-3 font-black text-slate-400 text-lg">VS</div>

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2 line-clamp-1">
                  {selectedMatch.awayTeam.teamName || selectedMatch.awayTeam.name}
                </span>
                <input
                  type="number"
                  min={0}
                  value={resultForm.awayScore}
                  onChange={(e) => setResultForm({ ...resultForm, awayScore: Number(e.target.value) })}
                  className="w-16 h-12 text-center text-xl font-black rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Away</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-bold">Auto-calculation preview: </span>
              {resultForm.homeScore > resultForm.awayScore ? (
                <span>{selectedMatch.homeTeam.teamName || selectedMatch.homeTeam.name} wins (+3 pts).</span>
              ) : resultForm.homeScore < resultForm.awayScore ? (
                <span>{selectedMatch.awayTeam.teamName || selectedMatch.awayTeam.name} wins (+3 pts).</span>
              ) : (
                <span>Draw (+1 pt to each team).</span>
              )}
            </div>

            {/* Toggle Match Statistics Section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Match Telemetry & Statistics
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Record possession, shots, fouls, and yellow cards
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="toggle-stats-entry"
                  checked={resultForm.showStats}
                  onChange={(e) => setResultForm({ ...resultForm, showStats: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                />
              </div>

              {resultForm.showStats && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <div className="grid grid-cols-3 gap-2 items-center text-center font-bold text-[11px] text-slate-500 mb-1">
                    <span>Home</span>
                    <span>Metric</span>
                    <span>Away</span>
                  </div>

                  {/* Possession */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={resultForm.homePossession}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        setResultForm({ ...resultForm, homePossession: h, awayPossession: Math.max(0, 100 - h) });
                      }}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Possession %</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={resultForm.awayPossession}
                      onChange={(e) => {
                        const a = Number(e.target.value);
                        setResultForm({ ...resultForm, awayPossession: a, homePossession: Math.max(0, 100 - a) });
                      }}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Total Shots */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={resultForm.homeShots}
                      onChange={(e) => setResultForm({ ...resultForm, homeShots: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Total Shots</span>
                    <input
                      type="number"
                      min={0}
                      value={resultForm.awayShots}
                      onChange={(e) => setResultForm({ ...resultForm, awayShots: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Shots on Target */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={resultForm.homeShotsOnTarget}
                      onChange={(e) => setResultForm({ ...resultForm, homeShotsOnTarget: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Shots on Target</span>
                    <input
                      type="number"
                      min={0}
                      value={resultForm.awayShotsOnTarget}
                      onChange={(e) => setResultForm({ ...resultForm, awayShotsOnTarget: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Corners */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={resultForm.homeCorners}
                      onChange={(e) => setResultForm({ ...resultForm, homeCorners: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Corners</span>
                    <input
                      type="number"
                      min={0}
                      value={resultForm.awayCorners}
                      onChange={(e) => setResultForm({ ...resultForm, awayCorners: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Fouls */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={resultForm.homeFouls}
                      onChange={(e) => setResultForm({ ...resultForm, homeFouls: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Fouls</span>
                    <input
                      type="number"
                      min={0}
                      value={resultForm.awayFouls}
                      onChange={(e) => setResultForm({ ...resultForm, awayFouls: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Yellow Cards */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={resultForm.homeYellowCards}
                      onChange={(e) => setResultForm({ ...resultForm, homeYellowCards: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <span className="text-center font-semibold text-slate-600 dark:text-slate-300">Yellow Cards</span>
                    <input
                      type="number"
                      min={0}
                      value={resultForm.awayYellowCards}
                      onChange={(e) => setResultForm({ ...resultForm, awayYellowCards: Number(e.target.value) })}
                      className="px-2 py-1 text-center font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResultModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" size="sm" disabled={updateMatchMutation.isPending}>
                {updateMatchMutation.isPending ? "Updating..." : "Confirm & Save Result"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
