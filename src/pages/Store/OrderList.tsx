import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { 
  Search, 
  Filter,
  Eye, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Truck, 
  MoreVertical 
} from "lucide-react";
import { Link } from "react-router";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const orders = [
    { id: "ORD-9281", customer: "Alex Johnson", items: 3, total: "245.00", status: "Pending", type: "Take Away", date: "June 20, 2024" },
    { id: "ORD-9282", customer: "Sarah Miller", items: 1, total: "90.00", status: "Accepted", type: "Pickup", date: "June 20, 2024" },
    { id: "ORD-9283", customer: "Mike Ross", items: 2, total: "135.00", status: "Take Away", type: "Take Away", date: "June 19, 2024" },
    { id: "ORD-9284", customer: "David Goggins", items: 5, total: "410.00", status: "Pickup", type: "Pickup", date: "June 19, 2024" },
    { id: "ORD-9285", customer: "Rachel Zane", items: 1, total: "15.00", status: "Pending", type: "Pickup", date: "June 18, 2024" }
  ];

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400";
      case "Accepted": return "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400";
      case "Pickup": return "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400";
      case "Take Away": return "bg-purple-100 text-purple-700 dark:bg-purple-400/10 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <PageMeta
        title="CoachMax | Store Orders"
        description="Monitor and manage all merchandise orders and pickups."
      />
      <div className="space-y-6">
        <PageBreadcrumb 
          pageTitle="Customer Orders" 
          items={[{ name: "Store", path: "/products" }]} 
        />

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "New Orders", value: "12", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
             { label: "Pending", value: "5", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
             { label: "Pickup Ready", value: "3", icon: MapPin, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
             { label: "Total Revenue", value: "$1,840", icon: Truck, color: "text-brand-500", bg: "bg-brand-50 dark:bg-brand-500/10" }
           ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                   <h4 className="text-xl font-black italic text-gray-900 dark:text-white">{stat.value}</h4>
                </div>
             </div>
           ))}
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative group w-full sm:w-80">
                 <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                 <input 
                    placeholder="Search Order ID or Name..." 
                    className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium border border-transparent focus:border-brand-500 outline-none w-full transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-500 transition-colors">
                 <Filter size={16} /> Filter
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Order ID</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Customer</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Type</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Total</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Date</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {orders.map((order) => (
                       <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                          <td className="px-6 py-5">
                             <span className="text-sm font-black text-brand-500 italic">#{order.id}</span>
                          </td>
                          <td className="px-6 py-5">
                             <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{order.customer}</p>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-2">
                                {order.type === "Pickup" ? <MapPin size={14} className="text-gray-400" /> : <Truck size={14} className="text-gray-400" />}
                                <span className="text-xs font-bold text-gray-500">{order.type}</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest ${getStatusStyle(order.status)} underline decoration-2 underline-offset-4`}>
                                {order.status}
                             </span>
                          </td>
                          <td className="px-6 py-5">
                             <span className="text-sm font-black text-gray-900 dark:text-white italic">${order.total} AUD</span>
                          </td>
                          <td className="px-6 py-5">
                             <span className="text-xs font-medium text-gray-400">{order.date}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Link 
                                  to={`/order-details/${order.id}`} 
                                  className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-lg hover:bg-brand-500 hover:text-white transition-all shadow-sm"
                                >
                                   <Eye size={16} />
                                </Link>
                                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                   <MoreVertical size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-6 bg-gray-50/30 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Showing 5 of 42 orders</span>
              <div className="flex items-center gap-2">
                 <button className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-500 shadow-sm active:scale-95 transition-all uppercase">Prev</button>
                 <button className="px-4 py-2 bg-brand-500 rounded-lg text-[10px] font-black text-white shadow-xl shadow-brand-500/20 active:scale-95 transition-all uppercase">Next</button>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;
