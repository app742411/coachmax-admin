import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Link } from "react-router";

const CoachDashboard: React.FC = () => {
  // Mock user for UI purposes since context is not implemented
  const user = { name: "Pro", profileImg: null };

  const [attendanceRange, setAttendanceRange] = useState("Last 8 Weeks");

  // Apex Chart options for Attendance Overview (Line Chart)
  const lineChartOptions: ApexOptions = {
    colors: ["#0047FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 95, 100] },
    },
    dataLabels: { enabled: false },
    markers: { size: 4, colors: ["#0047FF"], strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
    grid: {
      borderColor: "#F1F5F9", strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["24 Mar", "31 Mar", "7 Apr", "14 Apr", "21 Apr", "28 Apr", "5 May", "12 May"],
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: "#64748B", fontSize: "12px" } },
    },
    yaxis: {
      min: 0, max: 100, tickAmount: 4,
      labels: { formatter: (val) => `${val}%`, style: { colors: "#64748B", fontSize: "12px" } },
    },
    tooltip: { theme: "light", x: { show: true }, y: { formatter: (val) => `${val}%` } },
  };

  const lineChartSeries = [
    { name: "Attendance", data: [65, 75, 70, 85, 72, 81, 83, 86] },
  ];

  // Apex Chart options for Performance Index (Donut Chart)
  const donutChartOptions: ApexOptions = {
    colors: ["#0047FF", "#06B6D4", "#10B981", "#F97316"],
    chart: { fontFamily: "Outfit, sans-serif", type: "donut" },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", color: "#64748B", offsetY: -5 },
            value: { show: true, fontSize: "24px", fontWeight: "700", color: "#0F172A", offsetY: 5 },
            total: { show: true, label: "Avg Index", formatter: () => "8.4", fontSize: "12px", color: "#64748B" },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { enabled: true },
  };

  const donutChartSeries = [45, 30, 15, 10];
  const donutLegendItems = [
    { label: "Excellent (9-10)", count: 45, percent: "45%", color: "bg-[#0047FF]" },
    { label: "Good (7-8)", count: 30, percent: "30%", color: "bg-[#06B6D4]" },
    { label: "Average (5-6)", count: 15, percent: "15%", color: "bg-[#10B981]" },
    { label: "Needs Work (<5)", count: 10, percent: "10%", color: "bg-[#F97316]" },
  ];

  return (
    <>
      <PageMeta title="Coach Dashboard | CoachMax" description="Coach analytics and class management" />

      {/* Header section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Coach Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Coach {user.name}!</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link to="/schedule" className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-theme-xs hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            <span>Manage Schedule</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Assigned Players */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Assigned Players</span>
            <div className="p-2 bg-[#0047FF]/10 text-[#0047FF] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">156</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 12%</span><span className="text-slate-400">vs last term</span>
            </div>
          </div>
        </div>

        {/* Card 2: Weekly Training Slots */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Weekly Slots</span>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">12</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <span>—</span><span>consistent load</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg Attendance */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Avg Attendance</span>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">94%</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 2%</span><span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Performance Index */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Performance Index</span>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-1">8.4</h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>↑ 0.3</span><span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Attendance Overview Line Chart */}
        <div className="col-span-12 xl:col-span-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Team Attendance Overview</h3>
            <div className="relative">
              <select
                value={attendanceRange}
                onChange={(e) => setAttendanceRange(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="Last 8 Weeks">Last 8 Weeks</option>
                <option value="Last Month">Last Month</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
          </div>
          <div className="w-full">
            <Chart options={lineChartOptions} series={lineChartSeries} type="area" height={280} />
          </div>
        </div>

        {/* Performance Index Donut Chart */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Performance Distribution</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[200px] mb-4">
              <Chart options={donutChartOptions} series={donutChartSeries} type="donut" width="100%" />
            </div>
            {/* Custom high fidelity Legend */}
            <div className="grid grid-cols-1 gap-y-2 w-full mt-2 text-xs">
              {donutLegendItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-500 truncate">{item.label}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">
                    {item.percent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-theme-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Sessions</h3>
            <Link to="/schedule" className="text-xs font-semibold text-[#0047FF] hover:underline">View all</Link>
          </div>
          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[310px] no-scrollbar">
            {[
              { title: "U-12 Elite Academy", subtitle: "Today, 4:00pm - 5:30pm", location: "Field 1" },
              { title: "Junior Dev Group B", subtitle: "Wednesday, 3:30pm - 5:00pm", location: "Field 3" },
              { title: "High-Performance School", subtitle: "Friday, 2:00pm - 3:30pm", location: "School Turf" },
            ].map((cls, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{cls.title}</h4>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-md">Live</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                   <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   {cls.subtitle}
                </div>
                <div className="flex items-center justify-between mt-1">
                   <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {cls.location}
                   </div>
                   <Link to="/attendance" className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#0047FF] hover:bg-blue-600 rounded-md transition-all">
                     Log Attendance
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoachDashboard;
