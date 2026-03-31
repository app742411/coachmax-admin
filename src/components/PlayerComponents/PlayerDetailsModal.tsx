import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
// import { User } from "../../types/player"; // Decoupling from old type for now
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Activity,
  ShieldCheck,
  Clock,
  AlertCircle,
  Footprints,
  Star,
  MapPin,
  Globe,
  CheckCircle2,
  Edit3,
  Save,
  X,
  History,
  Layers
} from "lucide-react";

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  onApprove: (id: string) => void;
  onReject: (user: any) => void;
  onUpdate?: (updatedUser: any) => void;
  actionLoading: boolean;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  onApprove,
  onReject,
  onUpdate,
  actionLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    if (selectedUser) {
      setEditData({ ...selectedUser });
      setIsEditing(false);
    }
  }, [selectedUser]);

  if (!selectedUser || !editData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditData((prev: any) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (onUpdate && editData) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return { years: 0, months: 0, days: 0 };
    const dob = new Date(dobString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const toggleEdit = () => {
    if (isEditing) {
      setEditData({ ...selectedUser });
    }
    setIsEditing(!isEditing);
  };

  const getSkillColor = (level: number) => {
    switch (level) {
      case 1: return "#ef4444"; // Red
      case 2: return "#f97316"; // Orange
      case 3: return "#eab308"; // Yellow
      case 4: return "#84cc16"; // Lime
      case 5: return "#22c55e"; // Green
      default: return "#94a3b8"; // Slate
    }
  };

  const statusColor = selectedUser.status === "APPROVED" ? "success" : selectedUser.status === "PENDING" ? "warning" : "error";
  const age = calculateAge(selectedUser.dob);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl max-h-[96vh] flex flex-col p-0 rounded-[32px] border-none bg-white shadow-2xl overflow-hidden font-sans">
      <div className="px-10 py-10 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-900">
            <UserIcon size={26} />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-2">
              Registration File
            </h4>
            <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={12} /> ID: {selectedUser._id.slice(-8).toUpperCase()}</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center gap-1.5"><Globe size={12} /> {isEditing ? "Modify Record" : "Review Mode"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-10">
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] transition-all border ${isEditing
              ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
              : "bg-gray-50 border-gray-100 text-gray-500 hover:text-gray-900 hover:border-gray-200"
              }`}
          >
            {isEditing ? <X size={14} /> : <Edit3 size={14} />}
            {isEditing ? "CANCEL" : "EDIT"}
          </button>
          {!isEditing && (
            <Badge size="md" color={statusColor as any} variant="solid" className="px-6 py-2 rounded-xl font-bold text-[10px] uppercase shadow-sm">
              {selectedUser.status || "UNKNOWN"}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-10 py-10 bg-white custom-scrollbar">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              <SectionHeader title="Identity Details" />
              <div>
                <Label>Full Name</Label>
                <Input name="fullName" value={editData.fullName || ""} onChange={handleInputChange} placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label>Email Address</Label>
                  <Input name="email" value={editData.email || ""} onChange={handleInputChange} placeholder="Email" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input name="phone" value={editData.phone || ""} onChange={handleInputChange} placeholder="Phone" />
                </div>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" name="dob" value={editData.dob ? new Date(editData.dob).toISOString().split('T')[0] : ""} onChange={handleInputChange} placeholder="DOB" />
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader title="Technical Profile" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Jersey Number</Label>
                  <Input name="jerseyNumber" value={editData.jerseyNumber || editData.shirtNumber || ""} onChange={handleInputChange} placeholder="e.g. 25" />
                </div>
                <div>
                  <Label>Preferred Foot</Label>
                  <Select
                    options={[
                      { value: "RIGHT", label: "Right" },
                      { value: "LEFT", label: "Left" },
                      { value: "BOTH", label: "Both" }
                    ]}
                    value={editData.preferredFoot}
                    onChange={(val) => handleSelectChange("preferredFoot", val)}
                  />
                </div>
              </div>
              <div>
                <Label>Skill Proficiency</Label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Rating</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setEditData((prev: any) => prev ? { ...prev, skillLevel: s } : null)}
                        className={`p-1.5 rounded-lg transition-all ${editData.skillLevel >= s ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                        style={{ color: editData.skillLevel >= s ? getSkillColor(editData.skillLevel) : "#e2e8f0" }}
                      >
                        <Star size={16} fill={editData.skillLevel >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label>Comments</Label>
                <Input name="comments" value={editData.comments || ""} onChange={handleInputChange} placeholder="Internal comments..." />
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader title="Affiliation & Health" />
              <div>
                <Label>Current Academy/Club</Label>
                <Input name="club" value={editData.club || ""} onChange={handleInputChange} placeholder="Club Name" />
              </div>
              <div>
                <Label>Legal Guardian</Label>
                <Input name="contactName" value={editData.contactName || ""} onChange={handleInputChange} placeholder="Guardian Name" />
              </div>
              <div>
                <Label>Medical Conditions</Label>
                <textarea
                  name="medicalCondition"
                  value={editData.medicalCondition || ""}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold text-gray-700 outline-none focus:border-brand-500 transition-all min-h-[100px] resize-none"
                  placeholder="Allergies, chronic conditions, etc."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-12">
            <div className="lg:col-span-1 space-y-8 border-r border-gray-50 pr-4">
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.profile ? `${import.meta.env.VITE_API_BASE_URL}/${selectedUser.profile}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                  alt={selectedUser.fullName}
                  className="h-44 w-44 rounded-[2rem] object-cover border-4 border-gray-50 shadow-sm mb-6"
                   onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                  }}
                />
                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">{selectedUser.fullName || "N/A"}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Player Identity</p>

                <div className="w-full space-y-4">
                  <ContactItem icon={<Mail size={14} />} label="Email" value={selectedUser.email || "N/A"} />
                  <ContactItem icon={<Phone size={14} />} label="Phone" value={selectedUser.phone || "N/A"} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <SectionHeader title="Technical Profile" />
              <div className="space-y-6">
                <InfoBox label="Skill Level" value={
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= (selectedUser.skillLevel || 0) ? getSkillColor(selectedUser.skillLevel) : "none"}
                        className={s <= (selectedUser.skillLevel || 0) ? "" : "text-gray-100"}
                        style={{ color: s <= (selectedUser.skillLevel || 0) ? getSkillColor(selectedUser.skillLevel) : undefined }}
                      />
                    ))}
                  </div>
                } />
                <InfoBox label="Jersey Number" value={selectedUser.jerseyNumber || selectedUser.shirtNumber || "N/A"} icon={<Trophy size={14} />} />
                <InfoBox label="Master Foot" value={(selectedUser.preferredFoot || "N/A") + " FOOT"} icon={<Footprints size={14} />} />
                <InfoBox label="Program" value={selectedUser.program?.name || selectedUser.programType || "N/A"} icon={<Activity size={14} />} />
                <InfoBox label="Category" value={selectedUser.category?.name || "N/A"} icon={<Layers size={14} />} />
                <InfoBox label="Term" value={selectedUser.term?.name || "N/A"} icon={<History size={14} />} />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <SectionHeader title="Affiliation & Health" />
              <div className="space-y-6">
                <InfoBox label="Current Club" value={selectedUser.club || "N/A"} icon={<MapPin size={14} />} />
                <InfoBox label="Legal Guardian" value={selectedUser.contactName || "N/A"} icon={<ShieldCheck size={14} />} />
                <InfoBox
                  label="Date of Birth"
                  value={
                    <div className="flex flex-col">
                      <span>{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : "N/A"}</span>
                      {selectedUser.dob && (
                        <span className="text-[10px] text-brand-500 font-extrabold mt-1">
                          Age: {age.years}y {age.months}m {age.days}d
                        </span>
                      )}
                    </div>
                  }
                  icon={<Calendar size={14} />}
                />
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-3">Health Considerations</span>
                  <p className="text-xs font-semibold text-gray-600 leading-relaxed min-h-[40px]">
                    {selectedUser.medicalCondition || "No medical conditions or allergies reported."}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <SectionHeader title="Administration" />
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-3">Self Statement</span>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                    "{selectedUser.comments || "No personal comments provided."}"
                  </p>
                </div>

                {selectedUser.status === "REJECTED" && selectedUser.rejectReason && (
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                    <span className="text-[9px] font-bold text-red-400 uppercase block mb-2 tracking-tighter">Rejection Reason</span>
                    <p className="text-xs font-bold text-red-600">
                      {selectedUser.rejectReason}
                    </p>
                  </div>
                )}

                <div className="p-6 bg-gray-900 rounded-3xl text-white shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Status Check</span>
                    <h5 className="text-xs font-bold">
                      {selectedUser.isOtpVerified ? "Verified User" : "OTP Pending"}
                    </h5>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    {selectedUser.isOtpVerified ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Last Registry Sync</span>
                  <span className="text-[9px] font-bold text-gray-400 tracking-tighter">{new Date(selectedUser.updatedAt || selectedUser.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-12 py-10 border-t border-gray-100 flex flex-col sm:flex-row gap-6 justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            {isEditing ? <Save size={18} /> : <Trophy size={18} />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Coach Max System</p>
            <p className="text-xs font-bold text-gray-900 leading-none">{isEditing ? "Modify Player Data" : "Internal Player Review"}</p>
          </div>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          {isEditing ? (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={toggleEdit}
                className="rounded-2xl px-8 h-14 text-sm font-bold border-gray-200 hover:bg-gray-50 transition-all text-gray-500 w-full sm:w-auto min-w-[150px]"
              >
                Discard
              </Button>
              <Button
                className="bg-brand-500 hover:bg-brand-600 rounded-2xl px-14 h-14 text-sm font-bold shadow-xl shadow-brand-500/20 text-white flex-grow sm:flex-grow-0 min-w-[200px]"
                onClick={handleSave}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-2xl px-12 h-14 text-sm font-bold border-gray-200 hover:bg-gray-50 transition-all text-gray-700 w-full sm:w-auto min-w-[150px]"
              >
                Cancel
              </Button>

              <div className="flex gap-3 w-full sm:w-auto">
                {(selectedUser.status === "PENDING" || selectedUser.status === "REJECTED") && (
                  <Button
                    className="bg-gray-900 hover:bg-black rounded-2xl px-14 h-14 text-sm font-bold shadow-xl shadow-gray-200 text-white flex-grow sm:flex-grow-0 min-w-[200px]"
                    onClick={() => { onApprove(selectedUser._id); }}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Approve Player"}
                  </Button>
                )}
                {(selectedUser.status === "PENDING" || selectedUser.status === "APPROVED") && (
                  <Button
                    className="bg-error-600 hover:bg-error-700 rounded-2xl px-8 h-14 text-sm font-bold shadow-xl shadow-error-500/10 text-white flex-grow sm:flex-grow-0"
                    onClick={() => { onReject(selectedUser); }}
                    disabled={actionLoading}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] border-l-2 border-gray-900 pl-4">{title}</h5>
);

const ContactItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 w-full">
    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tight">{label}</span>
      <span className="text-xs font-bold text-gray-700 truncate">{value}</span>
    </div>
  </div>
);

const InfoBox = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-start justify-between px-2">
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
      <div className="text-xs font-bold text-gray-800">{value}</div>
    </div>
    {icon && <div className="text-gray-300 mt-1">{icon}</div>}
  </div>
);

export default PlayerDetailsModal;
