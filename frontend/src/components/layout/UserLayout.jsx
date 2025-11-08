import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/layout/sidebar/topbar";

const UserLayout = () => {
  return (
    <div>
      <Topbar />
      <main className="container mx-auto px-4 py-3 md:p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;