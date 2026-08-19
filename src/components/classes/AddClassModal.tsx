import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { getTermsUrl } from "../../api/adminApi";
import TimePicker from "../form/time-picker";
import {
  X,
  Calendar,
  LayoutGrid,
  FileText,
  User,
  Clock,
  MapPin,
  Users,
  ClipboardList,
  Tag,
  ChevronDown
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

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classToEdit?: any;
  prefilledCategoryId?: string;
  prefilledProgramId?: string;
  prefilledDayOfWeek?: string;
  prefilledTermId?: string;
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
}: AddClassModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [terms, setTerms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchDropdowns = async () => {
        try {
          const [termsRes, catRes, coachRes] = await Promise.all([
            apiClient.get(getTermsUrl(), { params: { isEvent: "all" } }),
            apiClient.get("/api/user/getCategories", { params: { isEvent: "all" } }),
            apiClient.get("/api/admin/getAllCoaches")
          ]);

          if (termsRes.data?.data) setTerms(termsRes.data.data);
          if (catRes.data && Array.isArray(catRes.data)) setCategories(catRes.data);

          const coachesData = coachRes.data?.data || coachRes.data?.coaches || coachRes.data;
          if (Array.isArray(coachesData)) setCoaches(coachesData);
        } catch (err) {
          console.error("Failed to load dropdown data:", err);
        }
      };
      fetchDropdowns();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && classToEdit) {
      setFormData({
        name: classToEdit.name || "",
        term: classToEdit.term?._id || classToEdit.term || "",
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
    } else if (isOpen) {
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
    }
  }, [isOpen, classToEdit, prefilledCategoryId, prefilledProgramId, prefilledDayOfWeek, prefilledTermId]);

  useEffect(() => {
    if (formData.category) {
      const fetchPrograms = async () => {
        try {
          const res = await apiClient.get(`/api/user/getProgramsByCategory/${formData.category}`);
          if (res.data && Array.isArray(res.data)) {
            setPrograms(res.data);
            if (res.data.length > 0 && !res.data.find(p => p._id === formData.program)) {
              setFormData(prev => ({ ...prev, program: res.data[0]._id }));
            }
          }
        } catch (err) {
          console.error("Failed to fetch programs:", err);
        }
      };
      fetchPrograms();
    } else {
      setPrograms([]);
    }
  }, [formData.category]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startTime: convertTo24Hour(formData.startTime),
        endTime: convertTo24Hour(formData.endTime),
      };
      if (classToEdit) {
        await apiClient.put(`/api/admin/updateClass/${classToEdit._id}`, payload);
      } else {
        await apiClient.post("/api/admin/createClass", payload);
      }
      onClose();
      setFormData({
        name: "", term: "", category: "", program: "", coach: "",
        dayOfWeek: "MONDAY", startTime: "", endTime: "", location: "", capacity: 20,
        price: 0
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-none w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-300">

        {/* Header Section */}
        <div className="relative overflow-hidden bg-[#0A1930] px-6 py-4 xl:px-8 xl:py-6 text-white border-l-[6px] border-[#0047FF]">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 text-white">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  {/* Hexagon pattern of soccer ball */}
                  <path d="M12 9l2.5 1.8.8 2.7-2.3 2-2 0-1.5-1.5.8-2.7z" fill="currentColor" fillOpacity="0.15" />
                  <path d="M12 9V2M14.5 10.8l5.5-1.8M15.3 13.5l5.2 2.5M13 15.5l2 6.5M11 15.5l-2 6.5M8.7 13.5L3.5 16M9.5 10.8l-5.5-1.8" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">
                  {classToEdit ? "Edit Training Class" : "Create Training Class"}
                </h3>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  Schedule and manage academy training sessions
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 xl:p-8 space-y-5 xl:space-y-6">

            {/* CLASS INFORMATION SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-none bg-[#0A1930] text-white">
                  <ClipboardList className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                  Class Information
                </span>
                <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
              </div>

              {/* Class Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Tag className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Summer Class A"
                    className="w-full pl-11 pr-4 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Term, Category, Program */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Term */}
                <div className="space-y-1.5">
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
                      className="w-full pl-11 pr-10 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all"
                    >
                      <option value="">Select Term</option>
                      {(() => {
                        const selectedCatObj = categories.find(c => c._id === formData.category);
                        const selectedCatIsEvent = selectedCatObj ? !!selectedCatObj.isEvent : false;
                        const filtered = terms.filter(t => {
                          if (!formData.category) return true;
                          return !!t.isEvent === selectedCatIsEvent;
                        });
                        return filtered.map(t => <option key={t._id} value={t._id}>{t.name} ({t.year})</option>);
                      })()}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4.5 h-4.5" />
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
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
                      className="w-full pl-11 pr-10 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4.5 h-4.5" />
                    </span>
                  </div>
                </div>

                {/* Program */}
                <div className="space-y-1.5">
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
                      className="w-full pl-11 pr-10 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all disabled:opacity-60"
                    >
                      <option value="">Select Program</option>
                      {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4.5 h-4.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Coach (Aligned Left, Spanning 2/3 Width) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="col-span-1 md:col-span-2 space-y-1.5">
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
                      className="w-full pl-11 pr-10 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all"
                    >
                      <option value="">Select Coach</option>
                      {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4.5 h-4.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCHEDULE SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-none bg-[#0A1930] text-white">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                  Schedule
                </span>
                <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
              </div>

              {/* Day, Start, End */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      className="w-full pl-11 pr-10 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 appearance-none transition-all"
                    >
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown className="w-4.5 h-4.5" />
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
            </div>

            {/* LOCATION & CAPACITY SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-none bg-[#0A1930] text-white">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-[#0A1930] dark:text-white tracking-wider uppercase">
                  Location & Capacity
                </span>
                <div className="flex-1 border-b border-gray-200 dark:border-gray-800 ml-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Location */}
                <div className="space-y-1.5">
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
                      placeholder="e.g. Petrie Terrace"
                      className="w-full pl-11 pr-4 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
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
                      className="w-full pl-11 pr-4 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all"
                    />
                  </div>
                </div>

                {/* Class Fee */}
                <div className="space-y-1.5">
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
                      className="w-full pl-11 pr-4 py-2.5 h-[46px] text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] text-gray-800 dark:text-gray-200 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 xl:px-8 xl:py-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 rounded-none">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0047FF] hover:bg-[#003BE6] rounded-none disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 9l2.5 1.8.8 2.7-2.3 2-2 0-1.5-1.5.8-2.7z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 9V2M14.5 10.8l5.5-1.8M15.3 13.5l5.2 2.5M13 15.5l2 6.5M11 15.5l-2 6.5M8.7 13.5L3.5 16M9.5 10.8l-5.5-1.8" />
              </svg>
              {isSubmitting ? "Saving..." : classToEdit ? "Update Class" : "Create Class"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
