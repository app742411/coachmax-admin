import { useState, useEffect } from "react";
import { getAllNews, deleteNews } from "../../api/adminApi";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import {
  Edit2, 
  Trash2,
  Clock,
  Bookmark,
  Eye,
  Heart
} from "lucide-react";
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
       let imageUrl = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop";
       if (item.images && item.images.length > 0) {
         const imgPath = item.images[0].replace(/\\/g, '/');
         const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || "";
         imageUrl = imgPath.startsWith("http") ? imgPath : `${baseUrl}/${imgPath.replace(/^\//, '')}`;
       }

      return {
       id: item._id,
       title: item.title,
       category: item.category,
       readTime: "5 min read", // Mock
       timeAgo: new Date(item.publishedAt || item.createdAt).toLocaleDateString(),
       image: imageUrl,
       isFeatured: item.featured,
       description: item.description,
       author: item.publishedBy?.name || "Admin"
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
      isFeatured: true,
      description: "A detailed look into the recent changes in management at Real Madrid.",
      author: "Super Admin"
     },
     {
      id: 2,
      title: "Tactical breakdown of the Premier League's top contenders",
      category: "analysis",
      readTime: "8 min read",
      timeAgo: "1 day ago",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop",
      isFeatured: false,
      description: "An in-depth tactical analysis of the top teams competing for the Premier League title this season.",
      author: "Super Admin"
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
       <div className="lg:col-span-12 space-y-8">
        {/* Featured Banner Card */}
        {featured && (
         <div className="relative h-[480px] rounded-none overflow-hidden group shadow-2xl">
           <img 
            src={featured.image} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="featured"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
           <div className="absolute top-6 right-6">
            <div className="p-3 bg-brand-500 text-white rounded-none shadow-lg shadow-brand-500/40">
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
        <div>
         <h3 className="text-xs font-bold text-gray-400 mb-6">Latest Feed</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {items.map(item => (
            <div key={item.id} className="flex flex-col bg-white dark:bg-gray-900/50 rounded-none border border-gray-100 dark:border-gray-800/60 hover:border-brand-500/30 transition-all hover:-translate-y-1 shadow-sm">
             <div className="w-full h-48 overflow-hidden flex-shrink-0">
               <img src={item.image} className="w-full h-full object-cover" alt="item" />
             </div>
             <div className="flex-1 p-5 flex flex-col justify-between">
               <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-brand-500 underline underline-offset-4 decoration-2 capitalize">
                   {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold truncate">
                   {item.author}
                  </span>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
               </div>
               <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-gray-400">{item.timeAgo}</span>
                <div className="flex items-center gap-2">
                  <div 
                   onClick={(e) => handleEdit(item, e)}
                   className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-none text-blue-500 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors shadow-sm"
                   title="Edit"
                  >
                   <Edit2 size={14} />
                  </div>
                  <div 
                   onClick={(e) => handleDeleteClick(item.id, e)}
                   className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-none text-red-500 hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors shadow-sm"
                   title="Delete"
                  >
                   <Trash2 size={14} />
                  </div>
                  <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-none text-gray-400 hover:text-brand-500 cursor-pointer transition-colors shadow-sm">
                    <Bookmark size={14} />
                  </div>
                </div>
               </div>
             </div>
            </div>
           ))}
         </div>
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
