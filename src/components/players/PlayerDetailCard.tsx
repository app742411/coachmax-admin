import { useState } from "react";
import { Player } from "../../types/player";

interface PlayerDetailCardProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerDetailCard({ player, onClose }: PlayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Details" | "Development" | "Medical" | "More"
  >("Overview");

  const avatar = player.profileImage ? `/${player.profileImage}` : `https://ui-avatars.com/api/?name=${player.fullName}`;
  const dob = new Date(player.dob);
  const age = new Date().getFullYear() - dob.getFullYear();
  const dobString = dob.toLocaleDateString();
  
  const skillNum = player.weakFootRating || 3;

  return (
    <div className="w-full xl:w-[420px] shrink-0 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 p-6 sticky top-24 self-start">
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
          {(["Overview", "Details", "Development", "Medical", "More"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 -mb-px transition-all border-b-2 hover:text-[#0047FF] ${
                activeTab === tab
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

          {/* Player Ratings */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-50 dark:border-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Player Ratings
              </h4>
              <select className="px-2 py-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded outline-none cursor-pointer">
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
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5">Registration Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(player.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5">Elite Goals (Total)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{player.goals || 0}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 block mb-0.5">Current Season</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{player.appearances || 0} matches</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#full-profile"
              className="inline-flex items-center gap-1 font-bold text-[#0047FF] hover:underline"
            >
              <span>View Full Profile</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      )}

      {/* Empty States for other tabs */}
      {activeTab !== "Overview" && (
        <div className="py-8 text-center text-slate-400 text-xs">
          <span>{activeTab} module details are currently empty.</span>
        </div>
      )}
    </div>
  );
}
