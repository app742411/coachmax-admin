import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player";
import PlayerStatsCards from "../../components/players/PlayerStatsCards";
import PlayerFilters from "../../components/players/PlayerFilters";
import PlayerTable from "../../components/players/PlayerTable";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import { usePlayers, useDeletePlayer, useUpdatePlayerStatus } from "../../hooks/usePlayers";

export default function PlayersManagement() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const { data: playersResponse, isLoading } = usePlayers(1, 100);
  const players = playersResponse?.users || [];
  
  const deletePlayerMutation = useDeletePlayer();
  const updatePlayerStatusMutation = useUpdatePlayerStatus();
  
  const [playerToReject, setPlayerToReject] = useState<Player | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleDeletePlayer = (player: Player) => {
    deletePlayerMutation.mutate(player._id);
    if (selectedPlayer?._id === player._id) {
      setSelectedPlayer(null);
    }
  };

  const handleApprovePlayer = (player: Player) => {
    if (window.confirm("Are you sure you want to approve this player?")) {
      updatePlayerStatusMutation.mutate({ id: player._id, data: { status: "APPROVED" } });
    }
  };

  const handleRejectPlayer = (player: Player) => {
    setPlayerToReject(player);
    setRejectReason("");
  };

  const submitReject = () => {
    if (playerToReject && rejectReason.trim()) {
      updatePlayerStatusMutation.mutate({
        id: playerToReject._id,
        data: { status: "REJECTED", rejectresaon: rejectReason },
      });
      setPlayerToReject(null);
      setRejectReason("");
    }
  };

  // Filtering Logic
  const filteredPlayers = players.filter((p) => {
    const email = p.parentId?.email || "";
    const phone = p.parentId?.phone || "";
    const programStr = p.program?.name || "";
    
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesProgram =
      programFilter === "All" || programStr.toUpperCase().includes(programFilter.toUpperCase());
    
    // Status from backend
    const playerStatus = p.status || "PENDING"; 
    const matchesStatus =
      statusFilter === "All" || playerStatus.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesProgram && matchesStatus;
  });

  return (
    <>
      <PageMeta
        title="Players Management | CoachMax"
        description="Fidelity matched primary CoachMax players management UI"
      />

      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Players Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#0047FF]">Players Management</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-2 items-start w-full">
        {/* Left Side: Stats, Filters, Table */}
        <div className="flex-1 w-full min-w-0">
          <PlayerStatsCards
            totalCount={156}
            approvedCount={142}
            pendingCount={8}
            rejectedCount={6}
            eliteCount={32}
            schoolCount={68}
          />

          <PlayerFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            programFilter={programFilter}
            setProgramFilter={setProgramFilter}
            ageFilter={ageFilter}
            setAgeFilter={setAgeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {isLoading ? (
            <div className="py-10 text-center text-slate-500">Loading players...</div>
          ) : (
            <PlayerTable
              players={filteredPlayers}
              selectedPlayerId={selectedPlayer ? selectedPlayer._id : ""}
              onSelectPlayer={setSelectedPlayer}
              onDeletePlayer={handleDeletePlayer}
              onApprovePlayer={handleApprovePlayer}
              onRejectPlayer={handleRejectPlayer}
            />
          )}
        </div>

        {/* Right Side: Player Detail Module */}
        {selectedPlayer && (
          <PlayerDetailCard player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}
      </div>

      {playerToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Reject Player</h3>
            <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejecting {playerToReject.fullName}.</p>
            
            <textarea
              className="w-full h-24 p-3 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white resize-none"
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setPlayerToReject(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={!rejectReason.trim() || updatePlayerStatusMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {updatePlayerStatusMutation.isPending ? "Rejecting..." : "Reject Player"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
