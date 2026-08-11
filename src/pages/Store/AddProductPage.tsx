import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ProductForm from "../../components/Store/ProductForm";
import { useStoreProductDetails } from "../../hooks/useProducts";
import toast from "react-hot-toast";
import { Tag, ShoppingBag } from "lucide-react";

export default function AddProductPage() {
  return (
    <>
      <PageMeta
        title="CoachMax | Add Merchandise"
        description="Launch and manage elite athletes via new tournaments and events."
      />
      <div className="space-y-6">
        {/* Header Section styled like Create Training Class Modal Header */}
        <div className="relative overflow-hidden bg-[#0A1930] px-6 py-4 xl:px-8 xl:py-6 text-white border-l-[6px] border-[#0047FF]">
          {/* Grid Accent */}
          <div className="absolute right-6 bottom-4 grid grid-cols-5 gap-1 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#0047FF]" />
            ))}
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 text-white">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">
                  Add New Product
                </h3>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  Create and manage store merchandise and training kits
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductForm />
      </div>
    </>
  );
}

// --- slide ---

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: res, isLoading, isError } = useStoreProductDetails(id || "");

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load product details.");
      navigate("/products");
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const product = res?.data || res;
  if (!product) return null;

  const productData = {
    _id: product._id,
    name: product.name || "",
    shortHighlight: product.shortHighlight || "",
    price: product.price?.toString() || "",
    category: typeof product.category === 'object' && product.category !== null ? product.category._id : (product.category || ""),
    description: product.description || "",
    sizes: product.sizes || [],
    colors: Array.isArray(product.colors) ? product.colors.join(", ") : (product.colors || ""),
    stock: product.stock?.toString() || "",
    availabilityStatus: product.availabilityStatus || "IN_STOCK",
    images: product.images || []
  };

  return (
    <>
      <PageMeta
        title="CoachMax | Edit Merchandise"
        description="Launch and manage elite athletes via new tournaments and events."
      />
      <div className="space-y-6">
        {/* Header Section styled like Create Training Class Modal Header */}
        <div className="relative overflow-hidden bg-[#0A1930] px-6 py-4 xl:px-8 xl:py-6 text-white border-l-[6px] border-[#0047FF]">
          {/* Grid Accent */}
          <div className="absolute right-6 bottom-4 grid grid-cols-5 gap-1 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#0047FF]" />
            ))}
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/5 text-white">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">
                  Edit Merchandise Product
                </h3>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  Modify merchandise details and stock availability
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductForm initialData={productData} isEdit={true} />
      </div>
    </>
  );
}
