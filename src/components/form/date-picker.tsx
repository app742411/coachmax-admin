import { useEffect, useId } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { toDateOnly, dateOnlyToLocalDate } from "../../utils/dateTime";

type PropsType = {
  id?: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  options?: flatpickr.Options.Options;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  options,
}: PropsType) {
  const generatedId = useId();
  const inputId = id || `date-picker-${generatedId.replace(/:/g, "")}`;
  useEffect(() => {
    const element = document.getElementById(inputId);
    if (!element) return;
    const normalizedDefault = typeof defaultDate === "string" && toDateOnly(defaultDate)
      ? dateOnlyToLocalDate(defaultDate) || undefined : defaultDate;
    const flatPickr = flatpickr(element, {
      mode: mode || "single",
      static: false,
      monthSelectorType: "static",
      disableMobile: true,
      defaultDate: normalizedDefault,
      onChange,
      ...options,
      // UI format is fixed; integrations continue receiving ISO calendar dates.
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      locale: { ...(typeof options?.locale === "object" ? options.locale : {}), firstDayOfWeek: 1 },
    });
    if (!Array.isArray(flatPickr) && flatPickr.altInput) {
      flatPickr.altInput.id = `${inputId}-display`;
      flatPickr.altInput.setAttribute("aria-label", label ? `${label} (DD/MM/YYYY)` : "Date (DD/MM/YYYY)");
    }

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, inputId, defaultDate, options, label]);

  return (
    <div>
      {label && <Label htmlFor={`${inputId}-display`}>{label}</Label>}

      <div className="relative">
        <input
          id={inputId}
          placeholder={placeholder || "DD/MM/YYYY"}
          className="h-11 w-full rounded-none border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
