import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router";

const ProductList = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Apparel", "Gear", "Accessories"];

  // Mock data based on the screenshot
  const products = [
    {
      id: 1,
      name: "CM Training Kit",
      subtitle: "Jersey + Shorts + Sock Sleeve",
      price: "90.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: false
    },
    {
      id: 2,
      name: "Coach Max Polo Shirt",
      subtitle: "Personalized Initials - Navy Blue",
      price: "45.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1551280857-2b9bbe52cf5a?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: false
    },
    {
      id: 3,
      name: "CM Socks/Sleeve",
      subtitle: "Personalised Compression Sleeves",
      price: "15.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1582213704251-872f2d9136ca?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: false
    },
    {
      id: 4,
      name: "Coach Max Hoodie",
      subtitle: "Personalised Initials - Coach Blue",
      price: "85.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: false
    },
    {
      id: 5,
      name: "Winter Long Jacket",
      subtitle: "Hooded - Warm, Thick Polyester",
      price: "175.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1539533377285-cf421d69d86b?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: false
    },
    {
      id: 6,
      name: "CM Puff Vest",
      subtitle: "Blue Navy Puff Vest - CoachMax Elite",
      price: "110.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=300&auto=format&fit=crop",
      isOutOfStock: true
    }
  ];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

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
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-bold  transition-all ${activeCategory === cat
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 scale-105"
                    : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                placeholder="Search gear..."
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold border border-transparent focus:border-brand-500 outline-none w-48 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 relative">

              {/* Out of Stock Label */}
              {product.isOutOfStock && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold  shadow-lg">
                  Out of Stock
                </div>
              )}

              {/* Status Toggle / Actions Overlay */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <Link to={`/edit-product/${product.id}`} className="p-2 bg-white text-gray-800 rounded-xl shadow-xl hover:bg-brand-500 hover:text-white transition-all">
                  <Edit3 size={16} />
                </Link>
                <button className="p-2 bg-white text-red-500 rounded-xl shadow-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="h-64 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-brand-500 ">{product.category}</span>
                </div>
                <h4 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white mb-2 line-clamp-1 truncate">{product.name}</h4>
                <p className="text-gray-400 text-xs font-medium mb-4 line-clamp-2 min-h-[32px]">{product.subtitle}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div>
                    <span className="text-xs font-bold text-gray-400  block mb-0.5">Starting at</span>
                    <span className="text-xl font-bold text-brand-600 block tracking-tighter">${product.price} AUD</span>
                  </div>
                  <Link to={`/edit-product/${product.id}`} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl text-gray-400 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold  text-gray-900 dark:text-white">Gear Not Found</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">No merchandise in this category. Try adding a new training kit or academy gear.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
