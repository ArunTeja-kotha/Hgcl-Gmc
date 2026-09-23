import React from "react";

const Sidebar = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <aside className="w-64 min-h-[calc(100vh-4.5rem)] bg-[#123A63] flex flex-col px-4 py-6">

      {/* Menu */}
      <nav className="flex flex-col gap-2">

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg bg-[#E8F2FB] text-[#123A63] font-medium"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-[#1D4F85] transition-colors"
        >
          Employees
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-[#1D4F85] transition-colors"
        >
          Departments
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-[#1D4F85] transition-colors"
        >
          Grevience
        </a>

      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full px-4 py-3 rounded-lg bg-[#C94A4A] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;