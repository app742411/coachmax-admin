import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { User } from "../../types/player";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  handleReject: () => void;
  actionLoading: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  rejectReason,
  setRejectReason,
  handleReject,
  actionLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <h4 className="text-xl font-bold tracking-tighter text-gray-800 dark:text-white mb-2">Decline Application</h4>
        <p className="text-[10px] font-bold text-gray-400 mb-6">Provide reason for <strong>{selectedUser?.fullName}</strong></p>

        <div className="space-y-4">
          <div>
            <Label className="text-[10px] font-bold text-gray-400">Rejection Reason</Label>
            <textarea
              className="w-full mt-2 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-transparent focus:ring-2 focus:ring-error-500/20 outline-none min-h-[120px] text-sm dark:text-white font-medium"
              placeholder="State reason here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="rounded-xl border-gray-200 px-6 font-bold text-[10px]">Cancel</Button>
            <Button
              className="bg-error-600 hover:bg-error-700 h-10 px-6 rounded-xl font-bold text-[10px] shadow-lg shadow-error-500/20"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Confirm Rejection"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
