import React, { useState, useEffect } from "react";
import {
 Tag,
 Package,
 Image as ImageIcon,
 Info,
 LucideIcon
} from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import MultiImageDropzone from "../form/form-elements/MultiImageDropzone";
import SuccessPopup from "../SuccessPopup";
import apiClient from "../../api/apiClient";
import CategoryModal from "./CategoryModal";

interface ProductFormData {
 name: string;
 shortHighlight: string;
 price: string;
 category: string;
 description: string;
 sizes: string[];
 colors: string;
 stock: string;
 availabilityStatus: string;
 _id?: string;
}

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

interface FormCardProps {
 children: React.ReactNode;
 className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className = "" }) => (
 <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm ${className}`}>
  {children}
 </div>
);

interface ProductFormProps {
 initialData?: ProductFormData | null;
 isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData = null, isEdit = false }) => {
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
 const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
 const [images, setImages] = useState<File[]>([]);
 const [formData, setFormData] = useState<ProductFormData>({
  name: "",
  shortHighlight: "",
  price: "",
  category: "",
  description: "",
  sizes: [],
  colors: "",
  stock: "0",
  availabilityStatus: "IN_STOCK"
 });

 useEffect(() => {
  if (initialData) {
   // @ts-ignore
   setFormData(prev => ({ ...prev, ...initialData }));
  }
 }, [initialData]);

 const [showCategoryModal, setShowCategoryModal] = useState(false);

 const fetchCategories = async () => {
  try {
   const response = await apiClient.get("/api/admin/store/categories");
   const data = response.data.data || response.data;
   const formatted = data.map((item: any) => ({
    value: item.uuid || item.id || item._id,
    label: item.name
   }));
   setCategories(formatted);
  } catch (error) {
   console.error("Failed to fetch categories:", error);
   toast.error("Failed to fetch categories");
  }
 };

 useEffect(() => {
  fetchCategories();
 }, []);

 const sizeOptions = [
  { value: "XS", text: "Extra Small" },
  { value: "S", text: "Small" },
  { value: "M", text: "Medium" },
  { value: "L", text: "Large" },
  { value: "XL", text: "Extra Large" },
  { value: "XXL", text: "Double Extra Large" },
  { value: "One Size", text: "One Size Fits All" }
 ];

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleSizesChange = (selectedSizes: string[]) => {
  setFormData(prev => ({ ...prev, sizes: selectedSizes }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("shortHighlight", formData.shortHighlight);
  payload.append("description", formData.description);
  payload.append("category", formData.category);
  payload.append("price", formData.price);
  payload.append("stock", formData.stock);
  payload.append("availabilityStatus", formData.availabilityStatus);
  
  payload.append("sizes", JSON.stringify(formData.sizes));
  
  if (formData.colors) {
   const colorsArray = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
   payload.append("colors", JSON.stringify(colorsArray));
  }
  
  if (images.length > 0) {
   images.forEach(file => {
    payload.append("images", file);
   });
  }

  try {
   if (isEdit) {
    const productId = formData._id || initialData?._id;
    if (!productId) {
     toast.error("Product ID is missing for update.");
     return;
    }
    await apiClient.patch(`/api/admin/store/products/${productId}`, payload, {
     headers: { "Content-Type": "multipart/form-data" }
    });
    toast.success("Merchandise updated successfully!");
    setShowSuccessPopup(true);
   } else {
    await apiClient.post("/api/admin/store/products", payload, {
     headers: { "Content-Type": "multipart/form-data" }
    });
    toast.success("Merchandise added successfully!");
    setShowSuccessPopup(true);
   }
  } catch (error) {
   console.error("Failed to add product:", error);
   toast.error("Failed to add product");
  }
 };

 return (
  <div className="max-w-5xl mx-auto p-4 sm:p-6">
   <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    {/* Left Column: Basic Details & Pricing */}
    <div className="lg:col-span-7 space-y-6">
     <FormCard>
      <SectionHeader icon={Tag} title="Core Product Identity" />
      <div className="space-y-5">
        <div>
         <Label>Product Name</Label>
         <Input 
          placeholder="e.g., CM Training Kit - Personalized" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
         />
        </div>
        <div>
         <Label>Short Highlight (Subtitle)</Label>
         <Input 
          placeholder="e.g., Jersey + Shorts + Sock Sleeve" 
          name="shortHighlight" 
          value={formData.shortHighlight} 
          onChange={handleInputChange} 
         />
        </div>
        <div className="grid grid-cols-2 gap-6">
         <div>
           <Label>Price (AUD)</Label>
           <div className="relative">
            <Input 
             type="number" 
             placeholder="90.00" 
             name="price" 
             value={formData.price} 
             onChange={handleInputChange} 
            />
            <span className="absolute right-3 top-3.5 text-[10px] font-bold text-gray-400">AUD</span>
           </div>
         </div>
         <div>
           <div className="flex justify-between items-end mb-1">
             <Label>Category</Label>
             <button 
               type="button" 
               onClick={() => setShowCategoryModal(true)} 
               className="text-[10px] font-bold text-brand-500 hover:underline"
             >
               Manage Categories
             </button>
           </div>
           <Select 
            options={categories} 
            value={formData.category}
            onChange={(val: string) => setFormData(prev => ({...prev, category: val}))}
           />
         </div>
        </div>
      </div>
     </FormCard>

     <FormCard>
      <SectionHeader icon={Info} title="Extended Description" />
      <textarea 
        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400"
        placeholder="Detailed product specifics, material info, or sizing guide..."
        rows={8}
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      ></textarea>
     </FormCard>
    </div>

    {/* Right Column: Inventory & Media */}
    <div className="lg:col-span-5 space-y-6">
     <FormCard>
      <SectionHeader icon={Package} title="Inventory & Stock" />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
         <div>
          <Label>Available Sizes</Label>
          <MultiSelect 
           placeholder="Select multiple" 
           options={sizeOptions}
           value={formData.sizes}
           onChange={handleSizesChange}
          />
         </div>
         <div>
          <Label>Colors</Label>
          <Input 
           placeholder="e.g., Red, Blue" 
           name="colors" 
           value={formData.colors} 
           onChange={handleInputChange} 
          />
         </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
         <div>
           <Label>Starting Stock</Label>
           <Input 
            type="number" 
            placeholder="50" 
            name="stock" 
            value={formData.stock} 
            onChange={handleInputChange} 
           />
         </div>
         <div>
           <Label>Availability Status</Label>
           <Select 
            options={[
             {value: "IN_STOCK", label: "In Stock"}, 
             {value: "OUT_OF_STOCK", label: "Out of Stock"}, 
             {value: "PRE_ORDER", label: "Pre-order"}
            ]}
            value={formData.availabilityStatus}
            onChange={(val: string) => setFormData(prev => ({...prev, availabilityStatus: val}))}
           />
         </div>
        </div>
      </div>
     </FormCard>

     <FormCard>
      <SectionHeader icon={ImageIcon} title="Product Visuals" />
      <div className="space-y-4">
        <MultiImageDropzone 
         maxFiles={5}
         onUpload={(files: File[]) => setImages(files)} 
        />
      </div>
     </FormCard>

     <div className="flex flex-col gap-3">
       <Button 
        type="submit" 
        className="w-full rounded-2xl py-4 font-bold  shadow-2xl shadow-brand-500/30 active:scale-95 transition-all text-base"
       >
        {isEdit ? "Update Merchandise" : "Publish to Store"}
       </Button>

     </div>
    </div>
   </form>

   {showSuccessPopup && (
    <SuccessPopup 
     message={`Fantastic! The ${formData.name || "item"} has been ${isEdit ? "updated" : "added"} to the CoachMax merchandise catalog.`} 
     onClose={() => setShowSuccessPopup(false)} 
    />
   )}

   <CategoryModal 
    isOpen={showCategoryModal} 
    onClose={() => setShowCategoryModal(false)} 
    onCategoriesUpdated={fetchCategories} 
   />
  </div>
 );
};

export default ProductForm;
