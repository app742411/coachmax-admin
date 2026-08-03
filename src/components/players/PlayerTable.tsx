import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store";
import { setActiveRoomId } from "../../store/slices/chatSlice";
import apiClient from "../../api/apiClient";
import { Player } from "../../types/player";
import ConfirmDeleteModal from "../ui/modal/ConfirmDeleteModal";

interface PlayerTableProps {
  players: Player[];
  selectedPlayerId: string;
  onSelectPlayer: (player: Player) => void;
  onDeletePlayer?: (player: Player) => void;
  onApprovePlayer?: (player: Player) => void;
  onRejectPlayer?: (player: Player) => void;
  onAssignClass?: (player: Player) => void;
  onGenerateInvoice?: (player: Player) => void;
  onAddCoachNote?: (player: Player) => void;
}

export default function PlayerTable({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onDeletePlayer,
  onApprovePlayer,
  onRejectPlayer,
  onAssignClass,
  onGenerateInvoice,
  onAddCoachNote,
}: PlayerTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalPlayer, setDeleteModalPlayer] = useState<Player | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChatWithParent = async (player: Player) => {
    const parentId = (player.parentId as any)?.id || (player.parentId as any)?._id || player.parentId;
    if (!parentId || typeof parentId !== "string") {
      alert("Parent ID not found for this player.");
      return;
    }

    try {
      const res = await apiClient.post("/api/coach/chat/direct", { parentId });
      if (res.data && res.data.success && res.data.data) {
        const roomId = res.data.data._id;
        dispatch(setActiveRoomId(roomId));

        // Determine destination route based on role
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
        alert(res.data?.message || "Failed to start conversation.");
      }
    } catch (error: any) {
      console.error("Chat redirection error:", error);
      alert(error?.response?.data?.message || "Failed to start direct conversation.");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
      <div className="overflow-visible no-scrollbar">
        <table className="w-full text-left border-collapse text-xs [&_th]:border [&_th]:border-slate-700/50 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-[40px]">#</th>
              <th className="py-3 px-3 min-w-[70px]">Payment Status</th>
              <th className="py-3 px-3 min-w-[150px]">Player</th>
              <th className="py-3 px-3 min-w-[90px]">DOB</th>
              <th className="py-3 px-3 min-w-[120px] text-center">Medical Conditions</th>
              {/* <th className="py-3 px-3 min-w-[140px]">School</th> */}
              <th className="py-3 px-3 min-w-[60px] text-center">Jersey #</th>
              <th className="py-3 px-3 min-w-[80px] text-center">Skill</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Category</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Program</th>
              <th className="py-3 px-3 min-w-[50px] text-center">Foot</th>
              <th className="py-3 px-3 min-w-[120px]">Contact</th>
              <th className="py-3 px-3 min-w-[160px]">Email</th>
              <th className="py-3 px-3 min-w-[110px]">Phone</th>
              <th className="py-3 px-4 w-[70px] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const status = player.paymentStatus || player.status || "PENDING";
              const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
              const avatar = player.profileImage ? `${baseUrl}/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
              return (
                <tr
                  key={player._id}
                  onClick={() => onSelectPlayer(player)}
                  className={`border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${selectedPlayerId === player._id ? "bg-slate-50 dark:bg-slate-800/40" : ""
                    }`}
                >
                  <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${status === "PAID" || status === "APPROVED" ? "text-emerald-600" : status === "UNPAID" || status === "REJECTED" || status === "TRIAL" ? "text-rose-600" : "text-amber-500"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status === "PAID" || status === "APPROVED" ? "bg-emerald-600" : status === "UNPAID" || status === "REJECTED" || status === "TRIAL" ? "bg-rose-600" : "bg-amber-500"
                          }`}
                      />
                      {status}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={avatar}
                        alt={player.fullName}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{player.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-500">
                    {player.dob ? (
                      <div className="flex flex-col">
                        <span>{new Date(player.dob).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date().getFullYear() - new Date(player.dob).getFullYear()} yrs
                        </span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-3 truncate max-w-[150px] text-center" title={player.medicalConditionDetails || player.medicalConditions}>
                    {player.isMedicalCondition ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                        {player.medicalConditionDetails || "Yes"}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-500">No</span>
                    )}
                  </td>
                  {/* <td className="py-4 px-3">
                    <span className="text-slate-500 font-semibold">
                      {player.school || "N/A"}
                    </span>
                  </td> */}
                  <td className="py-4 px-3 text-center">
                    {player.jerseyNumber ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#031549] text-white text-xs font-bold shadow-sm">
                        {player.jerseyNumber}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${(player.rating || 0) > i
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200 dark:text-slate-700 dark:fill-slate-700"
                            }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center font-bold text-brand-500">
                    {player.category?.name || "N/A"}
                  </td>
                  <td className="py-4 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                    {player.programs?.length ? (
                      <div className="flex items-center justify-center gap-1.5 relative group cursor-pointer">
                        <span className="truncate max-w-[120px]">{player.programs[0].name}</span>
                        {player.programs.length > 1 && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 whitespace-nowrap">
                            +{player.programs.length - 1}
                          </span>
                        )}

                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50">
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-none py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            <ul className="text-left space-y-1.5">
                              {player.programs.map((p, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047FF]"></span>
                                  {p.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 rotate-45"></div>
                        </div>
                      </div>
                    ) : (
                      player.program?.name || "-"
                    )}
                  </td>
                  <td className="py-4 px-3 font-bold text-slate-600 dark:text-slate-400 text-center">
                    {(player.preferredFoot || player.prefferedFoot) === "LEFT" ? "L" : (player.preferredFoot || player.prefferedFoot) === "RIGHT" ? "R" : "-"}
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {player.parentId?.fullName || "N/A"}
                  </td>
                  <td className="py-4 px-3 font-medium text-slate-500 dark:text-slate-400">
                    {player.parentId?.email ? (
                      <a
                        href={`mailto:${player.parentId.email}`}
                        className="text-[#0047FF] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {player.parentId.email}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">
                    {player.parentId?.phone ? player.parentId.phone.replace(/^(\+\d{2,3})(\d+)$/, "$1 $2") : "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 border border-slate-200 dark:border-slate-700 rounded-none bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-flex items-center justify-center"
                      title="More Options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === player._id ? null : player._id);
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {openDropdownId === player._id && (
                      <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        {(() => {
                          const userStr = localStorage.getItem("user");
                          let isCoach = false;
                          if (userStr) {
                            try {
                              const parsed = JSON.parse(userStr);
                              if (parsed?.role === "COACH") {
                                isCoach = true;
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }

                          if (isCoach) {
                            return (
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    if (onAddCoachNote) {
                                      onAddCoachNote(player);
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  Add Coach Note
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    handleChatWithParent(player);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-gray-100 dark:border-slate-700 mt-1 pt-1"
                                >
                                  Chat
                                </button>
                              </div>
                            );
                          }

                          return (
                            <>
                              {onApprovePlayer && (
                                <button
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onApprovePlayer(player);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Approve Player
                                </button>
                              )}
                              {onRejectPlayer && (
                                <button
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRejectPlayer(player);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Reject Player
                                </button>
                              )}
                              {onAssignClass && (
                                <button
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0047FF] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAssignClass(player);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Assign to Class
                                </button>
                              )}
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  handleChatWithParent(player);
                                }}
                              >
                                Chat
                              </button>
                              {onGenerateInvoice && (
                                <button
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors border-t border-gray-100 dark:border-slate-700 mt-1 pt-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGenerateInvoice(player);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Generate Invoice
                                </button>
                              )}
                              {onDeletePlayer && (
                                <button
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModalPlayer(player);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Delete Player
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        isOpen={!!deleteModalPlayer}
        onClose={() => setDeleteModalPlayer(null)}
        onConfirm={() => {
          if (deleteModalPlayer && onDeletePlayer) {
            onDeletePlayer(deleteModalPlayer);
          }
          setDeleteModalPlayer(null);
        }}
        title="Delete Player"
        message="Are you sure you want to delete this player? This action cannot be undone."
      />
    </div>
  );
}
