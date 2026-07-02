import { useState } from "react";
import { Player } from "../../types/player";
import { useClassesForAssign, useAssignClass } from "../../hooks/usePlayers";

interface AssignClassModalProps {
  player: Player;
  onClose: () => void;
}

export default function AssignClassModal({ player, onClose }: AssignClassModalProps) {
  const categoryId = player.category?._id || "";
  const programId = player.program?._id || "";

  const { data: response, isLoading } = useClassesForAssign(categoryId, programId, true);
  const classes = response?.data || [];

  const assignMutation = useAssignClass();
  const [selectedClassId, setSelectedClassId] = useState("");

  const handleAssign = () => {
    if (selectedClassId) {
      assignMutation.mutate(
        { playerId: player._id, classId: selectedClassId },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Assign to Class</h3>
        <p className="text-sm text-slate-500 mb-4">
          Select a class for {player.fullName} ({player.program?.name || "No Program"}).
        </p>

        {isLoading ? (
          <div className="py-4 text-center text-sm text-slate-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500">No classes found for this program.</div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {classes.map((cls: any) => (
              <div
                key={cls._id}
                onClick={() => setSelectedClassId(cls._id)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedClassId === cls._id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cls.name}</span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {cls.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                  <span>{cls.dayOfWeek} {cls.startTime} - {cls.endTime}</span>
                  <span>Location: {cls.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedClassId || assignMutation.isPending}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#0047FF] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {assignMutation.isPending ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
