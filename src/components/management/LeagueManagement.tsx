import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllLeagues, createLeague, updateLeague, deleteLeague, getAllTeams } from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Trophy, Calendar, Image as ImageIcon, Users, Search, X, Settings2 } from "lucide-react";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

const LeagueManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const regStartDateRef = useRef<HTMLInputElement>(null);
  const regEndDateRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    season: "2026-2027",
    description: "",
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    status: "UPCOMING",
    type: "NATIONAL",
    visibility: "PUBLIC",
    pointsForWin: 3,
    pointsForDraw: 1,
    allowDraws: true,
    automaticLadderRecalculation: true,
  });

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch academy teams for league enrollment
  const { data: allTeamsData } = useQuery({
    queryKey: ["allAcademyTeams"],
    queryFn: () => getAllTeams(),
    enabled: isModalOpen,
  });
  const allAcademyTeams: any[] = Array.isArray(allTeamsData)
    ? allTeamsData
    : allTeamsData?.data || [];

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const { data: leaguesData, isLoading: loading } = useQuery({
    queryKey: ["leagues"],
    queryFn: () => getAllLeagues(),
  });
  const leagues = getDataArray(leaguesData);

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

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      season: "2026-2027",
      description: "",
      startDate: "",
      endDate: "",
      registrationStartDate: "",
      registrationEndDate: "",
      status: "UPCOMING",
      type: "NATIONAL",
      visibility: "PUBLIC",
      pointsForWin: 3,
      pointsForDraw: 1,
      allowDraws: true,
      automaticLadderRecalculation: true,
    });
    setSelectedTeamIds([]);
    setTeamSearchQuery("");
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setSelectedLeagueId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (league: any) => {
    setFormData({
      name: league.name || "",
      season: league.season || "2026-2027",
      description: league.description || "",
      startDate: league.startDate ? new Date(league.startDate).toISOString().split('T')[0] : "",
      endDate: league.endDate ? new Date(league.endDate).toISOString().split('T')[0] : "",
      registrationStartDate: league.registrationStartDate
        ? new Date(league.registrationStartDate).toISOString().split('T')[0]
        : league.registrationOpenDate
        ? new Date(league.registrationOpenDate).toISOString().split('T')[0]
        : "",
      registrationEndDate: league.registrationEndDate
        ? new Date(league.registrationEndDate).toISOString().split('T')[0]
        : league.registrationCloseDate
        ? new Date(league.registrationCloseDate).toISOString().split('T')[0]
        : "",
      status: (league.status || "UPCOMING").toUpperCase(),
      type: (league.type || league.leagueType || league.competitionScope || "NATIONAL").toUpperCase(),
      visibility: (league.visibility || "PUBLIC").toUpperCase(),
      pointsForWin: league.pointsForWin ?? 3,
      pointsForDraw: league.pointsForDraw ?? 1,
      allowDraws: league.allowDraws ?? true,
      automaticLadderRecalculation: league.automaticLadderRecalculation ?? league.autoLadderCalculation ?? true,
    });

    const currentTeamIds = Array.isArray(league.teams)
      ? league.teams.map((t: any) => (typeof t === "string" ? t : t._id))
      : [];
    setSelectedTeamIds(currentTeamIds);
    setTeamSearchQuery("");
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleTeamSelect = (id: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleSelectAllTeams = () => {
    const allFilteredIds = filteredAcademyTeams.map((t) => t._id);
    const allSelected = allFilteredIds.every((id) => selectedTeamIds.includes(id));
    if (allSelected) {
      setSelectedTeamIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedTeamIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
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
    if (formData.registrationStartDate) payload.append("registrationStartDate", formData.registrationStartDate);
    if (formData.registrationEndDate) payload.append("registrationEndDate", formData.registrationEndDate);
    payload.append("status", formData.status);
    payload.append("type", formData.type);
    payload.append("competitionScope", formData.type);
    payload.append("leagueType", formData.type);
    payload.append("visibility", formData.visibility);
    payload.append("pointsForWin", String(formData.pointsForWin));
    payload.append("pointsForDraw", String(formData.pointsForDraw));
    payload.append("allowDraws", String(formData.allowDraws));
    payload.append("automaticLadderRecalculation", String(formData.automaticLadderRecalculation));

    selectedTeamIds.forEach((tId) => {
      payload.append("teams", tId);
    });

    if (selectedFile) {
      payload.append("leagueLogo", selectedFile);
    }

    if (isEditing && selectedLeagueId) {
      updateMutation.mutate({ id: selectedLeagueId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredAcademyTeams = allAcademyTeams.filter((team: any) => {
    const tName = team.teamName || team.name || "";
    const coachStr = typeof team.coach === "object" ? team.coach?.name || "" : team.coach || "";
    return (
      tName.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      coachStr.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );
  });

  const filteredLeagues = leagues.filter((league: any) =>
    league.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.season?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (league.type || league.leagueType || "")?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-none outline-none focus:border-brand-500 bg-white dark:bg-slate-800 dark:text-white transition-colors shadow-sm"
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
                <th className="py-3 px-4 min-w-[100px]">Season</th>
                <th className="py-3 px-4 min-w-[140px]">Type</th>
                <th className="py-3 px-4 min-w-[150px]">Dates</th>
                <th className="py-3 px-4 w-[50px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Leagues...</span>
                  </div>
                </td></tr>
              ) : filteredLeagues.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">No leagues found.</td></tr>
              ) : (
                filteredLeagues.map((league: any) => (
                  <tr
                    key={league._id}
                    onClick={() => navigate(`/leagues/${league._id}`)}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-brand-50 overflow-hidden flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm shrink-0">
                          {league.logo ? (
                            <img src={getImageUrl(league.logo) as string} alt={league.name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy size={18} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight hover:text-brand-600 transition-colors">{league.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 max-w-[200px] truncate" title={league.description}>{league.description || "No description"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-bold tracking-tight">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-none border border-slate-200 dark:border-slate-700 uppercase">
                          {league.season || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {(() => {
                        const t = (league.type || league.leagueType || "NATIONAL").toUpperCase();
                        let badgeClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60";
                        let label = "National";

                        if (t === "INTERNATIONAL") {
                          badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60";
                          label = "International";
                        } else if (t === "STATE") {
                          badgeClass = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60";
                          label = "State / Regional";
                        } else if (t === "LOCAL" || t === "INTERNAL") {
                          badgeClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                          label = "Local / Internal";
                        }

                        return (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-none border uppercase tracking-wider ${badgeClass}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-500" /> Start: {league.startDate ? new Date(league.startDate).toLocaleDateString() : "TBD"}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> End: {league.endDate ? new Date(league.endDate).toLocaleDateString() : "TBD"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-none shadow-sm hover:shadow transition-colors"
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
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leagues/${league._id}`);
                              setOpenDropdownId(null);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0047FF] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700/60"
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[920px] max-h-[92vh] overflow-y-auto p-6 lg:p-8 rounded-xl shadow-2xl"
        noBackgroundBlur={true}
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-xl text-brand-600">
            <Trophy size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              {isEditing ? "Modify League" : "Create New League"}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Configure competition scope, schedule timelines, teams, and ladder rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-slate-50/60 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Trophy size={16} className="text-brand-600" />
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Basic Information
              </h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  League Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  placeholder="e.g. Premier Youth League"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Season <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  placeholder="e.g. 2026-2027"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  League Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white cursor-pointer"
                  required
                >
                  <option value="INTERNATIONAL">INTERNATIONAL</option>
                  <option value="NATIONAL">NATIONAL</option>
                  <option value="STATE">STATE</option>
                  <option value="LOCAL">LOCAL</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Visibility
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="INTERNAL">INTERNAL</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium focus:border-brand-500 outline-none text-slate-900 dark:text-white resize-none h-20"
                  placeholder="e.g. Youth football competition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Registration Timelines */}
          <div className="bg-slate-50/60 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar size={16} className="text-emerald-600" />
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Tournament & Registration Schedule
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    ref={startDateRef}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                      try {
                        startDateRef.current?.showPicker();
                      } catch {
                        startDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-slate-400 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    ref={endDateRef}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                      try {
                        endDateRef.current?.showPicker();
                      } catch {
                        endDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-slate-400 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Registration Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    ref={regStartDateRef}
                    value={formData.registrationStartDate}
                    onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                      try {
                        regStartDateRef.current?.showPicker();
                      } catch {
                        regStartDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-slate-400 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Registration End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    ref={regEndDateRef}
                    value={formData.registrationEndDate}
                    onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                      try {
                        regEndDateRef.current?.showPicker();
                      } catch {
                        regEndDateRef.current?.focus();
                      }
                    }}
                  >
                    <Calendar className="text-slate-400 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Ladder & Operational Rules */}
          <div className="bg-slate-50/60 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Settings2 size={16} className="text-amber-600" />
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Scoring & Ladder Rules
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Points for Win
                </label>
                <input
                  type="number"
                  value={formData.pointsForWin}
                  onChange={(e) => setFormData({ ...formData, pointsForWin: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Points for Draw
                </label>
                <input
                  type="number"
                  value={formData.pointsForDraw}
                  onChange={(e) => setFormData({ ...formData, pointsForDraw: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col justify-center gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowDraws}
                    onChange={(e) => setFormData({ ...formData, allowDraws: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Allow Draws
                    </span>
                    <span className="text-[10px] text-slate-400">Award points for tied matches</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.automaticLadderRecalculation}
                    onChange={(e) =>
                      setFormData({ ...formData, automaticLadderRecalculation: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Automatic Ladder Recalculation
                    </span>
                    <span className="text-[10px] text-slate-400">Instant standings computation</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Participating Teams (teams) */}
          <div className="bg-slate-50/60 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Participating Teams
                </h5>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  {selectedTeamIds.length} Selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllTeams}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 underline"
                >
                  {filteredAcademyTeams.every((t) => selectedTeamIds.includes(t._id))
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {/* Team Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search academy teams to enroll..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            {/* Scrollable Team List */}
            <div className="max-h-48 overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredAcademyTeams.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs italic">
                  No academy teams found.
                </div>
              ) : (
                filteredAcademyTeams.map((team: any) => {
                  const isSelected = selectedTeamIds.includes(team._id);
                  const tName = team.teamName || team.name || "Academy Team";
                  const coachName =
                    typeof team.coach === "object" && team.coach?.name
                      ? team.coach.name
                      : typeof team.coach === "string"
                      ? team.coach
                      : "Unassigned";

                  return (
                    <div
                      key={team._id}
                      onClick={() => toggleTeamSelect(team._id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-50/50 dark:bg-brand-950/20"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {tName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Coach: {coachName} {team.players?.length ? `• ${team.players.length} players` : ""}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {team._id.slice(-6)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 5: League Logo (leagueLogo) */}
          <div className="bg-slate-50/60 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ImageIcon size={16} className="text-indigo-600" />
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                League Logo / Crest (leagueLogo)
              </h5>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-brand-500 transition-colors shrink-0 shadow-xs"
              >
                {previewImage ? (
                  <img src={previewImage} alt="Logo preview" className="w-full h-full object-contain p-1.5" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-brand-500 transition-colors">
                    <ImageIcon className="w-7 h-7 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="modal-league-logo"
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="modal-league-logo"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-xs"
                  >
                    <ImageIcon size={13} />
                    <span>{previewImage ? "Change Logo" : "Select your logo"}</span>
                  </label>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold dark:border-rose-900/40 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <X size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  PNG, JPG, or SVG recommended. Displays in header, ladder, and standings.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-8 flex items-center gap-2"
            >
              <Trophy size={14} />
              <span>
                {createMutation.isPending || updateMutation.isPending
                  ? "Committing..."
                  : isEditing
                  ? "Save Changes"
                  : "Create League"}
              </span>
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
