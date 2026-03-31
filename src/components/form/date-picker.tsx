import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

interface DatePickerProps {
 id?: string;
 mode?: "single" | "multiple" | "range" | "time";
 onChange: (selectedDates: Date[], dateStr: string, instance: any) => void;
 defaultDate?: any;
 label?: string;
 placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
 id = "datepicker-" + Math.random().toString(36).substring(2, 9), // AUTO fallback id
 mode = "single",
 onChange,
 defaultDate,
 label,
 placeholder = "Select date",
}) => {
 useEffect(() => {
  const picker = flatpickr(`#${id}`, {
   mode,
   static: true,
   monthSelectorType: "static",
   dateFormat: "Y-m-d",
   defaultDate,
   onChange,
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
 }, [id, mode, onChange, defaultDate]);

 return (
  <div>
   {label && <Label htmlFor={id}>{label}</Label>}

   <div className="relative">
    <input
     id={id}
     placeholder={placeholder}
     className="
      h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
      shadow-theme-xs placeholder:text-gray-400 
      focus:outline-hidden focus:ring-3 
      bg-transparent text-gray-800 border-gray-300 
      focus:border-brand-300 focus:ring-brand-500/20 
      dark:bg-gray-900 dark:text-white/90 
      dark:placeholder:text-white/30 dark:border-gray-700 
      dark:focus:border-brand-800
     "
    />

    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
     <CalenderIcon className="size-6" />
    </span>
   </div>
  </div>
 );
};

export default DatePicker;
