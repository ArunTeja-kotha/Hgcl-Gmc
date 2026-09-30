import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import sidebarConfig from "../config/sidebarConfig";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const role = "SuperAdmin";

  const menus = sidebarConfig[role] || [];

  return (
    <div className="h-screen overflow-hidden bg-[#F4F8FC]">
      <Header />

      <div className="flex h-[calc(100vh-5rem)]">
        
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() =>
            setSidebarOpen((previous) => !previous)
          }
          menus={menus}
        />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;