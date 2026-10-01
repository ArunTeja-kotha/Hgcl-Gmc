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
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />

      <Route
        path="/plazas"
        element={
          <Layout>
            <Plazas />
          </Layout>
        }
      />

      <Route
        path="/roles"
        element={
          <Layout>
            <Roles />
          </Layout>
        }
      />

      <Route
        path="/departments"
        element={
          <Layout>
            <Departments />
          </Layout>
        }
      />

      <Route
        path="/sub-departments"
        element={
          <Layout>
            <SubDepartments />
          </Layout>
        }
      />

      <Route
        path="/categories"
        element={
          <Layout>
            <GrievanceCategories />
          </Layout>
        }
      />

      <Route
  path="/sub-categories"
  element={
    <Layout>
      <GrievanceSubCategory />
    </Layout>
  }
/>

  <Route
  path="/grievances"
  element={
    <Layout>
      <RegisteredGrievances />
    </Layout>
  }
/>
    </Routes>
  );
};

export default AppRoutes;
