import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import useLocalStorageWithExpiry from "hooks/useLocalStorageWithExpiry";

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const ALLOW_ROLES = ["doctor", "admin", "patient"];
  let userRole = "";

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      userRole = decodedToken.role;

      if (ALLOW_ROLES.includes(userRole)) {
        console.log("User role is allowed:", userRole);
      } else {
        console.log("User role is not allowed:", userRole);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.log("No token found in localStorage.");
  }

  const isUnauthorized = !token || !ALLOW_ROLES.includes(userRole);

  useLocalStorageWithExpiry();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<SignUp />} />
        {isUnauthorized && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route
          path="/doctor-dashboard"
          element={<Dashboard role={ALLOW_ROLES[0]} />}
        />
        {/* <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute allowedRoles={[ALLOW_ROLES[0]]}>
              <Dashboard role={ALLOW_ROLES[0]} />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={[ALLOW_ROLES[1]]}>
              <Dashboard role={ALLOW_ROLES[1]} />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute allowedRoles={[ALLOW_ROLES[2]]}>
              <Dashboard role={ALLOW_ROLES[2]} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
