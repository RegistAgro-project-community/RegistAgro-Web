import React from "react";
import { createRoot } from "react-dom/client";
import "../app/style/global.css";
import { AppRoutes } from "./route";
import "material-symbols/outlined.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  </React.StrictMode>,
);
