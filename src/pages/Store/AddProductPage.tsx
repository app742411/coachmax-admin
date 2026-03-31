import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ProductForm from "../../components/Store/ProductForm";

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
 // Mock initial data based on the CM Training Kit
 const mockInitialData = {
  name: "CM Training Kit",
  subtitle: "Jersey + Shorts + Sock Sleeve",
  price: "90.00",
  category: "Apparel",
  description: "High-performance training kit designed for elite CoachMax athletes. Includes breathability-enhanced jersey, motion-tuned shorts, and full-length compression socks.",
  sizes: ["M", "L", "XL"],
  quantity: "42",
  status: "In Stock"
 };

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
    <ProductForm initialData={mockInitialData} isEdit={true} />
   </div>
  </>
 );
}
