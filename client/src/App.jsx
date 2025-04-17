import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { protected_routes, public_routes } from "./routes";
import AuthMiddleware from "./routes/authMiddleware";
import Layout from "./pages/Layout";
import NonAuthLayout from "./lib/NonAuthLayout";
function App() {
  const { userData } = useSelector((state) => state.auth);
  console.log(userData);
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
    </div>
  );
}

export default App;
