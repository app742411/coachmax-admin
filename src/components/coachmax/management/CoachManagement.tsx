import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { getAllCoaches, createCoach, updateCoach, deleteCoach } from "../../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash, User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";

const CoachManagement: React.FC = () => {
  const queryClient = useQueryClient();

  // ── UI State (Modals & Forms) ──────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // ── Queries ─────────────────────────────────────────────────────

  const { data: coachesData, isLoading: loading } = useQuery({
    queryKey: ["coaches"],
    queryFn: getAllCoaches,
  });
  const coaches = getDataArray(coachesData);

  // ── Mutations ───────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach created");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create coach"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCoach(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach updated");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update coach"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach deleted");
    },
    onError: () => toast.error("Failed to delete coach"),
  });

  // ── Event Handlers ─────────────────────────────────────────────

  const handleOpenAdd = () => {
    setFormData({ fullName: "", email: "", phone: "", password: "" });
    setIsEditing(false);
    setSelectedCoachId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coach: any) => {
    setFormData({
      fullName: coach.fullName || coach.name || "",
      email: coach.email || "",
      phone: coach.phone || "",
      password: "", 
    });
    setIsEditing(true);
    setSelectedCoachId(coach._id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData };
    
    if (isEditing && selectedCoachId) {
      if (!submissionData.password) {
        const { password, ...rest } = submissionData;
        updateMutation.mutate({ id: selectedCoachId, data: rest });
      } else {
        updateMutation.mutate({ id: selectedCoachId, data: submissionData });
      }
    } else {
      createMutation.mutate(submissionData);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Coaching Staff</h3>
          <p className="text-xs text-gray-500 font-medium">Manage certified academy coaches</p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add Coach</Button>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b">
            <TableRow>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase tracking-wider">Coach Detail</TableCell>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase tracking-wider">Contact Info</TableCell>
              <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 text-center uppercase tracking-wider">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20">
                 <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Staff...</span>
                 </div>
              </TableCell></TableRow>
            ) : coaches.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20 text-gray-500 font-medium italic">No coaching staff records found.</TableCell></TableRow>
            ) : (
              coaches.map((coach: any) => (
                <TableRow key={coach._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-sm text-gray-900 dark:text-white/90 tracking-tight">{coach.fullName || coach.name || "N/A"}</span>
                         <span className="text-[10px] font-bold text-brand-500 uppercase flex items-center gap-1"><ShieldCheck size={10}/> Certified Coach</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium lowercase">
                        <Mail size={12} className="text-gray-300" /> {coach.email || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-900 font-bold tracking-tight">
                        <Phone size={12} className="text-brand-500" /> {coach.phone || coach.mobile || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenEdit(coach)} title="Modify" className="p-2 text-gray-400 hover:text-brand-500 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(coach._id)} title="Remove" className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[450px] p-6 lg:p-8 rounded-2xl shadow-2xl">
        <h4 className="text-xl font-bold mb-2 tracking-tight">{isEditing ? "Modify Coach" : "New Staff Registration"}</h4>
        <p className="text-xs text-gray-500 mb-8 font-medium">Coordinate the administrative credentials for academy staff.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="John Coach"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Identity</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="coach@academy.com"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Mobile Access</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="+61 000 000 000"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Secure Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-12 pr-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                  placeholder={isEditing ? "••••••••" : "Target Password"}
                  required={!isEditing}
                />
              </div>
              {isEditing && <p className="text-[9px] text-gray-300 mt-1.5 ml-1 font-bold italic tracking-wider uppercase">Persistence: Leave blank to retain current key</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-10 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
                {createMutation.isPending || updateMutation.isPending ? "Committing..." : "Save Registry"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoachManagement;
