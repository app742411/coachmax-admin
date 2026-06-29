import React from "react";
import Home from "../../pages/Dashboard/Home";
import CoachDashboard from "../../pages/Dashboard/CoachDashboard";

const RoleBasedDashboard: React.FC = () => {
  const userStr = localStorage.getItem("user");
  let user = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Failed to parse user from local storage", error);
  }

  // Check if user role is exactly "SUPER_ADMIN"
  if (user?.role === "SUPER_ADMIN") {
    return <Home />;
  }

  // Default to Coach Dashboard for "COACH" or fallback
  return <CoachDashboard />;
};

export default RoleBasedDashboard;
