import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player";
import PlayerStatsCards from "../../components/players/PlayerStatsCards";
import PlayerFilters from "../../components/players/PlayerFilters";
import PlayerTable from "../../components/players/PlayerTable";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import AssignClassModal from "../../components/players/AssignClassModal";
import GenerateInvoiceModal from "../../components/InvoiceManagement/GenerateInvoiceModal";
import AddCoachNoteModal from "../../components/CoachManagement/AddCoachNoteModal";
import { usePlayers, useDeletePlayer } from "../../hooks/usePlayers";
import Pagination from "../../components/common/Pagination";
import { UserPlus } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PlayersManagement() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Page state for 10-player backend pagination
  const [page, setPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch exactly 10 players per page from the backend
  const { data: playersResponse, isLoading } = usePlayers(page, 10, debouncedSearchQuery, programFilter, statusFilter);
  const players = playersResponse?.users || [];
  const totalPages = playersResponse?.totalPages || 1;
  const totalPlayers = playersResponse?.total || 0;
  
  const deletePlayerMutation = useDeletePlayer();
  
  const [playerToAssign, setPlayerToAssign] = useState<Player | null>(null);
  const [playerForInvoice, setPlayerForInvoice] = useState<Player | null>(null);
  const [coachNotePlayer, setCoachNotePlayer] = useState<Player | null>(null);

  // Reset page to 1 when filters change to avoid out-of-bound pages
  useEffect(() => {
    setPage(1);
  }, [searchQuery, programFilter, statusFilter, ageFilter]);

  const handleDeletePlayer = (player: Player) => {
    deletePlayerMutation.mutate(player._id);
    if (selectedPlayer?._id === player._id) {
      setSelectedPlayer(null);
    }
  };

  const handleAssignPlayer = (player: Player) => {
    setPlayerToAssign(player);
  };

  const handleGenerateInvoice = (player: Player) => {
    setPlayerForInvoice(player);
  };

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
          ) : !isLoading && players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-gray-50 rounded-full p-4 mb-4">
                <UserPlus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No players found</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                {searchQuery || programFilter !== "All" || statusFilter !== "All"
                  ? "We couldn't find any players matching your current filters. Try adjusting your search criteria."
                  : "Get started by inviting players to your academy. They'll receive an email to complete their profile."}
              </p>
            </div>
          ) : (
            <>
              <PlayerTable
                players={players}
                selectedPlayerId={selectedPlayer ? selectedPlayer._id : ""}
                onSelectPlayer={setSelectedPlayer}
                onDeletePlayer={handleDeletePlayer}
                onAssignClass={handleAssignPlayer}
                onGenerateInvoice={handleGenerateInvoice}
                onAddCoachNote={setCoachNotePlayer}
              />

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={totalPlayers}
                  limit={10}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>

        {/* Right Side: Player Detail Module */}
        {selectedPlayer && (
          <PlayerDetailCard player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}
      </div>

      {playerToAssign && (
        <AssignClassModal player={playerToAssign} onClose={() => setPlayerToAssign(null)} />
      )}

      <GenerateInvoiceModal
        isOpen={!!playerForInvoice}
        onClose={() => setPlayerForInvoice(null)}
        player={playerForInvoice}
      />

      {coachNotePlayer && (
        <AddCoachNoteModal
          isOpen={coachNotePlayer !== null}
          onClose={() => setCoachNotePlayer(null)}
          playerId={coachNotePlayer._id}
          playerName={coachNotePlayer.fullName}
        />
      )}
    </>
  );
}
