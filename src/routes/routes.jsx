import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Users from "../pages/Users/Users";
import Plazas from "../pages/Plazas";
import Roles from "../pages/Roles";
import SubDepartments from "../pages/SubDepartments";
import GrievanceCategories from "../pages/GrievanceCategory";
import Departments from "../pages/Departments";
import Layout from "../components/Layout";
import TmsRegisterComplaints from "../pages/tms/tms_register_complaints";

import Dashboard from "../pages/dashboard/dashboard";
import TmsComplaints from "../pages/tms/tms_complaints";
import GrievanceSubCategory from "../pages/GrievanceSubCategory";
import RegisteredGrievances from "../pages/RegisteredGrievances";

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
