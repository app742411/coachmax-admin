import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { getEventDetails, getEventParticipants, exportEventParticipants } from "../../api/eventApi";
import { 
  Calendar, 
  MapPin, 
  Globe, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  UserCheck,
  Star,
  ExternalLink,
  Layers,
  PhoneCall,
  Download,
  ChevronDown
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import toast from "react-hot-toast";

interface EventStats {
  totalSlots: number;
  registered: number;
  availableSlots: number;
  cancelled?: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  venueName: string;
  address: string;
  googleMapLink: string;
  contactPhone: string;
  website: string;
  registrationDeadline: string;
  isRegistrationOpen: boolean;
  bannerImage: string | null;
  status: string;
  stats: EventStats;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  club: string;
  programType: string;
  profile?: string;
}

interface Participant {
  _id: string;
  user: User;
  status: string;
  createdAt: string;
}

const EventDetailsComp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = async (format: "csv" | "excel") => {
    if (!id) return;
    try {
      toast.loading(`Preparing ${format.toUpperCase()} export...`, { id: "export" });
      const blob = await exportEventParticipants(id, format);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Participants_${event?.title || "Event"}_${new Date().getTime()}.${format === "excel" ? "xlsx" : "csv"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${format.toUpperCase()} Exported successfully!`, { id: "export" });
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.", { id: "export" });
    } finally {
      setExportOpen(false);
    }
  };

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getEventDetails(id);
      if (res.success) {
        setEvent(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    if (!id) return;
    setParticipantsLoading(true);
    try {
      const res = await getEventParticipants(id, page, limit);
      if (res.success) {
        setParticipants(res.data);
        setTotalPages(Math.ceil(res.total / limit) || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch participants.");
    } finally {
      setParticipantsLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
        <AlertCircle size={48} className="text-gray-100 mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Event not found.</p>
      </div>
    );
  }

  const metrics = [
    { label: "Total Capacity", value: event.stats.totalSlots, icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Registered", value: event.stats.registered, icon: UserCheck, color: "text-success-500", bg: "bg-success-500/10" },
    { label: "Remaining", value: event.stats.availableSlots, icon: Layers, color: "text-brand-500", bg: "bg-brand-500/10" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Banner & Basic Info Wrapper */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500">
        {/* Banner Section */}
        <div className="h-64 md:h-80 w-full relative overflow-hidden group">
          {event.bannerImage ? (
            <img 
              src={`${import.meta.env.VITE_API_BASE_URL}/${event.bannerImage}`} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
               <Layers size={64} className="text-gray-200 dark:text-gray-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                 <Badge color={(event.status === "UPCOMING" || event.status === "ONGOING") ? "success" : "warning"} variant="light" className="uppercase font-black italic text-[9px] tracking-widest px-4 py-1.5 bg-white/10 backdrop-blur-md border-none text-white ring-1 ring-inset ring-white/20">
                    {event.status}
                 </Badge>
                 <Badge color="info" variant="light" className="uppercase font-black italic text-[9px] tracking-widest px-4 py-1.5 bg-brand-500/20 backdrop-blur-md border-none text-brand-300 ring-1 ring-inset ring-brand-500/30">
                    {event.category}
                 </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-bold uppercase italic tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-500" />
                  <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-500" />
                  <span>{event.venueName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid Section */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Detailed Description */}
           <div className="lg:col-span-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-500/10 rounded-2xl">
                   <FileText size={24} className="text-brand-500" />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-800 dark:text-white">Event Details & Description</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed max-w-4xl italic">
                "{event.description}"
              </p>
           </div>

           {/* Metrics Grid */}
           <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {metrics.map((m, i) => (
                <div key={i} className="p-8 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between group hover:border-brand-500/20 transition-all duration-300">
                   <div>
                      <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest italic block mb-2">{m.label}</span>
                      <span className="text-3xl font-black italic uppercase text-gray-800 dark:text-white tracking-tighter scale-110 origin-left inline-block">{m.value}</span>
                   </div>
                   <div className={`p-4 ${m.bg} ${m.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                      <m.icon size={28} />
                   </div>
                </div>
              ))}
           </div>

           {/* Logistics Info Card */}
           <div className="lg:col-span-6 space-y-6">
              <div className="p-8 bg-white dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                 <h4 className="text-sm font-black italic uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Tournament Logistics</h4>
                 
                 <div className="space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-brand-500 shadow-sm border border-transparent group-hover:border-brand-500/10">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Address</span>
                          <span className="text-sm font-black italic uppercase text-gray-800 dark:text-white">{event.address}</span>
                          <a href={event.googleMapLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-brand-500 font-bold hover:underline mt-1">
                             VIEW ON MAP <ExternalLink size={10} />
                          </a>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-brand-500 shadow-sm border border-transparent group-hover:border-brand-500/10">
                          <Clock size={20} />
                       </div>
                       <div>
                          <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Enrollment Deadline</span>
                          <span className="text-sm font-black italic uppercase text-gray-800 dark:text-white text-error-500">{formatDate(event.registrationDeadline)}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Organizer Support Card */}
           <div className="lg:col-span-6 space-y-6">
              <div className="p-8 bg-brand-600 rounded-3xl shadow-xl shadow-brand-500/20 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 italic">Organizer Context</span>
                    <h4 className="text-2xl font-black italic uppercase tracking-wider mt-2 mb-8 group-hover:translate-x-1 transition-transform">Get Professional Support</h4>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                               <PhoneCall size={20} />
                           </div>
                           <div>
                               <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">Support Hotline</span>
                               <span className="text-lg font-black italic leading-none">{event.contactPhone}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                               <Globe size={20} />
                           </div>
                           <div>
                               <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">Event Portal</span>
                               <span className="text-sm font-black italic leading-none truncate block max-w-[200px]">{event.website}</span>
                           </div>
                        </div>
                    </div>
                  </div>
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute left-1/4 -bottom-16 w-32 h-32 bg-black/10 rounded-full blur-2xl group-hover:-translate-x-1 transition-transform duration-700" />
              </div>
           </div>
        </div>
      </div>

      {/* Registered Players List */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <Users size={24} className="text-brand-500" />
               </div>
               <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-800 dark:text-white leading-none">Registered Roster</h3>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic mt-1">Confirmed participants for this program</p>
               </div>
            </div>
            <div className="flex bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5 gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setExportOpen(!exportOpen)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-brand-500 rounded-xl text-white text-[10px] font-black uppercase italic tracking-widest shadow-lg shadow-brand-500/20 active:scale-95 transition-all dropdown-toggle"
                  >
                    <Download size={14} />
                    Export Roster
                    <ChevronDown size={12} className={`transition-transform duration-300 ${exportOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <Dropdown
                    isOpen={exportOpen}
                    onClose={() => setExportOpen(false)}
                    className="w-40 p-2 mt-2"
                  >
                     <p className="text-[9px] font-black uppercase text-gray-400 p-2 italic tracking-tighter border-b border-gray-50 dark:border-gray-800/50 mb-1">Select Format</p>
                     <DropdownItem
                       onClick={() => handleExport("csv")}
                       className="flex items-center gap-2 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                     >
                        <FileText size={14} className="text-brand-500" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">CSV Format</span>
                     </DropdownItem>
                     <DropdownItem
                       onClick={() => handleExport("excel")}
                       className="flex items-center gap-2 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                     >
                        <Layers size={14} className="text-success-500" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">Excel Sheet</span>
                     </DropdownItem>
                  </Dropdown>
                </div>

                <span className="px-4 py-1.5 text-xs font-black uppercase italic tracking-widest text-brand-500 flex items-center gap-2 border-l border-gray-200 dark:border-white/10 ml-1 leading-none">
                   Total: {event.stats.registered} / {event.stats.totalSlots}
                </span>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <Table>
               <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableRow>
                     <TableCell isHeader className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic text-gray-400 border-b border-gray-100 dark:border-white/5">Player Detail</TableCell>
                     <TableCell isHeader className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic text-gray-400 border-b border-gray-100 dark:border-white/5">Affiliation</TableCell>
                     <TableCell isHeader className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic text-gray-400 border-b border-gray-100 dark:border-white/5">Skill metrics</TableCell>
                     <TableCell isHeader className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic text-gray-400 border-b border-gray-100 dark:border-white/5 text-center">Registration Status</TableCell>
                  </TableRow>
               </TableHeader>
               <TableBody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {participantsLoading ? (
                     <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center">
                           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent" />
                        </TableCell>
                     </TableRow>
                  ) : participants.length > 0 ? (
                     participants.map((p) => (
                        <TableRow key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                           <TableCell className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="relative">
                                    <img 
                                      src={p.user.profile ? `${import.meta.env.VITE_API_BASE_URL}/${p.user.profile}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-brand-500/30 transition-all shadow-sm"
                                      alt={p.user.fullName} 
                                    />
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-success-500 rounded-lg text-white ring-2 ring-white dark:ring-gray-900 shadow-lg">
                                       <CheckCircle size={8} strokeWidth={4} />
                                    </div>
                                 </div>
                                 <div>
                                    <span className="block text-sm font-black italic uppercase text-gray-800 dark:text-white tracking-tight group-hover:text-brand-500 transition-colors cursor-pointer capitalize">
                                       {p.user.fullName}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">{p.user.email}</span>
                                       <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                       <span className="text-[10px] font-black text-brand-500 tracking-tighter italic">{p.user.phone}</span>
                                    </div>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="px-8 py-5">
                              <div className="space-y-1">
                                 <span className="block text-[11px] font-black italic uppercase text-gray-800 dark:text-white truncate max-w-[140px] leading-none">
                                    {p.user.club}
                                 </span>
                                 <span className="block text-[9px] font-bold uppercase text-gray-400 tracking-widest">Academy / Affiliation</span>
                              </div>
                           </TableCell>
                           <TableCell className="px-8 py-5">
                              <div className="space-y-2">
                                 <Badge size="sm" color="primary" variant="light" className="uppercase italic font-black text-[9px] tracking-widest px-3">
                                    {p.user.programType}
                                 </Badge>
                                 <div className="flex items-center gap-1.5">
                                    <Star size={10} className="text-yellow-500 fill-current" />
                                    <Star size={10} className="text-yellow-500 fill-current" />
                                    <Star size={10} className="text-yellow-500 fill-current" />
                                    <span className="text-[9px] font-black text-gray-400 italic uppercase ml-1 tracking-widest italic">Skills Verified</span>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="px-8 py-5">
                              <div className="flex flex-col items-center">
                                 <Badge variant="light" color={p.status === "REGISTERED" ? "success" : "warning"} className="uppercase font-black italic text-[9px] tracking-[0.2em] px-5 py-2 rounded-full ring-1 ring-inset ring-current/20">
                                    {p.status}
                                 </Badge>
                                 <span className="text-[8px] font-bold text-gray-400 uppercase italic mt-2">Registered: {new Date(p.createdAt).toLocaleDateString()}</span>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center">
                           <div className="flex flex-col items-center justify-center opacity-40">
                              <Users size={40} className="text-gray-200 mb-3" />
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">No registrations for this event yet.</p>
                           </div>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            {/* Pagination placeholder */}
            {totalPages > 1 && (
               <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30">
                  <span className="text-[10px] font-black uppercase text-gray-400 italic">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                      <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:text-brand-500 transition-all shadow-sm disabled:opacity-50"
                      >
                         Prev
                      </button>
                      <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:text-brand-500 transition-all shadow-sm disabled:opacity-50"
                      >
                         Next
                      </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default EventDetailsComp;
