import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { getAllClassesForAssign, assignClassToPlayer } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
  onSuccess?: () => void;
}

const AssignClassModal: React.FC<AssignClassModalProps> = ({ isOpen, onClose, player, onSuccess }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // ── Queries ─────────────────────────────────────────────────────

  const { data: classesData, isLoading: loading } = useQuery({
    queryKey: ["classes", player?.category?._id || player?.category, player?.program?._id || player?.program],
    queryFn: () => getAllClassesForAssign({
      category: player?.category?._id || player?.category,
      program: player?.program?._id || player?.program
    }),
    enabled: isOpen && !!player,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
  const classes = getDataArray(classesData);

  // ── Mutations ───────────────────────────────────────────────────

  const assignMutation = useMutation({
    mutationFn: (classId: string) => assignClassToPlayer(player?._id, classId),
    onSuccess: () => {
      // Invalidate both classes (roster might have changed) and specific player records if we had more fine-grained keys
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      // If we had a query for "player_details" or "player_classes", we would invalidate it here
      toast.success(`Class assigned to ${player?.fullName}`);
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: () => toast.error("Failed to assign class"),
  });

  const handleAssign = (classId: string) => {
    assignMutation.mutate(classId);
  };

  const filteredClasses = classes.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.term?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-0 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <div>
          <h4 className="text-xl font-bold text-gray-900">Assign Class</h4>
          <p className="text-xs text-gray-500 mt-1 font-medium">Player: <span className="text-brand-500">{player?.fullName}</span></p>
          <p className="text-[12px] text-red-500 mt-2 font-medium italic leading-relaxed">
            Note: Class assignment is allowed only if the student and class have matching category and program.
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
      </div>

      <div className="p-6 bg-gray-50/50">
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search by class or term..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 transition-all bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-[350px] overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm font-medium">Loading available classes...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm font-medium">No matching classes found.</div>
          ) : (
            filteredClasses.map((cls: any) => (
              <div key={cls._id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-brand-500/30 transition-all shadow-sm group">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-800">{cls.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-brand-500 uppercase px-1.5 py-0.5 bg-brand-50 rounded-md">{cls.term?.name || "No Term"}</span>
                    <span className="text-[10px] font-medium text-gray-400">{cls.dayOfWeek} • {cls.startTime}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssign(cls._id)}
                  disabled={assignMutation.isPending}
                >
                  {assignMutation.isPending ? "..." : "ASSIGN"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
        <Button variant="outline" onClick={onClose} size="sm" className="rounded-xl px-6">Close</Button>
      </div>
    </Modal>
  );
};

// Simple X icon if not imported
const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default AssignClassModal;
