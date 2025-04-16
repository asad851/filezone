import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/themeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <App />
    </ThemeProvider>
  </StrictMode>
);
