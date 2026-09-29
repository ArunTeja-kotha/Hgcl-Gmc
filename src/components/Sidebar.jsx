import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, menus = [] }) => {
  return (
    <aside
      className={`
        ${isOpen ? "w-64" : "w-20"}
        h-[calc(100vh-4rem)]
        bg-[#123A63]
        text-white
        flex
        flex-col
        shrink-0
        transition-all
        duration-300
      `}
    >

      {/* Sidebar Header */}
      <div
        className={`
          h-14
          flex
          items-center
          border-b
          border-white/10
          ${isOpen ? "justify-between px-4" : "justify-center"}
        `}
      >

        {/* GMS */}
        {isOpen && (
          <span className="text-xl font-bold">
            GMS
          </span>
        )}

        {/* Three Bars */}
        <button
          type="button"
          onClick={onToggle}
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-md
            text-2xl
            hover:bg-[#2563A6]
            transition
          "
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">

        {menus.map((menu) => (
          <div key={menu.menuId} className="mb-2">

            {/* Main Menu */}
            <Link
              to={menu.route}
              title={!isOpen ? menu.name : ""}
              className="
                flex
                items-center
                gap-4
                px-3
                py-3
                rounded-lg
                hover:bg-[#2563A6]
                transition
              "
            >

              {/* Icon */}
              <span className="text-xl w-6 min-w-6 text-center">
                {menu.icon || "▣"}
              </span>

              {/* Name */}
              {isOpen && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {menu.name}
                </span>
              )}

            </Link>

            {/* Child Menus */}
            {isOpen &&
              menu.children &&
              menu.children.length > 0 && (
                <div className="ml-8 mt-1">

                  {menu.children.map((child) => (
                    <Link
                      key={child.menuId}
                      to={child.route}
                      className="
                        block
                        px-3
                        py-2
                        text-sm
                        rounded-md
                        text-blue-100
                        hover:bg-[#2563A6]
                        transition
                      "
                    >
                      {child.name}
                    </Link>
                  ))}

                </div>
              )}

          </div>
        ))}

      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-4
            px-3
            py-3
            rounded-lg
            hover:bg-[#2563A6]
            transition
            text-left
          "
        >

          <span className="text-xl w-6 min-w-6 text-center">
            ⇥
          </span>

          {isOpen && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;