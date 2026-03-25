// src/components/SponsorManagement/SponsorTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MoreVertical, EditIcon, TrashIcon } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Sponsor, deleteSponsor, toggleBannerStatus } from "../../api/sponsorApi";
import toast from "react-hot-toast";

interface SponsorTableProps {
  sponsors: Sponsor[];
  loading: boolean;
  onEdit: (sponsor: Sponsor) => void;
  onRefresh: () => void;
}

const SponsorTable: React.FC<SponsorTableProps> = ({ sponsors, loading, onEdit, onRefresh }) => {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
    try {
      await deleteSponsor(id);
      toast.success("Sponsor deleted successfully!");
      onRefresh();
    } catch (err) {
      console.error("Error deleting sponsor:", err);
      toast.error("Failed to delete sponsor.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleBannerStatus(id);
      toast.success("Status updated!");
      onRefresh();
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to toggle status.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
            <TableRow>
              <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Banner</TableCell>
              <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Title & Subtitle</TableCell>
              <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Target Link</TableCell>
              <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Status</TableCell>
              <TableCell isHeader className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-gray-500 text-start border-b border-gray-100 dark:border-white/[0.05]">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
                </TableCell>
              </TableRow>
            ) : sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <TableRow key={sponsor._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <TableCell className="px-5 py-4 text-start">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${sponsor.image}`}
                      alt={sponsor.title}
                      className="h-12 w-24 object-cover rounded-lg border border-gray-100 dark:border-white/10 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder/placeholder.jpg";
                      }}
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm dark:text-white/90 uppercase italic tracking-tighter">
                        {sponsor.title}
                      </span>
                      <span className="text-[10px] font-black text-brand-500 uppercase">
                        {sponsor.subtitle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <a
                      href={sponsor.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-500 hover:underline truncate max-w-[150px] block font-mono"
                    >
                      {sponsor.link}
                    </a>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(sponsor._id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${(sponsor.isActive === "active" || sponsor.isActive === "Active" || sponsor.isActive === true)
                          ? "bg-success-500"
                          : "bg-gray-200 dark:bg-gray-700"
                          }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${(sponsor.isActive === "active" || sponsor.isActive === "Active" || sponsor.isActive === true)
                            ? "translate-x-5"
                            : "translate-x-1"
                            }`}
                        />
                      </button>
                      <span className={`text-[9px] font-black uppercase italic tracking-widest ${(sponsor.isActive === "active" || sponsor.isActive === "Active" || sponsor.isActive === true)
                        ? "text-success-600"
                        : "text-gray-400 font-bold"
                        }`}>
                        {(sponsor.isActive === "active" || sponsor.isActive === "Active" || sponsor.isActive === true) ? "Active" : "Deactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="absolute">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === sponsor._id ? null : sponsor._id)}
                        className="p-2 dropdown-toggle bg-gray-100 dark:bg-white/5 shadow-sm rounded-xl text-gray-500 hover:text-brand-500 transition-all border border-transparent hover:border-brand-500/20"
                      >
                        <MoreVertical size={16} />
                      </button>

                      <Dropdown
                        isOpen={openMenuId === sponsor._id}
                        onClose={() => setOpenMenuId(null)}
                        className="w-36 p-2 right-0 left-auto z-[999]"
                      >
                        <DropdownItem
                          onClick={() => { onEdit(sponsor); setOpenMenuId(null); }}
                          className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        >
                          <EditIcon size={14} />
                          <span className="text-xs font-black uppercase tracking-widest italic">Edit</span>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => { handleDelete(sponsor._id); setOpenMenuId(null); }}
                          className="flex items-center gap-2 text-error-600 hover:bg-error-50 rounded-lg p-2 transition-colors"
                        >
                          <TrashIcon size={14} />
                          <span className="text-xs font-black uppercase tracking-widest italic">Delete</span>
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-16 text-center text-gray-400 italic font-black uppercase tracking-widest text-[10px]">
                  No sponsors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SponsorTable;
