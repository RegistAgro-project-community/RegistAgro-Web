import { useLocation } from "react-router-dom";

interface NavProps {
  sidebarAberto: boolean;
  setSidebarAberto: (valor: boolean) => void;
}

function Nav({ sidebarAberto, setSidebarAberto }: NavProps) {
  const rota = useLocation();
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
        className={`
        flex flex-col
        h-full
        bg-white
        border-r border-border-color
        overflow-y-auto
        transition-transform duration-300

        fixed top-0 left-0 z-40 w-64
        
       
        ${sidebarAberto ? "translate-x-0" : "-translate-x-full"}

        md:relative
        md:translate-x-0
        md:w-64
        md:shrink-0
      `}
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
                src="/public/assets/logo-registagro.png"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main text-lg font-bold leading-tight tracking-tight">
                RegistAgro
              </h1>
              <p className="text-text-secondary text-xs font-medium">
                Painel Administrativo
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 p-4 mt-4 flex-1">
          {menuItens.map((item) => (
            <a
              href={item.herf}
              key={item.herf}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                rotaAtiva(item.herf)
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-background transition-colors group"
              } transition-colors`}
            >
              <span
                className={`material-symbols-outlined ${
                  rotaAtiva(item.herf)
                    ? ""
                    : "group-hover:text-primary transition-colors"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm ${
                  rotaAtiva(item.herf)
                    ? "font-semibold"
                    : "font-medium group-hover:text-text-main transition-colors"
                }`}
              >
                {item.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-border-color">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            href="/logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Terminar Sessão</span>
          </a>
        </div>
      </div>
    </>
  );
}
export default Nav;
