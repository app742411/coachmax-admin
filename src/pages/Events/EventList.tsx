// src/pages/Events/EventList.tsx
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { getAllEvents, updateEventStatus } from "../../api/eventApi";
import { Link, useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock3,
  Edit,
  Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  googleMapLink: string;
  contactPhone: string;
  website: string;
  registrationDeadline: string;
  isRegistrationOpen: boolean;
  bannerImage: string | null;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  stats?: {
    totalSlots: number;
    registered: number;
    availableSlots: number;
  };
}

const statusColors = {
  UPCOMING: "bg-blue-500",
  ONGOING: "bg-success-500",
  COMPLETED: "bg-gray-400"
};

const statusIcons = {
  UPCOMING: Clock3,
  ONGOING: AlertCircle,
  COMPLETED: CheckCircle
};

export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateEventStatus(id, newStatus);
      toast.success(`Event marked as ${newStatus.toLowerCase()}`);
      setEvents(prev => prev.map(ev => ev._id === id ? { ...ev, status: newStatus as any } : ev));
      setOpenStatusMenuId(null);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <>
      <PageMeta
        title="CoachMax | Event Explorer"
        description="Comprehensive management of all tournaments and coaching programs."
      />
      <PageBreadcrumb pageTitle="Event Inventory" />

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => {
            const StatusIcon = statusIcons[event.status];
            return (
              <div
                key={event._id}
                className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/event-details/${event._id}`)}
              >
                <div className="h-48 bg-gray-100 dark:bg-gray-800 relative ring-1 ring-inset ring-black/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {event.bannerImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${event.bannerImage}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/10 gap-3">
                      <ImageIcon size={32} className="text-gray-200" />
                      <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest italic">Asset Placeholder</span>
                    </div>
                  )}

                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black italic uppercase tracking-widest shadow-lg flex items-center gap-1.5 text-white ${statusColors[event.status]}`}>
                      <StatusIcon size={12} strokeWidth={3} />
                      {event.status}
                    </span>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStatusMenuId(openStatusMenuId === event._id ? null : event._id);
                      }}
                      className="p-2 dropdown-toggle bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-gray-800 dark:text-gray-100 shadow-xl hover:text-brand-500 transition-all border border-transparent hover:border-brand-500/20"
                    >
                      <MoreVertical size={16} strokeWidth={2.5} />
                    </button>
                    <Dropdown
                      isOpen={openStatusMenuId === event._id}
                      onClose={() => setOpenStatusMenuId(null)}
                      className="w-44 p-2 right-0 left-auto z-[999] mt-2 origin-top-right scale-100 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <p className="text-[10px] font-black uppercase text-gray-400 p-2 border-b border-gray-50 dark:border-gray-800 mb-1 italic">Event Governance</p>
                        <DropdownItem
                          onClick={() => handleStatusChange(event._id, "UPCOMING")}
                          className="flex items-center gap-2 p-2 rounded-xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Clock3 size={14} />
                          <span className="text-xs font-bold uppercase italic tracking-tighter">Set Upcoming</span>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange(event._id, "ONGOING")}
                          className="flex items-center gap-2 p-2 rounded-xl text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10 transition-colors"
                        >
                          <AlertCircle size={14} />
                          <span className="text-xs font-bold uppercase italic tracking-tighter">Live Ongoing</span>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange(event._id, "COMPLETED")}
                          className="flex items-center gap-2 p-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <CheckCircle size={14} />
                          <span className="text-xs font-bold uppercase italic tracking-tighter">Completed</span>
                        </DropdownItem>
                      </div>
                    </Dropdown>
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="mb-4">
                    <h4 className="text-xl font-black text-gray-800 dark:text-white uppercase italic tracking-tighter leading-tight line-clamp-1 group-hover:text-brand-500 transition-colors">{event.title}</h4>
                    <p className="text-[10px] font-black uppercase text-brand-500 tracking-[0.2em] italic mb-3 opacity-80">{event.category} Event</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin size={14} className="text-brand-500" />
                      </div>
                      <span className="truncate">{event.venueName}, {event.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar size={14} className="text-brand-500" />
                      </div>
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                  </div>

                  {/* Enhanced Stats Section */}
                  {event.stats && (
                    <div className="mt-5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                        <span className="text-gray-400 tracking-widest">Enrollment Progress</span>
                        <span className="text-brand-500">
                          {event.stats.registered} / {event.stats.totalSlots} Slots
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 transition-all duration-1000"
                          style={{ width: `${Math.min(100, (event.stats.registered / event.stats.totalSlots) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-bold text-success-500 uppercase italic tracking-tighter">
                        {event.stats.availableSlots} SLOTS REMAINING
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-4">
                    {event.createdBy && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-black text-gray-400">SA</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-gray-400 italic tracking-tighter truncate">
                          BY: {event.createdBy.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/40 pt-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
                            <span className="text-[8px] font-black text-gray-500">CM</span>
                          </div>
                        ))}
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-brand-500 shadow-sm flex items-center justify-center">
                          <span className="text-[8px] font-black text-white">+{event.stats?.availableSlots || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/edit-event/${event._id}`}
                          className="group/btn flex items-center gap-2 px-3 py-2 bg-brand-500/10 hover:bg-brand-500 rounded-xl text-brand-500 hover:text-white transition-all font-black uppercase italic tracking-widest text-[9px] shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit size={12} className="group-hover/btn:rotate-12 transition-transform" />
                          EDIT
                        </Link>
                        <Link
                          to={`/event-details/${event._id}`}
                          className="group/btn flex items-center gap-2 px-3 py-2 bg-success-500/10 hover:bg-success-500 rounded-xl text-success-500 hover:text-white transition-all font-black uppercase italic tracking-widest text-[9px] shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          VIEW
                          <ExternalLink size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
          <AlertCircle size={48} className="text-gray-100 mb-4" />
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">No events enlisted yet.</p>
          <Link to="/add-event" className="mt-6 text-brand-500 font-bold hover:underline">Launch your first event</Link>
        </div>
      )}
    </>
  );
}
