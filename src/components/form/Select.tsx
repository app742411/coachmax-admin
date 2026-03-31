import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
 value: string | number;
 label: string;
}

interface SelectProps {
 options: SelectOption[];
 placeholder?: string;
 onChange: (value: string) => void;
 className?: string;
 value?: string | number;
 defaultValue?: string | number;
}

const Select: React.FC<SelectProps> = ({
 options,
 placeholder = "Select an option",
 onChange,
 className = "",
 defaultValue = "",
}) => {
 const [selectedValue, setSelectedValue] = useState(defaultValue);
 const [open, setOpen] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  setSelectedValue(value);
  onChange(value);
  setOpen(false);
 };

 return (
  <div className="relative w-full">
   <select
    className={`
     h-11 w-full appearance-none rounded-lg border border-gray-300 
     bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs 
     placeholder:text-gray-400 focus:border-brand-300 
     focus:outline-hidden focus:ring-3 focus:ring-brand-500/10
     dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 
     dark:placeholder:text-white/30 dark:focus:border-brand-800
     ${selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"}
     ${className}
    `}
    value={selectedValue}
    onChange={handleChange}
    onClick={() => setOpen(!open)}
    onBlur={() => setOpen(false)}
   >
    {/* Placeholder */}
    <option
     value=""
     disabled
     className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
     {placeholder}
    </option>

    {/* Options */}
    {options.map((option) => (
     <option
      key={option.value}
      value={option.value}
      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
     >
      {option.label}
     </option>
    ))}
   </select>

   {/* Lucide Dropdown Icon */}
   <ChevronDown
    className={`
     pointer-events-none absolute right-3 top-1/2 h-5 w-5 
     -translate-y-1/2 text-gray-500 transition-transform 
     duration-200 dark:text-gray-400
     ${open ? "rotate-180" : "rotate-0"}
    `}
   />
  </div>
 );
};

export default Select;
