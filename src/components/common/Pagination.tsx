

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, totalItems, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 sm:px-6 mt-4 shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          className="relative inline-flex items-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          className="relative ml-3 inline-flex items-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{((page - 1) * limit) + 1}</span> to{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Math.min(page * limit, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px shadow-sm" aria-label="Pagination">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              className="relative inline-flex items-center rounded-none border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => onPageChange(pNum)}
                className={`relative inline-flex items-center border px-3 py-2 text-xs font-bold ${
                  pNum === page
                    ? "z-10 bg-[#0047FF] border-[#0047FF] text-white"
                    : "bg-white border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {pNum}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              className="relative inline-flex items-center rounded-none border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
