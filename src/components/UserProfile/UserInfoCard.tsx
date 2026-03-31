import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import { updateProfile } from "../../api/userApi";
import { PenIcon } from "lucide-react";
import { useUser } from "../../context/UserContext";

interface UserInfoForm {
 fullName: string;
 email: string;
 phoneNumber: string;
}

const UserInfoCard: React.FC = () => {
 const { isOpen, openModal, closeModal } = useModal();
 const { user, loading: ctxLoading, refreshProfile } = useUser();

 const [formData, setFormData] = useState<UserInfoForm>({
  fullName: "",
  email: "",
  phoneNumber: "",
 });

 const [avatarFile, setAvatarFile] = useState<File | null>(null);
 const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
 const fileInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  if (user) {
   setFormData({
    fullName: user.name || user.fullName || "",
    email: user.email || "",
    phoneNumber: user.mobile || user.phoneNumber || "",
   });

   setAvatarPreview(
    user.profileImg
     ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}/uploads/adminProfileImg/${user.profileImg}`
     : "/images/user/user-02.jpg"
   );
  }
 }, [user]);

 // 🌟 handle input change
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 // 🌟 handle avatar preview
 const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setAvatarFile(file);
   setAvatarPreview(URL.createObjectURL(file));
  }
 };

 // 🌟 SAVE PROFILE
 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
   const data = new FormData();
   data.append("name", formData.fullName);
   data.append("mobile", formData.phoneNumber);

   if (avatarFile) {
    data.append("profile", avatarFile);
   }

   const res = await updateProfile(data);

   if (res.success && res.data) {
    toast.success("Profile updated successfully!");
    refreshProfile();
    closeModal();
   }
  } catch (err) {
   console.error(err);
   toast.error("Failed to update profile.");
  }
 };

 // 🌟 LOADING
 if (ctxLoading && !user)
  return (
   <div className="p-5 text-center text-gray-500 dark:text-gray-400">
    Loading user info...
   </div>
  );

 // 🌟 MAIN RENDER
 return (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
   <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
    {/* Info Section */}
    <div>
     <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
      Personal Information
     </h4>

     <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
      <ProfileField label="Full Name" value={user?.name} />
      <ProfileField label="Email" value={user?.email} />
      <ProfileField label="Phone Number" value={user?.phoneNumber} />
     </div>
    </div>

    {/* Edit Button */}
    <button
     onClick={openModal}
     className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-50 lg:w-auto"
    >
     <PenIcon size={14} /> Edit
    </button>
   </div>

   {/* 🌟 Modal */}
   <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
    <form
     onSubmit={handleSave}
     className="rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
    >
     <h4 className="mb-2 text-2xl font-semibold dark:text-white/90">
      Edit Personal Information
     </h4>

     <div className="mb-8 flex flex-col items-center">
      <div 
       className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 cursor-pointer group shadow-lg hover:border-brand-500/50 transition-all"
       onClick={() => fileInputRef.current?.click()}
      >
       <img
        src={avatarPreview}
        alt="Avatar"
        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
       />
       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <PenIcon className="text-white h-6 w-6" />
       </div>
      </div>
      <p className="mt-2 text-xs text-gray-400 font-medium ">Click photo to change</p>

      <input 
       type="file" 
       ref={fileInputRef}
       className="hidden" 
       accept="image/*" 
       onChange={handleAvatarChange} 
      />
     </div>

     {/* Form fields */}
     <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <InputField
       name="fullName"
       label="Full Name"
       value={formData}
       onChange={handleChange}
      />
      <InputField
       name="email"
       label="Email"
       value={formData}
       onChange={handleChange}
       readOnly={true}
      />
      <InputField
       name="phoneNumber"
       label="Phone Number"
       value={formData}
       onChange={handleChange}
      />
     </div>

     {/* Buttons */}
     <div className="flex items-center gap-3 mt-6 lg:justify-end">
      <Button type="button" size="sm" variant="outline" onClick={closeModal}>
       Close
      </Button>
      <Button type="submit" size="sm">
       Save Changes
      </Button>
     </div>
    </form>
   </Modal>
  </div>
 );
}

/* ------ SMALL UI HELPERS ------ */

const ProfileField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
 <div>
  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
   {value || "Not Available"}
  </p>
 </div>
);

const InputField: React.FC<{ 
 name: keyof UserInfoForm; 
 label: string; 
 value: UserInfoForm; 
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 readOnly?: boolean;
}> = ({ name, label, value, onChange, readOnly }) => (
 <div>
  <Label>{label}</Label>
  <Input name={name} value={value[name]} onChange={onChange} readOnly={readOnly} />
 </div>
);

export default UserInfoCard;
