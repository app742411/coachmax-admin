import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { getAllCategories, createCategory } from "../../api/adminApi";
import { toast } from "react-hot-toast";

const CategoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categoriesData, isLoading: loading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setNewCategoryName("");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create category"),
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createMutation.mutate(newCategoryName);
  };

  return (
    <>
      <PageMeta title="CoachMax | Categories" description="Manage coaching categories" />
      <PageBreadcrumb pageTitle="Categories" />

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            Add Category
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Created At
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="px-5 py-4 text-center text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="px-5 py-4 text-center text-gray-500">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category: any) => (
                    <TableRow key={category._id}>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {category._id}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 font-medium text-start text-theme-sm dark:text-white/90">
                        {category.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6 lg:p-10">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Add New Category</h2>
        <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">Create a new category for your programs.</p>
        <form onSubmit={handleCreateCategory}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. School Program"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CategoryPage;
