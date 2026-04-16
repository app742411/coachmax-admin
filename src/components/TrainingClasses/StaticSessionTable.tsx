import React from "react";
import { Download, Printer, Plus } from "lucide-react";
import { STATIC_PLAYERS } from "./data";

interface StaticSessionTableProps {
  session: string;
}

const StaticSessionTable: React.FC<StaticSessionTableProps> = ({ session }) => {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-3xl border border-gray-200 dark:border-white/[0.05] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
            CMFA {session} Academy
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            2026 - Term 1 - Attendance &amp; Roster
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors">
            <Printer size={18} />
          </button>
          <div className="h-10 w-[1px] bg-gray-100 dark:bg-white/10 mx-2"></div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform">
            <Plus size={16} />
            CREATE CLASS
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-[11px] border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-[#1e2b5e] text-white">
              <th className="border border-white/10 px-2 py-3 font-extrabold">#</th>
              <th className="border border-white/10 px-2 py-3 font-extrabold">P</th>
              <th className="border border-white/10 px-2 py-3 font-extrabold">I</th>
              <th className="border border-white/10 px-4 py-3 text-left font-extrabold whitespace-nowrap">
                Training - {session} - 5pm - Max
              </th>
              <th className="border border-white/10 px-4 py-3 text-left font-extrabold w-32">NOTES</th>
              <th className="border border-white/10 px-6 py-3 text-left font-extrabold min-w-[180px]">Student</th>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <th key={n} className="border border-white/10 px-2 py-3 font-extrabold bg-[#2a3a7a]">
                  {n}
                </th>
              ))}
              <th className="border border-white/10 px-6 py-3 text-left font-extrabold min-w-[180px]">Student</th>
              <th className="border border-white/10 px-2 py-3 font-extrabold">#</th>
              <th className="border border-white/10 px-4 py-3 font-extrabold">FFA Nr</th>
              <th className="border border-white/10 px-4 py-3 font-extrabold">D.O.B</th>
              <th className="border border-white/10 px-2 py-3 font-extrabold">MED</th>
              <th className="border border-white/10 px-4 py-3 text-left font-extrabold whitespace-nowrap">Contact</th>
            </tr>
            <tr className="bg-brand-50 dark:bg-white/5 text-brand-700 dark:text-brand-400">
              <th
                colSpan={6}
                className="border border-gray-100 dark:border-white/5 py-1 text-[10px] font-bold text-gray-400 italic"
              >
                Academy Operations Registry
              </th>
              {[...Array(10)].map((_, i) => (
                <th
                  key={i}
                  className="border border-gray-100 dark:border-white/5 px-1 py-1 text-[8px] font-extrabold uppercase"
                >
                  {26 + i * 7}/01
                </th>
              ))}
              <th colSpan={5} className="border border-gray-100 dark:border-white/5 py-1"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {STATIC_PLAYERS.map((p, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
              >
                <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5 font-bold text-gray-400">
                  {p.id}
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto"></div>
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5"></td>
                <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5 text-gray-600 dark:text-gray-400 font-medium">
                  {p.training}
                </td>
                <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5"></td>
                <td className="border border-gray-100 dark:border-white/5 px-6 py-2.5 font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors uppercase tracking-tight">
                  {p.student}
                </td>
                {[...Array(10)].map((_, j) => (
                  <td
                    key={j}
                    className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-brand-600 focus:ring-brand-500 bg-white dark:bg-transparent"
                      defaultChecked={idx % 3 === 0 && j < 4}
                    />
                  </td>
                ))}
                <td className="border border-gray-100 dark:border-white/5 px-6 py-2.5 font-bold text-gray-900 dark:text-white uppercase tracking-tight opacity-50">
                  {p.student}
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5 font-bold text-gray-300">
                  {p.id}
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                  {p.ffa || "-"}
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-4 py-2.5 text-gray-500">
                  {p.dob}
                </td>
                <td className="border border-gray-100 dark:border-white/5 text-center px-2 py-2.5 text-[9px] font-extrabold text-orange-500 uppercase bg-orange-50/50 dark:bg-orange-500/10">
                  N/A
                </td>
                <td className="border border-gray-100 dark:border-white/5 px-4 py-2.5 text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer">
                  View Contact
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Legend */}
      <div className="p-6 bg-gray-50 dark:bg-white/[0.01] flex items-center justify-between border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Paid / Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Medical Alert</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold">
          Total Enrolled: {STATIC_PLAYERS.length} Players
        </p>
      </div>
    </div>
  );
};

export default StaticSessionTable;
