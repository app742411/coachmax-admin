import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import {
  Search,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "../../components/Store/ProductCard";

const ProductList = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([{ _id: "All", name: "All" }]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await apiClient.get("/api/admin/store/categories");
        const cats = catRes.data.data || catRes.data || [];
        setCategories([{ _id: "All", name: "All" }, ...cats]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        if (activeCategoryId !== "All") params.append("categoryId", activeCategoryId);
        
        const url = params.toString() ? `/api/user/store/products?${params.toString()}` : "/api/user/store/products";
        const prodRes = await apiClient.get(url);
        const prods = prodRes.data.data || prodRes.data || [];
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        toast.error("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategoryId]);

  const getCategoryName = (categoryId: string | any) => {
    // Sometimes API populates category, sometimes it's just an ID
    const id = typeof categoryId === 'object' && categoryId !== null ? categoryId._id : categoryId;
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : "Uncategorized";
  };



  return (
    <>
      <PageMeta
        title="CoachMax | Merchandise Management"
        description="Manage your elite coaching and academy products."
      />
      <PageBreadcrumb
        pageTitle="Merchandise Catalog"
        items={[{ name: "Store", path: "/products" }]}
      />
      <div className="space-y-6">

        {/* Header Section */}

        {/* Filters & Tools */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategoryId(cat._id)}
                className={`px-6 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategoryId === cat._id
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 scale-105"
                  : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product..."
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold border border-transparent focus:border-brand-500 outline-none w-48 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} getCategoryName={getCategoryName} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold  text-gray-900 dark:text-white">Product Not Found</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">No merchandise in this category. Try adding a new training kit or academy product.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
