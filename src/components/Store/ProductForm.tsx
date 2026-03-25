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
import DropzoneComponent from "../form/form-elements/DropZone";
import SuccessPopup from "../SuccessPopup";

interface ProductFormData {
  name: string;
  subtitle: string;
  price: string;
  category: string;
  description: string;
  sizes: string[];
  quantity: string;
  status: string;
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
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    subtitle: "",
    price: "",
    category: "Apparel",
    description: "",
    sizes: [],
    quantity: "0",
    status: "In Stock"
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const categories = [
    { value: "Apparel", label: "Apparel & Kits" },
    { value: "Gear", label: "Training Gear" },
    { value: "Accessories", label: "Accessories" },
    { value: "Footwear", label: "Footwear" }
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${isEdit ? "Updating" : "Creating"} Product:`, formData);
    toast.success(`Merchandise ${isEdit ? "updated" : "added"} successfully!`);
    setShowSuccessPopup(true);
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
                    name="subtitle" 
                    value={formData.subtitle} 
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
                        <span className="absolute right-3 top-3.5 text-[10px] font-black uppercase text-gray-400">AUD</span>
                     </div>
                  </div>
                  <div>
                     <Label>Category</Label>
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
               <div>
                  <Label>Available Sizes</Label>
                  <MultiSelect 
                    placeholder="Select multiple" 
                    options={sizeOptions}
                    value={formData.sizes}
                    onChange={handleSizesChange}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <Label>Starting Stock</Label>
                     <Input 
                        type="number" 
                        placeholder="50" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleInputChange} 
                      />
                  </div>
                  <div>
                     <Label>Availability Status</Label>
                     <Select 
                        options={[
                          {value: "In Stock", label: "In Stock"}, 
                          {value: "Out of Stock", label: "Out of Stock"}, 
                          {value: "Pre-order", label: "Pre-order"}
                        ]}
                        value={formData.status}
                        onChange={(val: string) => setFormData(prev => ({...prev, status: val}))}
                     />
                  </div>
               </div>
            </div>
          </FormCard>

          <FormCard>
            <SectionHeader icon={ImageIcon} title="Product Visuals" />
            <div className="space-y-4">
               <DropzoneComponent 
                 onUpload={(files: File[]) => console.log("Uploaded product images:", files)} 
               />
               <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Click or Drag to upload Front & Back views</p>
               </div>
            </div>
          </FormCard>

          <div className="flex flex-col gap-3">
             <Button 
                type="submit" 
                className="w-full rounded-2xl py-4 font-black italic uppercase shadow-2xl shadow-brand-500/30 active:scale-95 transition-all text-base"
             >
                {isEdit ? "Update Merchandise" : "Publish to Store"}
             </Button>
             <Button 
                type="button" 
                variant="outline" 
                className="w-full rounded-2xl font-bold text-gray-500 border-gray-200"
             >
                Discard Draft
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
    </div>
  );
};

export default ProductForm;
