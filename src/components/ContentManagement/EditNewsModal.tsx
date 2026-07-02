import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import DropzoneComponent from "../form/form-elements/DropZone";
import Button from "../ui/button/Button";
import { updateNews } from "../../api/adminApi";
import toast from "react-hot-toast";
import { Image as ImageIcon } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newsItem && isOpen) {
      setFormData({
        title: newsItem.title || "",
        category: newsItem.category || "",
        description: newsItem.description || "",
        featured: newsItem.featured ? "true" : "false"
      });
      setImageFile(null);
    }
  }, [newsItem, isOpen]);

  const newsCategories = [
    { value: "sports", label: "Sports" },
    { value: "business", label: "Business" },
    { value: "latest", label: "Latest" },
    { value: "liga", label: "La Liga" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
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
      toast.error("Failed to update news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar my-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit News Article</h2>
        <p className="text-sm text-gray-500">Update the details of the news article below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label>Headline Title</Label>
            <Input 
              placeholder="e.g., Real Madrid confirm Xabi Alonso as new head coach" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select 
              options={newsCategories} 
              placeholder="Select Category"
              value={formData.category}
              onChange={(val) => setFormData(prev => ({...prev, category: val}))}
            />
          </div>
          <div>
            <Label>Featured</Label>
            <Select 
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" }
              ]} 
              placeholder="Is Featured?"
              value={formData.featured}
              onChange={(val) => setFormData(prev => ({...prev, featured: val}))}
            />
          </div>
          <div className="col-span-2">
            <Label>Featured Banner Image (Optional)</Label>
            <DropzoneComponent 
              onUpload={(files: File[]) => setImageFile(files[0])} 
              previewUrl={newsItem?.image}
            />
            <div className="mt-3 p-3 bg-brand-50/50 dark:bg-brand-500/5 rounded-xl flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <ImageIcon size={14} />
              <span className="text-[10px] font-bold">Leave empty to keep existing image. Recommended: 1200x630</span>
            </div>
          </div>
          <div className="col-span-2">
            <Label>Description</Label>
            <textarea 
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400"
              rows={6}
              placeholder="Enter news description..."
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl px-8 font-bold text-gray-500 border-gray-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-xl px-8 font-bold shadow-xl shadow-brand-500/20 active:scale-95 transition-all"
          >
            {loading ? "Updating..." : "Update News"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditNewsModal;
