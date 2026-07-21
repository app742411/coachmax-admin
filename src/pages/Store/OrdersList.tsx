import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { useOrders } from "../../hooks/useOrders";

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useOrders(search, statusFilter, page, limit);

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <PageMeta title="CoachMax | Orders" description="Manage Store Orders" />
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Orders" items={[{ name: "Store", path: "/products" }]} />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-sm relative">
            <input 
              type="text" 
              placeholder="Search Orders (e.g. ORD-123)" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-none border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-none border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
          <div className="overflow-visible no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-red-500">Failed to load orders.</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr 
                      key={order._id} 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-all"
                    >
                      <td className="py-4 px-4 font-semibold text-[#0047FF]">
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{order.parent?.fullName || "N/A"}</div>
                        <div className="font-semibold text-slate-500">{order.parent?.email}</div>
                      </td>
                      <td className="py-4 px-3 font-bold text-slate-800 dark:text-slate-200">${order.totalAmount || 0}</td>
                      <td className="py-4 px-3 font-semibold text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            order.status === "DELIVERED" ? "text-emerald-600" : 
                            order.status === "CANCELLED" ? "text-rose-600" : 
                            "text-amber-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "DELIVERED" ? "bg-emerald-600" : 
                              order.status === "CANCELLED" ? "bg-rose-600" : 
                              "bg-amber-500"
                            }`}
                          />
                          {order.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-900 rounded-none">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNextPage}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> entries
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
