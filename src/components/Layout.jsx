import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import sidebarConfig from "../config/sidebarConfig";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const storedRole = localStorage.getItem("role");
  const role = storedRole?.replace(/\s+/g, " ").trim();
  const roleMap = {
    "Super Administrator": "SuperAdmin",
    "Web Administrator": "WebAdmin",
    "TMS User": "TMSUser",
    "Web User": "WebUser",
    "Nodal Officer": "NodalOfficer",
    Citizen: "Citizen",
  };
  const sidebarRole = roleMap[role] || role;
  const menus = sidebarConfig[sidebarRole] || [];
  return (
    <div className="min-h-screen bg-[#F4F8FC]">
      <Header />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((previous) => !previous)}
          menus={menus}
        />

        <main className="flex-1 min-w-0 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;