import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllCoaches, createCoach, updateCoach, deleteCoach, changeCoachPassword, toggleCoachActive } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, ShieldCheck } from "../../icons/lucide-icons";
import { Eye, EyeOff, Pencil, X } from "lucide-react";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

const CoachManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  const { data: coachesData, isLoading: loading } = useQuery({
    queryKey: ["coaches"],
    queryFn: () => getAllCoaches(),
  });
  const coaches = getDataArray(coachesData);

  const createMutation = useMutation({
    mutationFn: createCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach created");
      setIsModalOpen(false);
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCoach(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach information updated successfully");
      setIsModalOpen(false);
      setIsModalOpen(false);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => changeCoachPassword(id, data),
    onSuccess: () => {
      toast.success("Coach password updated successfully");
      setIsModalOpen(false);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach deleted");
      setDeleteModalId(null);
      setDeleteModalId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleCoachActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach access updated successfully");
    },
    onError: () => {
      toast.error("Failed to update coach access");
    }
  });

  const handleOpenAdd = () => {
    setFormData({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEditing(false);
    setSelectedCoachId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coach: any) => {
    setFormData({
      fullName: coach.fullName || coach.name || "",
      email: coach.email || "",
      phone: coach.phone || coach.mobile || "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEditing(true);
    setSelectedCoachId(coach._id);
    setIsModalOpen(true);
  };



  const confirmDelete = () => {
    if (deleteModalId) {
      deleteMutation.mutate(deleteModalId);
    }
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const symbols = "!@#$%^&*";
    const random = (str: string) => str[Math.floor(Math.random() * str.length)];
    const p = random(caps) + random(chars) + random(symbols) + Math.random().toString(36).slice(-5);
    setFormData({ ...formData, password: p, confirmPassword: p });
  };

  const handleToggleAccess = (coach: any) => {
    const nextActive = coach.isActive === false ? true : false;
    toggleMutation.mutate({
      id: coach._id,
      isActive: nextActive,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      toast.error("Password must be at least 8 characters and contain uppercase, lowercase, and a special symbol");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name: formData.fullName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      mobile: formData.phone,
      password: formData.password,
    };
    createMutation.mutate(payload);
  };

  const handleUpdateInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoachId) return;

    const payload = {
      name: formData.fullName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      mobile: formData.phone,
    };
    updateMutation.mutate({ id: selectedCoachId, data: payload });
  };

  const handleUpdatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoachId) return;

    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      toast.error("Password must be at least 8 characters and contain uppercase, lowercase, and a special symbol");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    changePasswordMutation.mutate({ id: selectedCoachId, data: { password: formData.password } });
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-none border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Coaching Staff</h3>
          <p className="text-xs text-gray-500 font-medium">Manage certified academy coaches</p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add Coach</Button>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        <Table>
          <TableHeader className="sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableCell isHeader>Coach Detail</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Phone</TableCell>
              <TableCell isHeader>Access</TableCell>
              <TableCell isHeader className="text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                  <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Staff...</span>
                </div>
              </TableCell></TableRow>
            ) : coaches.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">No coaching staff records found.</TableCell></TableRow>
            ) : (
              coaches.map((coach: any) => (
                <TableRow key={coach._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {coach.profileImage ? (
                        <img
                          src={coach.profileImage.startsWith('http') ? coach.profileImage : `${import.meta.env.VITE_API_BASE_URL || ""}/${coach.profileImage.replace(/^\/+/, "")}`}
                          alt={coach.fullName || coach.name || "Coach"}
                          className="w-10 h-10 rounded-none object-cover border border-brand-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-none bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm">
                          <User size={18} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 dark:text-white/90 tracking-tight">{coach.fullName || coach.name || "N/A"}</span>
                        <span className="text-[10px] font-bold text-brand-500 uppercase flex items-center gap-1"><ShieldCheck size={10} /> Certified Coach</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coach.email ? (
                      <a
                        href={`mailto:${coach.email}`}
                        className="flex items-center gap-2 text-xs text-[#0047FF] hover:underline font-bold lowercase"
                      >
                        <Mail size={14} className="text-[#0047FF]" /> {coach.email}
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium lowercase">
                        <Mail size={14} className="text-gray-300" /> N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-gray-900 font-bold tracking-tight">
                      <Phone size={12} className="text-brand-500" /> {coach.phone || coach.mobile || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAccess(coach)}
                        disabled={toggleMutation.isPending}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 ${
                          coach.isActive !== false ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            coach.isActive !== false ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${coach.isActive !== false ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                        {coach.isActive !== false ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenEdit(coach)} title="Modify" className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors"><Pencil size={14} /></button>
                      {/* <button onClick={() => handleDeleteClick(coach._id)} title="Remove" className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className={`p-6 lg:p-8 rounded-none shadow-2xl transition-all ${isEditing ? "w-[95%] max-w-[1000px] bg-gray-50/50" : "max-w-[500px] bg-white"}`}>
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold tracking-tight">Modify Coach</h4>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm flex flex-col h-full">
                <h5 className="font-bold text-gray-800 mb-1">Coach Information</h5>
                <p className="text-xs text-gray-500 mb-6">Manage profile details and contact information.</p>
                <form onSubmit={handleUpdateInfoSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
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
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
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
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                        placeholder="+61 000 000 000"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex justify-end">
                    <Button type="submit" disabled={updateMutation.isPending} className="px-6 h-11 rounded-none text-sm font-medium">
                      {updateMutation.isPending ? "Updating..." : "Update Information"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Security & Password Card */}
              <div className="bg-white rounded-none border border-gray-200 p-6 shadow-sm flex flex-col h-full">
                <h5 className="font-bold text-gray-800 mb-1">Security & Password</h5>
                <p className="text-xs text-gray-500 mb-6">Update coach login credentials securely.</p>
                <form onSubmit={handleUpdatePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                        <button type="button" onClick={generatePassword} className="text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
                          Suggest Password
                        </button>
                      </div>
                      <div className="relative">
                        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full rounded-none border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="text-[10px] text-red-500 mt-1.5 ml-1 font-semibold space-y-0.5">
                          {formData.password.length < 8 && <p>• Must be at least 8 characters</p>}
                          {!/[A-Z]/.test(formData.password) && <p>• Must contain an uppercase letter</p>}
                          {!/[a-z]/.test(formData.password) && <p>• Must contain a lowercase letter</p>}
                          {!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && <p>• Must contain a special symbol</p>}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full rounded-none border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                          placeholder="Confirm Password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-semibold">Passwords do not match</p>
                      )}
                    </div>
                    <p className="text-[10px] text-yellow-600 mt-2 ml-1 font-medium italic">
                      Updating password will immediately replace the coach's existing password.
                    </p>
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-100 flex justify-end">
                    <Button type="submit" disabled={changePasswordMutation.isPending} className="px-6 h-11 rounded-none text-sm font-medium">
                      {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-xl font-bold mb-2 tracking-tight">New Staff Registration</h4>
            <p className="text-xs text-gray-500 mb-8 font-medium">Coordinate the administrative credentials for academy staff.</p>
            <form onSubmit={handleCreateSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
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
                    className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
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
                    className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                    placeholder="+61 000 000 000"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Secure Password</label>
                    <button type="button" onClick={generatePassword} className="text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
                      Suggest Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-none border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                      placeholder="Target Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="text-[10px] text-red-500 mt-1.5 ml-1 font-semibold space-y-0.5">
                      {formData.password.length < 8 && <p>• Must be at least 8 characters</p>}
                      {!/[A-Z]/.test(formData.password) && <p>• Must contain an uppercase letter</p>}
                      {!/[a-z]/.test(formData.password) && <p>• Must contain a lowercase letter</p>}
                      {!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && <p>• Must contain a special symbol</p>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full rounded-none border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all h-12"
                      placeholder="Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-semibold">Passwords do not match</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-none h-11 px-6">Discard</Button>
                <Button type="submit" disabled={createMutation.isPending} className="px-8 h-11 rounded-none text-sm font-medium">
                  {createMutation.isPending ? "Saving..." : "Add Coach"}
                </Button>
              </div>
            </form>
          </>
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Coach"
        message="Are you sure you want to delete this coach? This action cannot be undone."
      />
    </div>
  );
};

export default CoachManagement;
