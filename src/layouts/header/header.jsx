import React from "react";
import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="h-18 w-full bg-white border-b border-[#D5E0EA] flex items-center justify-between px-6">

      {/* Logo + Heading */}
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="ORR Grievance Management System"
          className="h-12 w-12 rounded-full object-cover"
        />

        <h2 className="text-xl font-semibold text-[#123A63]">
          Grievance Management System
        </h2>
      </div>

      {/* Username */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#E8F2FB] flex items-center justify-center text-[#123A63] font-semibold">
          U
        </div>

        <span className="text-[#1F2937] font-medium">
          Username
        </span>
      </div>

    </header>
  );
};

export default Header;