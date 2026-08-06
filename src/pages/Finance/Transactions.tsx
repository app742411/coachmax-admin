import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { usePayments, useApprovePayment, useRejectPayment, useDashboardPayments } from "../../hooks/usePayments";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Transactions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = usePayments(search, statusFilter, page, limit);
  const { data: dashboardData } = useDashboardPayments();

  const approvePaymentMutation = useApprovePayment();
  const rejectPaymentMutation = useRejectPayment();

  const transactions = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.pages || 1;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <PageMeta title="CoachMax | Transactions" description="Manage Transactions" />
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Transactions" items={[{ name: "Finance", path: "/finance" }]} />

        {/* Dashboard Stats */}
        {dashboardData?.data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 shadow-theme-xs">
              <p className="text-sm font-semibold text-slate-500 uppercase">Today's Collections</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">${dashboardData.data.todaysCollections || 0}</h3>
            </div>
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 shadow-theme-xs">
              <p className="text-sm font-semibold text-slate-500 uppercase">Monthly Collections</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">${dashboardData.data.monthlyCollections || 0}</h3>
            </div>
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 shadow-theme-xs">
              <p className="text-sm font-semibold text-slate-500 uppercase">Outstanding</p>
              <h3 className="text-2xl font-bold text-amber-500 mt-2">${dashboardData.data.outstandingAmount || 0}</h3>
            </div>
            <div className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-5 shadow-theme-xs">
              <p className="text-sm font-semibold text-slate-500 uppercase">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-brand-500 mt-2">{dashboardData.data.pendingPayments || 0}</h3>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-sm relative">
            <input
              type="text"
              placeholder="Search Transactions (e.g. TXN-123)"
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
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-none shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 overflow-visible">
          <div className="overflow-visible no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#031549] text-white text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-[150px]">Transaction & Invoice</th>
                  <th className="py-3 px-3 min-w-[150px]">Parent/User</th>
                  <th className="py-3 px-3 min-w-[200px]">Payment Details</th>
                  <th className="py-3 px-3 min-w-[90px]">Date</th>
                  <th className="py-3 px-3 min-w-[100px]">Screenshot</th>
                  <th className="py-3 px-3 min-w-[90px]">Status</th>
                  <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">Failed to load transactions.</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((txn: any) => (
                    <tr
                      key={txn._id}
                      onClick={() => {
                        if (txn.invoice?._id) {
                          navigate(`/invoices/${txn.invoice._id}`);
                        }
                      }}
                      className={`border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all ${txn.invoice?._id ? "cursor-pointer" : ""
                        }`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-500">{txn.transactionId || txn._id.substring(txn._id.length - 8)}</div>
                        {txn.invoice?.invoiceNumber && (
                          <Link
                            to={`/invoices/${txn.invoice._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-[#0047FF] hover:underline block"
                          >
                            INV: {txn.invoice.invoiceNumber}
                          </Link>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{txn.parent?.fullName || "N/A"}</div>
                        <div className="font-semibold text-slate-500">{txn.parent?.email}</div>
                        <div className="font-semibold text-slate-500">{txn.parent?.phone}</div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">${txn.amount || 0} <span className="font-semibold text-slate-500 text-xs">({txn.paymentMethod || "UNKNOWN"})</span></div>
                        {txn.remarks && <div className="text-xs text-slate-500 max-w-[200px] truncate" title={txn.remarks}>{txn.remarks}</div>}
                      </td>
                      <td className="py-4 px-3 font-semibold text-slate-500">{formatDate(txn.createdAt)}</td>
                      <td className="py-4 px-3">
                        {txn.paymentScreenshot ? (
                          <a
                            href={`${import.meta.env.VITE_API_BASE_URL}/${txn.paymentScreenshot}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-[#0047FF] hover:underline"
                          >
                            View Image
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${txn.status === "APPROVED" ? "text-emerald-600" : txn.status === "REJECTED" ? "text-rose-600" : "text-amber-500"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${txn.status === "APPROVED" ? "bg-emerald-600" : txn.status === "REJECTED" ? "bg-rose-600" : "bg-amber-500"
                              }`}
                          />
                          {txn.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {txn.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                approvePaymentMutation.mutate(txn._id);
                              }}
                              disabled={approvePaymentMutation.isPending || rejectPaymentMutation.isPending}
                              className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded disabled:opacity-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectPaymentMutation.mutate(txn._id);
                              }}
                              disabled={approvePaymentMutation.isPending || rejectPaymentMutation.isPending}
                              className="px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && total > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <span className="text-sm text-gray-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}