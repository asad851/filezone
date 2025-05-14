import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { protected_routes, public_routes } from "./routes";
import AuthMiddleware from "./routes/authMiddleware";
import Layout from "./lib/Layout";
import NonAuthLayout from "./lib/NonAuthLayout";
import { Toaster } from "./components/ui/sonner";
function App() {
  window.document.title = "Filezone";
  const setFavicon = (url) => {
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");
    link.rel = "icon";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  useEffect(() => {
    setFavicon("./images/logo.png");
  }, []);

  return (
    <div>
      <Routes>
        {public_routes?.map((route, id) => (
          <Route
            key={id}
            path={route.path}
            element={
              <NonAuthLayout>
                {React.createElement(route.element)}
              </NonAuthLayout>
            }
          />
        ))}
        {protected_routes?.map((route, id) => (
          <Route
            path={route.path}
            element={
              <AuthMiddleware>
                <Layout>{React.createElement(route.element)}</Layout>
              </AuthMiddleware>
            }
            key={id}
          />
        ))}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
