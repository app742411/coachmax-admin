import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllTerms, createTerm, updateTerm, deleteTerm } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Calendar } from "../../icons/lucide-icons";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "../form/date-picker";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";
import TermCalendar from "./TermCalendar";

const TermManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [showCalendar, setShowCalendar] = useState(true);
    const [eventFilter, setEventFilter] = useState<"all" | "false" | "true">("all");

    // ── UI State (Modals & Forms) ──────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        year: new Date().getFullYear(),
        startDate: "",
        endDate: "",
        isEvent: false,
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        if (dateOnly.includes("-")) {
            const [year, month, day] = dateOnly.split("-");
            return `${day}/${month}/${year}`;
        }
        return dateOnly;
    };

    // ── Year filter ────────────────────────────────────────────────
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

    // ── Queries ─────────────────────────────────────────────────────

    const { data: termsData, isLoading: loading } = useQuery({
        queryKey: ["terms", selectedYear, eventFilter],
        queryFn: () => getAllTerms(selectedYear, eventFilter),
    });
    const terms = Array.isArray(termsData) ? termsData : (termsData?.data || []);

    // ── Mutations ───────────────────────────────────────────────────

    const createMutation = useMutation({
        mutationFn: createTerm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success("Term created successfully");
            setIsModalOpen(false);
        },
        onError: () => toast.error("Failed to create term"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateTerm(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success("Term updated successfully");
            setIsModalOpen(false);
        },
        onError: () => toast.error("Failed to update term"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTerm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success("Term deleted");
            setDeleteModalId(null);
        },
        onError: () => toast.error("Failed to delete term"),
    });

    // ── Event Handlers ─────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "year" ? parseInt(value) || 0 : value,
        }));
    };

    const handleDateChange = (name: string, dateStr: string) => {
        setFormData(prev => ({ ...prev, [name]: dateStr }));
    };

    // Validates DD/MM/YYYY
    const isValidDate = (date: string) => {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
    };

    // Helper to force conversion if the input is YYYY-MM-DD
    const formatToDDMMYYYY = (dateStr: string) => {
        if (!dateStr) return "";
        const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        if (dateOnly.includes("-")) {
            const [year, month, day] = dateOnly.split("-");
            return `${day}/${month}/${year}`;
        }
        return dateOnly;
    };

    const getDaysBetween = (start: string, end: string) => {
        if (!start || !end) return null;
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
        return Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 3600 * 24));
    };

    const handleOpenAdd = () => {
        setFormData({
            name: "",
            year: new Date().getFullYear(),
            startDate: "",
            endDate: "",
            isEvent: false,
        });
        setIsEditing(false);
        setSelectedId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (term: any) => {
        const cleanDate = (dateStr: string) => {
            if (!dateStr) return "";
            return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        };
        setFormData({
            name: term.name || "",
            year: term.year || new Date().getFullYear(),
            startDate: cleanDate(term.startDate),
            endDate: cleanDate(term.endDate),
            isEvent: !!term.isEvent,
        });
        setIsEditing(true);
        setSelectedId(term._id);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModalId(id);
    };

    const confirmDelete = () => {
        if (deleteModalId) {
            deleteMutation.mutate(deleteModalId);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedStart = formatToDDMMYYYY(formData.startDate);
        const formattedEnd = formatToDDMMYYYY(formData.endDate);

        if (!isValidDate(formattedStart) || !isValidDate(formattedEnd)) {
            toast.error("Please enter dates in DD/MM/YYYY format");
            return;
        }

        const payload = {
            name: formData.name,
            year: formData.year,
            startDate: formattedStart,
            endDate: formattedEnd,
            isEvent: formData.isEvent,
        };

        if (isEditing && selectedId) {
            updateMutation.mutate({ id: selectedId, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-none border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Academy Terms</h3>
                    <p className="text-xs text-gray-500">Define seasonal training windows</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setShowCalendar((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors rounded-none"
                    >
                        {showCalendar ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {showCalendar ? "Hide Calendar" : "Show Calendar"}
                    </button>

                    {/* isEvent filter tabs */}
                    <div className="flex items-center rounded-none border border-gray-200 overflow-hidden">
                        {([
                            { value: "all", label: "All" },
                            { value: "false", label: "Terms" },
                            { value: "true", label: "Holiday Programs" },
                        ] as const).map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setEventFilter(value)}
                                className={`px-3 py-2 text-xs font-bold transition-colors border-r last:border-r-0 border-gray-200 ${eventFilter === value
                                    ? "bg-[#031549] text-white"
                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-700 focus:border-brand-500 focus:bg-white outline-none transition-all cursor-pointer appearance-none"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>Year {y}</option>
                        ))}
                    </select>
                    <Button onClick={handleOpenAdd} size="sm">Add Term</Button>
                </div>
            </div>

            {/* ── Term Calendar ── */}
            {showCalendar && (
                <div className="mb-6 pb-6 border-b border-gray-100 dark:border-white/[0.05]">
                    {loading ? (
                        <div className="text-center text-xs text-gray-400 py-8">Loading calendar...</div>
                    ) : (
                        <TermCalendar terms={terms} selectedYear={selectedYear} />
                    )}
                </div>
            )}

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                <Table>
                    <TableHeader className="sticky top-0 z-10 shadow-sm">
                        <TableRow>
                            <TableCell isHeader>Term Detail</TableCell>
                            <TableCell isHeader>Timeline</TableCell>
                            <TableCell isHeader>Type</TableCell>
                            <TableCell isHeader className="text-center">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Synchronizing...</TableCell></TableRow>
                        ) : terms.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500">No terms found for this filter.</TableCell></TableRow>
                        ) : (
                            terms.map((term: any) => (
                                <TableRow key={term._id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-gray-800 dark:text-white/90 uppercase tracking-tight">{term.name}</span>
                                            <span className="text-[10px] text-brand-500 font-extrabold">{term.year} Season</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-bold text-xs text-gray-500 tracking-tighter">
                                            <Calendar size={14} className="text-gray-300" />
                                            <span>{formatDate(term.startDate)}</span>
                                            <span className="text-gray-300">→</span>
                                            <span>{formatDate(term.endDate)}</span>
                                            {getDaysBetween(term.startDate, term.endDate) !== null && (
                                                <span className="ml-2 px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-extrabold uppercase rounded-none shadow-sm border border-brand-100">
                                                    {getDaysBetween(term.startDate, term.endDate)} days
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {term.isEvent ? (
                                            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider rounded-none border border-amber-100 dark:border-amber-500/20">
                                                Holiday Program
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider rounded-none border border-blue-100 dark:border-blue-500/20">
                                                Term
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={() => handleOpenEdit(term)} className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors"><Pencil size={14} /></button>
                                            <button onClick={() => handleDeleteClick(term._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[450px] p-6 lg:p-8">
                <h4 className="text-xl font-bold mb-2">{isEditing ? "Modify Term" : "Schedule New Term"}</h4>
                <p className="text-xs text-gray-500 mb-6 font-medium">Coordinate the seasonal training timeline.</p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Term Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-none border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                                placeholder="Summer Term"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full rounded-none border border-gray-100 bg-gray-50 px-3 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <DatePicker
                            id="startDate"
                            label="Start Date"
                            defaultDate={formData.startDate}
                            onChange={(_, dateStr) => handleDateChange("startDate", dateStr)}
                        />
                        <DatePicker
                            id="endDate"
                            label="End Date"
                            defaultDate={formData.endDate}
                            onChange={(_, dateStr) => handleDateChange("endDate", dateStr)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="isEvent"
                                checked={formData.isEvent}
                                onChange={(e) => setFormData(prev => ({ ...prev, isEvent: e.target.checked }))}
                                className="w-4 h-4 text-[#031549] border-gray-300 rounded-none focus:ring-[#031549]"
                            />
                            <span className="text-xs font-semibold text-gray-700">Holiday Program / Event</span>
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-12 rounded-none text-xs font-bold uppercase tracking-widest">
                            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Commit Term"}
                        </Button>
                    </div>
                </form>
            </Modal>
            <ConfirmDeleteModal
                isOpen={!!deleteModalId}
                onClose={() => setDeleteModalId(null)}
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
                title="Delete Term"
                message="Are you sure you want to delete this term? This action cannot be undone."
            />
        </div>
    );
};

export default TermManagement;
