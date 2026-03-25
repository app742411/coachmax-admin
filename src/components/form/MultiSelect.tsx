import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";

interface MultiSelectOption {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options = [],
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);


  //  CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    if (onChange) onChange(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (value: string) => {
    const newSelected = (selectedOptions as string[]).includes(value)
      ? (selectedOptions as string[]).filter((v) => v !== value)
      : [...(selectedOptions as string[]), value];

    updateSelection(newSelected);
  };

  const removeOption = (value: string) => {
    updateSelection((selectedOptions as string[]).filter((v) => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;

      case "Escape":
        setIsOpen(false);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}

      <div className="relative inline-block w-full">
        {/* SELECTED BOX */}
        <div
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          className={`mb-2 flex min-h-11 rounded-lg border border-gray-300
           py-1.5 pl-3 pr-3 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 
           ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
        >
          {/* SELECTED TAGS */}
          <div className="flex flex-wrap flex-auto gap-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((value) => {
                const option = options.find((o) => o.value === value);
                const text = option?.text || value;

                return (
                  <div
                    key={value}
                    className="group flex items-center rounded-full
                    bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800
                    dark:bg-gray-800 dark:text-white/90"
                  >
                    {text}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) removeOption(value);
                      }}
                      className="pl-2 text-gray-500 hover:text-gray-400"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="w-full p-1 text-sm text-gray-400 dark:text-gray-500">
                {placeholder}
              </div>
            )}
          </div>

          {/* DROPDOWN ICON */}
          <div className="flex items-center">
            <ChevronDownIcon size={16}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}

            >

            </ChevronDownIcon>
          </div>
        </div>

        {/* OPTIONS DROPDOWN */}
        {isOpen && (
          <div
            className="absolute left-0 z-40 w-full max-h-60 overflow-y-auto bg-white rounded-lg shadow dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          >
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.value);

              return (
                <div
                  key={option.value}
                  className={`p-2 cursor-pointer 
            ${isSelected ? "bg-blue-50 dark:bg-gray-700" : ""}
            hover:bg-blue-100 dark:hover:bg-gray-800`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.text}   {/* FIX: Use label instead of text */}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MultiSelect;
