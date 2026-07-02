import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import AddContentForm from "../../components/ContentManagement/AddContentForm";

interface AddContentPageProps {
 type?: "news" | "blog";
}

export default function AddContentPage({ type = "news" }: AddContentPageProps) {
 const pageTitle = type === "news" ? "Create News Article" : "Draft New Blog Post";
 const pageDesc = type === "news" ? "Announce latest updates to the CoachMax community." : "Share your coaching wisdom and elite analyses.";

 return (
  <>
   <PageMeta
    title={`CoachMax | ${pageTitle}`}
    description={pageDesc}
   />
   <div className="space-y-6">
    <PageBreadcrumb pageTitle={pageTitle} />
    <AddContentForm type={type} />
   </div>
  </>
 );
}
