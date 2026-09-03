import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getTeamById, 
  deleteTeam, 
  updateTeam, 
  getAllCoaches, 
  unassignPlayersFromTeam,
  getTemporaryPlayersForTeam,
  deleteTemporaryPlayerFromTeam 
} from "../../api/adminApi";
import { getAllTerms } from "../../api/terms";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import ConfirmDeleteModal from "../../components/ui/modal/ConfirmDeleteModal";
import AssignPlayerToTeamModal from "../../components/management/AssignPlayerToTeamModal";
import AddTemporaryPlayersModal from "../../components/management/AddTemporaryPlayersModal";
import EditTemporaryPlayerModal from "../../components/management/EditTemporaryPlayerModal";
import TeamFullTable from "../../components/teams/TeamFullTable";
import {
  Shield,
  User,
  Calendar,
  UserPlus,
  Trash2,
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  AlertCircle,
  Clock,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeamDetailsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddTempModalOpen, setIsAddTempModalOpen] = useState(false);
  const [editTempPlayer, setEditTempPlayer] = useState<any | null>(null);
  const [tempPlayerToDelete, setTempPlayerToDelete] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<any | null>(null);

  // Edit Team Form state
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

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

  const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Fetch Team Details
  const { data: teamData, isLoading, error } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId!),
    enabled: !!teamId,
  });

  const team = teamData?.data || teamData || null;

  // Fetch Coaches for edit modal
  const { data: coachesData } = useQuery({
    queryKey: ["coaches"],
    queryFn: () => getAllCoaches(),
    enabled: isEditModalOpen,
  });

  const coaches = Array.isArray(coachesData) ? coachesData : (coachesData?.data || []);

  // Fetch Terms for edit modal
  const { data: termsData } = useQuery({
    queryKey: ["terms", formData.year],
    queryFn: () => getAllTerms(formData.year ? Number(formData.year) : undefined),
    enabled: isEditModalOpen,
  });
  const terms = Array.isArray(termsData) ? termsData : (termsData?.data || termsData?.terms || []);

  // Update Team Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTeam(id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(res?.message || "Team updated successfully!");
      setIsEditModalOpen(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update team"),
  });

  // Delete Team Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(res?.message || "Team deleted successfully!");
      navigate("/teams");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete team"),
  });

  // Unassign / Remove Players Mutation (POST /api/admin/teams/:teamId/unassign)
  const removePlayersMutation = useMutation({
    mutationFn: async (playerIds: string | string[]) => {
      if (!teamId) return;
      return await unassignPlayersFromTeam(teamId, playerIds);
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "Player(s) unassigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["availablePlayersForTeam"] });
      queryClient.invalidateQueries({ queryKey: ["availablePlayers"] });
      setPlayerToRemove(null);
      setIsBulkDeleteModalOpen(false);
      setSelectedPlayerIds([]);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to unassign player(s)");
    },
  });

  const handleOpenEdit = () => {
    if (!team) return;
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
    setIsEditModalOpen(true);
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;
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
    updateMutation.mutate({ id: teamId, data: payload });
  };

  // Delete Temporary Player Mutation
  const deleteTempPlayerMutation = useMutation({
    mutationFn: (tempPlayerId: string) => deleteTemporaryPlayerFromTeam(teamId!, tempPlayerId),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Temporary player deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["temporaryPlayers", teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setTempPlayerToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete temporary player");
    },
  });

  const isExternalTeam = team?.teamType === "EXTERNAL" || team?.isExternal === true;

  // Fetch Temporary Players if external team
  const { data: tempPlayersData } = useQuery({
    queryKey: ["temporaryPlayers", teamId],
    queryFn: () => getTemporaryPlayersForTeam(teamId!),
    enabled: !!teamId && isExternalTeam,
  });

  const rawTempArray = Array.isArray(tempPlayersData)
    ? tempPlayersData
    : (tempPlayersData?.data || tempPlayersData?.players || tempPlayersData?.temporaryPlayers || []);

  const players: any[] = isExternalTeam
    ? (rawTempArray.length > 0 ? rawTempArray : (team?.temporaryPlayers || team?.players || []))
    : (team?.players || []);



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-3 border-[#0047FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Loading Team Profile...
        </p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Team Details" />
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Team Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The team you are looking for does not exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/teams")} size="sm">
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const teamLogoSrc = team.teamLogo ? getImageUrl(team.teamLogo) : (team.logo ? getImageUrl(team.logo) : null);
  const headCoach = typeof team.coach === "object" ? team.coach : null;
  const asstCoach = typeof team.assistantCoach === "object" ? team.assistantCoach : null;

  return (
    <>
      <PageMeta
        title={`CoachMax | ${team.teamName || "Team Details"}`}
        description={`Team management, roster and coaches for ${team.teamName}`}
      />

      <div className="space-y-6">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/teams")}
              className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0047FF] hover:border-[#0047FF] transition-colors rounded-none shadow-xs cursor-pointer"
              title="Back to Teams"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to="/teams" className="hover:text-slate-600 dark:hover:text-slate-200">
                  Teams Management
                </Link>
                <span>/</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{team.teamName}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {team.teamName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                if (isExternalTeam) {
                  setIsAddTempModalOpen(true);
                } else {
                  setIsAssignModalOpen(true);
                }
              }}
              className="px-4 py-2 text-xs font-bold bg-[#0047FF] hover:bg-blue-700 text-white rounded-none transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isExternalTeam ? "+ Add Temporary Players" : "Assign Players"}</span>
            </button>
            <button
              onClick={handleOpenEdit}
              className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-none shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Team</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* HERO BANNER CARD */}
        <div className="bg-[#0A1930] text-white p-6 lg:p-8 rounded-none border-l-4 border-[#0047FF] shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-5 pointer-events-none">
            <Shield className="w-80 h-80 text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Team Crest & Header Details */}
            <div className="lg:col-span-6 flex items-center gap-5">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-none bg-white/10 flex items-center justify-center text-white overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
                {teamLogoSrc ? (
                  <img
                    src={teamLogoSrc}
                    alt={team.teamName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "";
                    }}
                  />
                ) : (
                  <Shield className="w-12 h-12 text-[#0047FF]" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl lg:text-2xl font-black text-white leading-tight tracking-tight">
                    {team.teamName}
                  </h2>
                  {(() => {
                    const isExt = team.teamType === "EXTERNAL" || team.isExternal === true;
                    return (
                      <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        isExt ? "bg-amber-600 text-white" : "bg-blue-600 text-white"
                      }`}>
                        {isExt ? "External Team" : "Our Team"}
                      </span>
                    );
                  })()}
                  {team.ageGroup && (
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase bg-[#0047FF] text-white tracking-wider">
                      {team.ageGroup}
                    </span>
                  )}
                  {(team.fee || team.teamFee) && (
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase bg-emerald-600 text-white tracking-wider">
                      Fee: ${team.fee || team.teamFee}
                    </span>
                  )}
                  {team.term && (
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase bg-purple-600 text-white tracking-wider">
                      Term: {typeof team.term === 'object' ? (team.term.name || team.term.termName) : "Assigned"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 flex-wrap text-xs text-gray-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      Created{" "}
                      {new Date(team.createdAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>

                  {(team.venue || team.location) && (
                    <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{[team.venue, team.location].filter(Boolean).join(" • ")}</span>
                    </span>
                  )}

                  {team.scheduleType && (
                    <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {team.scheduleType === "SINGLE_DAY" ? `${team.dayOfWeek || ""} ${team.startTime || ""}-${team.endTime || ""}`.trim() :
                         team.scheduleType === "WEEKDAYS" ? `Mon-Fri ${team.startTime || ""}-${team.endTime || ""}`.trim() :
                         "Custom Schedule"}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 border border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Squad
                  </span>
                  <span className="text-xs font-semibold text-gray-300">
                    ID: <code className="text-gray-400 text-[11px]">{team._id.substring(0, 10)}...</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Squad Stats Counters */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-none backdrop-blur-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Players
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {players.length}
                </span>
                <span className="text-[10px] text-gray-400">Total Enrolled</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-none backdrop-blur-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Goals
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  0
                </span>
                <span className="text-[10px] text-gray-400">Team Scored</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-none backdrop-blur-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Assists
                </span>
                <span className="text-2xl font-black text-blue-400 mt-1 block">
                  0
                </span>
                <span className="text-[10px] text-gray-400">Team Assists</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-none backdrop-blur-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Matches
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  0
                </span>
                <span className="text-[10px] text-gray-400">Appearances</span>
              </div>
            </div>
          </div>
        </div>

        {/* COACHING STAFF CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Head Coach Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {headCoach?.profileImage ? (
                <img
                  src={getImageUrl(headCoach.profileImage)!}
                  alt={headCoach.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(headCoach.name || "Coach")}&background=0A1930&color=fff`;
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#0A1930] text-white flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-[#0047FF]" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#0047FF] uppercase tracking-wider block">
                  Head Coach
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {(headCoach?.name || headCoach?.fullName || team.coach || "Unassigned").trim()}
                </h4>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {headCoach?.email && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      {headCoach.email}
                    </span>
                  )}
                  {(headCoach?.mobile || headCoach?.phone) && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      {headCoach.mobile || headCoach.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-blue-50 text-[#0047FF] dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shrink-0">
              Lead Coach
            </span>
          </div>

          {/* Assistant Coach Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {asstCoach?.profileImage ? (
                <img
                  src={getImageUrl(asstCoach.profileImage)!}
                  alt={asstCoach.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(asstCoach.name || "Assistant")}&background=0A1930&color=fff`;
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-slate-400" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assistant Coach
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {(asstCoach?.name || asstCoach?.fullName || "None Assigned").trim()}
                </h4>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {asstCoach?.email ? (
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      {asstCoach.email}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No email assigned</span>
                  )}
                  {(asstCoach?.mobile || asstCoach?.phone) && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      {asstCoach.mobile || asstCoach.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
              Assistant
            </span>
          </div>
        </div>

        {/* TEAM ATTENDANCE MATRIX & FULL TABLE */}
        <TeamFullTable teamId={teamId!} teamName={team.teamName} />
      </div>

      {/* ASSIGN PLAYERS MODAL */}
      <AssignPlayerToTeamModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        teamId={teamId || null}
      />

      {/* EDIT TEAM MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-w-[920px] max-h-[90vh] overflow-y-auto p-6 lg:p-8 rounded-none shadow-2xl"
        noBackgroundBlur={true}
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-none text-[#0047FF]">
            <Shield size={22} />
          </div>
          <div>
            <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Edit Team Profile
            </h4>
            <p className="text-xs text-slate-500 font-medium">Update team credentials, academic term, schedule, and venue details.</p>
          </div>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-6">
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
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all dark:text-white"
                    placeholder="Under 16 Tigers"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Category *</label>
                  <select
                    value={formData.teamType}
                    onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
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
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all dark:text-white"
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
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all dark:text-white"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value, term: "" })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
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
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
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
              
              {/* Coaches & Leadership */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assigned Head Coach *</label>
                  <select
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="">Select Head Coach</option>
                    {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.fullName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Assistant Coach</label>
                  <select
                    value={formData.assistantCoach}
                    onChange={(e) => setFormData({ ...formData, assistantCoach: e.target.value })}
                    className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="">Select Assistant Coach</option>
                    {coaches.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.fullName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {players.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Team Captain</label>
                    <select
                      value={formData.captain}
                      onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                      className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
                    >
                      <option value="">-- None --</option>
                      {players.map((p: any) => {
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
                      className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all appearance-none cursor-pointer dark:text-white"
                    >
                      <option value="">-- None --</option>
                      {players.map((p: any) => {
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
              )}
            </div>

            {/* Logo Upload Panel */}
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 p-6 border border-gray-200 dark:border-gray-700">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Team Logo</label>
              <div 
                onClick={() => {
                  const input = document.getElementById("team-details-logo-input");
                  if (input) input.click();
                }}
                className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center bg-white dark:bg-slate-900 cursor-pointer overflow-hidden hover:border-[#0047FF] transition-colors group relative shadow-xs"
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="text-white w-7 h-7" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-[#0047FF] transition-colors">
                    <Shield className="w-8 h-8 mb-2 text-[#0047FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</span>
                  </div>
                )}
              </div>
              <input
                id="team-details-logo-input"
                type="file"
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
              Schedule & Location Details
            </h5>

            {/* Schedule Type Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schedule Type</label>
              <div className="flex items-center gap-3">
                {(["SINGLE_DAY"/*, "WEEKDAYS", "CUSTOM"*/] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({ ...formData, scheduleType: st })}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border transition-all ${
                      formData.scheduleType === st
                        ? "bg-[#0047FF] text-white border-[#0047FF] shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-[#0047FF]"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
                {/* 
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
                >
                  WEEKDAYS
                </button>
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
                >
                  CUSTOM
                </button>
                */}
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
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all dark:text-white"
                  placeholder="Main Ground"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold focus:bg-white focus:border-[#0047FF] outline-none transition-all dark:text-white"
                  placeholder="Bhopal Sports Complex"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE TEAM MODAL */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (teamId) deleteMutation.mutate(teamId);
        }}
        title="Delete Team"
        message={`Are you sure you want to permanently delete this team? This action cannot be undone.`}
      />

      {/* CONFIRM REMOVE SINGLE PLAYER MODAL */}
      <ConfirmDeleteModal
        isOpen={!!playerToRemove}
        onClose={() => setPlayerToRemove(null)}
        onConfirm={() => {
          if (playerToRemove) removePlayersMutation.mutate([playerToRemove._id]);
        }}
        title="Unassign Player from Team"
        message={`Are you sure you want to unassign ${playerToRemove?.fullName || playerToRemove?.name || "this player"
          } from ${team.teamName}?`}
      />

      {/* CONFIRM REMOVE MULTIPLE / BULK PLAYERS MODAL */}
      <ConfirmDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedPlayerIds.length > 0) {
            removePlayersMutation.mutate(selectedPlayerIds);
          }
        }}
        title="Unassign Selected Players"
        message={`Are you sure you want to unassign ${selectedPlayerIds.length} selected player(s) from ${team.teamName}?`}
      />

      {/* ADD TEMPORARY AWAY PLAYERS MODAL (EXTERNAL TEAM) */}
      {teamId && (
        <AddTemporaryPlayersModal
          isOpen={isAddTempModalOpen}
          onClose={() => setIsAddTempModalOpen(false)}
          teamId={teamId}
          teamName={team.teamName}
        />
      )}

      {/* EDIT TEMPORARY AWAY PLAYER MODAL (EXTERNAL TEAM) */}
      {teamId && (
        <EditTemporaryPlayerModal
          isOpen={!!editTempPlayer}
          onClose={() => setEditTempPlayer(null)}
          teamId={teamId}
          player={editTempPlayer}
        />
      )}

      {/* CONFIRM DELETE TEMPORARY PLAYER MODAL */}
      <ConfirmDeleteModal
        isOpen={!!tempPlayerToDelete}
        onClose={() => setTempPlayerToDelete(null)}
        onConfirm={() => {
          const id = tempPlayerToDelete?._id || tempPlayerToDelete?.id;
          if (id) deleteTempPlayerMutation.mutate(id);
        }}
        loading={deleteTempPlayerMutation.isPending}
        title="Delete Temporary Player"
        message={`Are you sure you want to permanently delete ${
          tempPlayerToDelete?.name || tempPlayerToDelete?.fullName || "this temporary player"
        } from ${team.teamName}?`}
      />
    </>
  );
}
