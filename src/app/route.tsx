import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./auth/login/app";
import Register from "./auth/register/app";
import Home from "./dashboard/app";
import Produtos from "./produtos/app";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard" element={<Home />}></Route>
        <Route path="/produtos" element={<Produtos />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
