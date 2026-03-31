import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { getAllPrograms, createProgram, updateProgram, deleteProgram, getAllCategories, getProgramsByCategory } from "../../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash, Filter, Layers } from "lucide-react";

const ProgramManagement: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const catsRes = await getAllCategories().catch(() => ({ data: [] }));
      const cats = getDataArray(catsRes);
      setCategories(cats);

      if (cats.length > 0) {
        const firstCatId = cats[0]._id;
        setSelectedCategoryFilter(firstCatId);
        const progsRes = await getProgramsByCategory(firstCatId);
        setPrograms(getDataArray(progsRes));
      } else {
        const progsRes = await getAllPrograms().catch(() => ({ data: [] }));
        setPrograms(getDataArray(progsRes));
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredPrograms = async (categoryId: string) => {
    try {
      setLoading(true);
      const res = await getProgramsByCategory(categoryId);
      setPrograms(getDataArray(res));
    } catch (error) {
      console.error("Error fetching filtered programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategoryFilter(val);
    fetchFilteredPrograms(val);
  };

  const handleOpenAdd = () => {
    setFormData({ name: "", category: selectedCategoryFilter }); // Default to current filter
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: any) => {
    setFormData({
      name: prog.name || prog.title || "",
      category: prog.category?._id || prog.category || "",
    });
    setIsEditing(true);
    setSelectedId(prog._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteProgram(id);
      toast.success("Program deleted");
      fetchFilteredPrograms(selectedCategoryFilter);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isEditing && selectedId) {
        await updateProgram(selectedId, formData);
        toast.success("Program updated");
      } else {
        await createProgram(formData);
        toast.success("Program created");
      }
      setIsModalOpen(false);
      fetchFilteredPrograms(selectedCategoryFilter);
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Curriculum Programs</h3>
          <p className="text-xs text-gray-500 font-medium">Manage coaching levels by academy category</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-500 transition-colors" />
            <select 
              value={selectedCategoryFilter} 
              onChange={handleFilterChange}
              className="pl-9 pr-8 py-2 rounded-lg border border-gray-100 bg-gray-50 text-xs font-bold text-gray-600 focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleOpenAdd} size="sm">Add Program</Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b">
            <TableRow>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase tracking-wider pl-6">Module Title</TableCell>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase tracking-wider">Classification</TableCell>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 text-center uppercase tracking-wider pr-6">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Library...</span>
                </div>
              </TableCell></TableRow>
            ) : programs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20 text-gray-500 font-medium italic">No programs identified in this category.</TableCell></TableRow>
            ) : (
              programs.map((prog) => (
                <TableRow key={prog._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-4 pl-6 font-bold text-sm text-gray-800 dark:text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                        <Layers size={16} />
                      </div>
                      {prog.name || prog.title}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="px-2 py-1 bg-brand-50 text-brand-600 text-[10px] font-extrabold uppercase rounded shadow-sm border border-brand-100">
                      {prog.category?.name || categories.find(c => c._id === (prog.category?._id || prog.category))?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenEdit(prog)} title="Modify" className="p-2 text-gray-400 hover:text-brand-500 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(prog._id)} title="Remove" className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[450px] p-6 lg:p-8 rounded-2xl shadow-2xl">
        <h4 className="text-xl font-bold mb-2 tracking-tight">{isEditing ? "Modify Program" : "New Curriculum Module"}</h4>
        <p className="text-xs text-gray-500 mb-8 font-medium">Define the core objectives for this training level.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Program Label</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="Elite Performance"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Parent Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select Target Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-10 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit" disabled={submitting} className="px-10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">{submitting ? "Committing..." : "Deploy Program"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProgramManagement;
