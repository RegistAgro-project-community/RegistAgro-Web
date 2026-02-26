import { useState, useEffect } from "react";
import Nav from "../components/nav";
import Cookies from "js-cookie";
import axios from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
interface Consumer {
  name: string;
}
interface Product {
  name: string;
}
interface OrderData {
  consumer: Consumer;
  product: Product;
  status: string;
  value: number;
  qtd: number;
  unit: string;
}
interface BackendResponse {
  orders: OrderData[];
  pendents: number;
  total: number;
  ongoing?: number;
}
interface BackendError {
  message?: string;
  error?: string | { message: string }[];
  info?: string;
}
export default function Pedidos() {
  const token = Cookies.get("token");
  const [totalOrders, setTotalOrders] = useState<OrderData[]>([]);
  const [correntPage, setCorrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchProduct, setSearchProduct] = useState("");
  const [ongoing, setOngoing] = useState("");
  const [pendentOrder, setPedentOrder] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const Order_URL = "/orders/farms/order/get";
  const [siderAberto, setSiderAberto] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(e: any) {
    setSearchProduct(e.target.value);
    setCorrentPage(1);
    console.log(searchProduct);
  }
  async function fetchOrdersData() {
    try {
      const data = axios.get<BackendResponse>(Order_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
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
    queryKey: ["Orders", token],
    queryFn: fetchOrdersData,
    enabled: !!token,
    retry: 1,
    staleTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (token && data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPedentOrder(String(data.data.pendents));
      setTotalOrders([...data.data.orders]);
      setOngoing(String(data.data.ongoing));
      setTotalOrder(String(data.data.total));
    }
  }, [token, data]);

  if (error) {
    console.log(error);
  }
  const filterOrders = totalOrders.filter((item) => {
    const order = searchProduct.toLowerCase();
    return item.consumer.name.toLowerCase().includes(order);
  });
  const totalItems = filterOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastPage = correntPage * itemsPerPage;
  const indexOfFristPage = indexOfLastPage - itemsPerPage;
  const correntItems = filterOrders.slice(indexOfFristPage, indexOfLastPage);

  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
            </div>
          )}
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
                  total: pendentOrder || 0,
                  icon: "pending_actions",
                },
                {
                  label: "Aguardando Coleta",
                  total: ongoing || 0,
                  icon: "local_shipping",
                },
                {
                  label: "Concluídos Hoje",
                  total: totalOrder || 0,
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
            <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden overflow-x-auto mt-5">
              {/*Search*/}
              <div className="  p-4  border-b border-border-color flex gap-4 items-center overflow-hidden">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-1/2 text-gray-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-text-main placeholder-gray-400"
                    placeholder="Buscar cliente..."
                    value={searchProduct}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              {/* Tabela */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border-color uppercase">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Consumidor
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Produto
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Qunatidade
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Preço
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {correntItems && correntItems.length > 0 ? (
                    correntItems.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-text-secondary">
                            #{i + 1}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-text-main ">
                            {item.consumer.name}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className=" text-base font-medium text-text-secondary leading-relaxed capitalize">
                            {item.product.name}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-text-secondary font-medium ">
                            {item.qtd}
                            {item.unit}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-text-secondary">
                            {item.value.toLocaleString("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-red-600 transition-colors">
                              Rejeitar
                            </button>
                            <button className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all transform active:scale-95">
                              Aceitar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center w-full">
                          <p className="text-gray-500 font-medium">
                            {totalOrders.length === 0
                              ? "Você ainda não possui nenhum pedido"
                              : filterOrders.length === 0
                                ? "Cliente não encontrado"
                                : ""}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Paginação */}
              <div className="px-6 py-4 border-t border-border-color flex items-center justify-between w-full">
                <p className="text-medium text-gray-600">
                  Mostrando{" "}
                  <span className="font-medium text-text-main">
                    {totalItems === 0 ? 0 : indexOfFristPage + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium text-text-main">
                    {Math.min(indexOfLastPage, totalItems)}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-text-main">
                    {totalItems}
                  </span>{" "}
                  Produtos
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCorrentPage((prev) => prev - 1)}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 active:scale-90"
                    disabled={correntPage === 1}
                  >
                    Anterior
                  </button>

                  <button
                    onClick={() => setCorrentPage((prev) => prev + 1)}
                    disabled={correntPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-90 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
