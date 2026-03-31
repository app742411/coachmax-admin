import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { getAllTerms, createTerm, updateTerm, deleteTerm } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash } from "lucide-react";
import DatePicker from "../../components/form/date-picker";

const TermPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        year: new Date().getFullYear(),
        startDate: "",
        endDate: "",
    });

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const res = await getAllTerms();
            const dataArray = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
            setTerms(dataArray);
        } catch (error) {
            console.error("Error fetching terms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

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

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this term?")) return;
        try {
            await deleteTerm(id);
            toast.success("Term deleted successfully");
            fetchTerms();
        } catch (error) {
            toast.error("Failed to delete term");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (isEditing && selectedId) {
                await updateTerm(selectedId, formData);
                toast.success("Term updated successfully");
            } else {
                await createTerm(formData);
                toast.success("Term created successfully");
            }
            setIsModalOpen(false);
            fetchTerms();
        } catch (error) {
            console.error("Error saving term:", error);
            toast.error("Failed to save term");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageMeta title="CoachMax | Terms" description="Manage coaching terms" />
            <PageBreadcrumb pageTitle="Terms" />

            <div className="space-y-6">
                <div className="flex justify-end">
                    <Button onClick={handleOpenAdd} variant="primary" size="md">
                        Add Term
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Year</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Start Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">End Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 text-center">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="px-5 py-4 text-center text-gray-500">Loading...</TableCell></TableRow>
                                ) : terms.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="px-5 py-4 text-center text-gray-500">No terms found.</TableCell></TableRow>
                                ) : (
                                    terms.map((term) => (
                                        <TableRow key={term._id}>
                                            <TableCell className="px-5 py-4 text-gray-800 font-medium text-start text-theme-sm dark:text-white/90">{term.name}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{term.year}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{term.startDate}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{term.endDate}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleOpenEdit(term)} className="text-gray-500 hover:text-brand-500"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(term._id)} className="text-gray-500 hover:text-red-500"><Trash size={18} /></button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6 lg:p-10 z-9999999" showCloseButton={true}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{isEditing ? "Edit Term" : "Add New Term"}</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Term Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g. Summer Term" required />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <DatePicker
                                label="Start Date"
                                placeholder="YYYY-MM-DD"
                                defaultDate={formData.startDate}
                                onChange={(_, dateStr) => handleDateChange("startDate", dateStr)}
                            />
                        </div>
                        <div className="mb-4">
                            <DatePicker
                                label="End Date"
                                placeholder="YYYY-MM-DD"
                                defaultDate={formData.endDate}
                                onChange={(_, dateStr) => handleDateChange("endDate", dateStr)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : (isEditing ? "Update Term" : "Create Term")}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default TermPage;
