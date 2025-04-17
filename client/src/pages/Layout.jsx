import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

function Layout({ children }) {
  return (
    <div className="">
      <Header />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
