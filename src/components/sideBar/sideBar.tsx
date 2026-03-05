import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import SignOut from "../signOutModal/modalSignOut";

interface NavProps {
  sidebarAberto: boolean;
  setSidebarAberto: (valor: boolean) => void;
}

export default function SideBar({ sidebarAberto, setSidebarAberto }: NavProps) {
  const rota = useLocation();
  const [abertoSignOut, setAbertoSingOut] = useState(false);
  const rotaAtiva = (path: string) => rota.pathname === path;

  const menuItens = [
    { label: "Dashboard", herf: "/dashboard", icon: "dashboard" },
    { label: "Produtos", herf: "/produtos", icon: "inventory_2" },
    { label: "Pedidos", herf: "/pedidos", icon: "list_alt" },
    { label: "Rastreamento", herf: "/rotas", icon: "local_shipping" },
    { label: "Perfil da Fazenda", herf: "/perfil", icon: "storefront" },
  ];

  return (
    <>
      {sidebarAberto && (
        <div
          onClick={() => setSidebarAberto(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <div
        className={`flex flex-col h-full bg-white border-r border-border-color overflow-y-auto transition-transform duration-300 fixed top-0 left-0 z-40 w-64 ${sidebarAberto ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-64 md:shrink-0`}
      >
        <div className="p-6 pb-2 relative">
          <button
            onClick={() => setSidebarAberto(false)}
            className="md:hidden absolute top-4 right-4 text-text-secondary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="flex items-center gap-3">
            <div className=" flex items-center justify-center rounded-lg h-10 w-10 ">
              <img
                className="h-10"
                src="/assets/image/logo-registagro.png"
                alt="Logo RegistAgro"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-black text-lg font-bold leading-tight tracking-tight">
                RegistAgro
              </h1>
              <p className="text-text-secondary text-xs font-medium">
                Painel Administrativo
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 py-4 px-2 mt-4 flex-1">
          {menuItens.map((item) => (
            <Link
              to={item.herf}
              key={item.herf}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${rotaAtiva(item.herf) ? "bg-green-100 text-green-700 font-semibold" : "text-black/60 hover:bg-background transition-colors group"} transition-colors`}
            >
              <span
                className={`material-symbols-outlined ${rotaAtiva(item.herf) ? "" : "group-hover:text-black/85 transition-colors"}`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm ${rotaAtiva(item.herf) ? "font-semibold" : "font-medium group-hover:text-black/85 transition-colors"}`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="w-full border-t border-border-color">
          <button
            className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            onClick={() => setAbertoSingOut(true)}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Terminar Sessão</span>
          </button>
        </div>
      </div>
      <SignOut openSignOut={abertoSignOut}>
        <button
          className=" flex-1 min-w-30 h-12  bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em]"
          onClick={() => setAbertoSingOut(false)}
        >
          <span className="truncate">Cancelar</span>
        </button>
      </SignOut>
    </>
  );
}
