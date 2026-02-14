import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./auth/login/app";
import Register from "./auth/register/app";
import Home from "./dashboard/app";
import Produtos from "./produtos/app";
import Pedidos from "./pedidos/app";
import { PublicRote } from "./publicRote";
import { PrivateRote } from "./privateRote";
import ContratarTransorte from "./transporte/app";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRote>
              <Login />
            </PublicRote>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <PublicRote>
              <Register />
            </PublicRote>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRote>
              <Home />
            </PrivateRote>
          }
        ></Route>
        <Route
          path="/produtos"
          element={
            <PrivateRote>
              <Produtos />
            </PrivateRote>
          }
        ></Route>
        <Route
          path="/pedidos"
          element={
            <PrivateRote>
              <Pedidos />
            </PrivateRote>
          }
        ></Route>
        <Route
          path="/pedidos/transporte"
          element={
            <PrivateRote>
              <ContratarTransorte />
            </PrivateRote>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
