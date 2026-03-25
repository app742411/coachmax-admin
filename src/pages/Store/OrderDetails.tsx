import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Clipboard, 
  Printer, 
  Calendar
} from "lucide-react";
import { Link, useParams } from "react-router";
import Button from "../../components/ui/button/Button";

const OrderDetails = () => {
  const { id } = useParams();

  const orderData = {
    id: id || "ORD-9281",
    date: "June 20, 2024",
    time: "14:32 PM",
    customer: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "+61 412 345 678",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
    },
    items: [
      { id: 1, name: "CM Training Kit", size: "L", qty: 2, price: "90.00", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=100&auto=format&fit=crop" },
      { id: 2, name: "CM Socks/Sleeve", size: "M", qty: 1, price: "15.00", image: "https://images.unsplash.com/photo-1582213704251-872f2d9136ca?q=80&w=100&auto=format&fit=crop" }
    ],
    billing: {
      subtotal: "195.00",
      tax: "15.00",
      shipping: "35.00",
      total: "245.00"
    },
    shipping: {
      address: "CoachMax Academy Grounds, Pitch 4, Main St.",
      method: "Pickup",
      schedule: "June 22, 2024 | 10:00 AM - 12:00 PM"
    }
  };

  return (
    <>
      <PageMeta
        title={`CoachMax | Order ${orderData.id}`}
        description="Review and process customer merchandise orders."
      />
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <Link to="/orders" className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-brand-500 transition-all shadow-sm">
                 <ArrowLeft size={20} />
              </Link>
              <PageBreadcrumb 
                pageTitle={`#${orderData.id}`} 
                items={[
                  { name: "Store", path: "/products" },
                  { name: "Order List", path: "/orders" }
                ]} 
              />
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-black uppercase text-gray-500 hover:text-brand-500 transition-all shadow-sm">
                 <Printer size={16} /> Print Order
              </button>
              <Button className="rounded-2xl px-10 italic font-black uppercase shadow-xl shadow-brand-500/20 active:scale-95 transition-all text-sm">
                 Update Status
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Section: Items & Summary */}
           <div className="lg:col-span-8 space-y-6">
              <div className="bg-brand-500 p-6 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-brand-500/20">
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Order Timeline</span>
                       <h3 className="text-2xl font-black italic tracking-wide uppercase">Order Currently: {status}</h3>
                       <p className="text-xs font-bold opacity-70">Last update: June 20, 2024 at 14:35 PM</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20 active:scale-95 transition-all">Mark as Ready</button>
                       <button className="px-6 py-3 bg-white rounded-2xl text-xs font-black uppercase tracking-widest text-brand-600 shadow-lg active:scale-95 transition-all">Accept Order</button>
                    </div>
                 </div>
                 <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="absolute left-1/2 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              {/* Order Items Table */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6">
                 <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Gear Breakdown</h4>
                 <div className="space-y-4">
                    {orderData.items.map((item) => (
                       <div key={item.id} className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-brand-500/30">
                          <img src={item.image} className="w-16 h-16 object-cover rounded-xl" alt={item.name} />
                          <div className="flex-1 min-w-0">
                             <h5 className="font-black italic text-gray-900 dark:text-white uppercase truncate">{item.name}</h5>
                             <div className="flex items-center gap-4 mt-1">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Size: {item.size}</span>
                                <span className="text-[10px] font-black uppercase text-brand-500 tracking-widest">Qty: {item.qty}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Price</span>
                             <span className="text-base font-black italic text-brand-600">${item.price}</span>
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Calculations */}
                 <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 space-y-3 max-w-xs ml-auto">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <span>Sub Total</span>
                       <span className="text-gray-900 dark:text-white font-black">${orderData.billing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <span>Tax (GST)</span>
                       <span className="text-gray-900 dark:text-white font-black">${orderData.billing.tax}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <span>Shipping/Proc.</span>
                       <span className="text-gray-900 dark:text-white font-black">${orderData.billing.shipping}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black italic text-brand-600 border-t-2 border-brand-500 pt-3">
                       <span className="uppercase tracking-tighter">Total AUD</span>
                       <span>${orderData.billing.total}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Section: Customer & Delivery */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                 <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Player Info</h4>
                 <div className="flex gap-4 mb-6">
                    <img src={orderData.customer.avatar} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/10" alt="" />
                    <div>
                       <h5 className="font-black italic text-gray-900 dark:text-white uppercase truncate">{orderData.customer.name}</h5>
                       <p className="text-xs font-bold text-gray-400 lowercase">{orderData.customer.email}</p>
                       <p className="text-xs font-black text-brand-500 mt-1 uppercase italic">Elite Academy Member</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500 transition-all group">
                       <div className="flex items-center gap-3">
                          <Phone size={18} className="text-brand-500" />
                          <span className="text-xs font-black italic uppercase tracking-wider text-gray-600 dark:text-gray-400 font-black">{orderData.customer.phone}</span>
                       </div>
                       <ArrowLeft size={14} className="text-gray-300 group-hover:text-brand-500 rotate-180 transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-brand-500 transition-all group">
                       <div className="flex items-center gap-3">
                          <Clipboard size={18} className="text-gray-400" />
                          <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Order History</span>
                       </div>
                       <span className="text-[10px] font-black px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-500 uppercase">12 Total</span>
                    </button>
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 overflow-hidden relative">
                 <h4 className="text-sm font-black italic uppercase text-gray-900 dark:text-white mb-6 border-l-4 border-brand-500 pl-3">Order Schedule & Location</h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex shrink-0 items-center justify-center text-brand-500">
                          <MapPin size={20} />
                       </div>
                       <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Academy Grounds {orderData.shipping.method}</span>
                          <p className="text-xs font-black italic uppercase text-gray-700 dark:text-gray-300 leading-relaxed">{orderData.shipping.address}</p>
                               <button className="text-[10px] font-black uppercase text-brand-500 italic mt-1 hover:underline decoration-2 underline-offset-4">Open on Maps</button>
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex shrink-0 items-center justify-center text-brand-500">
                          <Calendar size={20} />
                       </div>
                       <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Scheduled {orderData.shipping.method}</span>
                          <p className="text-xs font-black italic uppercase text-gray-700 dark:text-gray-300 leading-relaxed">{orderData.shipping.schedule}</p>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                       <button className="w-full py-4 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase italic tracking-[0.1em] shadow-xl shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                          <Clock size={16} /> Re-schedule {orderData.shipping.method}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
