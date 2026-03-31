import React, { useState } from "react";
import {
  Newspaper,
  Layout,
  User,
  Image as ImageIcon,
  FileText,
  Eye
} from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import Select from "../form/Select";
import DropzoneComponent from "../form/form-elements/DropZone";
import SuccessPopup from "../SuccessPopup";
import { LucideIcon } from "lucide-react";

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

interface AddContentFormProps {
  type?: "news" | "blog";
}

const AddContentForm: React.FC<AddContentFormProps> = ({ type: initialType = "news" }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [contentType, setContentType] = useState<"news" | "blog">(initialType);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    readTime: "",
    author: "",
    excerpt: "",
    content: "",
    status: "Published",
    isFeatured: false,
    tags: []
  });

  const newsCategories = [
    { value: "sports", label: "Sports" },
    { value: "business", label: "Business" },
    { value: "latest", label: "Latest" },
    { value: "liga", label: "La Liga" }
  ];

  const blogCategories = [
    { value: "coaching", label: "Coaching Tips" },
    { value: "nutrition", label: "Nutrition" },
    { value: "analysis", label: "Match Analysis" },
    { value: "mindset", label: "Player Mindset" }
  ];

  const categories = contentType === "news" ? newsCategories : blogCategories;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting ${contentType} Data:`, formData);
    toast.success(`${contentType === "news" ? "News" : "Blog"} published successfully!`);
    setShowSuccessPopup(true);
  };

  const tabs = [
    { id: "basic", label: "General Info", icon: Layout },
    { id: "body", label: "Content Editor", icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left: Sidebar Navigation */}
        <div className="w-full xl:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sticky top-24 shadow-sm">
            <div className="flex items-center gap-3 px-3 mb-6 pb-4 border-b border-gray-50 dark:border-gray-800/50">
              <div className="p-2.5 bg-brand-500 rounded-xl text-white shadow-lg shadow-brand-500/30">
                <Newspaper size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white  ">Content Studio</h4>
                <p className="text-[10px] font-bold text-gray-400 ">Unified Creation</p>
              </div>
            </div>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                    activeTab === tab.id
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 translate-x-1"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 ">Live Preview</span>
                <Eye size={16} className="text-gray-400" />
              </div>
              <div className="aspect-video bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center p-4">
                <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">Headline: {formData.title || "Untiled Story..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Main Editor Content */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === "basic" && (
              <FormCard>
                <SectionHeader icon={Layout} title="Basic Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Label>Content Type</Label>
                    <Select 
                      options={[
                        { value: "news", label: "News Article" },
                        { value: "blog", label: "Blog Post" }
                      ]} 
                      placeholder="Select Type"
                      value={contentType}
                      onChange={(val) => setContentType(val as "news" | "blog")}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Headline Title</Label>
                    <Input 
                      placeholder={contentType === "news" ? "e.g., Real Madrid confirm Xabi Alonso as new head coach" : "e.g., 5 Tips to Improve Your Tactics"} 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select 
                      options={categories} 
                      placeholder="Select Category"
                      value={formData.category}
                      onChange={(val) => setFormData(prev => ({...prev, category: val}))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Read Time</Label>
                      <div className="relative">
                        <Input 
                          placeholder="5" 
                          name="readTime" 
                          value={formData.readTime} 
                          onChange={handleInputChange} 
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] font-bold text-gray-400">Min</span>
                      </div>
                    </div>
                    <div>
                      <Label>Author</Label>
                      <div className="relative">
                        <Input 
                          placeholder="Admin" 
                          name="author" 
                          value={formData.author} 
                          onChange={handleInputChange} 
                        />
                        <User size={16} className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Featured Banner Image</Label>
                    <DropzoneComponent 
                      onUpload={(files) => console.log("Uploaded banner:", files)} 
                    />
                    <div className="mt-3 p-3 bg-brand-50/50 dark:bg-brand-500/5 rounded-xl flex items-center gap-2 text-brand-600 dark:text-brand-400">
                      <ImageIcon size={14} />
                      <span className="text-[10px] font-bold ">Recommended: 1200x630 (Social Sharing Display)</span>
                    </div>
                  </div>
                </div>
              </FormCard>
            )}

            {activeTab === "body" && (
              <FormCard>
                <SectionHeader icon={FileText} title="Story Composition" />
                <div className="space-y-6">
                  <div>
                    <Label>Short Excerpt (Brief Summary)</Label>
                    <textarea 
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400"
                      rows={3}
                      placeholder="A short punchy intro to grab attention..."
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div>
                    <Label>Full Content Body</Label>
                    <textarea 
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 min-h-[400px]"
                      placeholder="Compose your full article here. Use paragraphs and rich formatting ideas..."
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </FormCard>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-xl px-8 font-bold text-gray-500 border-gray-200"
              >
                Cancel Draft
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl px-12 font-bold  shadow-xl shadow-brand-500/20 active:scale-95 transition-all"
              >
                Publish Now
              </Button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup 
          message={`Success! Your ${contentType === "news" ? "News Article" : "Blog Post"} is now live on the CoachMax platform.`} 
          onClose={() => setShowSuccessPopup(false)} 
        />
      )}
    </div>
  );
};

export default AddContentForm;
