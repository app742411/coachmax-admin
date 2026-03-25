import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import {
    MapPin,
    Clock,
    Phone,
    Mail,
    User,
    Calendar,
    Trophy,
    Shield,
    Activity,
    Award,
    Globe
} from "lucide-react";
import { useParams } from "react-router";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import user1 from "../../../public/images/user/user-01.jpg";

const PlayerDetails: React.FC = () => {
    const { id } = useParams();

    const playerData = {
        id: id || "PLR-002",
        date: "March 20, 2024",
        time: "10:30 AM",
        player: {
            name: "Marcus Rashford",
            email: "marcus.r@example.com",
            phone: "+44 789 456 123",
            avatar: user1,
            position: "Forward",
            age: "21",
            height: "185cm",
            weight: "78kg",
            preferredFoot: "Right",
            nationality: "United Kingdom"
        },
        stats: [
            { id: 1, label: "Matches", value: "22", icon: Activity, color: "bg-blue-500" },
            { id: 2, label: "Goals", value: "15", icon: Trophy, color: "bg-brand-500" },
            { id: 3, label: "Assists", value: "8", icon: Award, color: "bg-yellow-500" },
            { id: 4, label: "Exp.", value: "4 Years", icon: Shield, color: "bg-purple-500" }
        ],
        experience: [
            { club: "Manchester City Academy", years: "2018 - 2021", role: "Striker (U16/U18)" },
            { club: "Local Premier League", years: "2021 - 2023", role: "Forward" }
        ],
        enquiry: {
            team: "Senior Elite Squad",
            message: "I am looking for a professional environment to grow and CoachMax seems like the best place for my development. I have a strong goal-scoring record and excellent work ethic.",
            location: "Stretford, Manchester"
        }
    };

    return (
        <>
            <PageMeta
                title={`CoachMax | Player ${playerData.player.name}`}
                description="Review player profile and application details."
            />
            <PageBreadcrumb
                pageTitle={playerData.player.name}
                items={[
                    { name: "Players", path: "/players" },
                    { name: "Pending Enquiries", path: "/pending-players" }
                ]}
            />
            <div className="space-y-6 max-w-full mx-auto p-4 sm:p-6 lg:p-8">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* <div className="flex items-center gap-4">
              <Link to="/pending-players" className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-brand-500 transition-all shadow-sm">
                 <ArrowLeft size={20} />
              </Link>
              <PageBreadcrumb 
                pageTitle={playerData.player.name} 
                items={[
                  { name: "Players", path: "/players" },
                  { name: "Pending Enquiries", path: "/pending-players" }
                ]} 
              />
           </div> */}

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-black uppercase text-gray-500 hover:text-error-500 transition-all shadow-sm active:scale-95">
                            Reject Application
                        </button>
                        <Button className="rounded-2xl px-12 italic font-black uppercase shadow-xl shadow-brand-500/20 active:scale-95 transition-all text-sm">
                            Approve Player
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Section: Stats & Bio */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Profile Card */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="relative">
                                    <img src={playerData.player.avatar} className="w-40 h-40 rounded-3xl object-cover shadow-2xl ring-4 ring-brand-500/10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt={playerData.player.name} />
                                    <div className="absolute -bottom-2 -right-2 bg-brand-500 text-white p-2.5 rounded-2xl shadow-xl">
                                        <Shield size={20} />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                        <h3 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white-80 tracking-tight">{playerData.player.name}</h3>
                                        <Badge color="info" className="uppercase italic font-black text-[10px] px-3">Age: {playerData.player.age}</Badge>
                                        <Badge color="success" className="uppercase italic font-black text-[10px] px-3">Level: Elite</Badge>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <MapPin size={16} className="text-red-400" /> {playerData.enquiry.location}
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all">
                                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Position</span>
                                            <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-200">{playerData.player.position}</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all">
                                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Preferred Foot</span>
                                            <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-200">{playerData.player.preferredFoot}</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all">
                                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Height</span>
                                            <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-200">{playerData.player.height}</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all">
                                            <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Weight</span>
                                            <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-200">{playerData.player.weight}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl"></div>
                            <div className="absolute left-1/4 -top-12 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>
                        </div>

                        {/* Stats Highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {playerData.stats.map(stat => (
                                <div key={stat.id} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center gap-3">
                                    <div className={`p-3 ${stat.color} text-white rounded-2xl shadow-lg`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic uppercase text-gray-900 dark:text-white">{stat.value}</span>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Application Details */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                            <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Application Message</h4>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                "{playerData.enquiry.message}"
                            </div>

                            <div className="mt-8">
                                <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Previous Clubs / Experience</h4>
                                <div className="space-y-4">
                                    {playerData.experience.map((exp, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-brand-500/20 transition-all">
                                            <div className="w-10 h-10 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500">
                                                <Globe size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-sm font-black italic uppercase text-gray-800 dark:text-gray-200">{exp.club}</h5>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{exp.role}</p>
                                            </div>
                                            <span className="text-xs font-black text-brand-500 italic">{exp.years}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Contact & Identity */}
                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                            <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Contact Identity</h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent flex items-center gap-4 group cursor-default">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-brand-500 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Email Address</span>
                                        <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-300 truncate max-w-[180px]">{playerData.player.email}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent flex items-center gap-4 group cursor-default">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-brand-500 shadow-sm">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Phone Number</span>
                                        <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-300">{playerData.player.phone}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent flex items-center gap-4 group cursor-default">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-brand-500 shadow-sm">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">Nationality</span>
                                        <span className="text-xs font-black italic uppercase text-gray-800 dark:text-gray-300">{playerData.player.nationality}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-600 rounded-3xl shadow-xl shadow-brand-500/30 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Enquiry Target</span>
                                <h4 className="text-xl font-black italic uppercase tracking-wider mt-1 mb-6">{playerData.enquiry.team}</h4>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest opacity-70">Enquiry Date</span>
                                        <span className="text-sm font-black italic leading-none">{playerData.date}</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-white text-brand-600 rounded-2xl text-xs font-black uppercase italic tracking-[0.1em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Clock size={16} /> Schedule Interview
                                </button>
                            </div>
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerDetails;
