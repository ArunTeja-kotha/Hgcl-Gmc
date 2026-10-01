import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/login";
import Register from "../pages/register/register";

import Layout from "../components/Layout";
import TmsRegisterComplaints from "../pages/tms/tms_register_complaints";

import Dashboard from "../pages/dashboard/dashboard";
import TmsComplaints from "../pages/tms/tms_complaints";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Login */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Citizen Registration */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* TMS Complaints */}
      <Route
        path="/tms/grievances"
        element={
          <Layout>
            <TmsComplaints />
          </Layout>
        }
      />
      <Route
  path="/tms/grievances/new"
  element={
    <Layout>
      <TmsRegisterComplaints />
    </Layout>
  }
/>

    </Routes>
  );
};

export default AppRoutes;