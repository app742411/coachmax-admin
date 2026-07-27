import PageMeta from "../../components/common/PageMeta";
import AddContentForm from "../../components/ContentManagement/AddContentForm";
import { Sparkles } from "lucide-react";

export default function AddContentPage() {
  return (
    <>
      <PageMeta
        title="CoachMax | Create News Article"
        description="Publish breaking updates and news features instantly to your platform."
      />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles size={12} className="animate-pulse" />
              Content Studio
            </div>
            <h2 className="text-2xl font-bold text-gray-955 dark:text-white">
              Create News Article
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Publish breaking updates and news features instantly to your platform.
            </p>
          </div>
        </div>
        <AddContentForm />
      </div>
    </>
  );
}
