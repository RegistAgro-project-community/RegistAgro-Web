import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../auth/login/login";
import Register from "../auth/register/signup";
import Home from "./dashboard/dashboard";
import Produtos from "./produtos/app";
import Pedidos from "./pedidos/app";
import { PublicRote } from "./publicRote";
import { PrivateRote } from "./privateRote";
import ContratarTransorte from "./transporte/app";
import PerfilUsuario from "./perfil/app";
import Rotas from "./rotas/app";
import ProdutoDetalhe from "./produto-detalhe/app";
import Auth from "../auth/auth";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout para Auth */}
        <Route element={<Auth />}>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <PublicRote>
                <Login />
              </PublicRote>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRote>
                <Register />
              </PublicRote>
            }
          />
        </Route>

        {/* Rotas privadas continuam iguais */}
        <Route
          path="/dashboard"
          element={
            <PrivateRote>
              <Home />
            </PrivateRote>
          }
        />

        <Route
          path="/produtos"
          element={
            <PrivateRote>
              <Produtos />
            </PrivateRote>
          }
        />

        <Route
          path="/pedidos"
          element={
            <PrivateRote>
              <Pedidos />
            </PrivateRote>
          }
        />

        <Route
          path="/pedidos/transporte/:id"
          element={
            <PrivateRote>
              <ContratarTransorte />
            </PrivateRote>
          }
        />

        <Route
          path="/rotas"
          element={
            <PrivateRote>
              <Rotas />
            </PrivateRote>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRote>
              <PerfilUsuario />
            </PrivateRote>
          }
        />

        <Route
          path="/produtos/produto-detalhe/:id"
          element={
            <PrivateRote>
              <ProdutoDetalhe />
            </PrivateRote>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
