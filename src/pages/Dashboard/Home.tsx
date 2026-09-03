import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { getAdminDashboard } from "../../api/adminApi";
import { 
  Users, 
  Layers, 
  Award, 
  TrendingUp, 
  FileText, 
  Clock, 
  ArrowRight
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [attendanceRange, setAttendanceRange] = useState("Last 8 Weeks");
  const [paymentRange, setPaymentRange] = useState("This Month");

  const { data: dashboardRes, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });

  const dashboardData = dashboardRes?.data || dashboardRes;

  const players = dashboardData?.players || {};
  const staff = dashboardData?.staff || {};
  const academics = dashboardData?.academics || {};
  const registrationRequests = dashboardData?.registrationRequests || {};
  const financials = dashboardData?.financials || {};
  const events = dashboardData?.events || {};
  const store = dashboardData?.store || {};
  const recentActivity = dashboardData?.recentActivity || {};

  // Donut chart - Payment Status Breakdown
  const paymentBreakdown = players.paymentStatusBreakdown || {};
  const paidCount = paymentBreakdown.PAID || 0;
  const trialCount = paymentBreakdown.TRIAL || 0;
  const unpaidCount = paymentBreakdown.UNPAID || 0;
  const othersCount = paymentBreakdown.OTHERS || 0;
  const totalStatusCount = paidCount + trialCount + unpaidCount + othersCount;

  const donutChartSeries = [paidCount, trialCount, unpaidCount, othersCount];
  const donutChartOptions: ApexOptions = {
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              color: "#64748B",
              offsetY: -5,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: "700",
              color: "#0F172A",
              offsetY: 5,
            },
            total: {
              show: true,
              label: "Status Total",
              formatter: () => `${totalStatusCount}`,
              fontSize: "11px",
              color: "#64748B",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  const getPercent = (count: number) => {
    if (totalStatusCount === 0) return "0%";
    return `${Math.round((count / totalStatusCount) * 100)}%`;
  };

  const donutLegendItems = [
    { label: "Paid", count: paidCount, percent: getPercent(paidCount), color: "bg-[#10B981]" },
    { label: "Trial", count: trialCount, percent: getPercent(trialCount), color: "bg-[#3B82F6]" },
    { label: "Unpaid", count: unpaidCount, percent: getPercent(unpaidCount), color: "bg-[#F59E0B]" },
    { label: "Others", count: othersCount, percent: getPercent(othersCount), color: "bg-[#8B5CF6]" },
  ];

  // Line Chart options for Attendance Overview
  const lineChartOptions: ApexOptions = {
    colors: ["#0047FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: ["#0047FF"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["24 Mar", "31 Mar", "7 Apr", "14 Apr", "21 Apr", "28 Apr", "5 May", "12 May"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748B", fontSize: "12px" },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${val}%`,
        style: { colors: "#64748B", fontSize: "12px" },
      },
    },
  };

  const lineChartSeries = [
    {
      name: "Attendance",
      data: [75, 78, 80, 85, 82, 88, 87, 91],
    },
  ];

  // Financial Segment Progress calculations
  const totalInvoices = financials.totalInvoices || 0;
  const paidInvoices = financials.paidInvoices || 0;
  const unpaidInvoices = financials.unpaidInvoices || 0;
  const pendingApprovals = financials.pendingPaymentApprovals || 0;

  const paidInvoicePercent = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;
  const unpaidInvoicePercent = totalInvoices > 0 ? Math.round((unpaidInvoices / totalInvoices) * 100) : 0;
  const pendingApprovalPercent = totalInvoices > 0 ? Math.round((pendingApprovals / totalInvoices) * 100) : 0;

  // Request Breakdown calculation
  const reqByType = registrationRequests.byType || {};
  const newPlayerCount = reqByType.NEW_PLAYER || 0;
  const tempPlayerCount = reqByType.TEMPORARY_PLAYER || 0;
  const addProgCount = reqByType.ADD_PROGRAM || 0;
  const eventRegCount = reqByType.EVENT_REGISTRATION || 0;
  const totalReqCount = newPlayerCount + tempPlayerCount + addProgCount + eventRegCount;

  const getReqPercent = (count: number) => {
    if (totalReqCount === 0) return "w-[0%]";
    return `w-[${Math.round((count / totalReqCount) * 100)}%]`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40 bg-[#F1F5F9] dark:bg-slate-950 min-h-screen">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
      </div>
    );
  }


  return (
    <div className="-m-4 md:-m-6 p-4 md:p-6 bg-[#F1F5F9] dark:bg-slate-950 min-h-[calc(100vh-76px)]">
      <PageMeta
        title="Dashboard | CoachMax Admin Dashboard"
        description="Fidelity matched primary CoachMax dashboard UI"
      />

      {/* Header section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Super Admin</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-400">Live Database Overview</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Card 1: Total Players */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Total Players</span>
            <div className="p-2 bg-[#0047FF]/10 text-[#0047FF] rounded-none">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{players.total || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <span className="text-emerald-600">{players.active || 0} Active</span>
              <span>•</span>
              <span className="text-amber-500">{players.pendingApproval || 0} Pending</span>
            </div>
          </div>
        </div>

        {/* Card 2: Classes */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Classes</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-none dark:bg-purple-950/20">
              <Layers size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{academics.totalClasses || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <span>{academics.totalCapacity || 0} Capacity Slots</span>
            </div>
          </div>
        </div>

        {/* Card 3: Programs */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Programs</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none dark:bg-indigo-950/20">
              <Award size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{academics.totalActivePrograms || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <span>{academics.totalCategories || 0} Categories</span>
            </div>
          </div>
        </div>

        {/* Card 4: Coaches */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Coaches</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-none dark:bg-blue-950/20">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{staff.totalCoaches || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <span>Active Coaches: {staff.activeCoaches || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Revenue */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-none dark:bg-emerald-950/20">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">${financials.totalRevenue || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-505 font-bold">
              <span>${financials.outstandingAmount || 0} Outstanding</span>
            </div>
          </div>
        </div>

        {/* Card 6: Pending Requests */}
        <div className="p-4 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wide">Pending Requests</span>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-none dark:bg-amber-950/20">
              <FileText size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">{registrationRequests.pending || 0}</h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <span>Total Requests: {registrationRequests.total || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Classes Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Attendance Overview Line Chart */}
        <div className="col-span-12 xl:col-span-6 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Attendance Overview</h3>
            <div className="relative">
              <select
                value={attendanceRange}
                onChange={(e) => setAttendanceRange(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold text-slate-505 bg-slate-50 border border-slate-200 rounded-none hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="Last 8 Weeks">Last 8 Weeks</option>
                <option value="Last Month">Last Month</option>
                <option value="Yearly">Yearly</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
          <div className="w-full">
            <Chart options={lineChartOptions} series={lineChartSeries} type="area" height={280} />
          </div>
        </div>

        {/* Players by Payment Status Donut Chart */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Players by Status</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[200px] mb-4">
              <Chart options={donutChartOptions} series={donutChartSeries} type="donut" width="100%" />
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2 text-[10px] font-bold">
              {donutLegendItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-400 truncate">{item.label}</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 ml-1">
                    {item.count} <span className="text-[9px] text-slate-400 font-normal">({item.percent})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events list */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Events At A Glance</h3>
            <span className="text-[10px] font-bold text-slate-405">Total: {events.total || 0}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/40 text-xs shadow-md">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Upcoming Events</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">{events.upcoming || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/40 text-xs shadow-md">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Event Registrations</span>
              <span className="text-lg font-bold text-indigo-650 mt-1 block">{events.totalRegistrations || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/40 text-xs shadow-md">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Store Orders</span>
              <span className="text-lg font-bold text-slate-800 dark:text-white mt-1 block">{store.totalOrders || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Payments, Enrolments, Activities */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Payment Overview */}
        <div className="col-span-12 lg:col-span-5 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payment Overview</h3>
            <div className="relative">
              <select
                value={paymentRange}
                onChange={(e) => setPaymentRange(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold text-slate-505 bg-slate-50 border border-slate-200 rounded-none hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/30 rounded-none shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white my-0.5">${financials.totalRevenue || 0}</h4>
              <span className="text-[9px] text-slate-450 font-semibold">Monthly collections: ${financials.monthlyCollections || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/30 rounded-none shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white my-0.5">${financials.outstandingAmount || 0}</h4>
              <span className="text-[9px] text-rose-500 font-semibold">Pending approvals: {financials.pendingPaymentApprovals || 0}</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {/* Multi-segmented progress bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-none overflow-hidden flex">
              <div style={{ width: `${paidInvoicePercent}%` }} className="h-full bg-emerald-500" />
              <div style={{ width: `${unpaidInvoicePercent}%` }} className="h-full bg-rose-500" />
              <div style={{ width: `${pendingApprovalPercent}%` }} className="h-full bg-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Paid Invoices</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">{financials.paidInvoices || 0} <span className="text-[10px] text-slate-450 font-normal">({paidInvoicePercent}%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Unpaid Invoices</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">{financials.unpaidInvoices || 0} <span className="text-[10px] text-slate-450 font-normal">({unpaidInvoicePercent}%)</span></span>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending Approvals</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">{financials.pendingPaymentApprovals || 0} <span className="text-[10px] text-slate-450 font-normal">({pendingApprovalPercent}%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Breakdown */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800/90 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Requests Breakdown</h3>
            <button 
              onClick={() => navigate("/new-registration-request")}
              className="text-xs font-bold text-[#0047FF] hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4 justify-between">
            {[
              { name: "New Player Registration", value: newPlayerCount, pct: getReqPercent(newPlayerCount) },
              { name: "Temporary Player Request", value: tempPlayerCount, pct: getReqPercent(tempPlayerCount) },
              { name: "Add Program Request", value: addProgCount, pct: getReqPercent(addProgCount) },
              { name: "Event Registration", value: eventRegCount, pct: getReqPercent(eventRegCount) },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-none overflow-hidden">
                  <div className={`h-full bg-[#0047FF] rounded-none ${item.pct}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests quick activity feed */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800/90 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Approval Queue</h3>
            <span className="text-[10px] font-bold text-slate-405">Pending: {registrationRequests.pending || 0}</span>
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[330px] no-scrollbar">
            {recentActivity.pendingRequests && recentActivity.pendingRequests.length > 0 ? (
              recentActivity.pendingRequests.slice(0, 5).map((req: any, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => navigate("/new-registration-request")}
                  className="flex gap-2.5 items-start p-2 border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                >
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-none shrink-0 dark:bg-amber-950/20">
                    <Clock size={12} />
                  </div>
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                      {req.player?.fullName || "Player"}
                    </p>
                    <span className="text-[9px] text-[#0047FF] font-bold block uppercase mt-0.5">
                      {req.requestType?.replace("_", " ")}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Parent: {req.parent?.fullName || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 italic text-xs">
                No pending approval requests.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Player Registrations Table Section */}
      <div className="p-6 bg-white border border-slate-200/70 rounded-none shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Player Registrations</h3>
          <button 
            onClick={() => navigate("/players")}
            className="text-xs font-bold text-[#0047FF] hover:underline"
          >
            Manage Players
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 w-[45px] text-center">S.No</th>
                <th className="pb-3 min-w-[150px]">Player</th>
                <th className="pb-3 min-w-[120px]">Parent</th>
                <th className="pb-3 min-w-[130px]">Email</th>
                <th className="pb-3 min-w-[100px]">Phone</th>
                <th className="pb-3 min-w-[100px]">Category</th>
                <th className="pb-3 min-w-[100px]">Payment Status</th>
                <th className="pb-3 min-w-[100px]">Registered Date</th>
                <th className="pb-3 min-w-[80px]">Status</th>
                <th className="pb-3 w-[40px] text-right"></th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.recentPlayers && recentActivity.recentPlayers.length > 0 ? (
                recentActivity.recentPlayers.map((row: any, idx: number) => {
                  const avatarUrl = row.profileImage ? `/${row.profileImage}` : `https://ui-avatars.com/api/?name=${row.fullName}`;
                  const pStatus = row.paymentStatus || "TRIAL";
                  const activeStat = row.playerStatus || "ACTIVE";
                  
                  return (
                    <tr 
                      key={row._id} 
                      onClick={() => navigate(`/player/${row._id}`)}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors"
                    >
                      <td className="py-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      {/* Player */}
                      <td className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <img src={avatarUrl} alt={row.fullName} className="w-6 h-6 rounded-full object-cover border border-slate-100" />
                          <span>{row.fullName}</span>
                        </div>
                      </td>
                      {/* Parent */}
                      <td className="py-4 text-slate-700 dark:text-slate-350 font-semibold">{row.parentId?.fullName || "N/A"}</td>
                      {/* Email */}
                      <td className="py-4 text-slate-550 dark:text-slate-400 font-semibold truncate max-w-[120px]">{row.parentId?.email || "N/A"}</td>
                      {/* Phone */}
                      <td className="py-4 text-slate-550 dark:text-slate-400 font-semibold">{row.parentId?.phone || "N/A"}</td>
                      {/* Category */}
                      <td className="py-4 text-slate-500 dark:text-slate-400 font-bold uppercase">{row.category?.name || "N/A"}</td>
                      {/* Payment Status */}
                      <td className="py-4 font-bold">
                        <span className={`px-2 py-0.5 text-[9px] rounded-full uppercase ${
                          pStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                        }`}>
                          {pStatus.replace("_", " ")}
                        </span>
                      </td>
                      {/* Registered Date */}
                      <td className="py-4 text-slate-550 dark:text-slate-400 font-semibold">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      {/* Status */}
                      <td className="py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-full dark:bg-emerald-950/20 dark:text-emerald-400`}>
                          {activeStat}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => navigate(`/player/${row._id}`)}
                          className="text-slate-450 hover:text-[#0047FF] transition-colors"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    No recent player registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
