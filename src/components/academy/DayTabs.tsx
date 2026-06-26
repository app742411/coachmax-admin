
interface DayTabsProps {
  activeDay: string;
  onChangeDay: (day: string) => void;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DayTabs({ activeDay, onChangeDay }: DayTabsProps) {
  return (
    <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 text-xs font-semibold overflow-x-auto no-scrollbar gap-1">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onChangeDay(day)}
          className={`py-3 px-8 rounded-t-lg transition-all ${
            activeDay === day
              ? "bg-[#031549] text-white font-bold"
              : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
