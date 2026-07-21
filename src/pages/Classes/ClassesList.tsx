import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "../../api/apiClient";
import ClassFilters from "../../components/classes/ClassFilters";
import ClassTable from "../../components/classes/ClassTable";
import ViewClassPlayersModal from "../../components/classes/ViewClassPlayersModal";
import AddClassModal from "../../components/classes/AddClassModal";

interface ClassItem {
  _id: string;
  name: string;
  trainingType: string;
  sessionDuration: number;
  status: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  term?: { name: string; year: number };
  program?: { name: string };
  category?: { name: string };
  coach?: { name: string };
  players?: any[];
}

export default function ClassesList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPlayersClassId, setViewPlayersClassId] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      const response = await apiClient.get("/api/admin/getAllClasses");
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.program?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Classes Management | CoachMax" description="Manage your classes" />
      
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classes Management</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#0047FF]">Classes Management</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-none bg-[#0047FF] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-theme-xs"
          >
            + Add Class
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 items-start w-full">
        <div className="flex-1 w-full min-w-0">
          <ClassFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ClassTable 
            classes={filteredClasses}
            isLoading={isLoading}
            onEditClass={() => { /* TODO: handle edit */ }}
            onViewPlayers={(cls) => setViewPlayersClassId(cls._id)}
          />
        </div>
      </div>



        <AddClassModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsLoading(true);
            fetchClasses();
          }} 
        />

      <ViewClassPlayersModal 
        isOpen={!!viewPlayersClassId}
        onClose={() => setViewPlayersClassId(null)}
        classId={viewPlayersClassId}
      />
    </>
  );
}
