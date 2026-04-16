import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { getAllTerms, createTerm, updateTerm, deleteTerm } from "../../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash, Calendar } from "lucide-react";
import DatePicker from "../../form/date-picker";

const TermManagement: React.FC = () => {
    const queryClient = useQueryClient();

    // ── UI State (Modals & Forms) ──────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: "",
        year: new Date().getFullYear(),
        startDate: "",
        endDate: "",
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    };

    // ── Queries ─────────────────────────────────────────────────────

    const { data: termsData, isLoading: loading } = useQuery({
        queryKey: ["terms"],
        queryFn: getAllTerms,
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

    const handleOpenAdd = () => {
        setFormData({
            name: "",
            year: new Date().getFullYear(),
            startDate: "",
            endDate: "",
        });
        setIsEditing(false);
        setSelectedId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (term: any) => {
        setFormData({
            name: term.name || "",
            year: term.year || new Date().getFullYear(),
            startDate: term.startDate || "",
            endDate: term.endDate || "",
        });
        setIsEditing(true);
        setSelectedId(term._id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && selectedId) {
            updateMutation.mutate({ id: selectedId, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Academy Terms</h3>
                    <p className="text-xs text-gray-500">Define seasonal training windows</p>
                </div>
                <Button onClick={handleOpenAdd} size="sm">Add Term</Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b">
                        <TableRow>
                            <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Term Detail</TableCell>
                            <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Timeline</TableCell>
                            <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 text-center uppercase">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-400">Synchronizing...</TableCell></TableRow>
                        ) : terms.length === 0 ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-500">No terms defined.</TableCell></TableRow>
                        ) : (
                            terms.map((term: any) => (
                                <TableRow key={term._id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="py-4 font-bold text-sm text-gray-800 dark:text-white/90 uppercase tracking-tight">
                                        <div className="flex flex-col">
                                            <span>{term.name}</span>
                                            <span className="text-[10px] text-brand-500 font-extrabold">{term.year} Season</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 font-bold text-xs text-gray-500 tracking-tighter">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-300" />
                                            <span>{formatDate(term.startDate)}</span>
                                            <span className="text-gray-300">→</span>
                                            <span>{formatDate(term.endDate)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={() => handleOpenEdit(term)} className="p-2 text-gray-400 hover:text-brand-500 transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(term._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
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
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Term Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all" 
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
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all" 
                                required 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <DatePicker
                            label="Start Date"
                            defaultDate={formData.startDate}
                            onChange={(_, dateStr) => handleDateChange("startDate", dateStr)}
                        />
                        <DatePicker
                            label="End Date"
                            defaultDate={formData.endDate}
                            onChange={(_, dateStr) => handleDateChange("endDate", dateStr)}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
                            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Commit Term"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TermManagement;
