import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, menus = [] }) => {
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({});

  //Logout and navigating to the Login page 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  // it changes the state of the menu clicked 
  const toggleMenu = (menuId) => {
    setOpenMenus((previous) => ({
      ...previous,
      [menuId]: !previous[menuId],
    }));
  };

  return (
    <aside
      className={`
        ${isOpen ? "w-80" : "w-20"}
        h-screen
        bg-[#123A63]
        text-white
        flex
        flex-col
        shrink-0
        transition-all
        duration-300
      `}
    >
      <div
        className={`
          h-20
          flex
          items-center
          border-b
          border-white/10
          ${isOpen ? "justify-between px-4" : "justify-center"}
        `}
      >
        {isOpen && (
          <span className="text-xl font-bold">
           GMS
          </span>
        )}

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
      <nav className="flex-1 p-4 overflow-y-auto">
        {menus.map((menu) => {
          const hasChildren =
            menu.children &&
            menu.children.length > 0;

          const isMenuOpen =
            openMenus[menu.menuId];

          return (
            <div
              key={menu.menuId}
              className="mb-2"
            >
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleMenu(menu.menuId)}
                  title={!isOpen ? menu.name : ""}
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
                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap flex-1">
                      {menu.name}
                    </span>
                  )}
                  {isOpen && (
                    <span className="text-sm">
                      {isMenuOpen ? "" : ""}
                    </span>
                  )}
                </button>
              ) : (
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
                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {menu.name}
                    </span>
                  )}
                </Link>
              )}
              {isOpen &&
                hasChildren &&
                isMenuOpen && (
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
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
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