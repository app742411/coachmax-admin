import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  icon?: LucideIcon;
  iconSize?: number;
  triggerClassName?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  icon: Icon,
  iconSize = 14,
  triggerClassName,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => String(opt.value) === String(selectedValue));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    setInternalValue(val);
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={triggerClassName || `h-11 w-full flex items-center justify-between appearance-none rounded-none border px-4 py-2.5 text-sm shadow-theme-xs outline-hidden focus:outline-hidden focus:ring-3 bg-white dark:bg-gray-900 text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800 transition-all ${disabled ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" : "cursor-pointer group"}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={iconSize} className="text-gray-400 shrink-0 group-hover:text-brand-500 transition-colors" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
          </span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Select Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 min-w-full mt-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-none overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-1">
            {options.map((option, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelect(String(option.value))}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors
                    ${
                      String(selectedValue) === String(option.value)
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {option.label}
                </button>
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-4 py-3 text-xs text-center text-gray-400">
                No options
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
