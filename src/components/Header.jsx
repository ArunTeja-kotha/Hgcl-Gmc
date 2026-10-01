import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const userName = localStorage.getItem("userName") || "User";

  return (
    <header className="h-20 w-full bg-white border-b border-[#D5E0EA] flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center gap-4">

        <img
          src={logo}
          alt="ORR Grievance Management System"
          className="h-11 w-11 rounded-full object-cover"
        />

        <h1 className="text-xl font-semibold text-[#123A63]">
          Grievance Management System
        </h1>

      </div>

      <div className="flex items-center">

        <span className="text-[#1F2937] font-medium text-sm">
          {userName}
        </span>

      </div>

    </header>
  );
};

export default Header;