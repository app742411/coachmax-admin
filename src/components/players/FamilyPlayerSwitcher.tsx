import { useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { getMediaUrl, getMediaFallback } from "../../utils/media";

type Child = { _id: string; fullName?: string; profileImage?: string | null; playerStatus?: string | null };

export default function FamilyPlayerSwitcher({ children, selectedId }: { children: Child[]; selectedId: string }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (children.length < 2) return null;

  const scrollBy = (direction: number) => scrollRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Users size={17} className="text-blue-600" /><div><h2 className="text-sm font-bold text-gray-900">Children in this family</h2><p className="text-xs text-gray-500">Choose a child to view their individual records</p></div></div>
        <div className="flex gap-1"><button onClick={() => scrollBy(-1)} aria-label="Previous child" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"><ChevronLeft size={16} /></button><button onClick={() => scrollBy(1)} aria-label="Next child" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"><ChevronRight size={16} /></button></div>
      </div>
      <div ref={scrollRef} className="flex snap-x gap-3 overflow-x-auto pb-1">
        {children.map((child) => {
          const name = child.fullName || "Player";
          const selected = String(child._id) === String(selectedId);
          return <button key={child._id} onClick={() => navigate(`/player/${child._id}`)} aria-current={selected ? "page" : undefined} className={`flex min-w-[220px] snap-start items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200" : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"}`}>
            <img src={getMediaUrl(child.profileImage, getMediaFallback(name))} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = getMediaFallback(name); }} className="h-11 w-11 rounded-full object-cover" />
            <span className="min-w-0"><span className="block truncate text-sm font-bold text-gray-900">{name}</span><span className={`mt-0.5 block text-[10px] font-bold uppercase ${selected ? "text-blue-700" : "text-gray-500"}`}>{selected ? "Currently viewing" : child.playerStatus || "View profile"}</span></span>
          </button>;
        })}
      </div>
    </section>
  );
}
