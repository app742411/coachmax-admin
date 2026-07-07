import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailablePlayers, assignPlayerToTeam } from "../../api/adminApi";
import { toast } from "react-hot-toast";

interface AssignPlayerToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | null;
}

export default function AssignPlayerToTeamModal({ isOpen, onClose, teamId }: AssignPlayerToTeamModalProps) {
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  useEffect(() => {
    if (isOpen) setSelectedPlayer("");
  }, [isOpen]);

  const { data: playersResponse, isLoading } = useQuery({
    queryKey: ["availablePlayers"],
    queryFn: getAvailablePlayers,
    enabled: isOpen,
  });

  const players = Array.isArray(playersResponse) ? playersResponse : playersResponse?.data || [];

  const assignMutation = useMutation({
    mutationFn: ({ tId, pId }: { tId: string; pId: string }) => assignPlayerToTeam(tId, pId),
    onSuccess: (res) => {
      toast.success(res?.message || "Player assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["availablePlayers"] });
      onClose();
      setSelectedPlayer("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign player");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      toast.error("No team selected");
      return;
    }
    if (!selectedPlayer) {
      toast.error("Please select a player");
      return;
    }
    assignMutation.mutate({ tId: teamId, pId: selectedPlayer });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assign Player to Team</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Select Player <span className="text-red-500">*</span>
              </label>
              {isLoading ? (
                <div className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                  Loading players...
                </div>
              ) : (
                <select
                  required
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700"
                >
                  <option value="" disabled>-- Select a player --</option>
                  {players.map((player: any) => (
                    <option key={player._id} value={player._id}>
                      {player.fullName || `${player.firstName} ${player.lastName}`} {player.group ? `(${player.group})` : ''}
                    </option>
                  ))}
                </select>
              )}
              {players.length === 0 && !isLoading && (
                <p className="text-xs text-amber-500 mt-2">No available players found.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignMutation.isPending || !selectedPlayer}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0047FF] hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
            >
              {assignMutation.isPending ? "Assigning..." : "Assign Player"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
