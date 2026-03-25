import {
  Users,
  ArrowUp,
  ArrowDown,
  Activity,
  ShoppingBag,
  Trophy,
  LucideIcon
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorClass: string;
  iconContainerClass: string;
}

const MetricCard = ({ title, value, change, isPositive, icon: Icon, colorClass, iconContainerClass }: MetricCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:scale-[1.02] shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${iconContainerClass} shadow-lg shadow-current/10`}>
        <Icon size={28} className={colorClass} />
      </div>
      <div className="flex-1 text-right">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em]">
          {title}
        </span>
        <h4 className="mt-1 text-2xl font-black text-gray-900 dark:text-white italic">
          {value}
        </h4>
        {change && (
          <div className={`mt-1 flex items-center justify-end gap-1 text-[11px] font-black ${isPositive ? "text-green-500" : "text-red-500"} uppercase tracking-tight`}>
            {isPositive ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
            {change}%
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function CoachMaxDashboardMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <MetricCard
        title="Total Players"
        value="1,284"
        change="12.5"
        isPositive={true}
        icon={Users}
        colorClass="text-brand-500"
        iconContainerClass="bg-brand-50 dark:bg-brand-500/10"
      />
      <MetricCard
        title="Live Training"
        value="42"
        change="4.2"
        isPositive={true}
        icon={Activity}
        colorClass="text-blue-500"
        iconContainerClass="bg-blue-50 dark:bg-blue-500/10"
      />
      <MetricCard
        title="League Wins"
        value="18"
        change="2"
        isPositive={true}
        icon={Trophy}
        colorClass="text-yellow-500"
        iconContainerClass="bg-yellow-50 dark:bg-yellow-500/10"
      />
      <MetricCard
         title="Store Revenue"
         value="$42,850"
         change="18.7"
         isPositive={true}
         icon={ShoppingBag}
         colorClass="text-green-500"
         iconContainerClass="bg-green-50 dark:bg-green-500/10"
      />
    </div>
  );
}
