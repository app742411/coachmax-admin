import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { getAllPrograms, createProgram, getAllCategories } from "../../api/adminApi";
import { toast } from "react-hot-toast";

const ProgramPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  const { data: progsData, isLoading: loadingProgs } = useQuery({
    queryKey: ["programs"],
    queryFn: getAllPrograms,
  });

  const { data: catsData, isLoading: loadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const programs = getDataArray(progsData);
  const categories = getDataArray(catsData);
  const loading = loadingProgs || loadingCats;

  const createMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program created successfully");
      setFormData({ name: "", category: "" });
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create program"),
  });

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) {
        toast.error("Please fill all fields");
        return;
    }
    createMutation.mutate(formData);
  };

  return (
    <>
      <PageMeta title="CoachMax | Programs" description="Manage coaching programs" />
      <PageBreadcrumb pageTitle="Programs" />

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            Add Program
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created At</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                    <TableRow><TableCell colSpan={4} className="px-5 py-4 text-center text-gray-500">Loading...</TableCell></TableRow>
                ) : programs.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="px-5 py-4 text-center text-gray-500">No programs found.</TableCell></TableRow>
                ) : (
                  programs.map((prog: any) => (
                    <TableRow key={prog._id}>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{prog._id}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 font-medium text-start text-theme-sm dark:text-white/90">{prog.name || prog.title}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">{prog.category?.name || "N/A"}</TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {prog.createdAt ? new Date(prog.createdAt).toLocaleDateString() : "N/A"}
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
        <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Add New Program</h2>
        <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">Create a new elite coaching program.</p>
        <form onSubmit={handleCreateProgram}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Program Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Elite"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                required
            >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Creating..." : "Create Program"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProgramPage;
