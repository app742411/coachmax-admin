import { useState } from "react";
import { Player } from "../../types/player";
import { usePlayerProfile, useCoachNotes } from "../../hooks/usePlayers";
import AddCoachNoteModal from "../CoachManagement/AddCoachNoteModal";

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
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800";
  }
};

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
  isRegistrationRequest?: boolean;
}

export default function PlayerDetailCard({ player: initialPlayer, onClose, isRegistrationRequest }: PlayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Details" | "Development" | "Medical" | "Note"
  >("Overview");

  const { data: profileRes } = usePlayerProfile(initialPlayer._id);
  const player = profileRes?.data || initialPlayer;

  const { data: notesRes } = useCoachNotes(initialPlayer._id);
  const notes = notesRes?.data || [];
  const [editingNote, setEditingNote] = useState<any | null>(null);

  const avatar = player.profileImage ? `/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
  const dob = new Date(player.dob);
  const age = new Date().getFullYear() - dob.getFullYear();
  const dobString = dob.toLocaleDateString();

  const skillNum = player.weakFootRating || 3;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[420px] bg-white border-l border-slate-100 shadow-2xl dark:bg-slate-900 dark:border-slate-800 p-6 overflow-y-auto transform transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={player.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#0047FF]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {player.fullName}
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-full dark:bg-emerald-950/20 dark:text-emerald-400">
                  {player.status || "PENDING"}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mt-0.5">
                Jersey #{player.jerseyNumber} • {player.preferredFoot === "LEFT" ? "Left Foot" : player.preferredFoot === "RIGHT" ? "Right Foot" : "N/A"}
              </span>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 mb-5 text-[11px] font-bold">
          {(["Overview", "Details", "Development", "Medical", "Note"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 -mb-px transition-all border-b-2 hover:text-[#0047FF] ${activeTab === tab
                ? "border-[#0047FF] text-[#0047FF]"
                : "border-transparent text-slate-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents: Overview */}
        {activeTab === "Overview" && (
          <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
            {/* Personal Information */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3 pb-1 border-b border-slate-50 dark:border-slate-800/40">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {player.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {dobString} <span className="text-slate-400 font-normal">({age} Years)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Program</span>
                  <span className="font-bold text-[#0047FF]">{player.program?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {player.category?.name || "N/A"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-0.5">School</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {player.school || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3 pb-1 border-b border-slate-50 dark:border-slate-800/40">
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {player.parentId?.fullName || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="font-semibold text-[#0047FF] underline truncate block max-w-full">
                    {player.parentId?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{player.parentId?.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {player.parentId?.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {!isRegistrationRequest && (
              <>
                {/* Player Ratings */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-50 dark:border-slate-800/40">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                      Player Ratings
                    </h4>
                    <select className="px-2 py-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-none outline-none cursor-pointer">
                      <option>Current Season</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      { label: "Ball Mastery", rating: skillNum },
                      { label: "Weak Foot", rating: skillNum },
                      { label: "First Touch", rating: skillNum },
                      { label: "Defending", rating: skillNum },
                      { label: "Passing", rating: skillNum },
                      { label: "Football IQ", rating: skillNum },
                      { label: "Dribbling", rating: skillNum },
                      { label: "Aggression", rating: skillNum },
                      { label: "Finishing", rating: skillNum },
                      { label: "Positioning", rating: skillNum },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-0.5">
                        <span className="text-slate-500">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">
                            {"★".repeat(item.rating)}
                            {"☆".repeat(5 - item.rating)}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 w-3 text-right">
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3 pb-1 border-b border-slate-50 dark:border-slate-800/40">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-none">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Registration Date</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {new Date(player.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-none">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Elite Goals (Total)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{player.goals || 0}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-none">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Current Season</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{player.appearances || 0} matches</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isRegistrationRequest && (
              <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/60 rounded-xl">
                <h4 className="font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider text-[10px] mb-3 pb-2 border-b border-blue-100 dark:border-blue-800/60">
                  Registration Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-blue-700/70 dark:text-blue-400/70 block mb-0.5">Request Type</span>
                    <span className="font-semibold text-blue-950 dark:text-blue-100">
                      {player.requestType?.replace("_", " ") || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700/70 dark:text-blue-400/70 block mb-0.5">Preferred Term</span>
                    <span className="font-bold text-[#0047FF] dark:text-blue-400">
                      {player.preferredTerm?.name || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-blue-700/70 dark:text-blue-400/70 block mb-0.5">Preferred Classes</span>
                    {player.preferredClasses && player.preferredClasses.length > 0 ? (
                      <ul className="list-disc pl-4 text-blue-950 dark:text-blue-100 font-semibold space-y-1">
                        {player.preferredClasses.map((cls: any) => (
                          <li key={cls._id}>{cls.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="font-semibold text-blue-950 dark:text-blue-100">N/A</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-blue-700/70 dark:text-blue-400/70 block mb-0.5">Assigned By</span>
                    <span className="font-semibold text-blue-950 dark:text-blue-100">
                      {player.assignedBy?.name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isRegistrationRequest && (
              <div className="pt-2">
                <a
                  href="#full-profile"
                  className="inline-flex items-center gap-1 font-bold text-[#0047FF] hover:underline"
                >
                  <span>View Full Profile</span>
                  <span>&rarr;</span>
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === "Note" && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] pb-1 border-b border-slate-50 dark:border-slate-800/40">
              Coach Performance Notes
            </h4>
            {notes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                No notes logged for this player yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {notes.map((note: any) => (
                  <div
                    key={note._id}
                    className="relative p-4 bg-[#FEF9C3] dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 shadow-sm rounded-none space-y-1.5 pt-5"
                  >
                    {/* Pin design element */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500/80 rounded-full shadow-inner" />

                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 border uppercase font-bold text-[8px] ${getBadgeStyles(note.noteType)}`}>
                          {note.noteType?.replace("_", " ")}
                        </span>
                        <button
                          onClick={() => setEditingNote(note)}
                          className="text-[#0047FF] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <span className="text-slate-500 dark:text-yellow-400/60">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
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
        )}

        {/* Empty States for other tabs */}
        {activeTab !== "Overview" && activeTab !== "Note" && (
          <div className="py-8 text-center text-slate-400 text-xs">
            <span>{activeTab} module details are currently empty.</span>
          </div>
        )}
      </div>

      {editingNote && (
        <AddCoachNoteModal
          isOpen={editingNote !== null}
          onClose={() => setEditingNote(null)}
          playerId={player._id}
          playerName={player.fullName}
          noteId={editingNote._id}
          initialNoteType={editingNote.noteType}
          initialDescription={editingNote.description}
        />
      )}
    </>
  );
}
