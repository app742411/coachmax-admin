import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Clock } from "lucide-react";

type TimePickerProps = {
  id?: string;
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
};

export default function TimePicker({
  id = "time-picker-" + Math.random().toString(36).substr(2, 9),
  value,
  onChange,
  placeholder = "Select time",
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      time_24hr: false,
      defaultDate: value,
      onChange: (_selectedDates, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
    });

    return () => {
      fp.destroy();
    };
  }, []); // Empty dependency array to prevent re-initialization on every render

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <Clock className="size-5" />
      </span>
    </div>
  );
}
