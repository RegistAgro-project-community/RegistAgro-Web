import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./auth/login/app";
import Register from "./auth/register/app";
import Home from "./dashboard/app";
import Produtos from "./produtos/app";
import Pedidos from "./pedidos/app";
import { PublicRote } from "./publicRote";
import { PrivateRote } from "./privateRote";
import ContratarTransorte from "./transporte/app";
import PerfilUsuario from "./perfil/app";
import Rotas from "./rotas/app";
import ProdutoDetalhe from "./produto-detalhe/app";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route
          path="/rotas"
          element={
            <PrivateRote>
              <Rotas />
            </PrivateRote>
          }
        ></Route>
        <Route
          path="/perfil"
          element={
            <PrivateRote>
              <PerfilUsuario />
            </PrivateRote>
          }
        ></Route>
        <Route
          path="/produtos/produto-detalhe/:id"
          element={
            <PrivateRote>
              <ProdutoDetalhe />
            </PrivateRote>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
