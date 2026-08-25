import { useState, useEffect, useMemo } from "react";
import apiClient from "../../api/apiClient";
import { useTerms } from "../../hooks/useTerms";
import { useCategories } from "../../hooks/useCategories";
import { useProgramsByCategory } from "../../hooks/usePrograms";
import TimePicker from "../form/time-picker";
import toast from "react-hot-toast";
import {
  X,
  Calendar,
  LayoutGrid,
  FileText,
  User,
  Clock,
  MapPin,
  Users,
  ChevronDown,
  Plus,
  Trash2,
  CalendarDays,
  Sparkles
} from "lucide-react";

const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr) return "";
  const ampmRegex = /([0-9]{1,2}):([0-9]{2})\s*(AM|PM)/i;
  const match = timeStr.match(ampmRegex);
  if (!match) return timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const hoursStr = hours.toString().padStart(2, "0");
  return `${hoursStr}:${minutes}`;
};

export type ScheduleType = "SINGLE_DAY" | "WEEKDAYS" | "CUSTOM";

export interface CustomScheduleSlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classToEdit?: any;
  prefilledCategoryId?: string;
  prefilledProgramId?: string;
  prefilledDayOfWeek?: string;
  prefilledTermId?: string;
  prefilledYear?: string;
}

export default function AddClassModal({
  isOpen,
  onClose,
  onSuccess,
  classToEdit,
  prefilledCategoryId,
  prefilledProgramId,
  prefilledDayOfWeek,
  prefilledTermId,
  prefilledYear,
}: AddClassModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("SINGLE_DAY");
  const [selectedYear, setSelectedYear] = useState<string>(prefilledYear || "");

  const [formData, setFormData] = useState({
    name: "",
    term: "",
    category: "",
    program: "",
    coach: "",
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 20,
    price: 0,
  });

  const [customSchedules, setCustomSchedules] = useState<CustomScheduleSlot[]>([
    { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
    { dayOfWeek: "WEDNESDAY", startTime: "", endTime: "" },
  ]);

  const [bulkStartTime, setBulkStartTime] = useState("");
  const [bulkEndTime, setBulkEndTime] = useState("");

  const handleApplyTimeToAll = () => {
    if (!bulkStartTime && !bulkEndTime) {
      toast.error("Please select a start time or end time to apply");
      return;
    }
    setCustomSchedules(prev =>
      prev.map(slot => ({
        ...slot,
        startTime: bulkStartTime || slot.startTime,
        endTime: bulkEndTime || slot.endTime,
      }))
    );
    toast.success("Applied timing to all days");
  };

  const handleApplySlotTimeToAll = (sourceIndex: number) => {
    const sourceSlot = customSchedules[sourceIndex];
    if (!sourceSlot.startTime && !sourceSlot.endTime) {
      toast.error("Please enter a start or end time for this day first");
      return;
    }
    setCustomSchedules(prev =>
      prev.map(slot => ({
        ...slot,
        startTime: sourceSlot.startTime || slot.startTime,
        endTime: sourceSlot.endTime || slot.endTime,
      }))
    );
    toast.success(`Applied Day #${sourceIndex + 1} timing to all days`);
  };

  const { terms: allTerms } = useTerms({ isEvent: "all" }, { enabled: isOpen });
  const { terms } = useTerms(
    { year: selectedYear || undefined, isEvent: "all" },
    { enabled: isOpen }
  );

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsFromTerms = (allTerms || [])
      .map(t => t.year?.toString())
      .filter(Boolean) as string[];
    const set = new Set([
      (currentYear + 1).toString(),
      currentYear.toString(),
      (currentYear - 1).toString(),
      ...yearsFromTerms
    ]);
    return Array.from(set).sort().reverse();
  }, [allTerms]);

  const { categories } = useCategories({ isEvent: "all" });
  const { programs } = useProgramsByCategory(formData.category, { enabled: isOpen && !!formData.category });
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCoaches = async () => {
        try {
          const coachRes = await apiClient.get("/api/admin/getAllCoaches");
          const coachesData = coachRes.data?.data || coachRes.data?.coaches || coachRes.data;
          if (Array.isArray(coachesData)) setCoaches(coachesData);
        } catch (err) {
          console.error("Failed to load coaches data:", err);
        }
      };
      fetchCoaches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && classToEdit) {
      const detectedScheduleType: ScheduleType =
        classToEdit.scheduleType ||
        (Array.isArray(classToEdit.schedule) && classToEdit.schedule.length > 1 ? "CUSTOM" : "SINGLE_DAY");

      setScheduleType(detectedScheduleType);

      const termId = classToEdit.term?._id || classToEdit.term || "";
      const termYear = classToEdit.term?.year || allTerms.find(t => t._id === termId)?.year;
      if (termYear) {
        setSelectedYear(termYear.toString());
      }

      setFormData({
        name: classToEdit.name || "",
        term: termId,
        category: classToEdit.category?._id || classToEdit.category || "",
        program: classToEdit.program?._id || classToEdit.program || "",
        coach: classToEdit.coach?._id || classToEdit.coach || "",
        dayOfWeek: classToEdit.dayOfWeek || "MONDAY",
        startTime: classToEdit.startTime || "",
        endTime: classToEdit.endTime || "",
        location: classToEdit.location || "",
        capacity: classToEdit.capacity || 20,
        price: classToEdit.price || classToEdit.ClassFee || 0,
      });

      if (Array.isArray(classToEdit.schedule) && classToEdit.schedule.length > 0) {
        setCustomSchedules(
          classToEdit.schedule.map((s: any) => ({
            dayOfWeek: s.dayOfWeek || "MONDAY",
            startTime: s.startTime || "",
            endTime: s.endTime || "",
          }))
        );
      } else {
        setCustomSchedules([
          { dayOfWeek: classToEdit.dayOfWeek || "MONDAY", startTime: classToEdit.startTime || "", endTime: classToEdit.endTime || "" }
        ]);
      }
    } else if (isOpen) {
      setScheduleType("SINGLE_DAY");
      if (prefilledYear) {
        setSelectedYear(prefilledYear);
      } else if (prefilledTermId) {
        const found = allTerms.find(t => t._id === prefilledTermId);
        if (found?.year) setSelectedYear(found.year.toString());
      } else {
        setSelectedYear("");
      }

      setFormData({
        name: "",
        term: prefilledTermId || "",
        category: prefilledCategoryId || "",
        program: prefilledProgramId || "",
        coach: "",
        dayOfWeek: prefilledDayOfWeek || "MONDAY",
        startTime: "",
        endTime: "",
        location: "",
        capacity: 20,
        price: 0,
      });
      setCustomSchedules([
        { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
        { dayOfWeek: "WEDNESDAY", startTime: "", endTime: "" },
      ]);
    }
  }, [isOpen, classToEdit, prefilledCategoryId, prefilledProgramId, prefilledDayOfWeek, prefilledTermId, prefilledYear, allTerms]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    if (formData.term && newYear) {
      const currentTermObj = allTerms.find(t => t._id === formData.term);
      if (currentTermObj && currentTermObj.year && currentTermObj.year.toString() !== newYear) {
        setFormData(prev => ({ ...prev, term: "" }));
      }
    }
  };

  useEffect(() => {
    if (formData.category) {
      if (programs && programs.length > 0 && !programs.find(p => p._id === formData.program)) {
        setFormData(prev => ({ ...prev, program: programs[0]._id }));
      }
    } else {
      setFormData(prev => ({ ...prev, program: "" }));
    }
  }, [formData.category, programs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => {
        const updated = {
          ...prev,
          [name]: (name === "capacity" || name === "price") ? Number(value) : value
        };
        if (name === "category") {
          updated.term = "";
          updated.program = "";
        }
        return updated;
      });
    }
  };

  const handleCustomSlotChange = (index: number, field: keyof CustomScheduleSlot, value: string) => {
    setCustomSchedules(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addCustomSlot = () => {
    setCustomSchedules(prev => [
      ...prev,
      { dayOfWeek: "FRIDAY", startTime: "", endTime: "" }
    ]);
  };

  const removeCustomSlot = (index: number) => {
    if (customSchedules.length <= 1) {
      toast.error("At least one schedule slot is required for custom scheduling");
      return;
    }
    setCustomSchedules(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation based on scheduleType
    if (scheduleType === "SINGLE_DAY") {
      if (!formData.dayOfWeek) {
        toast.error("Please select a day of week");
        return;
      }
      if (!formData.startTime || !formData.endTime) {
        toast.error("Please enter both start and end times");
        return;
      }
    } else if (scheduleType === "WEEKDAYS") {
      if (!formData.startTime || !formData.endTime) {
        toast.error("Please enter both start and end times for weekdays");
        return;
      }
    } else if (scheduleType === "CUSTOM") {
      if (customSchedules.length === 0) {
        toast.error("Please add at least one schedule slot");
        return;
      }
      for (let i = 0; i < customSchedules.length; i++) {
        const slot = customSchedules[i];
        if (!slot.dayOfWeek || !slot.startTime || !slot.endTime) {
          toast.error(`Please complete Day, Start Time, and End Time for slot #${i + 1}`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const basePayload: any = {
        name: formData.name,
        term: formData.term,
        program: formData.program,
        category: formData.category,
        location: formData.location,
        coach: formData.coach,
        capacity: Number(formData.capacity) || 20,
        price: Number(formData.price) || 0,
        scheduleType: scheduleType,
      };

      let payload: any;

      if (scheduleType === "SINGLE_DAY") {
        payload = {
          ...basePayload,
          dayOfWeek: formData.dayOfWeek,
          startTime: convertTo24Hour(formData.startTime),
          endTime: convertTo24Hour(formData.endTime),
        };
      } else if (scheduleType === "WEEKDAYS") {
        // Weekdays requires only startTime and endTime. No dayOfWeek or schedule.
        payload = {
          ...basePayload,
          startTime: convertTo24Hour(formData.startTime),
          endTime: convertTo24Hour(formData.endTime),
        };
      } else if (scheduleType === "CUSTOM") {
        // Custom sends schedule array
        payload = {
          ...basePayload,
          schedule: customSchedules.map(s => ({
            dayOfWeek: s.dayOfWeek,
            startTime: convertTo24Hour(s.startTime),
            endTime: convertTo24Hour(s.endTime),
          })),
        };
      }

      if (classToEdit) {
        await apiClient.put(`/api/admin/updateClass/${classToEdit._id}`, payload);
        toast.success("Class updated successfully");
      } else {
        await apiClient.post("/api/admin/createClass", payload);
        toast.success("Class created successfully");
      }

      onClose();
      setFormData({
        name: "", term: "", category: "", program: "", coach: "",
        dayOfWeek: "MONDAY", startTime: "", endTime: "", location: "", capacity: 20,
        price: 0
      });
      onSuccess();
    } catch (error: any) {
      console.error("Failed to save class:", error);
      toast.error(error?.response?.data?.message || "Failed to save class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-none w-full max-w-5xl xl:max-w-[1240px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800">

        {/* Header Section (Sticky) */}
        <div className="relative overflow-hidden bg-[#0A1930] px-6 py-4 xl:px-8 xl:py-5 text-white border-l-[6px] border-[#0047FF] shrink-0">
          {/* Faint Pitch Schematic Background */}
          <svg className="absolute right-0 top-0 h-full w-auto opacity-10 pointer-events-none text-white/70" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="2" y="2" width="116" height="76" rx="2" />
            <line x1="60" y1="2" x2="60" y2="78" />
            <circle cx="60" cy="40" r="15" />
            <circle cx="60" cy="40" r="1" fill="currentColor" />
            <path d="M 2 20 L 18 20 L 18 60 L 2 60" />
            <path d="M 118 20 L 102 20 L 102 60 L 118 60" />
            <path d="M 2 28 L 8 28 L 8 52 L 2 52" />
            <path d="M 118 28 L 112 28 L 112 52 L 118 52" />
          </svg>

          {/* Dotted Grid Accent */}
          <div className="absolute right-6 bottom-4 grid grid-cols-5 gap-1 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#0047FF]" />
            ))}
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/5 text-white">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 9l2.5 1.8.8 2.7-2.3 2-2 0-1.5-1.5.8-2.7z" fill="currentColor" fillOpacity="0.15" />
                  <path d="M12 9V2M14.5 10.8l5.5-1.8M15.3 13.5l5.2 2.5M13 15.5l2 6.5M11 15.5l-2 6.5M8.7 13.5L3.5 16M9.5 10.8l-5.5-1.8" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg xl:text-xl font-bold tracking-wide text-white">
                  {classToEdit ? "Edit Training Class" : "Create Training Class"}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5 font-medium">
                  Schedule and manage academy training sessions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form id="create-class-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 xl:p-8 space-y-6 custom-scrollbar">

          {/* BASIC INFORMATION SECTION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-none bg-[#0A1930] text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                Basic Information
              </span>
              <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
              {/* Class Name */}
              <div className="space-y-1.5 md:col-span-1 lg:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <LayoutGrid className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. U-12 Development Squad"
                    className="w-full pl-11 pr-4 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="space-y-1.5 md:col-span-1 lg:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <CalendarDays className="w-5 h-5" />
                  </span>
                  <select
                    name="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all cursor-pointer"
                  >
                    <option value="">All Years</option>
                    {availableYears.map((y: string) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Term */}
              <div className="space-y-1.5 md:col-span-1 lg:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Term <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <select
                    required
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select Term</option>
                    {terms
                      .filter(t => {
                        if (!formData.category) return true;
                        const activeCat = categories.find(c => c._id === formData.category);
                        const isEventCat = activeCat ? !!activeCat.isEvent : false;
                        return !!t.isEvent === isEventCat;
                      })
                      .map(t => (
                        <option key={t._id} value={t._id}>
                          {t.name} {t.year ? `(${t.year})` : ""}
                        </option>
                      ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <LayoutGrid className="w-5 h-5" />
                  </span>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Program */}
              <div className="space-y-1.5 md:col-span-1 lg:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FileText className="w-5 h-5" />
                  </span>
                  <select
                    required
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Coach */}
              <div className="space-y-1.5 md:col-span-1 lg:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Coach <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <User className="w-5 h-5" />
                  </span>
                  <select
                    required
                    name="coach"
                    value={formData.coach}
                    onChange={handleChange}
                    className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select Coach</option>
                    {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SCHEDULE SECTION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-none bg-[#0A1930] text-white">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                Schedule Type & Timings
              </span>
              <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
            </div>

            {/* Schedule Type Segmented Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: SINGLE_DAY */}
              <button
                type="button"
                onClick={() => setScheduleType("SINGLE_DAY")}
                className={`p-3 text-left border rounded-none transition-all cursor-pointer flex flex-col justify-between ${
                  scheduleType === "SINGLE_DAY"
                    ? "border-[#0047FF] bg-blue-50/60 dark:bg-blue-950/30 text-[#0047FF] shadow-xs"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Single Day</span>
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  1 specific day & time slot
                </p>
              </button>

              {/* Option 2: WEEKDAYS */}
              <button
                type="button"
                onClick={() => setScheduleType("WEEKDAYS")}
                className={`p-3 text-left border rounded-none transition-all cursor-pointer flex flex-col justify-between ${
                  scheduleType === "WEEKDAYS"
                    ? "border-[#0047FF] bg-blue-50/60 dark:bg-blue-950/30 text-[#0047FF] shadow-xs"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Weekdays</span>
                  <CalendarDays className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Monday to Friday automatic
                </p>
              </button>

              {/* Option 3: CUSTOM */}
              <button
                type="button"
                onClick={() => setScheduleType("CUSTOM")}
                className={`p-3 text-left border rounded-none transition-all cursor-pointer flex flex-col justify-between ${
                  scheduleType === "CUSTOM"
                    ? "border-[#0047FF] bg-blue-50/60 dark:bg-blue-950/30 text-[#0047FF] shadow-xs"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Custom</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Multiple days & custom times
                </p>
              </button>
            </div>

            {/* 1. SINGLE_DAY Form Fields */}
            {scheduleType === "SINGLE_DAY" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5 pt-1">
                {/* Day of Week */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Day of Week <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <select
                      required
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleChange}
                      className="w-full pl-11 pr-9 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all cursor-pointer"
                    >
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Start Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.startTime}
                    onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                    placeholder="Select start time"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.endTime}
                    onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                    placeholder="Select end time"
                  />
                </div>
              </div>
            )}

            {/* 2. WEEKDAYS Form Fields */}
            {scheduleType === "WEEKDAYS" && (
              <div className="space-y-3 pt-1">
                <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4.5 h-4.5 text-[#0047FF] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      This class will automatically run every <strong className="text-[#0047FF]">Monday, Tuesday, Wednesday, Thursday, & Friday</strong> with the times specified below:
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5 pt-1">
                  {/* Start Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Start Time (Monday - Friday) <span className="text-red-500">*</span>
                    </label>
                    <TimePicker
                      value={formData.startTime}
                      onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                      placeholder="Select start time"
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      End Time (Monday - Friday) <span className="text-red-500">*</span>
                    </label>
                    <TimePicker
                      value={formData.endTime}
                      onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                      placeholder="Select end time"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. CUSTOM Form Fields */}
            {scheduleType === "CUSTOM" && (
              <div className="space-y-3.5 pt-1">
                {/* Apply time to all bar */}
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#0047FF] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                        Apply Time to All Days
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Set start & end time here to auto-fill all day slots
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-[125px]">
                      <TimePicker
                        value={bulkStartTime}
                        onChange={(time) => setBulkStartTime(time)}
                        placeholder="Start time"
                      />
                    </div>
                    <span className="text-slate-400 text-xs font-bold">-</span>
                    <div className="w-[125px]">
                      <TimePicker
                        value={bulkEndTime}
                        onChange={(time) => setBulkEndTime(time)}
                        placeholder="End time"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyTimeToAll}
                      className="px-3.5 py-2.5 h-[44px] text-xs font-bold bg-[#0047FF] hover:bg-blue-700 text-white transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply to All</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Configure individual days and their corresponding timings:
                  </span>
                  <button
                    type="button"
                    onClick={addCustomSlot}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0047FF] hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Day
                  </button>
                </div>

                {/* 2-Column Responsive Custom Schedules Grid in Landscape Mode */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                  {customSchedules.map((slot, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                    >
                      {/* Day of Week */}
                      <div className="sm:col-span-5 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                            Day #{index + 1} <span className="text-red-500">*</span>
                          </label>
                          {index === 0 && customSchedules.length > 1 && (slot.startTime || slot.endTime) && (
                            <button
                              type="button"
                              onClick={() => handleApplySlotTimeToAll(index)}
                              className="text-[10px] font-semibold text-[#0047FF] hover:underline cursor-pointer"
                            >
                              Copy to all
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            required
                            value={slot.dayOfWeek}
                            onChange={(e) => handleCustomSlotChange(index, "dayOfWeek", e.target.value)}
                            className="w-full px-3 pr-8 py-2 h-[44px] text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none font-bold cursor-pointer"
                          >
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                            <option value="SATURDAY">Saturday</option>
                            <option value="SUNDAY">Sunday</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Start Time */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                          Start <span className="text-red-500">*</span>
                        </label>
                        <TimePicker
                          value={slot.startTime}
                          onChange={(time) => handleCustomSlotChange(index, "startTime", time)}
                          placeholder="Start time"
                        />
                      </div>

                      {/* End Time */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                          End <span className="text-red-500">*</span>
                        </label>
                        <TimePicker
                          value={slot.endTime}
                          onChange={(time) => handleCustomSlotChange(index, "endTime", time)}
                          placeholder="End time"
                        />
                      </div>

                      {/* Action Remove */}
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeCustomSlot(index)}
                          disabled={customSchedules.length <= 1}
                          className="h-[44px] w-[44px] inline-flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800/50 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                          title="Remove slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LOCATION & CAPACITY SECTION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-none bg-[#0A1930] text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                Location & Capacity
              </span>
              <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5">
              {/* Location */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Hall A / Petrie Terrace"
                    className="w-full pl-11 pr-4 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Users className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full pl-11 pr-4 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all"
                  />
                </div>
              </div>

              {/* Class Fee */}
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Class Fee ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-bold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-2.5 h-[44px] text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Section (Sticky at bottom) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 xl:px-8 xl:py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="submit"
            form="create-class-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#0047FF] hover:bg-[#003BE6] rounded-none disabled:opacity-50 transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 9l2.5 1.8.8 2.7-2.3 2-2 0-1.5-1.5.8-2.7z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 9V2M14.5 10.8l5.5-1.8M15.3 13.5l5.2 2.5M13 15.5l2 6.5M11 15.5l-2 6.5M8.7 13.5L3.5 16M9.5 10.8l-5.5-1.8" />
            </svg>
            {isSubmitting ? "Saving..." : classToEdit ? "Update Class" : "Create Class"}
          </button>
        </div>

      </div>
    </div>
  );
}
