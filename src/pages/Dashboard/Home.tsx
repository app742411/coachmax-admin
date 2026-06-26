import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const [attendanceRange, setAttendanceRange] = useState("Last 8 Weeks");
  const [paymentRange, setPaymentRange] = useState("This Month");

  // Apex Chart options for Attendance Overview (Line Chart)
  const lineChartOptions: ApexOptions = {
    colors: ["#0047FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
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
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: ["#0047FF"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: ["24 Mar", "31 Mar", "7 Apr", "14 Apr", "21 Apr", "28 Apr", "5 May", "12 May"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${val}%`,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  const lineChartSeries = [
    {
      name: "Attendance",
      data: [65, 75, 70, 85, 72, 81, 83, 86],
    },
  ];

  // Apex Chart options for Players by Age Group (Donut Chart)
  const donutChartOptions: ApexOptions = {
    colors: ["#0047FF", "#8F00FF", "#06B6D4", "#F97316", "#38BDF8", "#6366F1"],
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
              fontSize: "24px",
              fontWeight: "700",
              color: "#0F172A",
              offsetY: 5,
            },
            total: {
              show: true,
              label: "Total",
              formatter: () => "642",
              fontSize: "12px",
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

  const donutChartSeries = [128, 156, 142, 118, 70, 28];

  const donutLegendItems = [
    { label: "U6 - U8", count: 128, percent: "20%", color: "bg-[#0047FF]" },
    { label: "U9 - U10", count: 156, percent: "24%", color: "bg-[#8F00FF]" },
    { label: "U11 - U12", count: 142, percent: "22%", color: "bg-[#06B6D4]" },
    { label: "U13 - U14", count: 118, percent: "18%", color: "bg-[#F97316]" },
    { label: "U15 - U16", count: 70, percent: "11%", color: "bg-[#38BDF8]" },
    { label: "U17+", count: 28, percent: "5%", color: "bg-[#6366F1]" },
  ];

  return (
    <>
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
          <button className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-theme-xs hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            <span>12 - 18 May 2026</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Card 1: Total Players */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Players</span>
            <div className="p-2 bg-[#0047FF]/10 text-[#0047FF] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">642</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 8.5%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Players */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Active Players</span>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">598</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 6.2%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Programs */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Programs</span>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">24</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <span>—</span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Teams */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teams</span>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">48</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 4.3%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 5: Coaches */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Coaches</span>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">28</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 7.7%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 6: Attendance (This Week) */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Attendance</span>
            {/* Simple circular visual icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#0047FF]" strokeDasharray="86, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">86%</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <span>↓ 3.2%</span>
              <span className="text-slate-400">vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Classes Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Attendance Overview Line Chart */}
        <div className="col-span-12 xl:col-span-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance Overview</h3>
            <div className="relative">
              <select
                value={attendanceRange}
                onChange={(e) => setAttendanceRange(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-8"
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

        {/* Players by Age Group Donut Chart */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Players by Age Group</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[200px] mb-4">
              <Chart options={donutChartOptions} series={donutChartSeries} type="donut" width="100%" />
            </div>
            {/* Custom high fidelity Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2 text-xs">
              {donutLegendItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-500 truncate">{item.label}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">
                    {item.count} <span className="text-[10px] text-slate-400 font-normal">({item.percent})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Classes</h3>
            <a href="#classes" className="text-xs font-semibold text-[#0047FF] hover:underline">View all</a>
          </div>
          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[310px] no-scrollbar">
            {[
              { title: "U8 - Monday 4:15pm", subtitle: "Today, 4:15pm - 5:15pm" },
              { title: "U10A - Monday 4:15pm", subtitle: "Today, 4:15pm - 5:15pm" },
              { title: "U10B - Monday 6:00pm", subtitle: "Today, 6:00pm - 7:00pm" },
              { title: "U12A - Tuesday 4:15pm", subtitle: "Tomorrow, 4:15pm - 5:15pm" },
              { title: "U12B - Tuesday 6:00pm", subtitle: "Tomorrow, 6:00pm - 7:00pm" },
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-[#0047FF] rounded-lg dark:bg-blue-950/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{cls.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{cls.subtitle}</p>
                  </div>
                </div>
                <button className="px-2.5 py-1 text-[10px] font-bold text-[#0047FF] bg-blue-50 hover:bg-blue-100 rounded-md transition-all dark:bg-blue-950/20 dark:text-blue-400">
                  Show Park
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payments, Enrolments, Activities */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Payment Overview */}
        <div className="col-span-12 lg:col-span-5 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Overview</h3>
            <div className="relative">
              <select
                value={paymentRange}
                onChange={(e) => setPaymentRange(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-8"
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
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Collected</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white my-0.5">$18,240</h4>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ 12.5% <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Outstanding</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white my-0.5">$3,240</h4>
              <span className="text-[10px] text-rose-600 font-semibold">↓ 8.3% <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {/* Multi-segmented progress bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: "68%" }} className="h-full bg-emerald-500" />
              <div style={{ width: "12%" }} className="h-full bg-rose-500" />
              <div style={{ width: "8%" }} className="h-full bg-amber-500" />
              <div style={{ width: "12%" }} className="h-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Paid</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">$18,240 <span className="text-[10px] text-slate-400 font-normal">(68%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Overdue</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">$3,240 <span className="text-[10px] text-slate-400 font-normal">(12%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Partial</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">$2,160 <span className="text-[10px] text-slate-400 font-normal">(8%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>Pending</span>
                </div>
                <span className="text-slate-800 dark:text-slate-200">$3,120 <span className="text-[10px] text-slate-400 font-normal">(12%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Enrolment */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Program Enrolment</h3>
            <a href="#programs" className="text-xs font-semibold text-[#0047FF] hover:underline">View all</a>
          </div>
          <div className="flex-1 flex flex-col gap-4 justify-between">
            {[
              { name: "Development Program", value: 212, pct: "w-[85%]" },
              { name: "Elite Program", value: 156, pct: "w-[65%]" },
              { name: "1on1 Sessions", value: 98, pct: "w-[45%]" },
              { name: "Holiday Camps", value: 76, pct: "w-[35%]" },
              { name: "School Programs", value: 62, pct: "w-[28%]" },
              { name: "Mini Kickers", value: 38, pct: "w-[18%]" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-[#0047FF] rounded-full ${item.pct}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <a href="#activity" className="text-xs font-semibold text-[#0047FF] hover:underline">View all</a>
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[330px] no-scrollbar">
            {[
              {
                text: "New player Lucas Martin registered",
                time: "2 hours ago",
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                text: "Payment received from Oliver Matthews",
                time: "3 hours ago",
                color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                text: "Noah Smith moved to U8 - Monday 4:15pm",
                time: "5 hours ago",
                color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
              },
              {
                text: "New trial booked by Liam Carter",
                time: "1 day ago",
                color: "bg-purple-50 text-purple-600 dark:bg-purple-950/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                ),
              },
              {
                text: "Invoice #INV-2456 paid",
                time: "1 day ago",
                color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`p-2 rounded-lg shrink-0 w-8 h-8 flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {activity.text}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes At A Glance Table Section */}
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Classes At A Glance</h3>
          <a href="#classes-full" className="text-xs font-semibold text-[#0047FF] hover:underline">View all</a>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 min-w-[180px]">Class</th>
                <th className="pb-3 min-w-[140px]">Coach</th>
                <th className="pb-3 min-w-[130px]">Day & Time</th>
                <th className="pb-3 min-w-[100px]">Location</th>
                <th className="pb-3 min-w-[80px]">Players</th>
                <th className="pb-3 min-w-[150px]">Attendance (This Week)</th>
                <th className="pb-3 min-w-[80px]">Capacity</th>
                <th className="pb-3 min-w-[80px]">Status</th>
                <th className="pb-3 w-[40px] text-right"></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  className: "U8 - Monday 4:15pm",
                  coach: "Coach Robbie",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
                  time: "Mon 4:15pm - 5:15pm",
                  location: "Shaw Park",
                  players: "18 / 20",
                  attendance: 89,
                  capacity: 20,
                  status: "Active",
                },
                {
                  className: "U10A - Monday 4:15pm",
                  coach: "Coach Max",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                  time: "Mon 4:15pm - 5:15pm",
                  location: "Shaw Park",
                  players: "16 / 18",
                  attendance: 88,
                  capacity: 18,
                  status: "Active",
                },
                {
                  className: "U10B - Monday 6:00pm",
                  coach: "Coach Max",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                  time: "Mon 6:00pm - 7:00pm",
                  location: "Shaw Park",
                  players: "14 / 18",
                  attendance: 82,
                  capacity: 18,
                  status: "Active",
                },
                {
                  className: "U12A - Tuesday 4:15pm",
                  coach: "Coach Robbie",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
                  time: "Tue 4:15pm - 5:15pm",
                  location: "Shaw Park",
                  players: "17 / 20",
                  attendance: 90,
                  capacity: 20,
                  status: "Active",
                },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  {/* Class Name */}
                  <td className="py-4 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 text-[#0047FF] rounded-md dark:bg-blue-950/20 dark:text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>{row.className}</span>
                    </div>
                  </td>
                  {/* Coach */}
                  <td className="py-4 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <img src={row.avatar} alt={row.coach} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold">{row.coach}</span>
                    </div>
                  </td>
                  {/* Time */}
                  <td className="py-4 font-medium text-slate-500 dark:text-slate-400">{row.time}</td>
                  {/* Location */}
                  <td className="py-4 font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{row.location}</span>
                    </div>
                  </td>
                  {/* Players */}
                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">{row.players}</td>
                  {/* Attendance Progress */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${row.attendance}%` }} className="h-full bg-emerald-500 rounded-full" />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 w-8">{row.attendance}%</span>
                    </div>
                  </td>
                  {/* Capacity */}
                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">{row.capacity}</td>
                  {/* Status */}
                  <td className="py-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full dark:bg-emerald-950/20 dark:text-emerald-400">
                      {row.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
