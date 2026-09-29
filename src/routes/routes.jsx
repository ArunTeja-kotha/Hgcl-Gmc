import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/login";
import Register from "../pages/register/register";

import Layout from "../components/Layout";

import Dashboard from "../pages/dashboard/dashboard";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Login Page */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Register Page */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Dashboard inside Layout */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;