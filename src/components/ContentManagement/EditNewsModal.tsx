import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import {
  Upload,
  Trash2,
  Tag,
  FileText,
  Bookmark,
  Loader2,
  Newspaper,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { smartErrorToast } from "../../utils/toast";
import { updateNews } from "../../api/adminApi";
import HtmlEditor from "../form/HtmlEditor";

interface EditNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  newsItem: any;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  newsItem
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    featured: "false"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newsItem && isOpen) {
      setFormData({
        title: newsItem.title || "",
        category: newsItem.category || "",
        description: newsItem.description || "",
        featured: newsItem.isFeatured ? "true" : "false"
      });
      setImageFile(null);
      setImagePreview(newsItem.image || null);
    }
  }, [newsItem, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturedChange = (val: string) => {
    setFormData(prev => ({ ...prev, featured: val }));
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
      toast.error("Please enter a category");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("category", formData.category.trim());
      data.append("featured", formData.featured);
      if (imageFile) {
        data.append("images", imageFile);
      }
      
      await updateNews(newsItem.id || newsItem._id, data);
      toast.success("News updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating news:", error);
      smartErrorToast(error, "Failed to update news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-0 overflow-y-auto no-scrollbar my-8 rounded-none">
      <div className="bg-white dark:bg-gray-900 p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6 p-4 bg-[#031549] text-white rounded-none shadow-sm -mx-6 -mt-6 border-b border-[#082269]">
          <div className="p-2 bg-white/10 rounded-none text-white">
            <Newspaper size={18} />
          </div>
          <h5 className="text-lg font-bold text-white">Edit News Article</h5>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Top Left: Headline Title, Category & Pin as Featured */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              {/* Headline Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Headline Title
                </label>
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

              {/* Category & Featured Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <Tag size={12} />
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="e.g., Sports, Latest"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-none border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-sm font-semibold text-gray-900 dark:text-white transition-all"
                    required
                  />
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
                      className={`py-2 px-4 text-xs font-bold rounded-none transition-all ${formData.featured === "true"
                          ? "bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-md border border-gray-100 dark:border-gray-800"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeaturedChange("false")}
                      className={`py-2 px-4 text-xs font-bold rounded-none transition-all ${formData.featured === "false"
                          ? "bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-md border border-gray-100 dark:border-gray-800"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right: Featured Banner Image Dropzone */}
            <div className="lg:col-span-5 flex flex-col justify-end">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Featured Banner Image
              </label>

              <div className="flex-1 flex flex-col justify-stretch">
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="group relative border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all rounded-none cursor-pointer p-4 text-center flex flex-col items-center justify-center min-h-[145px]"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="p-2 bg-gray-50 dark:bg-gray-850 rounded-none group-hover:scale-110 transition-transform mb-2">
                      <Upload className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                      Drag & drop banner here
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      JPG, PNG, WEBP (Max 5MB)
                    </p>
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline">
                      Browse Local Files
                    </span>
                  </div>
                ) : (
                  <div className="relative border border-gray-100 dark:border-gray-800 rounded-none overflow-hidden group aspect-[16/9] min-h-[145px]">
                    <div 
                      className="absolute inset-0 w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${imagePreview})` }}
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
            </div>

            {/* Bottom: News Description HTML Editor (Full Width) */}
            <div className="lg:col-span-12 space-y-2">
              <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                <FileText size={12} />
                News Description
              </label>
              <HtmlEditor
                value={formData.description}
                onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
                placeholder="Write your news article description here..."
                className="min-h-[160px]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-none text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-none text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update Article
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditNewsModal;
