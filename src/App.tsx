import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router"; // Use react-router v7
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/LandingPage/LandingPage";
import ForgetPassword from "./pages/AuthPages/ForgetPassword";
import OTPVerification from "./pages/AuthPages/OTPVerification";
import UpdatePassword from "./pages/AuthPages/UpdatePassword";
import PlayerList from "./pages/Players/PlayerList";
import PlayerDetails from "./pages/Players/PlayerDetails";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserList from "./pages/Users/UserList";
import AddEvent from "./pages/Events/AddEvent";
import EventList from "./pages/Events/EventList";
import ContentListPage from "./pages/Content/ContentListPage";
import AddContentPage from "./pages/Content/AddContentPage";
import GalleryGrid from "./pages/Gallery/GalleryGrid";
import AddGalleryPage from "./pages/Gallery/AddGalleryPage";
import ProductList from "./pages/Store/ProductList";
import AddProductPage, { EditProductPage } from "./pages/Store/AddProductPage";
import OrderList from "./pages/Store/OrderList";
import OrderDetails from "./pages/Store/OrderDetails";
import { UserProvider } from "./context/UserContext";

import SponsorManagementPage from "./pages/Sponsors/SponsorManagementPage";
import EditEvent from "./pages/Events/EditEvent";
import EventDetails from "./pages/Events/EventDetails";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <UserProvider>
          <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/players" element={<PlayerList />} />
              <Route path="/player-details/:id" element={<PlayerDetails />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/event-details/:id" element={<EventDetails />} />
              <Route path="/news" element={<ContentListPage type="news" />} />
              <Route path="/add-news" element={<AddContentPage type="news" />} />
              <Route path="/blogs" element={<ContentListPage type="blog" />} />
              <Route path="/add-blog" element={<AddContentPage type="blog" />} />
              <Route path="/sponsors" element={<SponsorManagementPage />} />
              <Route path="/gallery" element={<GalleryGrid />} />
              <Route path="/add-gallery" element={<AddGalleryPage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/edit-product/:id" element={<EditProductPage />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/order-details/:id" element={<OrderDetails />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verify-OTP" element={<OTPVerification />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
