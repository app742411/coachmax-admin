import React from "react";
import { Clock } from "lucide-react";

interface TimeSlotNavigatorProps {
  timeSlots: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  loading?: boolean;
}

const TimeSlotNavigator: React.FC<TimeSlotNavigatorProps> = ({
  timeSlots,
  selectedTime,
  onSelectTime,
  loading,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-3 px-2">
        <Clock size={16} className="text-orange-500" />
        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">
          {loading ? "Loading Time Slots..." : "Select Time Slot"}
        </h4>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        {!loading && timeSlots.length === 0 && (
          <p className="text-sm text-gray-400 italic px-2">No time slots available for this day.</p>
        )}
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-extrabold whitespace-nowrap transition-all border-2 ${
              selectedTime === time
                ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-600 hover:border-gray-200"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotNavigator;
