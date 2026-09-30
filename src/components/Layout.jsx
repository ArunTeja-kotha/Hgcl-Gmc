import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import sidebarConfig from "../config/sidebarConfig";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const role = "SuperAdmin";

  const menus = sidebarConfig[role] || [];

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