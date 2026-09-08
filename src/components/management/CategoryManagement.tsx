import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCategories";
import { toast } from "react-hot-toast";
import { Edit, Trash, Tag } from "../../icons/lucide-icons";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

const CategoryManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", isEvent: false });

  const { categories, isLoading: loading } = useCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleOpenAdd = () => {
    setFormData({ name: "", isEvent: false });
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setFormData({ name: cat.name || "", isEvent: !!cat.isEvent });
    setIsEditing(true);
    setSelectedId(cat._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModalId(id);
  };

  const confirmDelete = () => {
    if (deleteModalId) {
      deleteMutation.mutate(deleteModalId, {
        onSuccess: () => {
          toast.success("Category deleted");
          setDeleteModalId(null);
        },
        onError: () => toast.error("Failed to delete category"),
      });
    }
  };

  const handleNameChange = (val: string) => {
    const isHoliday = val.toLowerCase().includes("holiday");
    setFormData(prev => ({
      ...prev,
      name: val,
      isEvent: isHoliday ? true : prev.isEvent
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedId) {
      updateMutation.mutate(
        { id: selectedId, data: formData },
        {
          onSuccess: () => {
            toast.success("Category updated");
            setIsModalOpen(false);
          },
          onError: () => toast.error("Failed to update category"),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Category created");
          setIsModalOpen(false);
        },
        onError: () => toast.error("Failed to create category"),
      });
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-none border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Academy Categories</h3>
          <p className="text-xs text-gray-500">Manage high-level groups</p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add New</Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        <Table>
          <TableHeader className="sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableCell isHeader>Category Name</TableCell>
              <TableCell isHeader className="text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-400">Syncing...</TableCell></TableRow>
            ) : categories.length === 0 ? (
              <TableRow><TableCell colSpan={2} className="text-center py-10 text-gray-500">No categories recorded.</TableCell></TableRow>
            ) : (
              categories.map((cat: any) => (
                <TableRow key={cat._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-brand-50 flex items-center justify-center text-brand-500">
                        <Tag size={16} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800 dark:text-white/90">{cat.name}</span>
                        {cat.isEvent && (
                          <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider rounded-none border border-amber-100 dark:border-amber-500/20">
                            Holiday Program
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenEdit(cat)} className="p-2 text-gray-400 hover:text-brand-500 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteClick(cat._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
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
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-none border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Academy"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isEvent}
                onChange={(e) => setFormData(prev => ({ ...prev, isEvent: e.target.checked }))}
                className="w-4 h-4 text-[#031549] border-gray-300 rounded-none focus:ring-[#031549]"
              />
              <span className="text-xs font-semibold text-gray-700">Holiday Program</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : (isEditing ? "Update Category" : "Add Category")}
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default CategoryManagement;
