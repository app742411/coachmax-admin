import { useState, useEffect } from "react";
import { getAllNews, deleteNews } from "../../api/adminApi";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { 
 Filter, 
 Bookmark, 
 Clock, 
 Eye, 
 Heart,
 Newspaper,
 Edit2,
 Trash2
} from "lucide-react";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";
import EditNewsModal from "../../components/ContentManagement/EditNewsModal";
import ConfirmDeleteModal from "../../components/ui/modal/ConfirmDeleteModal";

const ContentListPage = ({ type = "news" }) => {
 const [activeTab, setActiveTab] = useState("Latest");

 const newsTabs = ["Latest", "Business", "Sports", "League"];
 const blogTabs = ["All Posts", "Training", "Nutrition", "Analysis"];
 const tabs = type === "news" ? newsTabs : blogTabs;

 const [contentItems, setContentItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [editingNews, setEditingNews] = useState<any>(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [itemToDelete, setItemToDelete] = useState<string | null>(null);
 const [isDeleting, setIsDeleting] = useState(false);

 const fetchNews = async () => {
  try {
   setLoading(true);
   const res = await getAllNews();
   if (res.success) {
    const mappedNews = res.data.map((item: any) => {
     const imageUrl = item.images && item.images.length > 0
      ? `${import.meta.env.VITE_API_BASE_URL}/${item.images[0]}`
      : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop";

     return {
      id: item._id,
      title: item.title,
      category: item.category,
      readTime: "5 min read", // Mock
      timeAgo: new Date(item.publishedAt || item.createdAt).toLocaleDateString(),
      image: imageUrl,
      isFeatured: item.featured,
      description: item.description
     };
    });
    setContentItems(mappedNews);
   }
  } catch (error) {
   console.error("Error fetching news:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  if (type === "news") {
   fetchNews();
  } else {
   // Keep mock data for blog type for now
   setContentItems([
    {
     id: 1,
     title: "Real Madrid confirm Xabi Alonso as new head coach",
     category: "la liga",
     readTime: "5 min read",
     timeAgo: "5 hours ago",
     image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
     isFeatured: true
    },
    {
     id: 2,
     title: "Tactical breakdown of the Premier League's top contenders",
     category: "analysis",
     readTime: "8 min read",
     timeAgo: "1 day ago",
     image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop",
     isFeatured: false
    }
   ]);
   setLoading(false);
  }
 }, [type]);

 const handleEdit = (item: any, e: React.MouseEvent) => {
  e.stopPropagation();
  setEditingNews(item);
  setIsEditModalOpen(true);
 };

 const handleDeleteClick = (id: string, e: React.MouseEvent) => {
  e.stopPropagation();
  setItemToDelete(id);
  setIsDeleteModalOpen(true);
 };

 const confirmDelete = async () => {
  if (!itemToDelete) return;
  setIsDeleting(true);
  try {
   await deleteNews(itemToDelete);
   toast.success("News deleted successfully");
   setContentItems(prev => prev.filter(item => item.id !== itemToDelete));
   setIsDeleteModalOpen(false);
  } catch (error) {
   console.error("Error deleting news:", error);
   toast.error("Failed to delete news.");
  } finally {
   setIsDeleting(false);
   setItemToDelete(null);
  }
 };

 const featured = contentItems.find(item => item.isFeatured);
 const items = contentItems.filter(item => !item.isFeatured);

 return (
  <>
   <PageMeta
    title={`CoachMax | ${type === "news" ? "News & Updates" : "Blogs & Analysis"}`}
    description={`Manage the coachmax ${type} platform.`}
   />
   <div className="space-y-6">
    <PageBreadcrumb pageTitle={type === "news" ? "News & Updates" : "Blogs & Hub"} />

    {/* Categories Tab Bar */}
    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
      {tabs.map((tab) => (
       <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`text-sm font-bold  whitespace-nowrap transition-all border-b-2 pb-2 ${
         activeTab === tab
          ? "text-brand-500 border-brand-500"
          : "text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
        }`}
       >
        {tab}
       </button>
      ))}
    </div>

    {/* Main Content Layout */}
    {loading ? (
     <div className="flex justify-center items-center py-40">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
     </div>
    ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left: Featured & Main List */}
      <div className="lg:col-span-8 space-y-8">
       {/* Featured Banner Card */}
       {featured && (
        <div className="relative h-[480px] rounded-3xl overflow-hidden group shadow-2xl">
          <img 
           src={featured.image} 
           className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
           alt="featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <div className="absolute top-6 right-6">
           <div className="p-3 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/40">
             <Bookmark size={20} fill="white" />
           </div>
          </div>
          <div className="absolute bottom-10 left-10 right-10">
           <div className="flex items-center gap-3 mb-4">
             <span className="bg-brand-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold  shadow-lg">
              {featured.category}
             </span>
             <span className="text-white/80 text-[10px] font-bold  flex items-center gap-1.5">
              <Clock size={12} /> {featured.readTime}
             </span>
           </div>
           <h2 className="text-4xl font-bold text-white leading-tight mb-4 drop-shadow-md lg:w-3/4">
             {featured.title}
           </h2>
           <div className="flex items-center justify-between">
             <span className="text-white/60 text-xs font-bold  ">{featured.timeAgo}</span>
             <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1 text-xs"><Eye size={14}/> 1.2k</span>
              <span className="flex items-center gap-1 text-xs"><Heart size={14}/> 428</span>
             </div>
           </div>
          </div>
        </div>
       )}

       {/* Feed List Items */}
       <div className="space-y-4">
         <h3 className="text-xs font-bold text-gray-400  mb-6">Latest Feed</h3>
         {items.map(item => (
          <div key={item.id} className="flex gap-6 bg-white dark:bg-gray-900/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800/60 hover:border-brand-500/30 transition-all hover:translate-x-1">
           <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
             <img src={item.image} className="w-full h-full object-cover" alt="item" />
           </div>
           <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
             <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-brand-500 underline underline-offset-4 decoration-2">
                 {item.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold  ">
                 {item.readTime}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                {item.title}
              </h4>
             </div>
             <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold text-gray-400 ">{item.timeAgo}</span>
              <div className="flex items-center gap-2">
                <div 
                 onClick={(e) => handleEdit(item, e)}
                 className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors shadow-sm"
                 title="Edit"
                >
                 <Edit2 size={14} />
                </div>
                <div 
                 onClick={(e) => handleDeleteClick(item.id, e)}
                 className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors shadow-sm"
                 title="Delete"
                >
                 <Trash2 size={14} />
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 hover:text-brand-500 cursor-pointer transition-colors shadow-sm">
                  <Bookmark size={14} />
                </div>
              </div>
             </div>
           </div>
          </div>
         ))}
       </div>
      </div>

      {/* Right Column: Trending & Widgets */}
      <div className="lg:col-span-4 space-y-8">
       <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
         <div className="flex items-center justify-between mb-6">
          <h5 className="text-xs font-bold text-gray-900 dark:text-white  ">Trending Topics</h5>
          <Filter size={16} className="text-gray-400" />
         </div>
         <div className="space-y-4">
          {["Champions League", "Transfer Rumors", "Training Drills", "Premier League Insights", "Youth Academy"].map((topic, i) => (
           <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
             <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-100 dark:text-gray-800 ">{i+1}</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors">{topic}</span>
             </div>
             <span className="text-[10px] font-bold text-brand-500">2.1k</span>
           </div>
          ))}
         </div>
       </div>

       <div className="p-8 bg-brand-500 rounded-3xl shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12">
           <Newspaper size={120} />
         </div>
         <h4 className="text-xl font-bold text-white mb-4 relative z-10 leading-tight">Grow Your Audience with Quality Analysis</h4>
         <p className="text-white/70 text-sm font-medium mb-6 relative z-10">Consistently publishing match reviews and training tips increases player engagement by 40%.</p>
         <Button className="w-full bg-white text-brand-500 hover:bg-white/90 rounded-2xl font-bold  shadow-lg relative z-10 active:scale-95 transition-all py-4">Draft Post</Button>
       </div>
      </div>
     </div>
    )}
   </div>
   <EditNewsModal 
    isOpen={isEditModalOpen} 
    onClose={() => setIsEditModalOpen(false)} 
    onSuccess={() => fetchNews()} 
    newsItem={editingNews} 
   />
   <ConfirmDeleteModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={confirmDelete}
    loading={isDeleting}
    title="Delete News"
    message="Are you sure you want to delete this news article? This action cannot be undone."
   />
  </>
 );
};

export default ContentListPage;
