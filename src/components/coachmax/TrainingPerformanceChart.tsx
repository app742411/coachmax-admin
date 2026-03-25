import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function TrainingPerformanceChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Raleway, sans-serif",
    },
    colors: ["#465FFF", "#10B981"],
    chart: {
      fontFamily: "Raleway, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
  };

  const series = [
    {
      name: "Attendance %",
      data: [82, 75, 90, 85, 95, 70, 60],
    },
    {
      name: "Avg Performance",
      data: [65, 70, 75, 80, 72, 85, 90],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 italic uppercase">
            Training Tracker
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400 font-medium">
            Weekly attendance vs average player performance
          </p>
        </div>
      </div>

      <div className="max-w-full">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
