import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAdminPlayerDetails, useCoachNotes } from "../../hooks/usePlayers";
import EditPlayerStatsModal from "../../components/players/EditPlayerStatsModal";
import { useAppDispatch } from "../../store";
import { setActiveRoomId } from "../../store/slices/chatSlice";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  ShieldAlert, 
  Award, 
  Activity, 
  Heart, 
  Clock, 
  MessageSquare
} from "lucide-react";

const getBadgeStyles = (noteType: string) => {
  switch (noteType) {
    case "POSITIVE_PERFORMANCE":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "DEVELOPMENT_AREA":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "ARRIVED_LATE":
      return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    case "BEHAVIOUR_CONCERN":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800";
    case "INJURY":
      return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    case "MEDICAL_INCIDENT":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800";
    case "PARENT_DISCUSSION":
      return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800";
    default:
      return "bg-yellow-100 text-yellow-850 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-850";
  }
};

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: detailsRes, isLoading: loadingDetails } = useAdminPlayerDetails(playerId);
  const { data: notesRes, isLoading: loadingNotes } = useCoachNotes(playerId || "");
  const [chatting, setChatting] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Extract variables according to backend JSON envelope structure
  const responseData = detailsRes?.data;
  const player = responseData?.player;
  const parent = responseData?.parent || player?.parentId;
  const overallAttendance = responseData?.overallAttendance;
  const notes = notesRes?.data || [];

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-8 text-center bg-white border border-gray-100 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player Not Found</h3>
        <p className="text-gray-400 text-sm mt-2">The player record could not be loaded or does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-brand-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const avatar = player.profileImage ? `${baseUrl}/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
  const dob = player.dob ? new Date(player.dob) : null;
  const age = dob ? new Date().getFullYear() - dob.getFullYear() : null;
  const dobString = dob ? dob.toLocaleDateString() : null;

  const handleChatWithParent = async () => {
    const parentId = parent?._id || player.parentId?._id || player.parentId;
    if (!parentId || typeof parentId !== "string") {
      toast.error("Parent ID not found for this player.");
      return;
    }

    try {
      setChatting(true);
      const res = await apiClient.post("/api/coach/chat/direct", { parentId });
      if (res.data && res.data.success && res.data.data) {
        const roomId = res.data.data._id;
        dispatch(setActiveRoomId(roomId));

        const userStr = localStorage.getItem("user");
        let isCoach = false;
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            isCoach = parsed?.role === "COACH";
          } catch (e) {
            console.error(e);
          }
        }
        navigate(isCoach ? "/messages" : "/communication");
      } else {
        toast.error(res.data?.message || "Failed to start conversation.");
      }
    } catch (error: any) {
      console.error("Chat redirection error:", error);
      toast.error(error?.response?.data?.message || "Failed to start direct conversation.");
    } finally {
      setChatting(false);
    }
  };

  const statistics = player.statistics || {};
  const statCards = [
    { label: "Appearances", value: statistics.appearances || 0, icon: Activity, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20" },
    { label: "Goals", value: statistics.goals || 0, icon: Award, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" },
    { label: "Assists", value: statistics.assists || 0, icon: Heart, color: "bg-pink-50 text-pink-600 dark:bg-pink-950/20" },
    { label: "Clean Sheets", value: statistics.cleanSheets || 0, icon: ShieldAlert, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20" },
    { label: "Yellow Cards", value: statistics.yellowCards || 0, icon: Clock, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20" },
    { label: "Red Cards", value: statistics.redCards || 0, icon: ShieldAlert, color: "bg-red-50 text-red-600 dark:bg-red-950/20" },
    { label: "Minutes Played", value: statistics.minutesPlayed || 0, icon: Clock, color: "bg-slate-50 text-slate-650 dark:bg-slate-950/20" },
  ];

  const addressParts = [
    parent?.address,
    parent?.city,
    parent?.state,
    parent?.postcode,
    parent?.country
  ].filter(Boolean);
  const fullAddress = addressParts.join(", ");

  const activeStatus = player.playerStatus || player.status;
  const paymentStatus = player.paymentStatus;

  return (
    <>
      <PageMeta
        title={`Player Profile: ${player.fullName} | CoachMax`}
        description={`Full details profile and statistics of player ${player.fullName}`}
      />

      <div className="space-y-6">
        {/* Back navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>BACK TO LIST</span>
          </button>
          {parent && (
            <div className="flex gap-3">
              <button
                onClick={handleChatWithParent}
                disabled={chatting}
                className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0047FF] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-theme-xs disabled:opacity-50"
              >
                <MessageSquare size={16} />
                {chatting ? "Redirecting..." : "Chat with Parent"}
              </button>
            </div>
          )}
        </div>

        {/* Profile Card Header */}
        <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={avatar}
            alt={player.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#0047FF] shadow-md shrink-0 animate-fade-in"
          />
          <div className="text-center md:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {player.fullName}
              </h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {activeStatus && (
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeStatus === "ACTIVE" || activeStatus === "APPROVED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                  }`}>
                    {activeStatus}
                  </span>
                )}
                {paymentStatus && (
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    paymentStatus === "PAID"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400"
                  }`}>
                    {paymentStatus.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
            
            {player.rating !== undefined && player.rating !== null && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2">
                <span className="text-slate-400 text-xs font-semibold">Rating:</span>
                <span className="text-amber-500 font-bold text-xs tracking-wide">
                  {"★".repeat(player.rating)}
                  {"☆".repeat(5 - player.rating)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {player.jerseyNumber && <span>Jersey #{player.jerseyNumber}</span>}
              {player.prefferedFoot && <span>Preferred Foot: {player.prefferedFoot}</span>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-slate-50 dark:border-slate-800/40 pt-4 text-left">
              {player.category?.name && (
                <div>
                  <span className="text-slate-450 text-[10px] block font-bold uppercase tracking-wider">Category</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{player.category.name}</span>
                </div>
              )}
              {player.programs && player.programs.length > 0 && (
                <div>
                  <span className="text-slate-450 text-[10px] block font-bold uppercase tracking-wider">Program</span>
                  <span className="font-bold text-[#0047FF] dark:text-blue-400 text-xs">
                    {player.programs.map((p: any) => p.name).join(", ")}
                  </span>
                </div>
              )}
              {player.term?.name && (
                <div>
                  <span className="text-slate-450 text-[10px] block font-bold uppercase tracking-wider">Term Assigned</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{player.term.name}</span>
                </div>
              )}
              {player.joinedDate && (
                <div>
                  <span className="text-slate-450 text-[10px] block font-bold uppercase tracking-wider">Joined Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {new Date(player.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Alerts (If Any) */}
        {player.isMedicalCondition && (
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-5 flex items-start gap-3.5 shadow-sm animate-pulse">
            <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-850 dark:text-red-400">Medical Warning & Allergies</h4>
              <p className="text-xs text-red-900 dark:text-red-300 font-semibold mt-1">
                {player.medicalConditionDetails || player.medicalConditions || "Details not specified by parent."}
              </p>
            </div>
          </div>
        )}

        {/* Core statistics grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-slate-800/40">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Performance Statistics
            </h3>
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="text-[10px] font-bold text-[#0047FF] hover:underline uppercase"
            >
              Edit Stats
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-4 flex flex-col justify-between shadow-theme-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{card.label}</span>
                    <div className={`p-1.5 rounded-none ${card.color}`}>
                      <Icon size={14} />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                    {card.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <EditPlayerStatsModal
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          playerId={player._id}
          playerName={player.fullName}
          initialStats={statistics}
        />

        {/* Double Column Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Personal and Contact Details */}
          <div className="space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800/40">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
                {player.firstName && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">First Name</span>
                    <span className="text-slate-800 dark:text-slate-200">{player.firstName}</span>
                  </div>
                )}
                {player.lastName && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Last Name</span>
                    <span className="text-slate-800 dark:text-slate-200">{player.lastName}</span>
                  </div>
                )}
                {dobString && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {dobString} {age !== null && <span className="text-slate-400 font-normal">({age} Years)</span>}
                    </span>
                  </div>
                )}
                {player.gender && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Gender</span>
                    <span className="text-slate-850 dark:text-slate-200 uppercase">{player.gender}</span>
                  </div>
                )}
                {player.school && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">School</span>
                    <span className="text-slate-800 dark:text-slate-200">{player.school}</span>
                  </div>
                )}
                {player.createdAt && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Registration Date</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {new Date(player.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Parent & Contact Information */}
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800/40">
                Parent & Contact Details
              </h3>
              {parent ? (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
                  {parent.fullName && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Parent Name</span>
                      <span className="text-slate-800 dark:text-slate-200">{parent.fullName}</span>
                    </div>
                  )}
                  {parent.relationship && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Relationship</span>
                      <span className="text-slate-800 dark:text-slate-200">{parent.relationship}</span>
                    </div>
                  )}
                  {parent.email && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block mb-0.5">Email Address</span>
                      <a 
                        href={`mailto:${parent.email}`}
                        className="text-[#0047FF] hover:underline block truncate"
                      >
                        {parent.email}
                      </a>
                    </div>
                  )}
                  {parent.phone && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Phone Number</span>
                      <span className="text-slate-800 dark:text-slate-200">{parent.phone}</span>
                    </div>
                  )}
                  {parent.emergencyContact && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Emergency Contact</span>
                      <span className="text-slate-805 dark:text-slate-200">{parent.emergencyContact}</span>
                    </div>
                  )}
                  {fullAddress && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block mb-0.5">Billing Address</span>
                      <span className="text-slate-800 dark:text-slate-200 block leading-normal">
                        {fullAddress}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-450 italic">No parent profile linked to this player.</p>
              )}
            </div>

            {/* Assigned Classes */}
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800/40">
                Assigned Classes
              </h3>
              {player.assignedClasses && player.assignedClasses.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                  {player.assignedClasses.map((cls: any, idx: number) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cls.name || cls.className || "Class"}</span>
                        {(cls.dayOfWeek || cls.startTime || cls.location) && (
                          <span className="text-slate-400 block text-[10px] mt-0.5">
                            {[cls.dayOfWeek, cls.startTime, cls.location].filter(Boolean).join(" at ")}
                          </span>
                        )}
                      </div>
                      <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase rounded-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-450 italic">No active classes assigned to this player.</p>
              )}
            </div>
          </div>

          {/* Right Column: Skill Ratings and Notes */}
          <div className="space-y-6">
            
            {/* Attendance overview metrics */}
            {overallAttendance && (
              <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800/40">
                  Attendance Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-450">Attendance Rate</span>
                      <span className="text-brand-500">{overallAttendance.percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2">
                      <div 
                        className="bg-brand-500 h-2 transition-all duration-500" 
                        style={{ width: `${overallAttendance.percentage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2 text-xs font-semibold">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Total Sessions</span>
                      <span className="text-base font-bold text-slate-800 dark:text-white mt-1 block">{overallAttendance.totalSessions || 0}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Attended</span>
                      <span className="text-base font-bold text-slate-800 dark:text-white mt-1 block">{overallAttendance.attendedCount || 0}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Present</span>
                      <span className="text-base font-bold text-emerald-600 mt-1 block">{overallAttendance.presentCount || 0}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Absent</span>
                      <span className="text-base font-bold text-rose-500 mt-1 block">{overallAttendance.absentCount || 0}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Late Arrival</span>
                      <span className="text-base font-bold text-amber-500 mt-1 block">{overallAttendance.lateCount || 0}</span>
                    </div>
                    {overallAttendance.trialCount > 0 && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/30">
                        <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wide">Trial Count</span>
                        <span className="text-base font-bold text-indigo-500 mt-1 block">{overallAttendance.trialCount || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Coach Notes performance logs */}
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800/40">
                Coach Performance Notes
              </h3>
              {loadingNotes ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-brand-500 border-r-transparent" />
                </div>
              ) : notes.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs italic">
                  No performance notes logged for this player yet.
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                  {notes.map((note: any) => (
                    <div
                      key={note._id}
                      className="relative p-4 bg-[#FEF9C3] dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 shadow-sm rounded-none space-y-2 pt-6"
                    >
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-500/80 rounded-full shadow-inner" />

                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={`px-2 py-0.5 border uppercase font-bold text-[8px] rounded-none ${getBadgeStyles(note.noteType)}`}>
                          {note.noteType?.replace("_", " ")}
                        </span>
                        <span className="text-slate-500 dark:text-yellow-400/60">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-850 dark:text-slate-200 font-semibold leading-relaxed">
                        {note.description}
                      </p>
                      {note.createdBy && (
                        <div className="text-[9px] text-slate-500 dark:text-yellow-400/50 font-medium text-right italic">
                          — Coach {note.createdBy.name || note.createdBy.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
