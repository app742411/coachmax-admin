import { useState } from "react";
import { useNavigate } from "react-router";
import { Player } from "../../types/player";
import { useAppDispatch } from "../../store";
import { setActiveRoomId } from "../../store/slices/chatSlice";
import apiClient from "../../api/apiClient";
import { ShieldAlert } from "lucide-react";

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
  showStatusColumn?: boolean;
}

export default function PlayerTable({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onDeletePlayer,
  onApprovePlayer,
  onRejectPlayer,
  onAssignClass: _onAssignClass,
  onGenerateInvoice,
  onAddCoachNote,
  showStatusColumn = false,
}: PlayerTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalPlayer, setDeleteModalPlayer] = useState<Player | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updatePosition = () => {
    if (!openDropdownId) return;
    const trigger = document.getElementById(`trigger-${openDropdownId}`);
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 150;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left + window.scrollX - (menuWidth - rect.width);
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 20;
    }
    if (left < 0) left = 10;

    let top = rect.bottom + window.scrollY + 4;
    let placement: 'top' | 'bottom' = 'bottom';

    if (rect.bottom + menuHeight > viewportHeight && rect.top - menuHeight > 0) {
      top = rect.top + window.scrollY - menuHeight - 4;
      placement = 'top';
    }

    setMenuPosition({ top, left, placement });
  };

  const toggleDropdown = (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation();
    if (openDropdownId === playerId) {
      setOpenDropdownId(null);
      setMenuPosition(null);
    } else {
      setOpenDropdownId(playerId);
      setTimeout(updatePosition, 0);
    }
  };

  const handleChatWithParent = async (player: Player) => {
    const parentId = player.parentId?._id || player.parentId;
    if (!parentId) {
      alert("No parent contact information found for this player.");
      return;
    }

    try {
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
        alert(res.data?.message || "Failed to start conversation.");
      }
    } catch (error: any) {
      console.error("Chat redirection error:", error);
      alert(error?.response?.data?.message || "Failed to start direct conversation.");
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-none shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <table className="min-w-[1100px] w-full text-left border-collapse text-[11px] [&_th]:border [&_th]:border-slate-700/50 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
          <thead>
            <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
              <th className="py-2.5 px-2 w-[30px] text-center">#</th>
              <th className="py-2.5 px-2 min-w-[65px] text-center">Payment Status</th>
              {showStatusColumn && <th className="py-2.5 px-2 min-w-[65px] text-center">Status</th>}
              <th className="py-2.5 px-2 min-w-[120px]">Player</th>
              <th className="py-2.5 px-2 min-w-[75px]">DOB</th>
              <th className="py-2.5 px-2 min-w-[100px] text-center">Medical Conditions</th>
              <th className="py-2.5 px-2 min-w-[50px] text-center">Jersey #</th>
              <th className="py-2.5 px-2 min-w-[70px] text-center">Skill</th>
              <th className="py-2.5 px-2 min-w-[80px] text-center">Category</th>
              <th className="py-2.5 px-2 min-w-[80px] text-center">Program</th>
              <th className="py-2.5 px-2 min-w-[40px] text-center">Foot</th>
              <th className="py-2.5 px-2 min-w-[90px]">Contact</th>
              <th className="py-2.5 px-2 min-w-[110px]">Email</th>
              <th className="py-2.5 px-2 min-w-[90px]">Phone</th>
              <th className="py-2.5 px-2 w-[50px] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const isRequest = !!(player as any).requestId || !!(player as any).requestType;
              const paymentStatus = player.paymentStatus || "PENDING";
              const playerStatus = isRequest ? (player.status || "PENDING") : ((player as any).playerStatus || player.status || "PENDING");
              const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
              const avatar = player.profileImage ? `${baseUrl}/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
              return (
                <tr
                  key={player._id}
                  onClick={() => onSelectPlayer(player)}
                  className={`border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all ${selectedPlayerId === player._id ? "bg-slate-50 dark:bg-slate-800/40" : ""
                    }`}
                >
                  <td className="py-3 px-2 font-semibold text-slate-500 text-center">{idx + 1}</td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${paymentStatus === "PAID" || paymentStatus === "APPROVED" || paymentStatus === "ACTIVE"
                          ? "text-emerald-600"
                          : paymentStatus === "OTHERS"
                            ? "text-blue-600"
                            : paymentStatus === "UNPAID" || paymentStatus === "REJECTED" || paymentStatus === "TRIAL" || paymentStatus === "INACTIVE" || paymentStatus === "BLOCKED"
                              ? "text-rose-600"
                              : "text-amber-500"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${paymentStatus === "PAID" || paymentStatus === "APPROVED" || paymentStatus === "ACTIVE"
                            ? "bg-emerald-600"
                            : paymentStatus === "OTHERS"
                              ? "bg-blue-600"
                              : paymentStatus === "UNPAID" || paymentStatus === "REJECTED" || paymentStatus === "TRIAL" || paymentStatus === "INACTIVE" || paymentStatus === "BLOCKED"
                                ? "bg-rose-600"
                                : "bg-amber-500"
                          }`}
                      />
                      {paymentStatus}
                    </span>
                  </td>
                  {showStatusColumn && (
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${playerStatus === "PAID" || playerStatus === "APPROVED" || playerStatus === "ACTIVE"
                            ? "text-emerald-600"
                            : playerStatus === "OTHERS"
                              ? "text-blue-600"
                              : playerStatus === "UNPAID" || playerStatus === "REJECTED" || playerStatus === "TRIAL" || playerStatus === "INACTIVE" || playerStatus === "BLOCKED"
                                ? "text-rose-600"
                                : "text-amber-500"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${playerStatus === "PAID" || playerStatus === "APPROVED" || playerStatus === "ACTIVE"
                              ? "bg-emerald-600"
                              : playerStatus === "OTHERS"
                                ? "bg-blue-600"
                                : playerStatus === "UNPAID" || playerStatus === "REJECTED" || playerStatus === "TRIAL" || playerStatus === "INACTIVE" || playerStatus === "BLOCKED"
                                  ? "bg-rose-600"
                                  : "bg-amber-500"
                            }`}
                        />
                        {playerStatus}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={avatar}
                        alt={player.fullName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100"
                      />
                      <span
                        className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px] block"
                        title={player.fullName}
                      >
                        {player.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-500">
                    {player.dob ? (
                      <div className="flex flex-col">
                        <span>{new Date(player.dob).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-450 font-normal">
                          {new Date().getFullYear() - new Date(player.dob).getFullYear()} yrs
                        </span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-2 text-center" title={player.medicalConditionDetails || player.medicalConditions}>
                    {player.isMedicalCondition ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-105 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[90px] block mx-auto">
                        {player.medicalConditionDetails || "Yes"}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {player.jerseyNumber ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#031549] text-white text-[10px] font-bold shadow-sm">
                        {player.jerseyNumber}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${(player.rating || 0) > i
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
                  <td className="py-3 px-2 text-center font-bold text-brand-500">
                    <span
                      className="truncate max-w-[95px] block mx-auto text-center"
                      title={player.category?.name || "N/A"}
                    >
                      {player.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-600 dark:text-slate-400">
                    {player.programs?.length ? (
                      <div className="flex items-center justify-center gap-1.5 relative group cursor-pointer">
                        <span className="truncate max-w-[100px]">{player.programs[0].name}</span>
                        {player.programs.length > 1 && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 whitespace-nowrap">
                            +{player.programs.length - 1}
                          </span>
                        )}

                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50">
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-none py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap text-left">
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
                      <span
                        className="truncate max-w-[100px] block mx-auto"
                        title={player.program?.name || "-"}
                      >
                        {player.program?.name || "-"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 font-bold text-slate-600 dark:text-slate-400 text-center">
                    {(player.preferredFoot || player.prefferedFoot) === "LEFT" ? "L" : (player.preferredFoot || player.prefferedFoot) === "RIGHT" ? "R" : "-"}
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-705 dark:text-slate-300">
                    <span
                      className="truncate max-w-[95px] block"
                      title={player.parentId?.fullName || "N/A"}
                    >
                      {player.parentId?.fullName || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-500 dark:text-slate-400">
                    {player.parentId?.email ? (
                      <a
                        href={`mailto:${player.parentId.email}`}
                        className="text-[#0047FF] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors truncate max-w-[115px] block font-semibold"
                        onClick={(e) => e.stopPropagation()}
                        title={player.parentId.email}
                      >
                        {player.parentId.email}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-550 dark:text-slate-400">
                    {player.parentId?.phone ? player.parentId.phone.replace(/^(\+\d{2,3})(\d+)$/, "$1 $2") : "N/A"}
                  </td>
                  <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`trigger-${player._id}`}
                      className={`text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 p-1 border rounded-none hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs inline-flex items-center justify-center ${openDropdownId === player._id
                          ? 'border-[#0047FF] bg-blue-50/50 dark:bg-blue-950/20 text-[#0047FF]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      title="More Options"
                      onClick={(e) => toggleDropdown(e, player._id)}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Action Menu dropdown */}
      {openDropdownId && menuPosition && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpenDropdownId(null);
              setMenuPosition(null);
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className={`z-50 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 transform transition-all duration-200 origin-top-right rounded-none`}
          >
            {players.find(p => p._id === openDropdownId) && (() => {
              const player = players.find(p => p._id === openDropdownId)!;
              const activeStatus = (player as any).playerStatus || player.status;

              return (
                <>
                  {(activeStatus === "PENDING_APPROVAL" || activeStatus === "PENDING") && onApprovePlayer && (
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
                  {(activeStatus === "PENDING_APPROVAL" || activeStatus === "PENDING") && onRejectPlayer && (
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
                  {/* {onAssignClass && (
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
                  )} */}
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
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateInvoice(player);
                        setOpenDropdownId(null);
                      }}
                    >
                      Generate Invoice
                    </button>
                  )}
                  {onAddCoachNote && (
                    <button
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddCoachNote(player);
                        setOpenDropdownId(null);
                      }}
                    >
                      Add Coach Note
                    </button>
                  )}
                  {onDeletePlayer && (
                    <button
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-t border-slate-100 dark:border-slate-750"
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 p-6 max-w-sm w-full rounded-none border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-none dark:bg-red-500/10 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Delete Player Record</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Are you sure you want to permanently delete the player profile for <span className="font-semibold text-slate-700 dark:text-slate-200">{deleteModalPlayer.fullName}</span>? This action is irreversible.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setDeleteModalPlayer(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                onClick={() => {
                  if (onDeletePlayer) {
                    onDeletePlayer(deleteModalPlayer);
                  }
                  setDeleteModalPlayer(null);
                }}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
