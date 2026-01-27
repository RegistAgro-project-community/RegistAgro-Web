import React from "react";
import { createRoot } from "react-dom/client";
import "../app/style/global.css";
import { AppRoutes } from "./route";
import "material-symbols/outlined.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);
