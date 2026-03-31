import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash, Tag } from "lucide-react";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategories(Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ name: "" });
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setFormData({ name: cat.name || "" });
    setIsEditing(true);
    setSelectedId(cat._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isEditing && selectedId) {
        await updateCategory(selectedId, formData);
        toast.success("Category updated");
      } else {
        await createCategory(formData);
        toast.success("Category created");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Academy Categories</h3>
          <p className="text-xs text-gray-500">Manage high-level groups</p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add New</Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b">
            <TableRow>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Category Name</TableCell>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 text-center uppercase">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-400">Syncing...</TableCell></TableRow>
            ) : categories.length === 0 ? (
              <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-500">No categories recorded.</TableCell></TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-4 font-bold text-sm text-gray-800 dark:text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500">
                        <Tag size={16} />
                      </div>
                      {cat.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenEdit(cat)} className="p-2 text-gray-400 hover:text-brand-500 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[400px] p-6 lg:p-8">
        <h4 className="text-xl font-bold mb-2">{isEditing ? "Edit Category" : "New Category"}</h4>
        <p className="text-xs text-gray-500 mb-6">Manage high-level academy groupings.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Category Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ name: e.target.value })} 
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Academy"
              required 
            />
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Commit Data"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
