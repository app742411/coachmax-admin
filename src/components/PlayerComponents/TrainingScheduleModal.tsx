import React from "react";
import { User } from "../../types/player";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface CalendarMonthProps {
  days: number[];
  range?: { start: number; end: number };
  month: string;
  year: number;
}

const CalendarMonth = ({ days, range, month, year }: CalendarMonthProps) => {
  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayIndex = (month: string, year: number) => {
    return new Date(`${month} 1, ${year}`).getDay();
  };

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getFirstDayIndex(month, year);
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-8 md:h-10" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isTraining = days.includes(d);
    const inRange = range && d >= range.start && d <= range.end;

    cells.push(
      <div
        key={d}
        className={`h-8 md:h-10 flex items-center justify-center text-[11px] font-bold transition-all rounded-lg relative overflow-hidden
         ${isTraining ? 'bg-brand-500 text-white shadow-md z-10' : 'text-gray-400'}
         ${inRange ? 'bg-brand-500/10 border border-brand-500/20' : ''}
        `}
      >
        {inRange && <div className="absolute inset-0 bg-brand-500/10" />}
        <span className="relative z-10">{d}</span>
      </div>
    );
  }

  return <div className="grid grid-cols-7 gap-1">{cells}</div>;
};

interface TrainingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const TrainingScheduleModal: React.FC<TrainingScheduleModalProps> = ({ isOpen, onClose, user }) => {
  const months = [
    { name: "July", year: 2026, trainingDays: [7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30], highlightRange: { start: 1, end: 12 } },
    { name: "August", year: 2026, trainingDays: [1, 4, 6, 8, 11, 13, 15, 18, 20, 22, 25, 27, 29] },
    { name: "September", year: 2026, trainingDays: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29], highlightRange: { start: 19, end: 30 } },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[92vh] flex flex-col">
      {/* Fixed Header */}
      <div className="px-10 pt-10 pb-6 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
        <h4 className="text-3xl font-bold tracking-tighter text-gray-800 dark:text-white mb-2 flex items-center justify-between">
          <span>{user ? `Assign ${user.fullName.split(' ')[0]}'s` : "Term 2"} <span className="text-brand-500 ">Training Schedule</span></span>
          <span className="text-[10px] font-bold text-gray-400 border px-3 py-1 rounded-full border-gray-100">{user ? user.programType : "AUSTRALIA"} 2026</span>
        </h4>
        <p className="text-[10px] font-bold text-gray-400">
          Weekly sessions (2-3 times/week) • Holiday clinics highlighted
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto px-10 py-8 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {months.map((m) => (
            <div key={m.name} className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden p-6 bg-gray-50/50 dark:bg-white/05">
              <h5 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-6 border-b pb-4 border-gray-200/50">
                {m.name}
              </h5>
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 mb-4 tracking-tighter">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <CalendarMonth days={m.trainingDays} range={m.highlightRange} month={m.name} year={m.year} />
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-brand-50/50 dark:bg-brand-500/05 rounded-2xl border border-brand-100 dark:border-brand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-brand-500 shadow-sm" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Training Session</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-lg bg-brand-500/20 border border-brand-500/30" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Holiday Camp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="px-10 py-5 border-t border-gray-100 dark:border-white/5 flex gap-3 justify-end flex-shrink-0 bg-gray-50/50 dark:bg-white/05 rounded-b-[28px]">
        <Button variant="outline" onClick={onClose} className="rounded-xl px-10 text-[10px] font-bold border-gray-200">Close Schedule</Button>
      </div>
    </Modal>
  );
};

export default TrainingScheduleModal;
