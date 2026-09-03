import { BrowserRouter as Router, Routes, Route, useParams } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PlayersManagement from "./pages/PlayersManagement/PlayersManagement";
import RegistrationRequests from "./pages/PlayersManagement/RegistrationRequests";
import PlayerProfilePage from "./pages/PlayersManagement/PlayerProfilePage";
import Academy from "./pages/Academy/Academy";
import ProgramsManagement from "./pages/Programs/ProgramsManagement";
import ClassesList from "./pages/Classes/ClassesList";
import CloneTermPage from "./pages/Classes/CloneTermPage";
import ProductList from "./pages/Store/ProductList";
import AddProductPage, { EditProductPage } from "./pages/Store/AddProductPage";
import OrdersList from "./pages/Store/OrdersList";
import OrderDetails from "./pages/Store/OrderDetails";
import CoachingManagementPage from "./pages/CochingManagement/CoachingManagementPage";
import CoachesPage from "./pages/Coaches/CoachesPage";
import AddTempPlayers from "./pages/CoachManagement/AddTempPlayers";
import MyClassesList from "./pages/CoachManagement/MyClassesList";
import TemporaryPlayersList from "./pages/CoachManagement/TemporaryPlayersList";
import CoachNotesPage from "./pages/CoachManagement/CoachNotesPage";
import RoleBasedDashboard from "./components/auth/RoleBasedDashboard";
import AddEvent from "./pages/Events/AddEvent";
import EventList from "./pages/Events/EventList";
import ContentListPage from "./pages/Content/ContentListPage";
import AddContentPage from "./pages/Content/AddContentPage";
import NewsDetails from "./pages/Content/NewsDetails";
import GalleryGrid from "./pages/Gallery/GalleryGrid";
import AddGalleryPage from "./pages/Gallery/AddGalleryPage";
import SponsorManagementPage from "./pages/Sponsors/SponsorManagementPage";
import EditEvent from "./pages/Events/EditEvent";
import EventDetails from "./pages/Events/EventDetails";
import BankDetails from "./pages/Finance/BankDetails";
import InvoiceList from "./pages/Finance/InvoiceList";
import InvoiceDetails from "./pages/Finance/InvoiceDetails";
import Transactions from "./pages/Finance/Transactions";
import TermEarningsPage from "./pages/Finance/TermEarningsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import CommunicationPage from "./pages/Communication";
import TeamsManagementPage from "./pages/Teams/TeamsManagementPage";
import TeamDetailsPage from "./pages/Teams/TeamDetailsPage";
import LeaguesManagementPage from "./pages/Teams/LeaguesManagementPage";
import FixturesManagementPage from "./pages/Teams/FixturesManagementPage";
import AuditLogsPage from "./pages/AuditLogs/AuditLogsPage";
import UserManual from "./pages/Docs/UserManual";
import { Toaster } from "react-hot-toast";

function DynamicProgramRoute() {
  const { programType } = useParams<{ programType: string }>();
  const formattedType = programType
    ? programType
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    : 'Academy';
  return <Academy programType={formattedType} />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 999999,
        }}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '0px',
            padding: '16px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<RoleBasedDashboard />} />
            <Route path="/new-registration-request" element={<RegistrationRequests />} />
            <Route path="/players" element={<PlayersManagement />} />
            <Route path="/player/:playerId" element={<PlayerProfilePage />} />
            <Route path="/programs" element={<ProgramsManagement />} />
            <Route path="/classes" element={<ClassesList />} />
            <Route path="/clone-term" element={<CloneTermPage />} />
            <Route path="/program/:programType" element={<DynamicProgramRoute />} />

            {/* Store */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />

            {/* Management */}
            <Route path="/coaching-management" element={<CoachingManagementPage />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/add-temporary-players" element={<AddTempPlayers />} />
            <Route path="/leagues" element={<LeaguesManagementPage />} />
            <Route path="/teams" element={<TeamsManagementPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/fixtures" element={<FixturesManagementPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/news" element={<ContentListPage type="news" />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/add-content" element={<AddContentPage />} />
            <Route path="/gallery" element={<GalleryGrid />} />
            <Route path="/add-gallery" element={<AddGalleryPage />} />
            <Route path="/sponsors" element={<SponsorManagementPage />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event-details/:id" element={<EventDetails />} />

            {/* Finance */}
            <Route path="/bank-details" element={<BankDetails />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/term-earnings" element={<TermEarningsPage />} />
            <Route path="/finance-report" element={<TermEarningsPage />} />

            {/* Audit & Manual */}
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/user-manual" element={<UserManual />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/schedule" element={<MyClassesList />} />
            <Route path="/my-players" element={<PlayersManagement />} />
            <Route path="/temporary-players-list" element={<TemporaryPlayersList />} />
            <Route path="/coach-notes" element={<CoachNotesPage />} />

            {/* Communication & Messages */}
            <Route path="/communication" element={<CommunicationPage />} />
            <Route path="/messages" element={<CommunicationPage />} />
            <Route path="/announcements" element={<CommunicationPage />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
