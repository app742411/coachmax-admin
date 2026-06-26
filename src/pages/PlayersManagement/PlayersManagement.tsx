import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player";
import PlayerStatsCards from "../../components/players/PlayerStatsCards";
import PlayerFilters from "../../components/players/PlayerFilters";
import PlayerTable from "../../components/players/PlayerTable";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import { usePlayers, useDeletePlayer } from "../../hooks/usePlayers";

export default function PlayersManagement() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const { data: playersResponse, isLoading } = usePlayers(1, 100);
  const players = playersResponse?.data || [];
  
  const deletePlayerMutation = useDeletePlayer();

  const handleDeletePlayer = (player: Player) => {
    deletePlayerMutation.mutate(player._id);
    if (selectedPlayer?._id === player._id) {
      setSelectedPlayer(null);
    }
  };

  // Filtering Logic
  const filteredPlayers = players.filter((p) => {
    const email = p.parentId?.userId?.email || "";
    const phone = p.parentId?.phone || "";
    const programStr = p.programs?.map(pg => pg.name).join(", ") || "";
    
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesProgram =
      programFilter === "All" || programStr.toUpperCase().includes(programFilter.toUpperCase());
    
    // Status is not explicitly in the backend, assuming "Paid" for all for now.
    const playerStatus = "Paid"; 
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
            />
          )}
        </div>

        {/* Right Side: Player Detail Module */}
        {selectedPlayer && (
          <PlayerDetailCard player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}
      </div>
    </>
  );
}
