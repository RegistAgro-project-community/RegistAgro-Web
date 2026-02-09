import { removeToken } from "./auth";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();
  removeToken();
  navigate("/login");
  return null;
}
