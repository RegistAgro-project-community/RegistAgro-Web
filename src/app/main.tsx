import React from "react";
import { createRoot } from "react-dom/client";
import "../app/style/global.css";
import { AppRoutes } from "./route";
import "material-symbols/outlined.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);
