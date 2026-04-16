import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Edit, Trash, Eye, Users, X, Info, MoreVertical, Calendar, MapPin } from "lucide-react";
import TimePicker from "../../components/form/time-picker";

const ClassPage: React.FC = () => {
  const queryClient = useQueryClient();

  // ── UI State (Modals & Forms) ──────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
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

  // ── Queries ─────────────────────────────────────────────────────

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getAllClasses(),
    refetchInterval: 5000, 
  });
  const classes = Array.isArray(classesData) ? classesData : ((classesData as any)?.data || []);

  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: getAllCategories });
  const categories = Array.isArray(categoriesData) ? categoriesData : ((categoriesData as any)?.data || (categoriesData as any)?.categories || []);

  const { data: termsData } = useQuery({ queryKey: ["terms"], queryFn: getAllTerms });
  const terms = Array.isArray(termsData) ? termsData : ((termsData as any)?.data || []);

  const { data: coachesData } = useQuery({ queryKey: ["coaches"], queryFn: getAllCoaches });
  const coaches = Array.isArray(coachesData) ? coachesData : ((coachesData as any)?.data || []);

  const { data: programsData } = useQuery({
    queryKey: ["programs", formData.category],
    queryFn: () => getProgramsByCategory(formData.category),
    enabled: !!formData.category,
  });
  const programs = Array.isArray(programsData) ? programsData : ((programsData as any)?.data || (programsData as any)?.programs || []);

  const { data: viewClassData, isLoading: viewClassLoading } = useQuery({
    queryKey: ["class", selectedClassId],
    queryFn: () => getClassById(selectedClassId!),
    enabled: !!selectedClassId && isViewModalOpen,
  });
  const selectedClass = viewClassData?.data || viewClassData;

  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["classPlayers", selectedClassId],
    queryFn: () => getClassPlayers(selectedClassId!),
    enabled: !!selectedClassId && isViewModalOpen,
  });
  const assignedPlayers = playersData?.players || [];

  // ── Mutations ───────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class created successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create class"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class updated successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update class"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class removed successfully");
    },
    onError: () => toast.error("Failed to delete class"),
  });

  // ── Event Handlers ─────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (name: string, time: string) => {
    setFormData(prev => ({ ...prev, [name]: time }));
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "", term: "", category: "", program: "", coach: "",
      dayOfWeek: "MONDAY", startTime: "09:00", endTime: "10:00",
      location: "", capacity: 20
    });
    setIsEditing(false);
    setSelectedClassId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      const res = await getClassById(id);
      const cls = res.data || res;
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
      setSelectedClassId(id);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch class details");
    }
  };

  const handleView = (id: string) => {
    setSelectedClassId(id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedClassId) {
      updateMutation.mutate({ id: selectedClassId, data: formData });
    } else {
      createMutation.mutate(formData);
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
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest pl-4">ID</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest">Class Identifier</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest">Classification</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest">Schedule</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest">Venue & Cap.</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 uppercase tracking-widest">Personnel</TableCell>
                <TableCell isHeader className="font-bold text-[10px] text-gray-400 py-4 text-center uppercase tracking-widest">Management</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-400">Syncing curriculum schedule...</TableCell></TableRow>
              ) : classes.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-500 font-medium italic">No classes identified.</TableCell></TableRow>
              ) : (
                classes.map((cls: any, idx: number) => (
                  <TableRow key={cls._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <TableCell className="py-4 pl-4 text-gray-400 font-bold text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 dark:text-white/90 group-hover:text-brand-500 transition-colors uppercase tracking-tight">{cls.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium italic">UID: {cls._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md uppercase tracking-tighter w-fit">
                          {cls.category?.name || "N/A"}
                        </span>
                        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                          {cls.program?.name || "General Program"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-white/80">
                          <Calendar size={12} className="text-brand-500" />
                          {cls.dayOfWeek}
                        </div>
                        <span className="text-[11px] font-medium text-gray-500 ml-4">{cls.startTime} - {cls.endTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                          <MapPin size={12} className="text-orange-500" />
                          {cls.location || "On-site"}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 ml-4">
                          <Users size={10} />
                          CAP: {cls.capacity}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-gray-800 dark:text-white/90">
                          {cls.coach?.fullName || cls.coach?.name || "No Head Coach"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cls.term?.name || "Standard Term"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleDropdown(cls._id); }}
                          className="dropdown-toggle p-2 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 z-9999"
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
                            <div className="border-t border-gray-50 dark:border-white/5 my-1"></div>
                            <DropdownItem onClick={() => { handleDelete(cls._id); setOpenDropdownId(null); }} className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                              <Trash size={14} className="text-red-400" /> Remove Class
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
              {terms.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required>
              <option value="">Select Category</option>
              {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Program</label>
            <select name="program" value={formData.program} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer" required disabled={!formData.category}>
              <option value="">Select Program</option>
              {programs.map((p: any) => <option key={p._id} value={p._id}>{p.name || p.title}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Head Coach</label>
            <select name="coach" value={formData.coach} onChange={handleChange} className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-sm font-bold focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Select Coach</option>
              {coaches.map((c: any) => (
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
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Committing..." : "Deploy Class"}
            </Button>
          </div>
        </form>
      </Modal>

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
          {viewClassLoading ? (
             <div className="text-center py-10 text-gray-400">Loading class info...</div>
          ) : selectedClass && (
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
                    assignedPlayers.map((player: any) => (
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
