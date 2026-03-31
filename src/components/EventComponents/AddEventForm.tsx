// src/components/EventComponents/AddEventForm.tsx
import React, { useState, useEffect } from "react";
import {
 Calendar,
 MapPin,
 Globe,
 Layout,
 Clock,
 Users,
 ChevronRight,
 ChevronLeft,
 Info,
 Phone
} from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import TimePicker from "../form/time-picker";
import DropzoneComponent from "../form/form-elements/DropZone";
import SuccessPopup from "../SuccessPopup";
import { LucideIcon } from "lucide-react";
import { createEvent, getAllEvents, updateEvent } from "../../api/eventApi";

interface SectionHeaderProps {
 icon: LucideIcon;
 title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
 <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
  <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
   <Icon size={18} />
  </div>
  <h5 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tighter ">{title}</h5>
 </div>
);

interface FormCardProps {
 children: React.ReactNode;
 className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className = "" }) => (
 <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm ${className}`}>
  {children}
 </div>
);

interface AddEventFormProps {
 eventId?: string;
}

import { useNavigate } from "react-router";

const AddEventForm: React.FC<AddEventFormProps> = ({ eventId }) => {
 const [currentStep, setCurrentStep] = useState(1);
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "",
  maxParticipants: "",
  startDate: null as Date | null,
  endDate: null as Date | null,
  startTime: "",
  endTime: "",
  venueName: "",
  address: "",
  googleMapLink: "",
  contactPhone: "",
  website: "",
  registrationDeadline: null as Date | null,
  eventImg: null as File | null,
 });

 useEffect(() => {
  if (eventId) {
   const fetchEvent = async () => {
    try {
     const res = await getAllEvents(); // Usually you'd have a getById, but the user only gave getAllEvents
     const event = res.data.find((e: any) => e._id === eventId);
     if (event) {
      setFormData({
       title: event.title,
       description: event.description,
       category: event.category,
       maxParticipants: event.maxParticipants.toString(),
       startDate: event.startDate ? new Date(event.startDate) : null,
       endDate: event.endDate ? new Date(event.endDate) : null,
       startTime: event.startTime,
       endTime: event.endTime,
       venueName: event.venueName,
       address: event.address,
       googleMapLink: event.googleMapLink,
       contactPhone: event.contactPhone,
       website: event.website,
       registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : null,
       eventImg: null,
      });
     }
    } catch (err) {
     console.error("Error fetching event for edit:", err);
    }
   };
   fetchEvent();
  }
 }, [eventId]);

 const categories = [
  { value: "Sports", label: "Sports" },
  { value: "Training", label: "Training Session" },
  { value: "Tournament", label: "Tournament" },
  { value: "Friendly", label: "Friendly Match" },
  { value: "Scouting", label: "Scouting Event" },
  { value: "Camp", label: "Holiday Camp" }
 ];

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleDateChange = (date: Date | null, field: string) => {
  setFormData(prev => ({ ...prev, [field]: date }));
 };

 const handleFileChange = (files: File[]) => {
  if (files.length > 0) {
   setFormData(prev => ({ ...prev, eventImg: files[0] }));
  }
 };

 const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  // Safety check: Only submit if we are on the final step
  if (currentStep < 3) {
   nextStep();
   return;
  }

  setLoading(true);

  try {
   const data = new FormData();
   Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof Date) {
     data.append(key, value.toISOString());
    } else if (value && key !== "eventImg") {
     data.append(key, value as string | Blob);
    }
   });

   if (formData.eventImg) {
    data.append("eventImg", formData.eventImg);
   }

   if (eventId) {
    await updateEvent(eventId, data);
    toast.success("Event updated successfully!");
   } else {
    await createEvent(data);
    toast.success("Event profile created successfully!");
   }
   setShowSuccessPopup(true);
  } catch (err) {
   console.error("Error saving event:", err);
   toast.error("Failed to save event. Please check your network.");
  } finally {
   setLoading(false);
  }
 };

 const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
 const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

 const steps = [
  { id: 1, label: "Identity", icon: Layout },
  { id: 2, label: "Timeline", icon: Calendar },
  { id: 3, label: "Venue & Assets", icon: MapPin }
 ];

 return (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
   {/* Step Indicators */}
   <div className="mb-12 flex items-center justify-between px-4 overflow-x-auto no-scrollbar gap-8">
    {steps.map((step) => (
     <div key={step.id} className="flex items-center gap-3 shrink-0">
      <div className={`p-3 rounded-xl transition-all ${currentStep === step.id
        ? "bg-brand-500 text-white shadow-xl shadow-brand-500/30 scale-110"
        : currentStep > step.id
         ? "bg-success-500/10 text-success-500 border border-success-500/20"
         : "bg-gray-100 dark:bg-white/5 text-gray-400"
       }`}>
       <step.icon size={20} strokeWidth={2.5} />
      </div>
      <div className="hidden sm:block">
       <p className={`text-[10px] font-bold  ${currentStep === step.id ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>Step 0{step.id}</p>
       <h6 className={`text-xs font-bold  tracking-tighter ${currentStep === step.id ? "text-brand-500" : "text-gray-400"}`}>{step.label}</h6>
      </div>
     </div>
    ))}
   </div>

   <form
    onSubmit={(e) => {
     e.preventDefault();
     if (currentStep === 3) handleSubmit(e);
     else nextStep();
    }}
    onKeyDown={(e) => {
     if (e.key === "Enter" && currentStep < 3) {
      e.preventDefault();
      nextStep();
     }
    }}
    className="space-y-6"
   >
    {currentStep === 1 && (
     <FormCard>
      <SectionHeader icon={Info} title="Event Identity" />
      <div className="space-y-6">
       <div>
        <Label>Event Title</Label>
        <Input
         placeholder="e.g., Summer Youth Cup"
         name="title"
         value={formData.title}
         onChange={handleInputChange}
         required
        />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
         <Label>Category</Label>
         <Select
          options={categories}
          placeholder="Select Event Category"
          value={formData.category}
          onChange={(val: string) => setFormData(prev => ({ ...prev, category: val }))}
         />
        </div>
        <div>
         <Label>Max Participants</Label>
         <div className="relative">
          <Input
           type="number"
           placeholder="e.g., 20"
           name="maxParticipants"
           value={formData.maxParticipants}
           onChange={handleInputChange}
          />
          <Users size={16} className="absolute right-3 top-3.5 text-gray-400" />
         </div>
        </div>
       </div>
       <div>
        <Label>Event Description</Label>
        <textarea
         className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 min-h-[150px]"
         placeholder="Tell us more about the weekend match..."
         name="description"
         value={formData.description}
         onChange={handleInputChange}
         required
        ></textarea>
       </div>
      </div>
     </FormCard>
    )}

    {currentStep === 2 && (
     <FormCard>
      <SectionHeader icon={Clock} title="Timeline & Schedule" />
      <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
         <Label>Start Date</Label>
         <DatePicker
          defaultDate={formData.startDate}
          onChange={(dates: Date[]) => handleDateChange(dates[0] || null, "startDate")}
          placeholder="Select Date"
         />
        </div>
        <div>
         <Label>End Date</Label>
         <DatePicker
          defaultDate={formData.endDate}
          onChange={(dates: Date[]) => handleDateChange(dates[0] || null, "endDate")}
          placeholder="Select Date"
         />
        </div>
        <div>
         <Label>Start Time</Label>
         <TimePicker
          value={formData.startTime}
          onChange={(time) => setFormData(p => ({ ...p, startTime: time }))}
          placeholder="10:00 AM"
         />
        </div>
        <div>
         <Label>End Time</Label>
         <TimePicker
          value={formData.endTime}
          onChange={(time) => setFormData(p => ({ ...p, endTime: time }))}
          placeholder="06:00 PM"
         />
        </div>
        <div className="col-span-2">
         <Label>Registration Deadline</Label>
         <DatePicker
          defaultDate={formData.registrationDeadline}
          onChange={(dates: Date[]) => handleDateChange(dates[0] || null, "registrationDeadline")}
          placeholder="Last day to enroll..."
         />
        </div>
       </div>
      </div>
     </FormCard>
    )}

    {currentStep === 3 && (
     <FormCard>
      <SectionHeader icon={MapPin} title="Logistics & Assets" />
      <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
         <Label>Venue Name</Label>
         <Input
          placeholder="e.g., City Ground Arena"
          name="venueName"
          value={formData.venueName}
          onChange={handleInputChange}
         />
        </div>
        <div className="col-span-2">
         <Label>Full Address</Label>
         <div className="relative">
          <Input
           placeholder="e.g., Bhopal, MP"
           name="address"
           value={formData.address}
           onChange={handleInputChange}
          />
          <MapPin size={16} className="absolute right-3 top-3.5 text-gray-400" />
         </div>
        </div>
        <div className="col-span-2">
         <Label>Google Maps Location Link</Label>
         <Input
          placeholder="https://maps.google.com/..."
          name="googleMapLink"
          value={formData.googleMapLink}
          onChange={handleInputChange}
         />
        </div>
        <div>
         <Label>Contact Phone</Label>
         <div className="relative">
          <Input
           placeholder="9876543210"
           name="contactPhone"
           value={formData.contactPhone}
           onChange={handleInputChange}
          />
          <Phone size={16} className="absolute right-3 top-3.5 text-gray-400" />
         </div>
        </div>
        <div>
         <Label>Event Website</Label>
         <div className="relative">
          <Input
           placeholder="www.example.com"
           name="website"
           value={formData.website}
           onChange={handleInputChange}
          />
          <Globe size={16} className="absolute right-3 top-3.5 text-gray-400" />
         </div>
        </div>
       </div>

       <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <Label>Official Event Banner</Label>
        <DropzoneComponent onUpload={handleFileChange} />
        {formData.eventImg && (
         <p className="mt-2 text-xs font-bold text-success-600">Selected: {formData.eventImg.name}</p>
        )}
       </div>
      </div>
     </FormCard>
    )}

    {/* Navigation Actions */}
    <div className="flex items-center justify-between pt-8 px-2">
     {currentStep > 1 && (
      <Button
       type="button"
       variant="outline"
       onClick={prevStep}
       className="rounded-xl px-8 font-bold  border-gray-200 text-gray-500 flex items-center gap-2"
      >
       <ChevronLeft size={16} strokeWidth={3} />
       Back
      </Button>
     )}
     <div className="ml-auto flex items-center gap-4">
      {currentStep < 3 ? (
       <Button
        type="button"
        onClick={nextStep}
        className="rounded-xl px-12 font-bold  shadow-xl shadow-brand-500/20 flex items-center gap-2"
       >
        Next Step
        <ChevronRight size={16} strokeWidth={3} />
       </Button>
      ) : (
       <Button
        type="button"
        onClick={() => handleSubmit()}
        disabled={loading}
        className="rounded-xl px-16 font-bold  shadow-xl shadow-brand-500/30 bg-success-600 hover:bg-success-700 active:scale-95 transition-all text-white"
       >
        {loading ? "Optimizing Assets..." : eventId ? "Update Event Profile" : "Create Event Profile"}
       </Button>
      )}
     </div>
    </div>
   </form>

   {showSuccessPopup && (
    <SuccessPopup
     message={`Success! The event has been officially ${eventId ? 'updated' : 'listed'}. Athletes can now view and register for this tournament.`}
     onClose={() => {
      setShowSuccessPopup(false);
      navigate("/events");
     }}
    />
   )}
  </div>
 );
};

export default AddEventForm;
