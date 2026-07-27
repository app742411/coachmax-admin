import React, { useState } from "react";
import { 
  Upload, 
  Trash2, 
  Tag, 
  FileText, 
  Bookmark,
  ArrowRight,
  Loader2,
  Newspaper,
  LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { createNews } from "../../api/adminApi";
import SuccessPopup from "../SuccessPopup";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 p-4 bg-[#031549] text-white rounded-none shadow-sm -mx-6 -mt-6 border-b border-[#082269]">
    <div className="p-2 bg-white/10 rounded-none text-white">
      <Icon size={18} />
    </div>
    <h5 className="text-lg font-bold text-white">{title}</h5>
  </div>
);

interface AddContentFormProps {
  type?: "news" | "blog";
}

const AddContentForm: React.FC<AddContentFormProps> = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    featured: "false",
    description: ""
  });

  const newsCategories = [
    { value: "sports", label: "Sports" },
    { value: "business", label: "Business" },
    { value: "latest", label: "Latest News" },
    { value: "liga", label: "La Liga" }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, category: val }));
  };

  const handleFeaturedChange = (val: string) => {
    setFormData((prev) => ({ ...prev, featured: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Please drop an image file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Headline Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("News Description is required");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("category", formData.category);
      data.append("featured", formData.featured);
      if (imageFile) {
        data.append("images", imageFile);
      }

      const response = await createNews(data);
      
      if (response && response.success === false) {
        toast.error(response.message || "Failed to create news.");
        return;
      }

      toast.success(response.message || "News announcement published successfully");
      setShowSuccessPopup(true);
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        featured: "false",
        description: ""
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Error creating news:", err);
      const errorMsg = err.response?.data?.message || "Failed to submit news. Please check required fields.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 dark:bg-gray-950/20 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
         {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card Wrapper */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-xl shadow-gray-100/50 dark:shadow-none p-6 space-y-6 rounded-none">
            <SectionHeader icon={Newspaper} title="Create News Article" />
            
            {/* 1. Featured Image Dropzone (At the Top) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Featured Banner Image
              </label>
              
              {!imagePreview ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="group relative border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all rounded-none cursor-pointer p-8 text-center flex flex-col items-center justify-center min-h-[220px]"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-none group-hover:scale-110 transition-transform mb-4">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Drag & drop banner here
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                  <span className="mt-4 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                    Browse Local Files
                  </span>
                </div>
              ) : (
                <div className="relative border border-gray-100 dark:border-gray-800 rounded-none overflow-hidden group aspect-[16/9] max-h-[300px]">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-none transition-transform hover:scale-110 shadow-lg shadow-red-600/30"
                      title="Remove Image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Headline Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Headline Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Real Madrid confirm Xabi Alonso as new head coach"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-none border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm font-semibold text-gray-900 dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            {/* 3. Category & Featured Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <Tag size={12} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-none border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm font-semibold text-gray-900 dark:text-white transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {newsCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <Bookmark size={12} />
                  Pin as Featured
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 dark:bg-gray-850 rounded-none border border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => handleFeaturedChange("true")}
                    className={`py-2 px-4 text-xs font-bold rounded-none transition-all ${
                      formData.featured === "true"
                        ? "bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-md border border-gray-100 dark:border-gray-800"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeaturedChange("false")}
                    className={`py-2 px-4 text-xs font-bold rounded-none transition-all ${
                      formData.featured === "false"
                        ? "bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-md border border-gray-100 dark:border-gray-800"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

            </div>

            {/* 4. Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                <FileText size={12} />
                News Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                placeholder="Write your news article description here..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-none border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm font-semibold text-gray-900 dark:text-white transition-all resize-y min-h-[160px]"
                required
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({ title: "", category: "", featured: "false", description: "" });
                setImageFile(null);
                setImagePreview(null);
              }}
              className="px-6 py-3 rounded-none text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-none text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Article
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          message="Success! Your News Article is now live on the CoachMax platform."
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default AddContentForm;
