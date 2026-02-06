import { useState } from "react";
import Nav from "../components/nav";

export default function Pedidos() {
  const [siderAberto, setSiderAberto] = useState(false);
  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <div className="h-16 w-full bg-white border-b border-border-color flex items-center justify-between  px-8 shrink-0 z-10">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden  mr-1 text-text-secondary hover:text-text-main transition-colors"
                onClick={() => setSiderAberto(true)}
              >
                <span className="material-symbols-outlined text-2xl align-middle">
                  menu
                </span>
              </button>
              <div>
                <h2 className="md:text-2xl text-sm md:font-bold font-medium  text-text-main tracking-tight">
                  Pedidos Recebidos
                </h2>
                <p className="text-[11px] md:text-sm text-text-secondary ">
                  Gerencie e aceite seus pedidos pendentes
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8  bg-background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Pedidos Pendentes",
                  total: 124,
                  icon: "pending_actions",
                },
                {
                  label: "Aguardando Coleta",
                  total: 6,
                  icon: "local_shipping",
                },
                {
                  label: "Concluídos Hoje",
                  total: 10500,
                  icon: "check_circle",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex items-center justify-between ${item.icon === "pending_actions" ? "hover:border-blue-300/50 " : item.icon === "local_shipping" ? "hover:border-orange-300/50" : item.icon === "check_circle" ? "bg-primary/30 hover:border-green-300/50" : ""} transition-colors`}
                >
                  <div>
                    <p className="text-sm text-text-secondary font-medium">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-text-main mt-2">
                      {item.total}
                    </p>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-full ${item.icon === "pending_actions" ? "text-blue-600 bg-blue-100" : item.icon === "local_shipping" ? "bg-orange-100 text-orange-600" : item.icon === "check_circle" ? "bg-green-50 text-green-600" : ""}  flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined">
                      {item.icon}{" "}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
