import { Navigate } from "react-router-dom";
import { isAuth } from "./auth";
import type { JSX } from "react";

interface PublicRotePros {
  children: JSX.Element;
}

export function PublicRote({ children }: PublicRotePros) {
  return isAuth() ? <Navigate to={"/dashboard"} replace /> : children;
}
