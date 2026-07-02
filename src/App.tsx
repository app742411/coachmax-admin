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
import Academy from "./pages/Academy/Academy";
import ProgramsManagement from "./pages/Programs/ProgramsManagement";
import ClassesList from "./pages/Classes/ClassesList";
import ProductList from "./pages/Store/ProductList";
import AddProductPage, { EditProductPage } from "./pages/Store/AddProductPage";
import CoachingManagementPage from "./pages/CochingManagement/CoachingManagementPage";
import RoleBasedDashboard from "./components/auth/RoleBasedDashboard";
import AddEvent from "./pages/Events/AddEvent";
import EventList from "./pages/Events/EventList";
import ContentListPage from "./pages/Content/ContentListPage";
import AddContentPage from "./pages/Content/AddContentPage";
import GalleryGrid from "./pages/Gallery/GalleryGrid";
import AddGalleryPage from "./pages/Gallery/AddGalleryPage";
import SponsorManagementPage from "./pages/Sponsors/SponsorManagementPage";
import EditEvent from "./pages/Events/EditEvent";
import EventDetails from "./pages/Events/EventDetails";
import TeamsManagementPage from "./pages/Teams/TeamsManagementPage";
import LeaguesManagementPage from "./pages/Teams/LeaguesManagementPage";
import FixturesManagementPage from "./pages/Teams/FixturesManagementPage";
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
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
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
            <Route path="/players" element={<PlayersManagement />} />
            <Route path="/programs" element={<ProgramsManagement />} />
            <Route path="/classes" element={<ClassesList />} />
            <Route path="/program/:programType" element={<DynamicProgramRoute />} />
            
            {/* Store */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />

            {/* Management */}
            <Route path="/coaching-management" element={<CoachingManagementPage />} />
            <Route path="/leagues" element={<LeaguesManagementPage />} />
            <Route path="/teams" element={<TeamsManagementPage />} />
            <Route path="/fixtures" element={<FixturesManagementPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/news" element={<ContentListPage type="news" />} />
            <Route path="/add-content" element={<AddContentPage type="blog" />} />
            <Route path="/gallery" element={<GalleryGrid />} />
            <Route path="/add-gallery" element={<AddGalleryPage />} />
            <Route path="/sponsors" element={<SponsorManagementPage />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event-details/:id" element={<EventDetails />} />

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
