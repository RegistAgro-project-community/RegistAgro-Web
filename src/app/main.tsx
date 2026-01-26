import React from "react";
import { createRoot } from "react-dom/client";
import "../app/style/global.css";
import { AppRoutes } from "./route";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);
