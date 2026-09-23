import React, { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Plus,
  Trash2,
  ExternalLink,
  UserCheck,
  Search,
  Sliders,
} from "lucide-react";
import {
  useLeagueTeams,
  useAddTeamToLeague,
  useRemoveTeamFromLeague,
  useUpdateLeagueTeamStats,
} from "../../hooks/useLeagueTeams";
import { LeagueTeam } from "../../types/league";
import { useLeaguePermissions } from "../../hooks/useLeaguePermissions";
import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../../../../api/adminApi";
import { toast } from "react-hot-toast";

interface TeamsGridProps {
  leagueId: string;
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ leagueId }) => {
  const { data: teams = [], isLoading } = useLeagueTeams(leagueId);
  const { canManageTeams } = useLeaguePermissions();

  const addTeamMutation = useAddTeamToLeague(leagueId);
  const removeTeamMutation = useRemoveTeamFromLeague(leagueId);
  const updateStatsMutation = useUpdateLeagueTeamStats(leagueId);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedTeamForStats, setSelectedTeamForStats] = useState<LeagueTeam | null>(null);
  const [statsForm, setStatsForm] = useState({
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  });
  const [mode, setMode] = useState<"EXISTING" | "NEW">("EXISTING");

  // Fetch all academy teams for "Select Existing Team"
  const { data: allTeamsData } = useQuery({
    queryKey: ["allAcademyTeams"],
    queryFn: () => getAllTeams(),
    enabled: isAddModalOpen,
  });

  const allAcademyTeams: any[] = Array.isArray(allTeamsData)
    ? allTeamsData
    : allTeamsData?.data || [];

  // Form for New Team
  const [newTeamForm, setNewTeamForm] = useState({
    name: "",
    coach: "",
    coachEmail: "",
    playersCount: 12,
  });

  // Selected existing team ID
  const [selectedExistingTeamId, setSelectedExistingTeamId] = useState("");

  const filteredTeams = teams.filter((t) => {
    const tName = t.teamName || t.name || "";
    const coachStr =
      typeof t.coach === "object" && t.coach?.name
        ? t.coach.name
        : typeof t.coach === "string"
        ? t.coach
        : "";
    return (
      tName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coachStr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "EXISTING") {
      if (!selectedExistingTeamId) {
        toast.error("Please select a team");
        return;
      }

      // Validation: prevent duplicate
      const alreadyExists = teams.some((t) => t._id === selectedExistingTeamId);
      if (alreadyExists) {
        toast.error("This team is already participating in the league");
        return;
      }

      const teamObj = allAcademyTeams.find((t: any) => t._id === selectedExistingTeamId);
      addTeamMutation.mutate(
        {
          _id: teamObj?._id,
          name: teamObj?.teamName || "Selected Team",
          coach: teamObj?.coach?.name || teamObj?.coach || "Coach Unassigned",
          playersCount: teamObj?.players?.length || 10,
        },
        {
          onSuccess: () => {
            setIsAddModalOpen(false);
            setSelectedExistingTeamId("");
          },
        }
      );
    } else {
      if (!newTeamForm.name.trim()) {
        toast.error("Team name is required");
        return;
      }

      const alreadyExists = teams.some(
        (t) => (t.teamName || t.name || "").toLowerCase() === newTeamForm.name.trim().toLowerCase()
      );
      if (alreadyExists) {
        toast.error("A team with this name is already participating");
        return;
      }

      addTeamMutation.mutate(
        {
          name: newTeamForm.name.trim(),
          coach: newTeamForm.coach || "Unassigned",
          coachEmail: newTeamForm.coachEmail,
          playersCount: Number(newTeamForm.playersCount) || 0,
        },
        {
          onSuccess: () => {
            setIsAddModalOpen(false);
            setNewTeamForm({ name: "", coach: "", coachEmail: "", playersCount: 12 });
          },
        }
      );
    }
  };

  const handleOpenStatsModal = (t: LeagueTeam) => {
    setSelectedTeamForStats(t);
    setStatsForm({
      played: t.record?.played ?? (t.wins || 0) + (t.losses || 0) + (t.draws || 0),
      won: t.record?.won ?? t.wins ?? 0,
      drawn: t.record?.drawn ?? t.draws ?? 0,
      lost: t.record?.lost ?? t.losses ?? 0,
      goalsFor: t.record?.goalsFor ?? 0,
      goalsAgainst: t.record?.goalsAgainst ?? 0,
      points: t.record?.points ?? 0,
    });
    setIsStatsModalOpen(true);
  };

  const handleStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForStats) return;

    updateStatsMutation.mutate(
      {
        teamId: selectedTeamForStats._id,
        stats: {
          played: Number(statsForm.played),
          won: Number(statsForm.won),
          drawn: Number(statsForm.drawn),
          lost: Number(statsForm.lost),
          goalsFor: Number(statsForm.goalsFor),
          goalsAgainst: Number(statsForm.goalsAgainst),
          points: Number(statsForm.points),
        },
      },
      {
        onSuccess: () => {
          setIsStatsModalOpen(false);
          setSelectedTeamForStats(null);
        },
      }
    );
  };

  const getTeamInitials = (name: string) => {
    const clean = name.replace(/Coach\s*Max/gi, "").trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return clean.slice(0, 2).toUpperCase() || "TM";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Participating Teams ({teams.length})
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage clubs, squads, and academies enrolled in this league.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search team or coach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 w-44 sm:w-56 transition-all"
            />
          </div>

          {/* Add Team Button */}
          {canManageTeams && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>Add Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-2" />
          <span className="text-xs font-semibold">Loading Teams...</span>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Users size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No teams found</p>
          <p className="text-xs text-slate-400">Add teams to participate in this league competition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => {
            const teamName = team.teamName || team.name || "Academy Team";
            const coachName =
              typeof team.coach === "object" && team.coach?.name
                ? team.coach.name
                : typeof team.coach === "string"
                ? team.coach
                : "Unassigned";
            const wins = team.record?.won ?? team.wins ?? 0;
            const draws = team.record?.drawn ?? team.draws ?? 0;
            const losses = team.record?.lost ?? team.losses ?? 0;

            return (
              <div
                key={team._id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header: Crest & Name */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-slate-700 dark:text-slate-200">
                        {team.logo ? (
                          <img
                            src={
                              team.logo.startsWith("http")
                                ? team.logo
                                : `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/${team.logo.replace(/^\//, "")}`
                            }
                            alt={teamName}
                            onError={(e) => {
                              // Hide image on error to display fallback
                              (e.target as HTMLElement).style.display = "none";
                              const fallback = (e.target as HTMLElement).parentElement?.querySelector(".fallback-initials");
                              if (fallback) (fallback as HTMLElement).style.display = "inline";
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <span
                          className="fallback-initials"
                          style={{ display: team.logo ? "none" : "inline" }}
                        >
                          {getTeamInitials(teamName)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {teamName}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <UserCheck size={12} className="text-brand-500" />
                          <span>Coach: {coachName}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${
                        team.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {team.status || "ACTIVE"}
                    </span>
                  </div>

                  {/* Team Records & Player count */}
                  <div className="grid grid-cols-4 gap-2 py-3 px-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-center mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Players
                      </span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {team.playersCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                        Wins
                      </span>
                      <span className="text-xs font-black text-emerald-600">{wins}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-600 block">
                        Draws
                      </span>
                      <span className="text-xs font-black text-amber-600">{draws}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-600 block">
                        Losses
                      </span>
                      <span className="text-xs font-black text-rose-600">{losses}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/teams/${team._id}`}
                      className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>View Team</span>
                    </Link>

                    {canManageTeams && (
                      <button
                        onClick={() => handleOpenStatsModal(team)}
                        className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Override Team League Statistics"
                      >
                        <Sliders size={13} />
                        <span>Edit Stats</span>
                      </button>
                    )}
                  </div>

                  {canManageTeams && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${teamName} from this league?`)) {
                          removeTeamMutation.mutate(team._id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                      title="Remove from League"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADD TEAM MODAL ================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="max-w-[550px] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Team To League</h3>
            <p className="text-xs text-slate-500">
              Select an existing academy team or register a guest team.
            </p>
          </div>
        </div>

        {/* Mode Toggle: Existing vs New */}
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode("EXISTING")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              mode === "EXISTING"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Select Existing Team
          </button>
          <button
            type="button"
            onClick={() => setMode("NEW")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              mode === "NEW"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create New Team
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          {mode === "EXISTING" ? (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Existing Academy Team *
              </label>
              <select
                value={selectedExistingTeamId}
                onChange={(e) => setSelectedExistingTeamId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 cursor-pointer"
                required
              >
                <option value="" className="text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
                  Select a team...
                </option>
                {allAcademyTeams.map((t: any) => (
                  <option
                    key={t._id}
                    value={t._id}
                    className="text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  >
                    {t.teamName || t.name || "Academy Team"} {t.ageGroup ? `(${t.ageGroup})` : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Western Sydney Strikers"
                  value={newTeamForm.name}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Coach Name
                  </label>
                  <input
                    type="text"
                    placeholder="Coach full name"
                    value={newTeamForm.coach}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, coach: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Roster Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newTeamForm.playersCount}
                    onChange={(e) =>
                      setNewTeamForm({ ...newTeamForm, playersCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={addTeamMutation.isPending}>
              {addTeamMutation.isPending ? "Assigning..." : "Assign Team"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= EDIT TEAM LEAGUE STATS MODAL ================= */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        className="max-w-[480px] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Team League Statistics
            </h3>
            <p className="text-xs text-slate-500">
              {selectedTeamForStats?.teamName || selectedTeamForStats?.name || "Team"}
            </p>
          </div>
        </div>

        <form onSubmit={handleStatsSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Played (P)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.played}
                onChange={(e) => setStatsForm({ ...statsForm, played: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
                Won (W)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.won}
                onChange={(e) => setStatsForm({ ...statsForm, won: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
                Drawn (D)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.drawn}
                onChange={(e) => setStatsForm({ ...statsForm, drawn: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1.5">
                Lost (L)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.lost}
                onChange={(e) => setStatsForm({ ...statsForm, lost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Goals For (GF)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.goalsFor}
                onChange={(e) => setStatsForm({ ...statsForm, goalsFor: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Goals Against (GA)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.goalsAgainst}
                onChange={(e) =>
                  setStatsForm({ ...statsForm, goalsAgainst: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-1.5">
                Points (Pts)
              </label>
              <input
                type="number"
                min={0}
                value={statsForm.points}
                onChange={(e) => setStatsForm({ ...statsForm, points: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>
              Goal Difference (+/-): <strong>{statsForm.goalsFor - statsForm.goalsAgainst}</strong>
            </span>
            <span>
              Win Rate:{" "}
              <strong>
                {statsForm.played > 0
                  ? Math.round((statsForm.won / statsForm.played) * 100)
                  : 0}
                %
              </strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsStatsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={updateStatsMutation.isPending}>
              {updateStatsMutation.isPending ? "Saving..." : "Save Statistics"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
