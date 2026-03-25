import { Link } from "react-router";

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface PageBreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ pageTitle, items = [] }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm lg:p-6 transition-all">
      <div>
        <h2 className="text-2xl font-black italic tracking-tight text-gray-900 dark:text-white uppercase">
          {pageTitle}
        </h2>
      </div>
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-500 transition-colors"
              to="/"
            >
              Home
              <svg className="stroke-current opacity-40" width="12" height="12" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {item.path ? (
                <Link
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-500 transition-colors"
                  to={item.path}
                >
                  {item.name}
                  <svg className="stroke-current opacity-40" width="12" height="12" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 italic underline decoration-2 underline-offset-4">
                  {item.name}
                </span>
              )}
            </li>
          ))}
          {(!items || items.length === 0) && (
            <li className="text-[10px] font-black uppercase tracking-widest text-brand-600 italic underline decoration-2 underline-offset-4">
              {pageTitle}
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
