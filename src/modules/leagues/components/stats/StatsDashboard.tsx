import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Users,
  Calendar,
  CheckCircle2,
  Goal,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useLeagueStats } from "../../hooks/useLeagueStats";

interface StatsDashboardProps {
  leagueId: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ leagueId }) => {
  const { data: stats, isLoading } = useLeagueStats(leagueId);

  if (isLoading || !stats) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto mb-2" />
        <span className="text-xs font-semibold">Loading League Statistics...</span>
      </div>
    );
  }

  // Cards summary
  const summaryCards = [
    {
      title: "Total Teams",
      value: stats.totalTeams,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Total Matches",
      value: stats.totalMatches,
      icon: Calendar,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Matches Played",
      value: stats.matchesPlayed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Goals Scored",
      value: stats.goalsScored,
      icon: Goal,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Avg Goals / Match",
      value: stats.avgGoalsPerMatch,
      icon: Flame,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
    },
  ];

  // Goals per Team Bar Chart
  const teamVsGoals = stats.teamVsGoals || stats.teamGoals || [];
  const goalsCategories = teamVsGoals.map((t) =>
    t.teamName.replace(/Coach\s*Max\s*/gi, "").slice(0, 14)
  );
  const goalsValues = teamVsGoals.map((t) => t.goals);

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
        distributed: true,
      },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#6366F1"],
    dataLabels: { enabled: true, style: { fontSize: "10px", fontWeight: "bold" } },
    legend: { show: false },
    xaxis: {
      categories: goalsCategories,
      labels: {
        rotate: -35,
        style: { fontSize: "10px", fontWeight: 600 },
      },
    },
    yaxis: {
      title: { text: "Goals", style: { fontSize: "11px", fontWeight: 700 } },
    },
    grid: { strokeDashArray: 3 },
  };

  const barChartSeries = [
    {
      name: "Goals Scored",
      data: goalsValues,
    },
  ];

  // Results Distribution Donut Chart
  const donutSeries = [
    stats.resultsDistribution.decisiveWins ?? stats.resultsDistribution.wins ?? 3,
    stats.resultsDistribution.draws ?? 0,
    stats.resultsDistribution.competitiveGames ?? stats.resultsDistribution.losses ?? 2,
  ];

  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["Decisive Wins", "Draws", "Competitive Games"],
    colors: ["#10B981", "#F59E0B", "#3B82F6"],
    legend: { position: "bottom", fontSize: "12px", fontWeight: 600 },
    dataLabels: { enabled: true },
    stroke: { width: 0 },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          League Statistics
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Comprehensive match telemetry and scoring distributions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {card.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team vs Goals Chart */}
        <div className="lg:col-span-8 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Team vs Goals
              </h3>
              <p className="text-xs text-slate-500">Total offensive goals scored by team.</p>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={280} />
        </div>

        {/* Results Distribution */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Results Distribution
                </h3>
                <p className="text-xs text-slate-500">Wins, draws, and match breakdown.</p>
              </div>
            </div>
            <div className="py-2">
              <Chart options={donutOptions} series={donutSeries} type="donut" height={240} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Scoring Teams Leaderboard */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Top Scoring Teams Leaderboard
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ranked by Goals For
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.topScoringTeams.map((team, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                    idx === 0
                      ? "bg-amber-500 text-white"
                      : idx === 1
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white"
                      : idx === 2
                      ? "bg-amber-700 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {team.teamName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {team.goals}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Goals</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
