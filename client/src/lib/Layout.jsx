import Header from "@/components/Header";
import AppSidebar from "@/components/Sidebar";
import React from "react";

function Layout({ children }) {
  return (
    <div className="w-full h-full">
      <Header />

      {/* <AppSidebar /> */}
      <main className="min-h-full w-full h-[calc(100dvh-88px)] px-4 py-2 ">
        {children}
      </main>
    </div>
  );
}

export default Layout;
