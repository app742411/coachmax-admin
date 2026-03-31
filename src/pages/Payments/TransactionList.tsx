import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Search, Download, CreditCard, ArrowRight, User, DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Mock data for transactions
  const transactions = [
    { id: "TXN-9281", user: "Alex Blue", amount: "120.00", method: "Mastercard", status: "COMPLETED", date: "June 24, 2024", type: "Event Fee" },
    { id: "TXN-9282", user: "Jordan Red", amount: "45.00", method: "PayPal", status: "PENDING", date: "June 23, 2024", type: "Merchandise" },
    { id: "TXN-9283", user: "Sam Green", amount: "200.00", method: "Visa", status: "COMPLETED", date: "June 22, 2024", type: "Academy Fee" },
    { id: "TXN-9284", user: "Casey White", amount: "15.00", method: "Bank Transfer", status: "FAILED", date: "June 21, 2024", type: "Training kit" },
    { id: "TXN-9285", user: "Noah Stone", amount: "88.00", method: "Visa", status: "COMPLETED", date: "June 20, 2024", type: "Event Fee" },
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.user.toLowerCase().includes(searchTerm.toLowerCase()) || txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <PageMeta
        title="Coach Max | Revenue Tracker"
        description="Monitor all financial transactions, player payments, and store revenue in real-time."
      />
      <PageBreadcrumb 
        pageTitle="Transactions" 
        items={[
          { name: "Payments", path: "/transactions" },
          { name: "Transaction List", path: "/transactions" }
        ]}
      />

      <div className="space-y-8">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$14,280.00" icon={<DollarSign size={20} />} active />
          <StatCard title="Successful" value="112" icon={<CheckCircle2 size={20} />} />
          <StatCard title="Pending" value="8" icon={<Clock size={20} />} />
          <StatCard title="Failed" value="3" icon={<XCircle size={20} />} />
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex-1 relative group max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by ID or Player Name..."
              className="w-full h-12 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
              {["ALL", "COMPLETED", "PENDING", "FAILED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    statusFilter === s 
                      ? "bg-white dark:bg-gray-700 text-brand-500 shadow-sm" 
                      : "text-gray-400 hover:text-gray-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[11px] font-bold shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Download size={14} /> EXPORT CSV
            </button>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Transaction ID</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Player Info</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Payment Source</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Amount (AUD)</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Outcome</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] text-right">Registry Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/10">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-brand-50/10 dark:hover:bg-brand-500/[0.02] transition-colors group">
                  <td className="px-8 py-6 font-bold text-sm text-gray-900 dark:text-white tracking-tighter">
                    {txn.id}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                        <User size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{txn.user}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{txn.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <CreditCard size={14} className="text-gray-300" />
                       <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{txn.method}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-base font-extrabold text-gray-900 dark:text-white">${txn.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <Badge 
                        variant="light" 
                        color={txn.status === "COMPLETED" ? "success" : txn.status === "PENDING" ? "warning" : "error"}
                        className="text-[10px] font-extrabold px-5 py-1 rounded-full uppercase tracking-tighter"
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold text-gray-500 inline-flex items-center gap-2">
                      {txn.type} <ArrowRight size={10} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-6">
                <CreditCard size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white capitalize">Zero Registry Found</h4>
              <p className="text-sm text-gray-400 font-bold max-w-xs mt-2 lowercase">No transactions match your current query or global filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon, active = false }: { title: string; value: string; icon: React.ReactNode; active?: boolean }) => (
  <div className={`p-8 rounded-[2rem] border transition-all ${active ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/20 border-brand-500" : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm"}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${active ? "bg-white/10" : "bg-gray-50 dark:bg-gray-800 text-brand-500"}`}>
      {icon}
    </div>
    <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${active ? "text-white/70" : "text-gray-400"}`}>{title}</p>
    <h3 className="text-2xl font-black tracking-tighter">{value}</h3>
  </div>
);

export default TransactionList;
