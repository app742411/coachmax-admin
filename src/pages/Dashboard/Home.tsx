import PageMeta from "../../components/common/PageMeta";
import CoachMaxDashboardMetrics from "../../components/coachmax/CoachMaxDashboardMetrics";
import TrainingPerformanceChart from "../../components/coachmax/TrainingPerformanceChart";
import MatchScheduleHome from "../../components/coachmax/MatchScheduleHome";
import LeagueStandings from "../../components/coachmax/LeagueStandings";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";

export default function Home() {
  return (
    <>
      <PageMeta
        title="CoachMax | High-Performance Dashboard"
        description="Athlete management and sports analytics center"
      />
      <div className="space-y-6">
        {/* Row 1: Key Metrics */}
        <CoachMaxDashboardMetrics />

        {/* Row 2: Performance & Fixtures */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <TrainingPerformanceChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <MatchScheduleHome />
          </div>
        </div>

        {/* Row 3: League Table & Store Overview */}
        <div className="grid grid-cols-12 gap-6 pb-6">
          <div className="col-span-12 xl:col-span-7">
            <LeagueStandings />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <RecentOrders />
          </div>
        </div>

        {/* Row 4: Monthly Store Sales */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <MonthlySalesChart />
          </div>
        </div>
      </div>
    </>
  );
}
