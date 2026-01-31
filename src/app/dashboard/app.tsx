import Nav from "../components/nav";
import { useState } from "react";
export default function Home() {
  const [siderAberto, setSiderAberto] = useState(false);
  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="h-16 w-full bg-white border-b border-border-color flex items-center justify-between px-8 shrink-0">
              <div className="flex items-center gap-2">
                {" "}
                <button
                  onClick={() => setSiderAberto(true)}
                  className="md:hidden p-1 mr-1 text-text-secondary hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl align-middle">
                    menu
                  </span>
                </button>
                <h2 className="text-sm font-medium text-text-secondary">
                  Visão Geral
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-text-main">
                    {" "}
                    Fazenda Sol Nascente
                  </span>
                  <span className="text-xs text-text-secondary">
                    Produtor Verificado
                  </span>
                </div>
              </div>
            </div>
            {/* Conteudo */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-text-main tracking-tight">
                  Dashbooard da Fazenda
                </h1>
                <p className="text-text-secondary">
                  Bem-vindo de volta! Aqui está o resumo das sias atividades
                  hoje.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  {[
                    {
                      icon: "inventory_2",
                      label: "Total de produtos cadastrados",
                      total: 45,
                    },
                    {
                      icon: "pending_actions",
                      label: "Pedidos pendentes",
                      total: 8,
                    },
                    {
                      icon: "local_shipping",
                      label: "Entregas em andamento",
                      total: 3,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-white p-6 rounded-xl border border-border-color shadow-sm flex flex-col justify-between group ${
                        item.icon === "inventory_2"
                          ? "group hover:border-primary/50"
                          : item.icon === "pending_actions"
                            ? "hover:border-yellow-500/50"
                            : item.icon === "local_shipping"
                              ? "hover:border-blue-500/50"
                              : ""
                      } transition-colors shadow-sm`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={` flex items-center p-2 rounded-lg
                        ${
                          item.icon === "inventory_2"
                            ? "bg-green-50 text-green-600"
                            : item.icon === "pending_actions"
                              ? "bg-yellow-50 text-yellow-600"
                              : item.icon === "local_shipping"
                                ? "bg-blue-50 text-blue-600"
                                : ""
                        } 
                            `}
                        >
                          <span className="material-symbols-outlined text-[28px]">
                            {item.icon}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm font-medium mb-1">
                          {item.label}
                        </p>
                        <h3 className="text-3xl font-bold text-text-main">
                          {item.total}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold  text-text-main">
                      Resumo dos Últimos Pedidos
                    </h3>
                    <a
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                      href="/pedidos"
                    >
                      Ver todos os pedidos
                    </a>
                  </div>
                  <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-border-color">
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Pedido
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Consumidor
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Valor
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {[
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pedente",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pago",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "entregue",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "enviado",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pago",
                          },
                        ].map((item) => (
                          <tr
                            key={item.pedido}
                            className="hover:bg-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-text-main">
                              {" "}
                              <span className="font-mono">{item.pedido}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-text-secondary">
                              {item.nome}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-text-main">
                              {item.valor}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === "pedente"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : item.status === "pago"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : item.status === "enviado"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : item.status === "entregue"
                                          ? "bg-gray-200 text-gray-600"
                                          : ""
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Paginação */}
                    <div className="px-6 py-4 border-t border-border-color flex items-center justify-between">
                      <p className="text-medium text-gray-600">
                        Mostrando{" "}
                        <span className="font-medium text-text-main">1</span> a{" "}
                        <span className="font-medium text-text-main">5</span> de{" "}
                        <span className="font-medium text-text-main">5</span>{" "}
                        Produtos
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 active:scale-90"
                          disabled
                        >
                          Anterior
                        </button>
                        <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-90">
                          Próximo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
