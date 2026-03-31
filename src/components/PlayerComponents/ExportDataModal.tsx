import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { CheckSquare } from "lucide-react";
import Select from "../form/Select";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "excel" | "csv", filters?: any) => void;
  selectedCount: number;
  currentFilters: { status: string; programType: string; search: string };
}

const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  onExport,
  selectedCount,
  currentFilters,
}) => {
  const [format, setFormat] = useState<"excel" | "csv">("csv");
  const [useFilters, setUseFilters] = useState(selectedCount === 0);
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setUseFilters(selectedCount === 0);
      setFilters(currentFilters);
    }
  }, [isOpen, selectedCount, currentFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <h4 className="text-xl font-bold tracking-tighter text-gray-800 dark:text-white mb-2">Export Data</h4>
        <p className="text-[10px] font-bold text-gray-400 mb-6"> Configure your export requirements </p>

        <div className="space-y-6">
          <div>
            <Label className="text-[10px] font-bold text-gray-400 mb-3 block">File Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("csv")}
                className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all font-bold text-xs  ${format === "csv" ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-gray-100 dark:border-white/5 text-gray-400"}`}
              >
                CSV (.csv)
              </button>
              <button
                onClick={() => setFormat("excel")}
                className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all font-bold text-xs  ${format === "excel" ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-gray-100 dark:border-white/5 text-gray-400"}`}
              >
                EXCEL (.xlsx)
              </button>
            </div>
          </div>

          {selectedCount > 0 ? (
            <div className="p-4 bg-brand-50/50 dark:bg-brand-500/5 rounded-2xl border border-brand-100 dark:border-brand-500/20">
              <p className="text-[10px] font-bold text-brand-500 flex items-center gap-2">
                <CheckSquare size={14} />
                {selectedCount} Players Selected for export
              </p>
              <button
                onClick={() => setUseFilters(true)}
                className="mt-2 text-[8px] font-bold text-gray-400 hover:text-brand-500 transition-colors"
              >
                Or use filters instead?
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-[10px] font-bold text-gray-400 block">Filter Requirements</Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold text-gray-400">Status</Label>
                  <Select
                    options={[
                      { value: "APPROVED", label: "Approved" },
                      { value: "PENDING", label: "Pending" },
                      { value: "REJECTED", label: "Rejected" }
                    ]}
                    defaultValue={filters.status}
                    onChange={(val: string) => setFilters({ ...filters, status: val })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold text-gray-400">Program Type</Label>
                  <Select
                    options={[
                      { value: "", label: "All Programs" },
                      { value: "ELITE", label: "Elite" },
                      { value: "DEVELOPMENT", label: "Development" },
                      { value: "1on1 seson", label: "1on1 Session" }
                    ]}
                    defaultValue={filters.programType}
                    onChange={(val: string) => setFilters({ ...filters, programType: val })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold text-gray-400">Search Keywords</Label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent text-sm focus:ring-2 focus:ring-brand-500/20 outline-none dark:text-white"
                    placeholder="e.g. Player name..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="rounded-xl border-gray-200 px-6 font-bold text-[10px]">Close</Button>
            <Button
              className="bg-brand-500 hover:bg-brand-600 h-10 px-8 rounded-xl font-bold text-[10px] shadow-lg shadow-brand-500/20"
              onClick={() => onExport(format, useFilters ? filters : undefined)}
            >
              Download {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportDataModal;
