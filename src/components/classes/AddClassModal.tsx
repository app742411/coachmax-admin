import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import TimePicker from "../form/time-picker";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classToEdit?: any;
}

export default function AddClassModal({ isOpen, onClose, onSuccess, classToEdit }: AddClassModalProps) {
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
            apiClient.get("/api/admin/getAllTerms"),
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
      });
    } else if (isOpen) {
      setFormData({
        name: "", term: "", category: "", program: "", coach: "",
        dayOfWeek: "MONDAY", startTime: "", endTime: "", location: "", capacity: 20
      });
    }
  }, [isOpen, classToEdit]);

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
      setFormData(prev => ({
        ...prev,
        [name]: name === "capacity" ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (classToEdit) {
        await apiClient.put(`/api/admin/updateClass/${classToEdit._id}`, formData);
      } else {
        await apiClient.post("/api/admin/createClass", formData);
      }
      onClose();
      setFormData({
        name: "", term: "", category: "", program: "", coach: "",
        dayOfWeek: "MONDAY", startTime: "", endTime: "", location: "", capacity: 20
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-none w-full max-w-2xl max-h-[90vh] overflow-visible flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {classToEdit ? "Edit Class" : "Add New Class"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-visible">
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Class Name <span className="text-red-500">*</span></label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Summer Class A"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Term <span className="text-red-500">*</span></label>
                <select required name="term" value={formData.term} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700">
                  <option value="">Select Term</option>
                  {terms.map(t => <option key={t._id} value={t._id}>{t.name} ({t.year})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Program <span className="text-red-500">*</span></label>
                <select required name="program" value={formData.program} onChange={handleChange} disabled={!formData.category} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700 disabled:opacity-50">
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Coach <span className="text-red-500">*</span></label>
                <select required name="coach" value={formData.coach} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700">
                  <option value="">Select Coach</option>
                  {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Day of Week <span className="text-red-500">*</span></label>
                <select required name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700">
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                <TimePicker
                  value={formData.startTime}
                  onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                  placeholder="Select start time"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">End Time <span className="text-red-500">*</span></label>
                <TimePicker
                  value={formData.endTime}
                  onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                  placeholder="Select end time"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Location <span className="text-red-500">*</span></label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Petrie Terrace" className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Capacity <span className="text-red-500">*</span></label>
                <input required type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-none bg-transparent dark:border-gray-700" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-[#0047FF] hover:bg-blue-700 rounded-none disabled:opacity-50 transition-colors shadow-sm">
              {isSubmitting ? "Saving..." : classToEdit ? "Update Class" : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
