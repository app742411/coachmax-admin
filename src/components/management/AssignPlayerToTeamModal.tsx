import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "../ui/modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignPlayerToTeam } from "../../api/adminApi";
import apiClient from "../../api/apiClient";
import { toast } from "react-hot-toast";
import { Search, Users, Check, X, Shield, UserCheck } from "lucide-react";

interface AssignPlayerToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | null;
}

type AssignmentFilter = "ALL" | "AVAILABLE" | "ASSIGNED";

export default function AssignPlayerToTeamModal({ isOpen, onClose, teamId }: AssignPlayerToTeamModalProps) {
  const queryClient = useQueryClient();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("ALL");

  useEffect(() => {
    if (isOpen) {
      setSelectedPlayerIds([]);
      setSearchQuery("");
      setAssignmentFilter("ALL");
    }
  }, [isOpen]);

  const { data: playersResponse, isLoading } = useQuery({
    queryKey: ["availablePlayersForTeam"],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/admin/available-players');
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (list.length > 0) return list;
      } catch (e) {
        console.error("available-players failed, falling back to all users", e);
      }
      const usersRes = await apiClient.get('/api/admin/getUsers', { params: { limit: 200 } });
      return Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.data || [];
    },
    enabled: isOpen,
  });

  const players: any[] = useMemo(() => {
    return Array.isArray(playersResponse) ? playersResponse : playersResponse?.data || [];
  }, [playersResponse]);

  const availableCount = useMemo(() => players.filter(p => !p.isAssigned).length, [players]);
  const assignedCount = useMemo(() => players.filter(p => !!p.isAssigned).length, [players]);

  const filteredPlayers = useMemo(() => {
    let list = players;

    // Filter by assignment status
    if (assignmentFilter === "AVAILABLE") {
      list = list.filter(p => !p.isAssigned);
    } else if (assignmentFilter === "ASSIGNED") {
      list = list.filter(p => !!p.isAssigned);
    }

    // Filter by search query
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((p: any) => {
      const name = (p.fullName || `${p.firstName || ''} ${p.lastName || ''}`).toLowerCase();
      const email = (p.email || '').toLowerCase();
      const phone = (p.phone || '').toLowerCase();
      const category = (p.category?.name || p.category || '').toLowerCase();
      const team = (p.assignedTeam?.teamName || '').toLowerCase();
      const programs = (p.programs || []).map((pr: any) => pr.name || '').join(" ").toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        category.includes(q) ||
        team.includes(q) ||
        programs.includes(q)
      );
    });
  }, [players, searchQuery, assignmentFilter]);

  const allFilteredSelected =
    filteredPlayers.length > 0 && filteredPlayers.every((p: any) => selectedPlayerIds.includes(p._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredPlayers.map((p: any) => p._id));
      setSelectedPlayerIds(prev => prev.filter(id => !filteredIds.has(id)));
    } else {
      const newIds = new Set(selectedPlayerIds);
      filteredPlayers.forEach((p: any) => newIds.add(p._id));
      setSelectedPlayerIds(Array.from(newIds));
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  const assignMutation = useMutation({
    mutationFn: ({ tId, pIds }: { tId: string; pIds: string[] }) => assignPlayerToTeam(tId, pIds),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Players assigned successfully!");
      if (variables?.tId || teamId) {
        const targetId = variables?.tId || teamId;
        queryClient.invalidateQueries({ queryKey: ["team", targetId] });
        queryClient.invalidateQueries({ queryKey: ["teamFullTable", targetId] });
      }
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["teamFullTable"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["availablePlayers"] });
      queryClient.invalidateQueries({ queryKey: ["availablePlayersForTeam"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      onClose();
      setSelectedPlayerIds([]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign players");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      toast.error("No team selected");
      return;
    }
    if (selectedPlayerIds.length === 0) {
      toast.error("Please select at least one player");
      return;
    }
    assignMutation.mutate({ tId: teamId, pIds: selectedPlayerIds });
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  const getAvatarUrl = (profileImage: string | null | undefined) => {
    if (!profileImage) return null;
    if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
      return profileImage;
    }
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = profileImage.startsWith("/") ? profileImage : `/${profileImage}`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-0 overflow-hidden rounded-none shadow-2xl">
      <div className="flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#0A1930] px-6 py-4 text-white flex items-center justify-between border-l-4 border-[#0047FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Assign Players to Team</h2>
              <p className="text-xs text-gray-300 mt-0.5">
                Select players to assign or reassign to this team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Search Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 space-y-3">
          {/* Assignment Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <button
              type="button"
              onClick={() => setAssignmentFilter("ALL")}
              className={`px-3 py-1 text-xs font-bold transition-all border-b-2 ${
                assignmentFilter === "ALL"
                  ? "border-[#0047FF] text-[#0047FF] dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              All Players ({players.length})
            </button>
            <button
              type="button"
              onClick={() => setAssignmentFilter("AVAILABLE")}
              className={`px-3 py-1 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                assignmentFilter === "AVAILABLE"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available / Unassigned ({availableCount})
            </button>
            <button
              type="button"
              onClick={() => setAssignmentFilter("ASSIGNED")}
              className={`px-3 py-1 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                assignmentFilter === "ASSIGNED"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Assigned to Other Teams ({assignedCount})
            </button>
          </div>

          {/* Search & Bulk Select Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, team, category, program..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  disabled={filteredPlayers.length === 0}
                  className="w-4 h-4 text-[#0047FF] rounded-none border-slate-300 focus:ring-[#0047FF] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select All ({filteredPlayers.length})
                </span>
              </label>

              {selectedPlayerIds.length > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#0047FF] text-white rounded-none shadow-xs">
                  {selectedPlayerIds.length} Selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Player List */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar max-h-[440px]">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-semibold">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#0047FF] border-r-transparent mb-2" />
                <p>Loading available players...</p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-semibold">
                {searchQuery ? "No players match your search query." : "No players found in this category."}
              </div>
            ) : (
              filteredPlayers.map((player: any) => {
                const isSelected = selectedPlayerIds.includes(player._id);
                const playerName = player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim() || "Unnamed Player";
                const avatarSrc = getAvatarUrl(player.profileImage);
                const categoryName = player.category?.name || player.category || "";
                const termName = player.term?.name || player.term || "";
                const programs = player.programs || [];

                return (
                  <div
                    key={player._id}
                    onClick={() => togglePlayerSelection(player._id)}
                    className={`p-3.5 border transition-all cursor-pointer select-none rounded-none flex items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/30 border-[#0047FF] shadow-xs ring-1 ring-[#0047FF]"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Left: Checkbox + Avatar + Player Info */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="flex items-center justify-center shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#0047FF] rounded-none border-slate-300 focus:ring-[#0047FF] pointer-events-none"
                        />
                      </div>

                      {/* Profile Image / Avatar */}
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={playerName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=0A1930&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#0A1930] text-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                          {playerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {playerName}
                          </h4>

                          {categoryName && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {categoryName}
                            </span>
                          )}
                        </div>

                        {/* Programs & Term Tags */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          {programs.length > 0 && (
                            <span className="font-semibold text-[#0047FF] dark:text-blue-400 truncate max-w-[280px]">
                              {programs.map((pr: any) => pr.name).join(", ")}
                            </span>
                          )}

                          {termName && (
                            <span className="text-slate-400 font-medium">
                              • {termName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Team Assignment Flag / Badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {player.isAssigned && player.assignedTeam ? (
                        <div className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60 flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Assigned: {player.assignedTeam.teamName}</span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/60 flex items-center gap-1.5">
                          <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Available</span>
                        </div>
                      )}

                      {player.email && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {player.email}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <strong className="text-slate-900 dark:text-white">{selectedPlayerIds.length}</strong> of {players.length} players selected
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignMutation.isPending || selectedPlayerIds.length === 0}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0047FF] hover:bg-blue-700 rounded-none disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {assignMutation.isPending ? (
                  "Assigning..."
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Assign {selectedPlayerIds.length > 0 ? `(${selectedPlayerIds.length}) ` : ""}Players</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
