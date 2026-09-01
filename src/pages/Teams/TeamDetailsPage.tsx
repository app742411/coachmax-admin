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
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import ConfirmDeleteModal from "../../components/ui/modal/ConfirmDeleteModal";
import AssignPlayerToTeamModal from "../../components/management/AssignPlayerToTeamModal";
import AddTemporaryPlayersModal from "../../components/management/AddTemporaryPlayersModal";
import EditTemporaryPlayerModal from "../../components/management/EditTemporaryPlayerModal";
import {
  Shield,
  User,
  Users,
  Calendar,
  Search,
  UserPlus,
  Trash2,
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  LayoutGrid,
  List,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeamDetailsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
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
    teamType: "INTERNAL",
    captain: "",
    viceCaptain: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

  const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Format DOB and calculate Age
  const formatDobAndAge = (dobString?: string | null) => {
    if (!dobString) return { formattedDob: "N/A", age: null };
    try {
      const birthDate = new Date(dobString);
      if (isNaN(birthDate.getTime())) return { formattedDob: "N/A", age: null };

      const formattedDob = birthDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return { formattedDob, age: age >= 0 ? `${age} yrs` : null };
    } catch {
      return { formattedDob: "N/A", age: null };
    }
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
    setFormData({
      teamName: team.teamName || "",
      coach: team.coach?._id || team.coach || "",
      assistantCoach: team.assistantCoach?._id || team.assistantCoach || "",
      ageGroup: team.ageGroup || "",
      fee: team.fee || "",
      teamType: team.teamType || (team.isExternal ? "EXTERNAL" : "INTERNAL"),
      captain: team.captain?._id || team.captain || "",
      viceCaptain: team.viceCaptain?._id || team.viceCaptain || "",
    });
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
    payload.append("coach", formData.coach);
    if (formData.assistantCoach) {
      payload.append("assistantCoach", formData.assistantCoach);
    }
    payload.append("ageGroup", formData.ageGroup);
    if (formData.fee) {
      payload.append("fee", formData.fee);
    }
    if (formData.teamType) {
      payload.append("teamType", formData.teamType);
      payload.append("isExternal", formData.teamType === "EXTERNAL" ? "true" : "false");
    }
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

  const filteredPlayers = players.filter((p: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (p.fullName || `${p.firstName || ""} ${p.lastName || ""}` || p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const phone = (p.phone || "").toLowerCase();
    const jersey = (p.jerseyNumber ? `#${p.jerseyNumber}` : "").toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || jersey.includes(q);
  });

  const allFilteredSelected =
    filteredPlayers.length > 0 && filteredPlayers.every((p: any) => selectedPlayerIds.includes(p._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredPlayers.map((p: any) => p._id));
      setSelectedPlayerIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set(selectedPlayerIds);
      filteredPlayers.forEach((p: any) => newIds.add(p._id));
      setSelectedPlayerIds(Array.from(newIds));
    }
  };

  const toggleSelectPlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

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
                  {team.fee && (
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase bg-emerald-600 text-white tracking-wider">
                      Fee: ${team.fee}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    Created{" "}
                    {new Date(team.createdAt || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </p>

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

        {/* SQUAD ROSTER SECTION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Section Toolbar */}
          <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-[#0047FF] text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Squad Players Roster
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {players.length} players assigned to {team.teamName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Bulk Unassign Button */}
              {selectedPlayerIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-none transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer animate-in fade-in"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Unassign Selected ({selectedPlayerIds.length})</span>
                </button>
              )}

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search player name, email, jersey..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "table"
                      ? "bg-white dark:bg-slate-700 text-[#0047FF] shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-[#0047FF] shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  if (isExternalTeam) {
                    setIsAddTempModalOpen(true);
                  } else {
                    setIsAssignModalOpen(true);
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold bg-[#0047FF] hover:bg-blue-700 text-white rounded-none transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isExternalTeam ? "+ Add Temporary Players" : "+ Assign Players"}</span>
              </button>
            </div>
          </div>

          {/* Roster Display Content */}
          {players.length === 0 ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">No Players in Squad</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {isExternalTeam
                    ? "This team doesn't have any players assigned yet. Add temporary away players for this external team."
                    : "This team doesn't have any players assigned yet. Assign available players from your academy."}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isExternalTeam) {
                    setIsAddTempModalOpen(true);
                  } else {
                    setIsAssignModalOpen(true);
                  }
                }}
                className="mt-2 px-5 py-2.5 text-xs font-bold bg-[#0047FF] hover:bg-blue-700 text-white rounded-none transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isExternalTeam ? "+ Add Temporary Players Now" : "Assign Players Now"}</span>
              </button>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              No players found matching "{searchQuery}".
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 w-[45px] text-center">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-[#0047FF] rounded-none border-slate-300 focus:ring-[#0047FF] cursor-pointer"
                        title="Select All Players"
                      />
                    </th>
                    <th className="py-3 px-3 w-[40px] text-center text-slate-400">#</th>
                    <th className="py-3 px-4 min-w-[220px]">Player</th>
                    <th className="py-3 px-4 min-w-[180px]">Contact Info</th>
                    <th className="py-3 px-4 min-w-[120px]">DOB / Age</th>
                    <th className="py-3 px-4 min-w-[180px] text-center">Season Stats</th>
                    <th className="py-3 px-4 w-[70px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player: any, idx: number) => {
                    const isSelected = selectedPlayerIds.includes(player._id);
                    const playerName =
                      player.fullName ||
                      `${player.firstName || ""} ${player.lastName || ""}`.trim() ||
                      player.name ||
                      (player.email ? player.email.split("@")[0] : `Player #${idx + 1}`);

                    const avatarSrc = player.profileImage
                      ? getImageUrl(player.profileImage)
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=0A1930&color=fff`;

                    const { formattedDob, age } = formatDobAndAge(player.dob);
                    const stats = player.statistics || {};

                    return (
                      <tr
                        key={player._id || idx}
                        className={`border-b border-slate-100 last:border-0 dark:border-slate-800/40 transition-colors ${isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40"
                            : "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                          }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectPlayer(player._id)}
                            className="w-4 h-4 text-[#0047FF] rounded-none border-slate-300 focus:ring-[#0047FF] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={avatarSrc!}
                                alt={playerName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=0A1930&color=fff`;
                                }}
                              />
                              {player.jerseyNumber && (
                                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#0047FF] text-white text-[9px] font-black rounded-none border border-white">
                                  #{player.jerseyNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                                  {playerName}
                                </span>
                                {player._id && player._id === (team.captain?._id || team.captain) && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-amber-500 text-white rounded-none shadow-xs" title="Team Captain">
                                    Captain
                                  </span>
                                )}
                                {player._id && player._id === (team.viceCaptain?._id || team.viceCaptain) && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-blue-600 text-white rounded-none shadow-xs" title="Vice Captain">
                                    Vice Captain
                                  </span>
                                )}
                                {player.gender && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                                    {player.gender}
                                  </span>
                                )}
                              </div>

                              {/* Star Rating under Player Name */}
                              <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${(player.rating || 0) > i
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-200 fill-slate-200 dark:text-slate-700 dark:fill-slate-700"
                                      }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {player.email ? (
                            <span className="block truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                              {player.email}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No email</span>
                          )}
                          {player.phone && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              {player.phone}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                            {formattedDob}
                          </span>
                          {age && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {age}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                            <span title="Appearances" className="text-slate-700 dark:text-slate-300">
                              {stats.appearances || 0} Apps
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span title="Goals Scored" className="text-emerald-600 dark:text-emerald-400">
                              ⚽ {stats.goals || 0}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span title="Assists" className="text-blue-600 dark:text-blue-400">
                              👟 {stats.assists || 0}
                            </span>
                            {(stats.yellowCards > 0 || stats.redCards > 0) && (
                              <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-amber-500 font-bold" title="Yellow/Red Cards">
                                  🟨{stats.yellowCards || 0} 🟥{stats.redCards || 0}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isExternalTeam && (
                              <button
                                type="button"
                                onClick={() => setEditTempPlayer(player)}
                                className="p-1.5 text-slate-400 hover:text-[#0047FF] hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors rounded-none cursor-pointer"
                                title="Edit temporary player"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (isExternalTeam) {
                                  setTempPlayerToDelete(player);
                                } else {
                                  setPlayerToRemove(player);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors rounded-none cursor-pointer"
                              title={isExternalTeam ? "Delete temporary player" : "Unassign player from team"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlayers.map((player: any, idx: number) => {
                const isSelected = selectedPlayerIds.includes(player._id);
                const playerName =
                  player.fullName ||
                  `${player.firstName || ""} ${player.lastName || ""}`.trim() ||
                  player.name ||
                  (player.email ? player.email.split("@")[0] : `Player #${idx + 1}`);

                const avatarSrc = player.profileImage
                  ? getImageUrl(player.profileImage)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=0A1930&color=fff`;

                const { formattedDob, age } = formatDobAndAge(player.dob);
                const stats = player.statistics || {};

                return (
                  <div
                    key={player._id || idx}
                    className={`p-4 border transition-all flex flex-col justify-between gap-3 relative group ${isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0047FF] shadow-xs"
                        : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPlayer(player._id)}
                          className="w-4 h-4 text-[#0047FF] rounded-none border-slate-300 focus:ring-[#0047FF] cursor-pointer shrink-0"
                        />
                        <div className="relative shrink-0">
                          <img
                            src={avatarSrc!}
                            alt={playerName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=0A1930&color=fff`;
                            }}
                          />
                          {player.jerseyNumber && (
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#0047FF] text-white text-[9px] font-black rounded-none border border-white">
                              #{player.jerseyNumber}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {playerName}
                            </h4>
                            {player._id && player._id === (team.captain?._id || team.captain) && (
                              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-amber-500 text-white rounded-none shadow-xs" title="Team Captain">
                                Captain
                              </span>
                            )}
                            {player._id && player._id === (team.viceCaptain?._id || team.viceCaptain) && (
                              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-blue-600 text-white rounded-none shadow-xs" title="Vice Captain">
                                Vice Captain
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {player.email || player.phone || "No contact"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isExternalTeam && (
                          <button
                            type="button"
                            onClick={() => setEditTempPlayer(player)}
                            className="text-slate-400 hover:text-[#0047FF] p-1 cursor-pointer"
                            title="Edit temporary player"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (isExternalTeam) {
                              setTempPlayerToDelete(player);
                            } else {
                              setPlayerToRemove(player);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title={isExternalTeam ? "Delete temporary player" : "Unassign player"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-3 gap-1 py-2 px-2.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Goals</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {stats.goals || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Assists</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {stats.assists || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Apps</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {stats.appearances || 0}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {formattedDob} {age && `(${age})`}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-2.5 h-2.5 ${(player.rating || 0) > i ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"
                              }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
        className="max-w-[700px] p-6 rounded-none shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-none text-[#0047FF]">
            <Shield size={22} />
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Edit Team Profile
            </h4>
            <p className="text-xs text-slate-500 font-medium">Update team credentials, age group, and coaches.</p>
          </div>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Team Category
              </label>
              <select
                value={formData.teamType}
                onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none appearance-none cursor-pointer"
                required
              >
                <option value="INTERNAL">Our Team (Academy)</option>
                <option value="EXTERNAL">External Team (Opponent)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Age Group
                </label>
                <input
                  type="text"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
                  placeholder="e.g. U10, U12"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Team Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
                  placeholder="e.g. 150"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Head Coach
              </label>
              <select
                value={formData.coach}
                onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
              >
                <option value="">-- Select Head Coach --</option>
                {coaches.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName || c.name} ({c.email || "No email"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Assistant Coach
              </label>
              <select
                value={formData.assistantCoach}
                onChange={(e) => setFormData({ ...formData, assistantCoach: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
              >
                <option value="">-- Select Assistant Coach (Optional) --</option>
                {coaches.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName || c.name} ({c.email || "No email"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Team Captain
              </label>
              <select
                value={formData.captain}
                onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
              >
                <option value="">-- Select Captain (Optional) --</option>
                {players.map((p: any) => {
                  const pName = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || p.email;
                  return (
                    <option key={p._id} value={p._id}>
                      {pName} {p.jerseyNumber ? `(#${p.jerseyNumber})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Vice Captain
              </label>
              <select
                value={formData.viceCaptain}
                onChange={(e) => setFormData({ ...formData, viceCaptain: e.target.value })}
                className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs font-bold focus:border-[#0047FF] outline-none"
              >
                <option value="">-- Select Vice Captain (Optional) --</option>
                {players.map((p: any) => {
                  const pName = p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || p.email;
                  return (
                    <option key={p._id} value={p._id}>
                      {pName} {p.jerseyNumber ? `(#${p.jerseyNumber})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Team Logo
            </label>
            <div className="flex items-center gap-4">
              {previewImage && (
                <img src={previewImage} alt="Preview" className="w-12 h-12 rounded-none object-cover border" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0047FF] hover:file:bg-blue-100 cursor-pointer"
              />
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
