import { Navigate } from "react-router-dom";
import { isAuth } from "./auth";
import type { JSX } from "react";

interface PrivateRotePros {
  children: JSX.Element;
}

export function PrivateRote({ children }: PrivateRotePros) {
  return isAuth() ? children : <Navigate to={"/login"} replace />;
}
