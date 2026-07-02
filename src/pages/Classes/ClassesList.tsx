import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../api/apiClient";
import ClassFilters from "../../components/classes/ClassFilters";
import ClassTable from "../../components/classes/ClassTable";

interface ClassItem {
  _id: string;
  name: string;
  trainingType: string;
  sessionDuration: number;
  status: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  term?: { name: string; year: number };
  program?: { name: string };
  category?: { name: string };
  coach?: { name: string };
  players?: any[];
}

export default function ClassesList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchClasses = async () => {
    try {
      const response = await apiClient.get("/api/admin/getAllClasses");
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      const fetchDropdowns = async () => {
        try {
          const [termsRes, catRes, coachRes] = await Promise.all([
            apiClient.get("/api/admin/getAllTerms"),
            apiClient.get("/api/user/getCategories"),
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
  }, [isModalOpen]);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/admin/createClass", formData);
      setIsModalOpen(false);
      setFormData({
        name: "", term: "", category: "", program: "", coach: "",
        dayOfWeek: "MONDAY", startTime: "", endTime: "", location: "", capacity: 20
      });
      setIsLoading(true);
      fetchClasses();
    } catch (error) {
      console.error("Failed to create class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.program?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Classes Management | CoachMax" description="Manage your classes" />
      
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classes Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#0047FF]">Classes Management</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-[#0047FF] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-theme-xs"
          >
            + Add Class
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 items-start w-full">
        <div className="flex-1 w-full min-w-0">
          <ClassFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ClassTable 
            classes={filteredClasses}
            isLoading={isLoading}
            onEditClass={() => { /* TODO: handle edit */ }}
          />
        </div>
      </div>



        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Class</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Class Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Summer Class A"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Term <span className="text-red-500">*</span></label>
                      <select required name="term" value={formData.term} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700">
                        <option value="">Select Term</option>
                        {terms.map(t => <option key={t._id} value={t._id}>{t.name} ({t.year})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Category <span className="text-red-500">*</span></label>
                      <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Program <span className="text-red-500">*</span></label>
                      <select required name="program" value={formData.program} onChange={handleChange} disabled={!formData.category} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700 disabled:opacity-50">
                        <option value="">Select Program</option>
                        {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Coach <span className="text-red-500">*</span></label>
                      <select required name="coach" value={formData.coach} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700">
                        <option value="">Select Coach</option>
                        {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Day of Week <span className="text-red-500">*</span></label>
                      <select required name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700">
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
                      <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">End Time <span className="text-red-500">*</span></label>
                      <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Location <span className="text-red-500">*</span></label>
                      <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Petrie Terrace" className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Capacity <span className="text-red-500">*</span></label>
                      <input required type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-transparent dark:border-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-[#0047FF] hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors shadow-sm">
                    {isSubmitting ? "Saving..." : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
}
