import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/login";
import Register from "../pages/register/register";

import Users from "../pages/Users/Users";
import Departments from "../pages/Departments";
import SubDepartments from "../pages/SubDepartments";
import Roles from "../pages/Roles";
import Plazas from "../pages/Plazas";

import GrievanceCategories from "../pages/GrievanceCategory";
import GrievanceSubCategory from "../pages/GrievanceSubCategory";
import RegisteredGrievances from "../pages/RegisteredGrievances";
import WebUserGrievances from "../pages/WebUser/WebUserGrievances";
import NodalOfficerGrievances from "../pages/NodalOfficer/NodalOfficerGrievances";
import NodalOfficerPendingGrievances from "../pages/NodalOfficer/NodalOfficerPendingGrievances";
import NodalOfficerReassignedGrievances from "../pages/NodalOfficer/NodalOfficerReassignedGrievances";
import Dashboard from "../pages/dashboard/dashboard";

import TmsRegisterComplaints from "../pages/tms/tms_register_complaints";
import TmsComplaints from "../pages/tms/tms_complaints";

import FieldUserAssignedGrievances from "../pages/Field/FieldUserAssignedGrievances";
import FieldUserCompletedGrievances from "../pages/Field/FieldUserCompletedGrievances";

import Layout from "../components/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* ================= CITIZEN REGISTRATION ================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* ================= USER MANAGEMENT ================= */}

      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />

      <Route
        path="/users/create"
        element={
          <Layout>
            <Users />
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

      {/* ================= DEPARTMENT MANAGEMENT ================= */}

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

      {/* ================= PLAZA MANAGEMENT ================= */}

      <Route
        path="/plazas"
        element={
          <Layout>
            <Plazas />
          </Layout>
        }
      />

      {/* ================= GRIEVANCE MANAGEMENT ================= */}

      <Route
        path="/grievances"
        element={
          <Layout>
            <RegisteredGrievances />
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

      {/* ================= TMS USER ================= */}

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

      {/* ================= FIELD USER ================= */}

      <Route
        path="/field/grievances/assigned"
        element={
          <Layout>
            <FieldUserAssignedGrievances />
          </Layout>
        }
      />

      <Route
        path="/field/grievances/completed"
        element={
          <Layout>
            <FieldUserCompletedGrievances />
          </Layout>
        }
      />

      <Route
  path="/webuser/grievances"
  element={
    <Layout>
      <WebUserGrievances />
    </Layout>
  }
/>
      {/* ================= NODAL OFFICER ================= */}

<Route
  path="/nodal/grievances"
  element={
    <Layout>
      <NodalOfficerGrievances />
    </Layout>
  }
/>

  <Route
  path="/nodal/grievances/pending"
  element={   
    <Layout>
      <NodalOfficerPendingGrievances />
    </Layout>
  }
/>

<Route
  path="/nodal/grievances/reassigned"
  element={
    <Layout>
      <NodalOfficerReassignedGrievances />
    </Layout>
  }
/>

 </Routes>
  );
};


export default AppRoutes;
