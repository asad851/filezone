import React from "react";

function NonAuthLayout({ children }) {
  return <div className="min-h-screen w-full">{children}</div>;
}

export default NonAuthLayout;
