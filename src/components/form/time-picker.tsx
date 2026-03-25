import React, { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Clock } from "lucide-react";

interface TimePickerProps {
  id?: string;
  value: string;
  onChange: (timeStr: string) => void;
  placeholder?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  id = "timepicker-" + Math.random().toString(36).substring(2, 9),
  value,
  onChange,
  placeholder = "10:00 AM",
}) => {
  useEffect(() => {
    const picker = flatpickr(`#${id}`, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      defaultDate: value,
      onChange: (_, dateStr) => {
        onChange(dateStr);
      },
    });

    return () => {
      if (picker) {
        if (Array.isArray(picker)) {
          picker.forEach(p => p.destroy());
        } else {
          picker.destroy();
        }
      }
    };
  }, [id, onChange]); // Value is intentionally omitted from deps to avoid re-renders during typging if it were an input, but for flatpickr we use it as defaultDate

  return (
    <div className="relative">
      <input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className="
          h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
          shadow-theme-xs placeholder:text-gray-400 
          focus:outline-none focus:ring-3 
          bg-gray-50 dark:bg-gray-800/50 text-gray-800 border-gray-200 
          focus:border-brand-500 focus:ring-brand-500/20 
          dark:text-white/90 dark:border-gray-700 
          dark:focus:border-brand-800 transition-all font-medium
        "
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <Clock size={16} />
      </span>
    </div>
  );
};

export default TimePicker;
