// src/components/SponsorManagement/SponsorForm.tsx
import React, { useState, useEffect } from "react";
import {
 Image as ImageIcon,
 Link as LinkIcon,
 Tag,
 Type
} from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import DropzoneComponent from "../form/form-elements/DropZone";
import { LucideIcon } from "lucide-react";
import { createSponsor, updateSponsor, Sponsor } from "../../api/sponsorApi";

interface SectionHeaderProps {
 icon: LucideIcon;
 title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
 <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
  <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-500">
   <Icon size={18} />
  </div>
  <h5 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h5>
 </div>
);

interface SponsorFormProps {
 onSuccess: () => void;
 editingSponsor?: Sponsor | null;
 onCancelEdit?: () => void;
}

const SponsorForm: React.FC<SponsorFormProps> = ({ onSuccess, editingSponsor, onCancelEdit }) => {
 const [loading, setLoading] = useState(false);
 const [resetKey, setResetKey] = useState(0);
 const [formData, setFormData] = useState({
  title: "",
  subtitle: "",
  link: "",
  bannerImg: null as File | null,
 });

 useEffect(() => {
  if (editingSponsor) {
   setFormData({
    title: editingSponsor.title,
    subtitle: editingSponsor.subtitle,
    link: editingSponsor.link,
    bannerImg: null,
   });
  } else {
   setFormData({
    title: "",
    subtitle: "",
    link: "",
    bannerImg: null,
   });
  }
 }, [editingSponsor]);

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handleFileChange = (files: File[]) => {
  if (files.length > 0) {
   setFormData((prev) => ({ ...prev, bannerImg: files[0] }));
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   const data = new FormData();
   data.append("title", formData.title);
   data.append("subtitle", formData.subtitle);
   data.append("link", formData.link);
   if (formData.bannerImg) {
    data.append("bannerImg", formData.bannerImg);
   }

   if (editingSponsor) {
    await updateSponsor(editingSponsor._id, data);
    toast.success("Sponsor updated successfully!");
   } else {
    if (!formData.bannerImg) {
     toast.error("Please upload a banner image");
     setLoading(false);
     return;
    }
    await createSponsor(data);
    toast.success("Sponsor created successfully!");
   }

   setFormData({ title: "", subtitle: "", link: "", bannerImg: null });
   setResetKey(prev => prev + 1);
   onSuccess();
  } catch (err) {
   console.error("Error saving sponsor:", err);
   toast.error("Failed to save sponsor. Please try again.");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
   <form onSubmit={handleSubmit} className="space-y-6">
    <SectionHeader icon={editingSponsor ? Tag : ImageIcon} title={editingSponsor ? "Edit Sponsor Banner" : "Add New Sponsor Banner"} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div className="col-span-2 md:col-span-1">
      <Label>Banner Title</Label>
      <div className="relative">
       <Input
        placeholder="e.g., Summer Sale"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
       />
       <Type size={18} className="absolute right-3 top-3 text-gray-400" />
      </div>
     </div>

     <div className="col-span-2 md:col-span-1">
      <Label>Subtitle / Offer</Label>
      <div className="relative">
       <Input
        placeholder="e.g., 50% OFF"
        name="subtitle"
        value={formData.subtitle}
        onChange={handleInputChange}
        required
       />
       <Tag size={18} className="absolute right-3 top-3 text-gray-400" />
      </div>
     </div>

     <div className="col-span-2">
      <Label>Action Link / URL</Label>
      <div className="relative">
       <Input
        placeholder="e.g., https://example.com"
        name="link"
        value={formData.link}
        onChange={handleInputChange}
        required
       />
       <LinkIcon size={18} className="absolute right-3 top-3 text-gray-400" />
      </div>
     </div>

     <div className="col-span-2">
      <Label>Banner Image {editingSponsor && "(Leave empty to keep current)"}</Label>
      <DropzoneComponent key={resetKey} onUpload={handleFileChange} />
     </div>
    </div>

    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
     {editingSponsor && (
      <Button
       type="button"
       variant="outline"
       onClick={onCancelEdit}
       className="rounded-xl px-8 font-bold text-gray-500"
      >
       Cancel
      </Button>
     )}
     <Button
      type="submit"
      disabled={loading}
      className="rounded-xl px-12 font-bold  shadow-xl shadow-brand-500/20 active:scale-95 transition-all"
     >
      {loading ? "Saving..." : editingSponsor ? "Update Sponsor" : "Create Sponsor"}
     </Button>
    </div>
   </form>
  </div>
 );
};

export default SponsorForm;
