import axios from "../../api/axios";
import Nav from "../../components/nav";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { Link } from "react-router-dom";

interface FormData {
  name: string;
  profile: string;
}
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
}
interface BackendResponse {
  totalProducts?: number;
  data?: FormData;
  pendents?: string;
  ongoing?: string;
  orders: OrderData[];
}
interface BackendError {
  message?: string;
  error?: string | { message: string }[];
  info?: string;
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
  const User_URL = "/users/profile";
  const Order_URL = "/orders/farms/order/get";
  const PRODUTOS_URL = "/products/farms/get/products";
  // const called = useRef(false);
  const [siderAberto, setSiderAberto] = useState(false);

  async function fetchData() {
    const semOrder: BackendResponse = {
      orders: [],
      pendents: "0",
      ongoing: "0",
    };

    const semProduct: BackendResponse = {
      orders: [],
      totalProducts: 0,
    };
    try {
      const [userRes, orderRes, productRes] = await Promise.allSettled([
        axios.get<BackendResponse>(User_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<BackendResponse>(Order_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<BackendResponse>(PRODUTOS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const orderData =
        orderRes.status === "fulfilled" ? orderRes.value.data : semOrder;

      const productData =
        productRes.status === "fulfilled" ? productRes.value.data : semProduct;
      return {
        user: (
          userRes as PromiseFulfilledResult<AxiosResponse<BackendResponse>>
        ).value.data,
        order: orderData,
        product: productData,
      };
    } catch (err) {
      const error = err as AxiosError<BackendError>;

      if (error.response) {
        const data = error.response.data;
        if (Array.isArray(data?.error)) {
          const messagem = data.error.map((e) => e.message).join(", ");
          console.log(messagem);
        }
        if (typeof data?.error === "string") {
          console.log(data.error);
        }

        if (data?.message) {
          console.log(data.message);
        }
        if (data.info) {
          console.log(data.info);
        }
      }
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", token],
    queryFn: fetchData,
    enabled: !!token,
    retry: 1,
    staleTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (token && data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFazendaName(data.user.data?.name || "");
      setFazendaImg(data.user.data?.profile || "");
      setPedentOrder(data.order?.pendents || "");
      setOngoing(data.order?.ongoing || "");
      setTotalProduto(String(data.product.totalProducts));
      setTotalOrders([...data.order.orders]);
      console.log(token);
      console.log(data)
    }
  }, [token, data]);

  if (error) {
    console.log(error);
  }
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
                    {fazendaName || "Problema"}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Produtor Verificado
                  </span>
                </div>
                <div className="h-10 w-10 bg-amber-200 rounded-full hidden md:block ">
                  <img
                    src={`${fazendaIgm ? `${fazendaIgm}` : "http://localhost:5500/upload/users/user-30-01-2026_145927.jpg"}`}
                    alt="Euclénio kkkk"
                    title="Foto de Perfil"
                    className="aspect-square w-full rounded-full object-cover border border-border-color"
                  />
                </div>
              </div>
            </div>
            {/* Conteudo */}
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
                          totalOrders
                            ?.slice(startIndex, endIndex)
                            .map((item, i) => (
                              <tr
                                key={i}
                                className="hover:bg-background/50 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm font-medium text-text-main">
                                  {" "}
                                  <span className="font-mono">{i + 1}</span>
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
