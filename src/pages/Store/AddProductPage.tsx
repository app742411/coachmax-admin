import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ProductForm from "../../components/Store/ProductForm";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

export default function AddProductPage() {
 return (
  <>
   <PageMeta
    title="CoachMax | Add Merchandise"
    description="Launch and manage elite athletes via new tournaments and events."
   />
   <div className="space-y-6">
    <PageBreadcrumb 
     pageTitle="Add New Product" 
     items={[{ name: "Store", path: "/products" }]} 
    />
    <ProductForm />
   </div>
  </>
 );
}

// --- slide ---

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`/api/user/store/products/${id}`);
        const product = res.data.data || res.data;
        
        const initialData = {
          _id: product._id,
          name: product.name || "",
          shortHighlight: product.shortHighlight || "",
          price: product.price?.toString() || "",
          category: typeof product.category === 'object' && product.category !== null ? product.category._id : (product.category || ""),
          description: product.description || "",
          sizes: product.sizes || [],
          colors: Array.isArray(product.colors) ? product.colors.join(", ") : (product.colors || ""),
          stock: product.stock?.toString() || "",
          availabilityStatus: product.availabilityStatus || "IN_STOCK"
        };
        setProductData(initialData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details.");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
   <>
    <PageMeta
     title="CoachMax | Edit Merchandise"
     description="Launch and manage elite athletes via new tournaments and events."
    />
    <div className="space-y-6">
     <PageBreadcrumb 
      pageTitle="Edit Merchandise Product" 
      items={[{ name: "Store", path: "/products" }]} 
     />
     {productData && <ProductForm initialData={productData} isEdit={true} />}
    </div>
   </>
  );
}
