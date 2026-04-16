import React from "react";
import { Calendar, School, Sun, Tag } from "lucide-react";

export interface Category {
  _id: string;
  name: string;
}

interface MainTabSelectorProps {
  categories: Category[];
  activeCategoryId: string;
  loading?: boolean;
  onTabChange: (category: Category) => void;
}

/** Pick an icon based on category name keywords */
const getCategoryIcon = (name: string) => {
  const n = name.toUpperCase();
  if (n.includes("ACADEMY")) return <Calendar size={16} />;
  if (n.includes("SCHOOL")) return <School size={16} />;
  if (n.includes("HOLIDAY")) return <Sun size={16} />;
  return <Tag size={16} />;
};

const MainTabSelector: React.FC<MainTabSelectorProps> = ({
  categories,
  activeCategoryId,
  loading = false,
  onTabChange,
}) => {
  if (loading) {
    return (
      <div className="flex bg-white dark:bg-white/[0.03] p-1.5 rounded-2xl border border-gray-200 dark:border-white/[0.05] shadow-sm max-w-fit mx-auto md:mx-0 gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-11 w-36 rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap bg-white dark:bg-white/[0.03] p-1.5 rounded-xl border border-gray-200 dark:border-white/[0.05] shadow-sm max-w-fit mx-auto md:mx-0 gap-1">
      {categories.map((cat) => {
        const isActive = cat._id === activeCategoryId;
        return (
          <button
            key={cat._id}
            onClick={() => onTabChange(cat)}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${isActive
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
          >
            {getCategoryIcon(cat.name)}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default MainTabSelector;
