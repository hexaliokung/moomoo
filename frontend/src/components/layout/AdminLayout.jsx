import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const adminMenuItems = [
    { name: "เมนู", path: "/admin/menu" },
    { name: "ออเดอร์", path: "/admin/orders" },
    { name: "โต๊ะ", path: "/admin/tables" },
    { name: "บิล", path: "/admin/billing" },
    { name: "คิวรอ", path: "/admin/waitlist" },
  ];

  return (
    <div>
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:p-4">
          <div className="text-2xl font-bold">
            MooMoo Admin
          </div>

          <div className="flex items-center space-x-8">
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-white bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
                    : "text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
                }
              >
                {item.name}
              </NavLink>
            ))}
            <NavLink
              to="/"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
            >
              กลับหน้าร้าน
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-3 md:p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;