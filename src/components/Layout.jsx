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
"Field User": "FieldUser",
Citizen: "Citizen",
};

const sidebarRole = roleMap[role] || role;

const menus = sidebarConfig[sidebarRole] || [];

return ( <div className="flex h-screen flex-col overflow-hidden bg-[#F4F8FC]"> <Header />


  <div className="flex min-h-0 flex-1">
    <Sidebar
      isOpen={sidebarOpen}
      onToggle={() =>
        setSidebarOpen((previous) => !previous)
      }
      menus={menus}
    />

    <main className="min-w-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {children}
    </main>
  </div>
</div>

);
};

export default Layout;
