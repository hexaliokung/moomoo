import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Recursive NavItem for mobile menu
const NavItem = ({ item, depth = 0, closeMenu }) => {
  const [open, setOpen] = useState(false);

  const indent = depth * 8; // px indentation for nested items

  if (item.children) {
    return (
      <div className="w-full">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-100/40 rounded-md transition-colors duration-200 flex justify-between items-center"
          style={{ paddingLeft: `${16 + indent}px` }}
        >
          <span>{item.label}</span>
          <span className="text-sm text-gray-500">{open ? "-" : "+"}</span>
        </button>
        {open && (
          <div className="">
            {item.children.map((child, i) => (
              <NavItem key={i} item={child} depth={depth + 1} closeMenu={closeMenu} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf node: navigate and close menu
  return (
    <div className="w-full">
      <NavLink
        to={item.path}
        className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-100/40 rounded-md transition-colors duration-200"
        onClick={() => closeMenu && closeMenu()}
      >
        {item.label}
      </NavLink>
    </div>
  );
};

const Topbar = () => {
  const location = useLocation();
  // show table number only when URL is exactly "/:tableId" (single numeric segment)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const showTableNumber = pathSegments.length === 1 && !isNaN(pathSegments[0]);
  const tableId = showTableNumber ? pathSegments[0] : null;
  const [menuOpen, setMenuOpen] = useState(false);

  // Menu items should not include the table info — render table info separately
  const menuItems = [
    {
      label: "Admin Panel",
      path: "/admin",
    },
  ];

  return (
    <nav className="bg-white shadow-md w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-3 py-2 md:px-4 md:py-3">
        <NavLink to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 tracking-tight">
          MooMoo
        </NavLink>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6 text-base">
          {showTableNumber && (
            <NavLink
              to="/"
              className="text-red-600 hover:bg-red-100/30 px-3 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              เปลี่ยนโต๊ะ
            </NavLink>
          )}
          {menuItems.map((item, idx) => (
            <div key={idx} className="relative group">
              <NavLink
                to={item.path}
                className="text-gray-700 hover:text-red-600 hover:bg-red-100/30 px-3 py-2 rounded-md transition-colors duration-200"
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </div>

        {/* Hamburger (mobile) */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded text-gray-700 hover:text-red-600"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="pt-2 pb-4">
            {/* Show table info at top of mobile menu (separate from links) */}
              {showTableNumber && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <NavLink
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="inline-block text-sm text-red-600 hover:bg-red-100/30 px-3 py-1 rounded"
                  >
                    เปลี่ยนโต๊ะ
                  </NavLink>
                </div>
              )}

            {menuItems.map((item, i) => (
              <NavItem key={i} item={item} closeMenu={() => setMenuOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Topbar;
