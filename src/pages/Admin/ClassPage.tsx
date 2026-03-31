import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllCategories,
  getAllTerms,
  getProgramsByCategory,
  getAllCoaches,
  getClassPlayers
} from "../../api/adminApi";
import { toast } from "react-hot-toast";
import { Edit, Trash, Eye, Users, X, Info, MoreVertical } from "lucide-react";
import TimePicker from "../../components/form/time-picker";

const ClassPage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<any[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State for dropdown management
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    term: "",
    category: "",
    program: "",
    coach: "",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    capacity: 20
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, categoriesData, termsData, coachesData] = await Promise.all([
        getAllClasses().catch(err => { console.error("Classes error", err); return { data: [] }; }),
        getAllCategories().catch(err => { console.error("Categories error", err); return { data: [] }; }),
        getAllTerms().catch(err => { console.error("Terms error", err); return { data: [] }; }),
        getAllCoaches().catch(err => { console.error("Coaches error", err); return { data: [] }; })
      ]);

      const getDataArray = (res: any) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        return [];
      };

      setClasses(getDataArray(classesData));
      setCategories(getDataArray(categoriesData));
      setTerms(getDataArray(termsData));
      setCoaches(getDataArray(coachesData));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "category" && value) {
      try {
        const res = await getProgramsByCategory(value);
        setPrograms(Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []));
      } catch (error) {
        console.error("Error fetching programs by category:", error);
        setPrograms([]);
      }
    }
  };

  const handleTimeChange = (name: string, time: string) => {
    setFormData(prev => ({ ...prev, [name]: time }));
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      term: "",
      category: "",
      program: "",
      coach: "",
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      capacity: 20
    });
    setIsEditing(false);
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      const res = await getClassById(id);
      const cls = res.data || res;

      if (cls.category?._id || cls.category) {
        const catId = cls.category?._id || cls.category;
        const programsRes = await getProgramsByCategory(catId);
        setPrograms(Array.isArray(programsRes) ? programsRes : (programsRes && Array.isArray(programsRes.data) ? programsRes.data : []));
      }

      setFormData({
        name: cls.name || "",
        term: cls.term?._id || cls.term || "",
        category: cls.category?._id || cls.category || "",
        program: cls.program?._id || cls.program || "",
        coach: cls.coach?._id || cls.coach || "",
        dayOfWeek: cls.dayOfWeek || "MONDAY",
        startTime: cls.startTime || "09:00",
        endTime: cls.endTime || "10:00",
        location: cls.location || "",
        capacity: cls.capacity || 20
      });
      setIsEditing(true);
      setSelectedClass(cls);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch class details");
    }
  };

  const handleView = async (id: string) => {
    try {
      setPlayersLoading(true);
      setIsViewModalOpen(true);

      const [classRes, playersRes] = await Promise.all([
        getClassById(id),
        getClassPlayers(id)
      ]);

      setSelectedClass(classRes.data || classRes);
      setAssignedPlayers(playersRes.players || []);
    } catch (error) {
      console.error("View Fetch Error:", error);
      toast.error("Failed to load registry view");
      setIsViewModalOpen(false);
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteClass(id);
      toast.success("Class removed successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete class");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isEditing && selectedClass) {
        await updateClass(selectedClass._id, formData);
        toast.success("Class updated successfully");
      } else {
        await createClass(formData);
        toast.success("Class created successfully");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save class");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <>
      <PageMeta title="CoachMax | Class Management" description="Manage academy schedules and player enrollments" />
      <PageBreadcrumb pageTitle="Training Classes" />

      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Curriculum Schedule</h3>
            <p className="text-xs text-gray-500">Coordinate academy windows and rosters</p>
          </div>
          <Button onClick={handleOpenAdd} size="sm">Create Class</Button>
        </div>

        <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b">
              <TableRow>
                <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Name & Category</TableCell>
                <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Schedule</TableCell>
                <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 uppercase">Coach & Term</TableCell>
                <TableCell isHeader className="font-bold text-xs text-gray-600 py-4 text-center uppercase">Management</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Syncing curriculum schedule...</TableCell></TableRow>
              ) : classes.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500 font-medium italic">No classes identified.</TableCell></TableRow>
              ) : (
                classes.map((cls) => (
                  <TableRow key={cls._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4 text-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 dark:text-white/90">{cls.name}</span>
                        <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-tighter">{cls.category?.name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-700">{cls.dayOfWeek} • {cls.startTime} - {cls.endTime}</span>
                        <span className="text-xs text-gray-500 font-medium italic">{cls.location || "On-site"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">
                          {cls.coach?.fullName || cls.coach?.name || "No Head Coach"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{cls.term?.name || "No Term"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleDropdown(cls._id); }}
                          className="dropdown-toggle p-2 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-gray-100 z-9999"
                        >
                          <MoreVertical size={20} />
                        </button>

                        <Dropdown
                          isOpen={openDropdownId === cls._id}
                          onClose={() => setOpenDropdownId(null)}
                          className="w-44 right-0 mt-8"
                        >
                          <div className="py-1">
                            <DropdownItem onClick={() => { handleView(cls._id); setOpenDropdownId(null); }} className="flex items-center gap-2 hover:text-brand-600">
                              <Eye size={14} className="text-gray-400" /> View Roster
                            </DropdownItem>
                            <DropdownItem onClick={() => { handleOpenEdit(cls._id); setOpenDropdownId(null); }} className="flex items-center gap-2 hover:text-indigo-600">
                              <Edit size={14} className="text-gray-400" /> Modify Class
                            </DropdownItem>
                            <DropdownItem onClick={() => { handleDelete(cls._id); setOpenDropdownId(null); }} className="flex items-center gap-2 text-red-500 hover:bg-red-50">
                              <Trash size={14} className="text-red-400" /> Remove
                            </DropdownItem>
                          </div>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6 lg:p-8">
        <h4 className="text-xl font-bold mb-2 tracking-tight">{isEditing ? "Modify Class" : "Deploy Training Class"}</h4>
        <p className="text-sm text-gray-500 mb-6 font-medium">Coordinate elite academy training windows.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Class Identification</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all" required placeholder="Summer Academy B" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Term</label>
            <select name="term" value={formData.term} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required>
              <option value="">Select Term</option>
              {terms.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Program</label>
            <select name="program" value={formData.program} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required disabled={!formData.category}>
              <option value="">Select Program</option>
              {programs.map(p => <option key={p._id} value={p._id}>{p.name || p.title}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Head Coach</label>
            <select name="coach" value={formData.coach} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Coach</option>
              {coaches.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName || c.name || "N/A"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Training Day</label>
            <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required>
              {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all" required />
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all" placeholder="Center Field" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Start Time</label>
            <TimePicker value={formData.startTime} onChange={(time) => handleTimeChange("startTime", time)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">End Time</label>
            <TimePicker value={formData.endTime} onChange={(time) => handleTimeChange("endTime", time)} />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-gray-50">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel Workflow</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Committing..." : "Deploy Class"}</Button>
          </div>
        </form>
      </Modal>

      {/* COMPREHENSIVE VIEW MODAL (Combined) */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} className="max-w-[750px] p-0 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 lg:p-8 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 tracking-tight">Class Registry Information</h4>
              <p className="text-xs text-gray-500 font-medium">Session logistics and player rosters</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)} className="h-8 w-8 p-0 rounded-full border-gray-200"><X size={16} /></Button>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {selectedClass && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-2 lg:col-span-1 border-r border-gray-50 pr-4">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] block mb-1">Session ID</span>
                  <span className="text-sm font-bold text-gray-900">{selectedClass.name}</span>
                </div>
                <div className="border-r border-gray-50 pr-4">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] block mb-1">Schedule</span>
                  <span className="text-sm font-bold text-gray-700">{selectedClass.dayOfWeek}</span>
                  <span className="block text-[10px] font-bold text-brand-500 mt-1">{selectedClass.startTime} - {selectedClass.endTime}</span>
                </div>
                <div className="border-r border-gray-50 pr-4">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] block mb-1">Classification</span>
                  <span className="text-sm font-bold text-gray-900">{selectedClass.category?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] block mb-1">Instruction</span>
                  <span className="text-sm font-bold text-gray-900 truncate block">{selectedClass.coach?.fullName || selectedClass.coach?.name || "No Coach"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-brand-500" />
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-widest underline decoration-brand-500 decoration-2 underline-offset-4">Active Roster</h5>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-4 py-1 rounded-full shadow-sm">
                {assignedPlayers.length} Members Identifed
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 font-medium">
                  <TableRow>
                    <TableCell isHeader className="font-bold text-[10px] uppercase text-gray-400 py-4 tracking-widest pl-6">Participant</TableCell>
                    <TableCell isHeader className="font-bold text-[10px] uppercase text-gray-400 py-4 tracking-widest">Contact Access</TableCell>
                    <TableCell isHeader className="font-bold text-[10px] uppercase text-gray-400 py-4 tracking-widest text-center pr-6">Operational Stats</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-50">
                  {playersLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-xs font-bold text-gray-400">Syncing academy records...</TableCell></TableRow>
                  ) : assignedPlayers.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-xs text-gray-400 font-medium italic">No player assignments located.</TableCell></TableRow>
                  ) : (
                    assignedPlayers.map((player) => (
                      <TableRow key={player._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-[10px] shadow-lg shadow-gray-200">
                              {player.jerseyNumber || "—"}
                            </div>
                            <span className="text-xs font-bold text-gray-800">{player.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-500 font-medium lowercase italic underline decoration-gray-200">{player.email}</span>
                            <span className="text-[10px] text-brand-600 font-extrabold tracking-tight">{player.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase">{player.preferredFoot}</span>
                            <div className="w-[1px] h-3 bg-gray-100"></div>
                            <span className="px-2 py-1 bg-brand-50 rounded text-[9px] font-bold text-brand-700 tracking-tighter">LVL {player.skillLevel}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button onClick={() => setIsViewModalOpen(false)} className="px-12 h-12 font-bold uppercase tracking-widest text-[11px] rounded-xl">Dismiss View</Button>
        </div>
      </Modal>
    </>
  );
};

export default ClassPage;
