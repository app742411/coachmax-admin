import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player";
import PlayerStatsCards from "../../components/players/PlayerStatsCards";
import PlayerFilters from "../../components/players/PlayerFilters";
import PlayerTable from "../../components/players/PlayerTable";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import AssignClassModal from "../../components/players/AssignClassModal";
import { useRegistrationRequests } from "../../hooks/useRegistrationRequests";

import { useDeletePlayer } from "../../hooks/usePlayers"; // Assuming delete is the same

export default function RegistrationRequests() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [medicalFilter, setMedicalFilter] = useState("All");

  const { data: playersResponse, isLoading } = useRegistrationRequests(1, 100, medicalFilter);
  const players = playersResponse?.users || [];

  const deletePlayerMutation = useDeletePlayer();
  const [playerToAssign, setPlayerToAssign] = useState<Player | null>(null);

  const handleDeletePlayer = (player: Player) => {
    // using the requestId we mapped earlier
    const idToDelete = (player as any).requestId || player._id;
    deletePlayerMutation.mutate(idToDelete);
    if (selectedPlayer?._id === player._id) {
      setSelectedPlayer(null);
    }
  };



  const handleAssignPlayer = (player: Player) => {
    setPlayerToAssign(player);
  };

  // Filtering Logic
  const filteredPlayers = players.filter((p: Player) => {
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
        title="Registration Requests | CoachMax"
        description="Fidelity matched primary CoachMax registration requests UI"
      />

      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Registration Requests</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#0047FF]">Registration Requests</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-2 items-start w-full">
        {/* Left Side: Stats, Filters, Table */}
        <div className="flex-1 w-full min-w-0">
          <PlayerStatsCards
            totalCount={players.length}
            approvedCount={players.filter((p: Player) => p.status === 'APPROVED').length}
            pendingCount={players.filter((p: Player) => p.status === 'PENDING').length}
            rejectedCount={players.filter((p: Player) => p.status === 'REJECTED').length}
            eliteCount={0}
            schoolCount={0}
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
            medicalFilter={medicalFilter}
            setMedicalFilter={setMedicalFilter}
          />

          {isLoading ? (
            <div className="py-10 text-center text-slate-500">Loading requests...</div>
          ) : (
            <PlayerTable
              players={filteredPlayers}
              selectedPlayerId={selectedPlayer ? selectedPlayer._id : ""}
              onSelectPlayer={setSelectedPlayer}
              onDeletePlayer={handleDeletePlayer}
              onAssignClass={handleAssignPlayer}
              showStatusColumn={true}
            />
          )}
        </div>

        {/* Right Side: Player Detail Module */}
        {selectedPlayer && (
          <PlayerDetailCard player={selectedPlayer} onClose={() => setSelectedPlayer(null)} isRegistrationRequest={true} />
        )}
      </div>

      {playerToAssign && (
        <AssignClassModal player={playerToAssign} onClose={() => setPlayerToAssign(null)} />
      )}


    </>
  );
}
