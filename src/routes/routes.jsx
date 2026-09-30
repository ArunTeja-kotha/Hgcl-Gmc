import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Users from "../pages/Users/Users";

import Layout from "../components/Layout";
import Dashboard from "../pages/dashboard/dashboard";
import TmsComplaints from "../pages/tms/tms_complaints";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/tms/grievances"
        element={
          <Layout>
            <TmsComplaints />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;