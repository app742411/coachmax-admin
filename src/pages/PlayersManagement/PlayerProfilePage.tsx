import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAdminPlayerDetails, useUpdatePlayerPaymentStatus } from "../../hooks/usePlayers";
import EditPlayerStatsModal from "../../components/players/EditPlayerStatsModal";
import EditPlayerModal from "../../components/players/EditPlayerModal";
import PlayerPaymentHistoryModal from "../../components/players/PlayerPaymentHistoryModal";
import PlayerHistoryDashboard from "../../components/players/PlayerHistoryDashboard";
import FamilyPlayerSwitcher from "../../components/players/FamilyPlayerSwitcher";
import { chatApi } from "../../services/chatApi";
import ChatActionButton from "../../components/chat/ChatActionButton";
import RatingEditor from "../../components/players/RatingEditor";
import { getMediaUrl, getMediaFallback } from "../../utils/media";
import {
  ArrowLeft,
  ShieldAlert,
  Award,
  Activity,
  Heart,
  Clock,
  Edit,
  Receipt
} from "lucide-react";

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();

  const { data: detailsRes, isLoading: loadingDetails } = useAdminPlayerDetails(playerId);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const updatePaymentStatusMutation = useUpdatePlayerPaymentStatus();

  // Extract variables according to backend JSON envelope structure
  const responseData = detailsRes?.data;
  const player = responseData?.player;
  const parent = responseData?.parent || player?.parentId;

  // Extract assigned classes with per-class payment status
  const assignedClassesInfo: any[] =
    responseData?.assignedClassesPaymentInfo ||
    responseData?.classPaymentSummary?.assignedClassesWithPaymentStatus ||
    player?.classPaymentStatuses?.map((cps: any) => ({
      classId: cps.class?._id || cps.class,
      className: cps.class?.name || "Class",
      paymentStatus: cps.paymentStatus
    })) ||
    player?.assignedClasses?.map((c: any) => ({
      classId: c._id || c.id,
      className: c.name || c.className || "Class",
      paymentStatus: c.paymentStatus || player?.paymentStatus || "UNPAID",
      dayOfWeek: c.dayOfWeek,
      startTime: c.startTime,
      endTime: c.endTime,
      location: c.location
    })) || [];

  // Extract assigned teams with team payment status
  const assignedTeamsInfo: any[] =
    responseData?.assignedTeamsPaymentInfo ||
    responseData?.teamPaymentSummary?.assignedTeamsWithPaymentStatus || [];

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

  const avatar = getMediaUrl(player.profileImage, getMediaFallback(player.fullName));
  const dob = player.dob ? new Date(player.dob) : null;
  const age = dob ? new Date().getFullYear() - dob.getFullYear() : null;
  const dobString = dob ? dob.toLocaleDateString() : null;

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-none border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#0047FF] transition-colors shadow-xs"
            >
              <Edit size={14} />
              <span>Edit Player</span>
            </button>
            {parent && (
              <ChatActionButton
                contextLabel={player.fullName || "Parent"}
                buttonText="Chat with Parent"
                className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0047FF] px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition-colors shadow-theme-xs"
                ensureRoom={() => chatApi.openDirectChat(String(parent?._id || parent))}
              />
            )}
          </div>
        </div>

        <FamilyPlayerSwitcher children={responseData?.familyPlayers || []} selectedId={player._id} />

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
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activeStatus === "ACTIVE" || activeStatus === "APPROVED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}>
                    {activeStatus}
                  </span>
                )}
                {paymentStatus && (
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${paymentStatus === "PAID"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                    {paymentStatus.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className="text-slate-400 text-xs font-semibold">Rating:</span>
              <RatingEditor playerId={player._id} initialRating={player.rating || 0} />
            </div>

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4">
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

        <PlayerHistoryDashboard data={responseData || {}} player={player} />

        <EditPlayerStatsModal
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          playerId={player._id}
          playerName={player.fullName}
          initialStats={statistics}
        />

        <EditPlayerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          player={player}
        />

        <PlayerPaymentHistoryModal
          isOpen={isPaymentHistoryOpen}
          onClose={() => setIsPaymentHistoryOpen(false)}
          player={player}
        />

        {/* Double Column Info */}
        <div className="grid grid-cols-1 gap-6">
          {/* Left Column: Personal and Contact Details */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 content-start">

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
              <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-slate-800/40">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Assigned Classes ({assignedClassesInfo.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPaymentHistoryOpen(true)}
                  className="text-[10px] font-bold text-[#0047FF] hover:underline uppercase flex items-center gap-1"
                >
                  <Receipt size={12} />
                  <span>Full Payment History & Status</span>
                </button>
              </div>
              {assignedClassesInfo.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                  {assignedClassesInfo.map((item: any, idx: number) => {
                    const classId = item.classId || item._id;
                    const className = item.className || item.name || "Class";
                    const status = item.paymentStatus || player?.paymentStatus || "UNPAID";
                    const st = (status || "UNPAID").toUpperCase();
                    let day = item.dayOfWeek;
                    if (!day && className) {
                      const match = className.match(/^([a-zA-Z]+)/);
                      if (match) day = match[1];
                    }
                    return (
                      <div
                        key={idx}
                        className="py-3 px-2 -mx-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => navigate('/program/academy', { state: { classId, day } })}
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#0047FF] transition-colors">{className}</span>
                          {(item.dayOfWeek || item.startTime || item.location) && (
                            <span className="text-slate-400 block text-[10px] mt-0.5 font-medium">
                              {[item.dayOfWeek, item.startTime, item.location].filter(Boolean).join(" • ")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={st}
                            onChange={(e) => {
                              if (playerId && classId) {
                                updatePaymentStatusMutation.mutate({
                                  userId: playerId,
                                  payload: { paymentStatus: e.target.value, classId: classId.toString() },
                                });
                              }
                            }}
                            className={`h-6 px-1.5 text-[9px] font-bold uppercase rounded-none border cursor-pointer ${
                              st === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : st === "UNPAID" || st === "OVER_DUE"
                                ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            <option value="PAID">PAID</option>
                            <option value="UNPAID">UNPAID</option>
                            <option value="TRIAL">TRIAL</option>
                            <option value="OVER_DUE">OVER DUE</option>
                            <option value="HANDSHAKE">HANDSHAKE</option>
                            <option value="TBC">TBC</option>
                            <option value="EXTRA">EXTRA</option>
                            <option value="SUBSTITUTE">SUBSTITUTE</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-450 italic">No active classes assigned to this player.</p>
              )}
            </div>

            {/* Assigned Teams */}
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-6 shadow-theme-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-slate-800/40">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Assigned Teams ({assignedTeamsInfo.length})
                </h3>
              </div>
              {assignedTeamsInfo.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                  {assignedTeamsInfo.map((team: any, idx: number) => {
                    const teamId = team.teamId || team._id;
                    const teamName = team.teamName || team.name || "Team";
                    const status = team.paymentStatus || "PAID";
                    return (
                      <div
                        key={idx}
                        onClick={() => navigate(`/teams/${teamId}`)}
                        className="py-3 px-2 -mx-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded"
                      >
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#0047FF] transition-colors">{teamName}</span>
                          {team.teamFee !== undefined && (
                            <span className="text-slate-400 block text-[10px] mt-0.5 font-medium">
                              Team Fee: ${team.teamFee}
                            </span>
                          )}
                        </div>
                        <div>
                          {(() => {
                            const st = (status || "PAID").toUpperCase();
                            if (st === "PAID" || st === "APPROVED" || st === "ACTIVE") {
                              return <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] uppercase rounded-none dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">PAID</span>;
                            }
                            if (st === "TRIAL") {
                              return <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px] uppercase rounded-none dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400">TRIAL</span>;
                            }
                            if (st === "TBC") {
                              return <span className="px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 font-bold text-[10px] uppercase rounded-none shadow-xs">TBC</span>;
                            }
                            if (st === "HANDSHAKE") {
                              return <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[10px] uppercase rounded-none dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400">HANDSHAKE</span>;
                            }
                            if (st === "EXTRA" || st === "OTHERS") {
                              return <span className="px-2.5 py-0.5 bg-[#dee08b]/30 border border-[#dee08b] text-[#8a8c23] dark:text-[#dee08b] font-bold text-[10px] uppercase rounded-none">EXTRA</span>;
                            }
                            if (st === "SUBSTITUTE") {
                              return <span className="px-2.5 py-0.5 bg-[#dee08b]/30 border border-[#dee08b] text-[#8a8c23] dark:text-[#dee08b] font-bold text-[10px] uppercase rounded-none">SUBSTITUTE</span>;
                            }
                            return <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] uppercase rounded-none dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400">UNPAID</span>;
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-450 italic">No assigned teams for this player.</p>
              )}
            </div>
          </div>


        </div>
      </div>
    </>
  );
}
