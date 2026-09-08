import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { getAllTeams, createTeam, updateTeam, deleteTeam, getAllCoaches } from "../../api/adminApi";
import { getAllTerms } from "../../api/terms";
import { useTerms } from "../../hooks/useTerms";
import { findCurrentTerm } from "../../hooks/useCurrentTerm";
import { toast } from "react-hot-toast";
import { User, Shield, Image as ImageIcon, Clock } from "lucide-react";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";
import AssignPlayerToTeamModal from "./AssignPlayerToTeamModal";
import AddTemporaryPlayersModal from "./AddTemporaryPlayersModal";

const TeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [assignTeamId, setAssignTeamId] = useState<string | null>(null);
  const [tempPlayersTeam, setTempPlayersTeam] = useState<{ id: string; name: string } | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFilterYear, setSelectedFilterYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedFilterTerm, setSelectedFilterTerm] = useState<string>("");

  const { terms: filterTerms } = useTerms({ year: selectedFilterYear, isEvent: "all" });

  useEffect(() => {
    if (filterTerms && filterTerms.length > 0) {
      const active = findCurrentTerm(filterTerms) || filterTerms[0];
      const termIdToSet = active._id || active.id;
      if (!selectedFilterTerm || !filterTerms.some((t: any) => (t._id || t.id) === selectedFilterTerm)) {
        setSelectedFilterTerm(termIdToSet);
      }
    }
  }, [filterTerms]);

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
    fee: "",
    teamFee: "",
    year: new Date().getFullYear().toString(),
    term: "",
    scheduleType: "SINGLE_DAY" as "SINGLE_DAY" | "WEEKDAYS" | "CUSTOM",
    dayOfWeek: "Monday",
    startTime: "17:00",
    endTime: "18:30",
    venue: "",
    location: "",
    teamType: "INTERNAL",
    captain: "",
    viceCaptain: "",
  });
  const [customSchedules, setCustomSchedules] = useState<{ dayOfWeek: string; startTime: string; endTime: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const { data: teamsData, isLoading: loading } = useQuery({
    queryKey: ["teams", selectedFilterTerm],
    queryFn: () => getAllTeams(selectedFilterTerm || undefined),
  });
  const teams = getDataArray(teamsData);

  const { data: coachesData } = useQuery({
    queryKey: ["coaches"],
    queryFn: () => getAllCoaches(),
  });
  const coaches = getDataArray(coachesData);

  const { data: termsData } = useQuery({
    queryKey: ["terms", formData.year],
    queryFn: () => getAllTerms(formData.year ? Number(formData.year) : undefined),
  });
  const terms = Array.isArray(termsData) ? termsData : (termsData?.data || termsData?.terms || []);

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

  const handleOpenAdd = () => {
    setFormData({
      teamName: "",
      coach: "",
      assistantCoach: "",
      ageGroup: "",
      fee: "",
      teamFee: "",
      year: new Date().getFullYear().toString(),
      term: "",
      scheduleType: "SINGLE_DAY",
      dayOfWeek: "Monday",
      startTime: "17:00",
      endTime: "18:30",
      venue: "",
      location: "",
      teamType: "INTERNAL",
      captain: "",
      viceCaptain: "",
    });
    setCustomSchedules([{ dayOfWeek: "Monday", startTime: "17:00", endTime: "18:30" }]);
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setSelectedTeamId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team: any) => {
    const feeVal = team.fee || team.teamFee || "";
    const yearVal = team.year || team.term?.year || new Date().getFullYear();
    setFormData({
      teamName: team.teamName || "",
      coach: team.coach?._id || team.coach || "",
      assistantCoach: team.assistantCoach?._id || team.assistantCoach || "",
      ageGroup: team.ageGroup || "",
      fee: feeVal,
      teamFee: feeVal,
      year: yearVal ? yearVal.toString() : "",
      term: team.term?._id || team.term || "",
      scheduleType: team.scheduleType || "SINGLE_DAY",
      dayOfWeek: team.dayOfWeek || "Monday",
      startTime: team.startTime || "17:00",
      endTime: team.endTime || "18:30",
      venue: team.venue || "",
      location: team.location || "",
      teamType: team.teamType || (team.isExternal ? "EXTERNAL" : "INTERNAL"),
      captain: team.captain?._id || team.captain || "",
      viceCaptain: team.viceCaptain?._id || team.viceCaptain || "",
    });
    if (Array.isArray(team.schedule) && team.schedule.length > 0) {
      setCustomSchedules(team.schedule);
    } else {
      setCustomSchedules([{ dayOfWeek: "Monday", startTime: "17:00", endTime: "18:30" }]);
    }
    setSelectedFile(null);
    setPreviewImage(team.teamLogo ? getImageUrl(team.teamLogo) : (team.logo ? getImageUrl(team.logo) : null));
    setIsEditing(true);
    setSelectedTeamId(team._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModalId(id);
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
    if (formData.coach) payload.append("coach", formData.coach);
    if (formData.assistantCoach) {
      payload.append("assistantCoach", formData.assistantCoach);
    }
    payload.append("ageGroup", formData.ageGroup);

    const effectiveFee = formData.fee || formData.teamFee;
    if (effectiveFee) {
      payload.append("fee", effectiveFee);
      payload.append("teamFee", effectiveFee);
    }

    if (formData.teamType) {
      payload.append("teamType", formData.teamType);
      payload.append("isExternal", formData.teamType === "EXTERNAL" ? "true" : "false");
    }
    if (formData.year) {
      payload.append("year", formData.year);
    }
    if (formData.term) {
      payload.append("term", formData.term);
    }

    payload.append("scheduleType", formData.scheduleType);
    if (formData.scheduleType === "SINGLE_DAY") {
      if (formData.dayOfWeek) payload.append("dayOfWeek", formData.dayOfWeek);
      if (formData.startTime) payload.append("startTime", formData.startTime);
      if (formData.endTime) payload.append("endTime", formData.endTime);
    } else if (formData.scheduleType === "WEEKDAYS") {
      if (formData.startTime) payload.append("startTime", formData.startTime);
      if (formData.endTime) payload.append("endTime", formData.endTime);
    } else if (formData.scheduleType === "CUSTOM") {
      payload.append("schedule", JSON.stringify(customSchedules));
    }

    if (formData.venue) payload.append("venue", formData.venue);
    if (formData.location) payload.append("location", formData.location);

    if (formData.captain) {
      payload.append("captain", formData.captain);
    }
    if (formData.viceCaptain) {
      payload.append("viceCaptain", formData.viceCaptain);
    }

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
    (team.teamType || (team.isExternal ? "external" : "our team"))?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-none outline-none focus:border-brand-500 bg-white dark:bg-slate-800 dark:text-white transition-colors shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Year Filter Dropdown */}
          <select
            value={selectedFilterYear}
            onChange={(e) => {
              setSelectedFilterYear(e.target.value);
              setSelectedFilterTerm("");
            }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-none focus:outline-none focus:border-[#0047FF] shadow-xs cursor-pointer"
          >
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Term Filter Dropdown */}
          <select
            value={selectedFilterTerm}
            onChange={(e) => setSelectedFilterTerm(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-none focus:outline-none focus:border-[#0047FF] shadow-xs cursor-pointer max-w-[240px]"
          >
            {filterTerms.map((t: any) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name || t.termName || t.title || "Term"} {t.year ? `(${t.year})` : ""}
              </option>
            ))}
          </select>

          <Button onClick={handleOpenAdd} size="sm">Add Team</Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
        <div className="overflow-visible no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">Team Detail</th>
                <th className="py-3 px-4 min-w-[110px]">Type</th>
                <th className="py-3 px-4 min-w-[150px]">Coach</th>
                <th className="py-3 px-4 min-w-[100px]">Age Group</th>
                <th className="py-3 px-4 min-w-[90px]">Fee</th>
                <th className="py-3 px-4 min-w-[80px] text-center">Players</th>
                <th className="py-3 px-4 w-[50px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent shadow-sm"></div>
                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Teams...</span>
                  </div>
                </td></tr>
              ) : filteredTeams.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-20 text-gray-500 font-medium italic">No teams found.</td></tr>
              ) : (
                filteredTeams.map((team: any) => (
                  <tr
                    key={team._id}
                    onClick={() => navigate(`/teams/${team._id}`)}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-brand-50 overflow-hidden flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm shrink-0">
                          {team.teamLogo ? (
                            <img src={getImageUrl(team.teamLogo) as string} alt={team.teamName} className="w-full h-full object-cover" />
                          ) : team.logo ? (
                            <img src={getImageUrl(team.logo) as string} alt={team.teamName} className="w-full h-full object-cover" />
                          ) : (
                            <Shield size={18} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#0047FF] transition-colors flex items-center gap-1.5">
                            {team.teamName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {(() => {
                        const isExt = team.teamType === "EXTERNAL" || team.isExternal === true;
                        return (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-none border uppercase tracking-wider ${isExt
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60"
                              : "bg-blue-50 text-[#0047FF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60"
                            }`}>
                            {isExt ? "External Team" : "Our Team"}
                          </span>
                        );
                      })()}
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
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-none border border-slate-200 dark:border-slate-700">
                        {team.ageGroup || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {team.fee ? `$${team.fee}` : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teams/${team._id}`);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0047FF] dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60 text-xs font-bold rounded-none border border-blue-200 transition-colors shadow-xs"
                        title="Click to view team details"
                      >
                        {team.players?.length || 0} Players
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-none shadow-sm hover:shadow transition-colors"
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
                        <div className="absolute right-8 top-10 w-40 bg-white dark:bg-slate-800 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0047FF] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teams/${team._id}`);
                              setOpenDropdownId(null);
                            }}
                          >
                            <span>Team Details</span>
                            <span>→</span>
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(team);
                              setOpenDropdownId(null);
                            }}
                          >
                            Edit Team
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                              if (team.teamType === "EXTERNAL" || team.isExternal === true) {
                                setTempPlayersTeam({ id: team._id, name: team.teamName });
                              } else {
                                setAssignTeamId(team._id);
                              }
                            }}
                          >
                            {(team.teamType === "EXTERNAL" || team.isExternal === true) ? "+ Temp Players" : "Assign Players"}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[920px] max-h-[90vh] overflow-y-auto p-6 lg:p-8 rounded-lg shadow-2xl" noBackgroundBlur={true}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-none text-brand-500">
            <Shield size={22} />
          </div>
          <div>
            <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{isEditing ? "Modify Team Profile" : "Create New Team Profile"}</h4>
            <p className="text-xs text-slate-500 font-medium">Configure team details, coaches, schedule, and venue information.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Name *</label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all dark:text-white"
                    placeholder="Under 16 Tigers"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Category *</label>
                  <select
                    value={formData.teamType}
                    onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                    required
                  >
                    <option value="INTERNAL">Our Team (Academy)</option>
                    <option value="EXTERNAL">External Team (Opponent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Age Group *</label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all dark:text-white"
                    placeholder="e.g. U16"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value, teamFee: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all dark:text-white"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value, term: "" })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="">All Years</option>
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Academic Term</label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="">Select Academic Term</option>
                    {terms.map((t: any) => (
                      <option key={t._id || t.id} value={t._id || t.id}>
                        {t.name || t.termName || t.title || "Term"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coaches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assigned Head Coach *</label>
                  <select
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                    required
                  >
                    <option value="">Select Head Coach</option>
                    {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.fullName || c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assistant Coach</label>
                  <select
                    value={formData.assistantCoach}
                    onChange={(e) => setFormData({ ...formData, assistantCoach: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="">Select Assistant Coach</option>
                    {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.fullName || c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isEditing && selectedTeamId && (() => {
                const currentEditingTeam = teams.find((t: any) => t._id === selectedTeamId);
                const teamPlayers = currentEditingTeam?.players || [];
                if (teamPlayers.length === 0) return null;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Captain</label>
                      <select
                        value={formData.captain}
                        onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                        className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                      >
                        <option value="">-- None --</option>
                        {teamPlayers.map((p: any) => {
                          const pName = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || p.email;
                          return (
                            <option key={p._id || p} value={p._id || p}>
                              {pName} {p.jerseyNumber ? `(#${p.jerseyNumber})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Vice Captain</label>
                      <select
                        value={formData.viceCaptain}
                        onChange={(e) => setFormData({ ...formData, viceCaptain: e.target.value })}
                        className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer dark:text-white"
                      >
                        <option value="">-- None --</option>
                        {teamPlayers.map((p: any) => {
                          const pName = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || p.email;
                          return (
                            <option key={p._id || p} value={p._id || p}>
                              {pName} {p.jerseyNumber ? `(#${p.jerseyNumber})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Logo Upload Panel */}
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 p-6 border border-gray-200 dark:border-gray-700">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Team Logo</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center bg-white dark:bg-slate-900 cursor-pointer overflow-hidden hover:border-[#0047FF] transition-colors group relative shadow-xs"
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-white w-8 h-8" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-[#0047FF] transition-colors">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</span>
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
              <span className="text-[10px] text-gray-400 mt-3 text-center">Supports PNG, JPG, WEBP</span>
            </div>
          </div>

          {/* Schedule & Location Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock size={15} className="text-[#0047FF]" />
              {formData.teamType === "EXTERNAL" ? "Venue & Location Details" : "Team Schedule & Venue Details"}
            </h5>

            {formData.teamType !== "EXTERNAL" && (
              <>
                {/* Schedule Type Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schedule Type</label>
                  <div className="flex items-center gap-3">
                    {(["SINGLE_DAY"/*, "WEEKDAYS", "CUSTOM"*/] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleType: st })}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border transition-all ${formData.scheduleType === st
                            ? "bg-[#0047FF] text-white border-[#0047FF] shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-[#0047FF]"
                          }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule Fields */}
                {formData.scheduleType === "SINGLE_DAY" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-800/40 p-4 border border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Day of Week</label>
                      <select
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none dark:text-white"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">End Time</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* WEEKDAYS AND CUSTOM SCHEDULE TYPES COMMENTED OUT
            {formData.scheduleType === "WEEKDAYS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/40 p-4 border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Start Time (Mon - Fri)</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">End Time (Mon - Fri)</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {formData.scheduleType === "CUSTOM" && (
              <div className="space-y-3 bg-gray-50 dark:bg-slate-800/40 p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Custom Schedule Slots</span>
                  <button
                    type="button"
                    onClick={addCustomScheduleSlot}
                    className="text-xs font-bold text-[#0047FF] hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Slot
                  </button>
                </div>
                {customSchedules.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-gray-700">
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => updateCustomScheduleSlot(idx, "dayOfWeek", e.target.value)}
                      className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold dark:text-white"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateCustomScheduleSlot(idx, "startTime", e.target.value)}
                      className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold dark:text-white"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateCustomScheduleSlot(idx, "endTime", e.target.value)}
                      className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold dark:text-white"
                    />
                    {customSchedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomScheduleSlot(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            */}

            {/* Venue & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-brand-500 outline-none transition-all dark:text-white"
                  placeholder="Main Ground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-brand-500 outline-none transition-all dark:text-white"
                  placeholder="Bhopal Sports Complex"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-12 rounded-none text-xs font-bold uppercase tracking-widest">
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Team"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        onConfirm={() => {
          if (deleteModalId) {
            deleteMutation.mutate(deleteModalId);
          }
        }}
        title="Delete Team"
        message="Are you sure you want to permanently delete this team? This action cannot be undone."
      />

      <AssignPlayerToTeamModal
        isOpen={!!assignTeamId}
        onClose={() => setAssignTeamId(null)}
        teamId={assignTeamId}
      />

      {tempPlayersTeam && (
        <AddTemporaryPlayersModal
          isOpen={!!tempPlayersTeam}
          onClose={() => setTempPlayersTeam(null)}
          teamId={tempPlayersTeam.id}
          teamName={tempPlayersTeam.name}
        />
      )}
    </div>
  );
};

export default TeamManagement;
