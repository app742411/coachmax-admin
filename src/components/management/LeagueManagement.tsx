import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllLeagues, createLeague, updateLeague, deleteLeague } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Trophy, Calendar, Image as ImageIcon } from "lucide-react";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

const LeagueManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // ── UI State (Modals & Forms) ──────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    season: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const { data: leaguesData, isLoading: loading } = useQuery({
    queryKey: ["leagues"],
    queryFn: () => getAllLeagues(),
  });
  const leagues = getDataArray(leaguesData);

  // ── Mutations ───────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createLeague,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      toast.success(res?.message || "League created successfully!");
      setIsModalOpen(false);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to create league"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLeague(id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      toast.success(res?.message || "League updated successfully!");
      setIsModalOpen(false);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update league"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeague,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      toast.success(res?.message || "League deleted successfully!");
      setDeleteModalId(null);
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete league"),
  });

  // ── Event Handlers ─────────────────────────────────────────────

  const handleOpenAdd = () => {
    setFormData({ name: "", season: "", description: "", startDate: "", endDate: "" });
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setSelectedLeagueId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (league: any) => {
    setFormData({
      name: league.name || "",
      season: league.season || "",
      description: league.description || "",
      startDate: league.startDate ? new Date(league.startDate).toISOString().split('T')[0] : "",
      endDate: league.endDate ? new Date(league.endDate).toISOString().split('T')[0] : "",
    });
    setSelectedFile(null);
    setPreviewImage(getImageUrl(league.logo));
    setIsEditing(true);
    setSelectedLeagueId(league._id);
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
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("season", formData.season);
    payload.append("description", formData.description);
    if (formData.startDate) payload.append("startDate", formData.startDate);
    if (formData.endDate) payload.append("endDate", formData.endDate);
    
    if (selectedFile) {
      payload.append("leagueLogo", selectedFile);
    }

    if (isEditing && selectedLeagueId) {
      updateMutation.mutate({ id: selectedLeagueId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredLeagues = leagues.filter((league: any) => 
    league.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.season?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 bg-white dark:bg-slate-800 dark:text-white transition-colors shadow-sm"
          />
        </div>
        <Button onClick={handleOpenAdd} size="sm">Add League</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">League Detail</th>
                <th className="py-3 px-4 min-w-[150px]">Season</th>
                <th className="py-3 px-4 min-w-[150px]">Dates</th>
                <th className="py-3 px-4 w-[50px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-20">
                   <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                      <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Leagues...</span>
                   </div>
                </td></tr>
              ) : filteredLeagues.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-20 text-gray-500 font-medium italic">No leagues found.</td></tr>
              ) : (
                filteredLeagues.map((league: any) => (
                  <tr key={league._id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 overflow-hidden flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm shrink-0">
                          {league.logo ? (
                            <img src={getImageUrl(league.logo) as string} alt={league.name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy size={18} />
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight">{league.name}</span>
                           <span className="text-[10px] font-semibold text-slate-500 max-w-[200px] truncate" title={league.description}>{league.description || "No description"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-bold tracking-tight">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700 uppercase">
                              {league.season || "N/A"}
                          </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-500"/> Start: {league.startDate ? new Date(league.startDate).toLocaleDateString() : "TBD"}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400"/> End: {league.endDate ? new Date(league.endDate).toLocaleDateString() : "TBD"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded shadow-sm hover:shadow transition-colors"
                        title="More Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === league._id ? null : league._id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {openDropdownId === league._id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0047FF] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(league);
                              setOpenDropdownId(null);
                            }}
                          >
                            Edit League
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(league._id);
                              setOpenDropdownId(null);
                            }}
                          >
                            Delete League
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
             <Trophy size={22} />
          </div>
          <div>
            <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{isEditing ? "Modify League" : "New League"}</h4>
            <p className="text-xs text-slate-500 font-medium">Configure league details and branding.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">League Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="e.g. Summer Championship League"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all"
                placeholder="e.g. 2026"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-medium focus:bg-white focus:border-brand-500 outline-none transition-all resize-none h-24"
                placeholder="League description..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    ref={startDateRef}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-5 pr-11 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 bg-transparent"
                    required
                  />
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer z-20"
                    onClick={() => {
                      try {
                        startDateRef.current?.showPicker();
                      } catch (e) {
                        startDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    ref={endDateRef}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-5 pr-11 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 bg-transparent"
                    required
                  />
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer z-20"
                    onClick={() => {
                      try {
                        endDateRef.current?.showPicker();
                      } catch (e) {
                        endDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
             <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm h-full flex flex-col items-center justify-center">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">League Logo</label>
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
                {createMutation.isPending || updateMutation.isPending ? "Committing..." : "Save League"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete League"
        message="Are you sure you want to delete this league? This action cannot be undone."
      />
    </div>
  );
};

export default LeagueManagement;
