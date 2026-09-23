import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Search,
  UserCheck,
  Users,
  Sliders,
} from "lucide-react";
import {
  useLeagueTeams,
  useAddTeamToLeague,
  useRemoveTeamFromLeague,
  useToggleTeamStatus,
  useUpdateLeagueTeamStats,
} from "../../hooks/useLeagueTeams";
import { LeagueTeam } from "../../types/league";
import { useLeaguePermissions } from "../../hooks/useLeaguePermissions";
import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../../../../api/adminApi";
import { toast } from "react-hot-toast";

interface TeamManagementTableProps {
  leagueId: string;
}

export const TeamManagementTable: React.FC<TeamManagementTableProps> = ({ leagueId }) => {
  const { data: teams = [], isLoading } = useLeagueTeams(leagueId);
  const { canManageTeams } = useLeaguePermissions();

  const addTeamMutation = useAddTeamToLeague(leagueId);
  const removeTeamMutation = useRemoveTeamFromLeague(leagueId);
  const toggleStatusMutation = useToggleTeamStatus(leagueId);
  const updateStatsMutation = useUpdateLeagueTeamStats(leagueId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
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
  const [selectedAcademyTeamId, setSelectedAcademyTeamId] = useState("");

  const { data: allTeamsData } = useQuery({
    queryKey: ["allAcademyTeams"],
    queryFn: () => getAllTeams(),
    enabled: isAddModalOpen,
  });

  const allAcademyTeams: any[] = Array.isArray(allTeamsData)
    ? allTeamsData
    : allTeamsData?.data || [];

  const filteredTeams = teams.filter((t) => {
    const tName = t.teamName || t.name || "";
    const coachStr = typeof t.coach === "object" && t.coach?.name ? t.coach.name : typeof t.coach === "string" ? t.coach : "";
    return (
      tName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coachStr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleSelectAll = () => {
    if (selectedTeamIds.length === filteredTeams.length) {
      setSelectedTeamIds([]);
    } else {
      setSelectedTeamIds(filteredTeams.map((t) => t._id));
    }
  };

  const toggleSelectTeam = (id: string) => {
    if (selectedTeamIds.includes(id)) {
      setSelectedTeamIds(selectedTeamIds.filter((tId) => tId !== id));
    } else {
      setSelectedTeamIds([...selectedTeamIds, id]);
    }
  };

  // Bulk Actions
  const handleBulkActivate = () => {
    selectedTeamIds.forEach((id) => {
      toggleStatusMutation.mutate({ teamId: id, status: "ACTIVE" });
    });
    setSelectedTeamIds([]);
    toast.success("Selected teams activated");
  };

  const handleBulkDeactivate = () => {
    selectedTeamIds.forEach((id) => {
      toggleStatusMutation.mutate({ teamId: id, status: "INACTIVE" });
    });
    setSelectedTeamIds([]);
    toast.success("Selected teams deactivated");
  };

  const handleBulkRemove = () => {
    if (confirm(`Remove ${selectedTeamIds.length} selected teams from the league?`)) {
      selectedTeamIds.forEach((id) => {
        removeTeamMutation.mutate(id);
      });
      setSelectedTeamIds([]);
      toast.success("Teams removed from league");
    }
  };

  const handleExportSelected = () => {
    const listToExport = teams.filter(
      (t) => selectedTeamIds.length === 0 || selectedTeamIds.includes(t._id)
    );

    const headers = ["Team Name", "Coach", "Players Count", "Wins", "Draws", "Losses", "Status"];
    const rows = listToExport.map((t) => {
      const tName = t.teamName || t.name || "Team";
      const coachStr = typeof t.coach === "object" && t.coach?.name ? t.coach.name : typeof t.coach === "string" ? t.coach : "";
      const wins = t.record?.won ?? t.wins ?? 0;
      const draws = t.record?.drawn ?? t.draws ?? 0;
      const losses = t.record?.lost ?? t.losses ?? 0;
      return [
        `"${tName.replace(/"/g, '""')}"`,
        `"${coachStr.replace(/"/g, '""')}"`,
        t.playersCount || 0,
        wins,
        draws,
        losses,
        t.status || "ACTIVE",
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `League_Teams_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcademyTeamId) {
      toast.error("Please select a team");
      return;
    }

    if (teams.some((t) => t._id === selectedAcademyTeamId)) {
      toast.error("Team already participating");
      return;
    }

    const tObj = allAcademyTeams.find((t: any) => t._id === selectedAcademyTeamId);
    addTeamMutation.mutate(
      {
        _id: tObj?._id,
        name: tObj?.teamName || "Academy Team",
        coach: tObj?.coach?.name || tObj?.coach || "Unassigned",
        playersCount: tObj?.players?.length || 12,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setSelectedAcademyTeamId("");
        },
      }
    );
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
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Team Participation Management
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage rosters, statuses, eligibility, and team permissions for this league.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search team or coach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 w-44 sm:w-52 transition-all"
            />
          </div>

          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-xs cursor-pointer transition-all"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export Teams</span>
          </button>

          {canManageTeams && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>Add Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedTeamIds.length > 0 && canManageTeams && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
          <span className="font-bold text-blue-900 dark:text-blue-300">
            {selectedTeamIds.length} team(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-2.5 py-1 rounded font-bold bg-white dark:bg-slate-800 text-emerald-600 border border-emerald-200 hover:bg-emerald-50 cursor-pointer shadow-xs"
            >
              Activate
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-2.5 py-1 rounded font-bold bg-white dark:bg-slate-800 text-amber-600 border border-amber-200 hover:bg-amber-50 cursor-pointer shadow-xs"
            >
              Deactivate
            </button>
            <button
              onClick={handleBulkRemove}
              className="px-2.5 py-1 rounded font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-xs"
            >
              Remove Selected
            </button>
          </div>
        </div>
      )}

      {/* Teams Table */}
      <div className="overflow-x-auto no-scrollbar rounded-lg border border-slate-100 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {canManageTeams && (
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredTeams.length > 0 && selectedTeamIds.length === filteredTeams.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600"
                  />
                </th>
              )}
              <th className="py-3 px-4 min-w-[220px]">Team</th>
              <th className="py-3 px-4 min-w-[150px]">Coach</th>
              <th className="py-3 px-4 text-center">Players</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right min-w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                  Loading Team Management...
                </td>
              </tr>
            ) : filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium italic">
                  No teams found.
                </td>
              </tr>
            ) : (
              filteredTeams.map((team) => {
                const tName = team.teamName || team.name || "Academy Team";
                const coachStr =
                  typeof team.coach === "object" && team.coach?.name
                    ? team.coach.name
                    : typeof team.coach === "string"
                    ? team.coach
                    : "Unassigned";

                return (
                  <tr
                    key={team._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {canManageTeams && (
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selectedTeamIds.includes(team._id)}
                          onChange={() => toggleSelectTeam(team._id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600"
                        />
                      </td>
                    )}

                    {/* Team */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden font-bold text-[10px] text-slate-700 dark:text-slate-200">
                          {team.logo ? (
                            <img
                              src={
                                team.logo.startsWith("http")
                                  ? team.logo
                                  : `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/${team.logo.replace(/^\//, "")}`
                              }
                              alt={tName}
                              onError={(e) => {
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
                            {getTeamInitials(tName)}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {tName}
                        </span>
                      </div>
                    </td>

                    {/* Coach */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <UserCheck size={13} className="text-slate-400" />
                        <span>{coachStr}</span>
                      </div>
                    </td>

                    {/* Players Count */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {team.playersCount}
                    </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                        team.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {team.status || "ACTIVE"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canManageTeams && (
                        <>
                          <button
                            onClick={() => handleOpenStatsModal(team)}
                            className="px-2 py-1 text-[11px] font-bold rounded border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Edit Team League Statistics"
                          >
                            <Sliders size={12} />
                            <span>Stats</span>
                          </button>

                          <button
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                teamId: team._id,
                                status: team.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                              })
                            }
                            className={`px-2 py-1 text-[11px] font-bold rounded border transition-colors ${
                              team.status === "ACTIVE"
                                ? "text-amber-600 hover:bg-amber-50 border-amber-200"
                                : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                            }`}
                          >
                            {team.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove ${tName} from this league?`)) {
                                removeTeamMutation.mutate(team._id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                            title="Remove Team"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* Add Team Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="max-w-[480px] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assign Team to League</h3>
            <p className="text-xs text-slate-500">Select an existing club roster to enroll.</p>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Available Academy Teams
            </label>
            <select
              value={selectedAcademyTeamId}
              onChange={(e) => setSelectedAcademyTeamId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              required
            >
              <option value="">Select a team...</option>
              {allAcademyTeams.map((t: any) => (
                <option key={t._id} value={t._id}>
                  {t.teamName} {t.ageGroup ? `(${t.ageGroup})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={addTeamMutation.isPending}>
              {addTeamMutation.isPending ? "Assigning..." : "Confirm Assignment"}
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
