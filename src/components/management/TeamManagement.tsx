import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllTeams, createTeam, updateTeam, deleteTeam, getAllCoaches } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { User, Shield, Image as ImageIcon } from "lucide-react";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

const TeamManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── UI State (Modals & Forms) ──────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    teamName: "",
    coach: "",
    assistantCoach: "",
    ageGroup: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────
  const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const getDataArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // ── Queries ─────────────────────────────────────────────────────

  const { data: teamsData, isLoading: loading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getAllTeams(),
  });
  const teams = getDataArray(teamsData);

  const { data: coachesData } = useQuery({
    queryKey: ["coaches"],
    queryFn: () => getAllCoaches(),
  });
  const coaches = getDataArray(coachesData);

  // ── Mutations ───────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(res?.message || "Team created successfully!");
      setIsModalOpen(false);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to create team"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTeam(id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(res?.message || "Team updated successfully!");
      setIsModalOpen(false);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update team"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(res?.message || "Team deleted successfully!");
      setDeleteModalId(null);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete team"),
  });

  // ── Event Handlers ─────────────────────────────────────────────

  const handleOpenAdd = () => {
    setFormData({ teamName: "", coach: "", assistantCoach: "", ageGroup: "" });
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setSelectedTeamId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team: any) => {
    setFormData({
      teamName: team.teamName || "",
      coach: team.coach?._id || team.coach || "",
      assistantCoach: team.assistantCoach?._id || team.assistantCoach || "",
      ageGroup: team.ageGroup || "",
    });
    setSelectedFile(null);
    setPreviewImage(team.teamLogo ? getImageUrl(team.teamLogo) : (team.logo ? getImageUrl(team.logo) : null));
    setIsEditing(true);
    setSelectedTeamId(team._id);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("teamName", formData.teamName);
    payload.append("coach", formData.coach);
    if (formData.assistantCoach) {
      payload.append("assistantCoach", formData.assistantCoach);
    }
    payload.append("ageGroup", formData.ageGroup);
    
    if (selectedFile) {
      payload.append("teamLogo", selectedFile);
    }

    if (isEditing && selectedTeamId) {
      updateMutation.mutate({ id: selectedTeamId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const getCoachName = (coachId: string | any) => {
    if (!coachId) return "Unassigned";
    if (typeof coachId === 'object') return coachId.fullName || coachId.name || "Unassigned";
    const coach = coaches.find((c: any) => c._id === coachId);
    return coach ? (coach.fullName || coach.name) : "Unassigned";
  };

  const filteredTeams = teams.filter((team: any) => 
    team.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.ageGroup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCoachName(team.coach).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 dark:text-white transition-colors shadow-sm"
          />
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add Team</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">Team Detail</th>
                <th className="py-3 px-4 min-w-[150px]">Coach</th>
                <th className="py-3 px-4 min-w-[120px]">Age Group</th>
                <th className="py-3 px-4 min-w-[100px] text-center">Players</th>
                <th className="py-3 px-4 w-[50px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-20">
                   <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                      <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Teams...</span>
                   </div>
                </td></tr>
              ) : filteredTeams.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">No teams found.</td></tr>
              ) : (
                filteredTeams.map((team: any) => (
                  <tr key={team._id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 overflow-hidden flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm shrink-0">
                          {team.teamLogo ? (
                            <img src={getImageUrl(team.teamLogo) as string} alt={team.teamName} className="w-full h-full object-cover" />
                        ) : team.logo ? (
                            <img src={getImageUrl(team.logo) as string} alt={team.teamName} className="w-full h-full object-cover" />
                        ) : (
                            <Shield size={18} />
                        )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight">{team.teamName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-bold tracking-tight">
                            <User size={12} className="text-gray-400 mt-0.5 shrink-0" />
                            <div className="flex flex-col">
                              <span>{getCoachName(team.coach)}</span>
                              {team.coach?.email && <span className="text-[10px] text-gray-500 font-normal">{team.coach.email}</span>}
                            </div>
                        </div>
                        {team.assistantCoach && (
                            <div className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold tracking-tight mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <User size={10} className="text-gray-300 mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                  <span>Asst: {getCoachName(team.assistantCoach)}</span>
                                  {team.assistantCoach?.email && <span className="font-normal">{team.assistantCoach.email}</span>}
                                </div>
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                          {team.ageGroup || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-lg border border-brand-100">
                          {team.players?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded shadow-sm hover:shadow transition-colors"
                        title="More Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === team._id ? null : team._id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {openDropdownId === team._id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0047FF] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(team);
                              setOpenDropdownId(null);
                            }}
                          >
                            Edit Team
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(team._id);
                              setOpenDropdownId(null);
                            }}
                          >
                            Delete Team
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[850px] p-6 lg:p-8 rounded-3xl shadow-2xl" noBackgroundBlur={true}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-xl text-brand-500">
             <Shield size={22} />
          </div>
          <div>
            <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{isEditing ? "Modify Team" : "New Team Profile"}</h4>
            <p className="text-xs text-slate-500 font-medium">Configure team details and assign a coach.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Name</label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="Camelot FC"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assigned Coach</label>
                <select
                  value={formData.coach}
                  onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a Coach</option>
                  {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.fullName || c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assistant Coach (Optional)</label>
                <select
                  value={formData.assistantCoach}
                  onChange={(e) => setFormData({ ...formData, assistantCoach: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Assistant</option>
                  {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.fullName || c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Age Group</label>
              <input
                type="text"
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="e.g. Under-13"
                required
              />
            </div>
          </div>

          <div className="md:col-span-5">
             <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm h-full flex flex-col items-center justify-center">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">Team Logo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 cursor-pointer overflow-hidden hover:border-brand-500 transition-colors group relative"
                >
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon className="text-white w-8 h-8" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-brand-500 transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
             </div>
          </div>

          <div className="md:col-span-12 flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
                {createMutation.isPending || updateMutation.isPending ? "Committing..." : "Save Team"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
      />
    </div>
  );
};

export default TeamManagement;
