import Nav from "../../components/sideBar/sideBar";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile/useProfile";
import { useOrders } from "../../hooks/userOrders/useOrders";
import { useProducts } from "../../hooks/useProducts/useProduct";

interface Comsumer {
  name: string;
}
interface Product {
  name: string;
  type: string;
}
interface OrderData {
  consumer: Comsumer;
  product: Product;
  status: string;
  value: number;
  created_at: string;
}

export default function Home() {
  const token = Cookies.get("token");
  const [fazendaName, setFazendaName] = useState("");
  const itemsPerPage = 5;
  const [totalOrders, setTotalOrders] = useState<OrderData[] | null>([]);
  const [correntPage] = useState(1);
  const [fazendaIgm, setFazendaImg] = useState("");
  const [ongoing, setOngoing] = useState("");
  const [pendentOrder, setPedentOrder] = useState("");
  const [totalProduto, setTotalProduto] = useState("");
  const [siderAberto, setSiderAberto] = useState(false);
  const { data: orders, isLoading } = useOrders(token);
  const { data: profile } = useProfile(token);
  const { data: products } = useProducts(token);

  useEffect(() => {
    if (token && orders && profile && products) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFazendaName(profile.data.name || "");
      setFazendaImg(profile.data.profile || "");
      setPedentOrder(orders.pendents || "");
      setOngoing(orders.ongoing || "");
      setTotalProduto(String(products.totalProducts));
      setTotalOrders([...orders.orders]);
      console.log(token);
    }
  }, [token, orders, profile, products]);

  const startIndex = (correntPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
              </div>
            )}
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
                    {fazendaName || "Carregando..."}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Produtor Verificado
                  </span>
                </div>
                <div className="h-10 w-10 bg-green-200 rounded-full hidden md:block ">
                  <img
                    src={`${fazendaIgm ? `${fazendaIgm}` : "/assets/image/farm-avatar.png"}`}
                    title="Foto de Perfil"
                    className="aspect-square w-full rounded-full object-cover border border-border-color"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-2xl font-bold text-text-main tracking-tight">
                  Dashbooard da Fazenda
                </h1>
                <p className="text-text-secondary text-[13px] ">
                  Bem-vindo de volta! Aqui está o resumo das sias atividades
                  hoje.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                  {[
                    {
                      icon: "inventory_2",
                      label: "Total de produtos cadastrados",
                      total: totalProduto || 0,
                    },
                    {
                      icon: "pending_actions",
                      label: "Pedidos pendentes",
                      total: pendentOrder || 0,
                    },
                    {
                      icon: "local_shipping",
                      label: "Entregas em andamento",
                      total: ongoing || 0,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-white p-4 rounded-lg border flex items-center justify-between  ${
                        item.icon === "inventory_2"
                          ? "group hover:border-green-300/50"
                          : item.icon === "pending_actions"
                            ? "hover:border-yellow-300/50"
                            : item.icon === "local_shipping"
                              ? "hover:border-blue-300/50"
                              : ""
                      } transition-colors border-gray-200 shadow`}
                    >
                      <div>
                        <p className="text-text-secondary text-sm font-medium mb-1">
                          {item.label}
                        </p>
                        <h3 className="text-3xl font-bold text-text-main">
                          {item.total}
                        </h3>
                      </div>
                      <div className="flex justify-between items-start">
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
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold  text-text-main">
                      Resumo dos Últimos Pedidos
                    </h3>
                    <Link
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                      to="/pedidos"
                    >
                      Ver todos os pedidos
                    </Link>
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
                        {totalOrders && totalOrders.length > 0 ? (
                          [...totalOrders]
                            .sort(
                              (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime(),
                            )
                            ?.slice(startIndex, endIndex)
                            .map((item, i) => (
                              <tr
                                key={i}
                                className="hover:bg-background/50 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm font-medium text-text-main">
                                  {" "}
                                  <span className="font-mono">
                                    {totalOrders.length - (startIndex + i)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary">
                                  {item.consumer.name}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-text-main">
                                  {item.value.toLocaleString("pt-AO", {
                                    style: "currency",
                                    currency: "AOA",
                                  })}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.status === "pendent"
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        : item.status === "confirmed"
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
                            ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-20 text-center">
                              <div className="flex flex-col items-center justify-center w-full">
                                <p className="text-gray-500 font-medium">
                                  {"Você ainda não possui nenhum pedido"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
