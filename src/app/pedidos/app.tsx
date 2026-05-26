import { useState, useEffect, useRef } from "react";
import Nav from "../../components/sideBar/sideBar";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useNavigate, Link } from "react-router-dom";
import { useOrders } from "../../hooks/userOrders/useOrders";
import { useAcceptOrders } from "../../hooks/useAcceptOrder/useAcceptOrders";
import RejectOrder from "../../components/rejectOrderModal/modalRejectModal";
import Skeleton from "@mui/material/Skeleton";

interface Consumer {
  name: string;
}
interface Product {
  name: string;
  transport: string;
}
interface OrderData {
  consumer: Consumer;
  product: Product;
  status: string;
  transport_status: string | null;
  value: number;
  qtd: number;
  unit: string;
  id: string;
  created_at: string;
}
export default function Pedidos() {
  const token = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState<OrderData[]>([]);
  const [correntPage, setCorrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchProduct, setSearchProduct] = useState("");
  const [incollection, setIncollection] = useState("");
  const [pendentOrder, setPedentOrder] = useState("");
  const toast = useRef<Toast>(null);
  const [totalOrder, setTotalOrder] = useState("");
  const [siderAberto, setSiderAberto] = useState(false);
  const [rejectOpen, setIsRejectOpen] = useState(false);
  const navegate = useNavigate();
  const [select, setIsSelect] = useState({ id: "" });
  function TakeOrderId(id: string) {
    setIsSelect({ id });
    setIsRejectOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(e: any) {
    setSearchProduct(e.target.value);
    setCorrentPage(1);
    console.log(searchProduct);
  }

  const { data, error } = useOrders(token);
  useEffect(() => {
    if (token && data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPedentOrder(String(data.pendents));
      setTotalOrders([...data.orders]);
      setIncollection(String(data.incollection));
      setTotalOrder(String(data.total));
      setIsLoading(false);
    }
  }, [token, data]);
  console.log(totalOrders);
  if (error) {
    console.log(error);
  }
  const { mutate: acceptOrder } = useAcceptOrders(token);
  function handleAccept(id: string) {
    acceptOrder(id, {
      onSuccess: (data) => {
        console.log(data);
        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: data.message,
          life: 2000,
        });
      },
      onError: () => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível aceitar o pedido",
          life: 2000,
        });
      },
    });
  }
  function handleSearchTransport(item: OrderData) {
    navegate(`/pedidos/transporte/${item.id}`, {
      state: {
        transportType: item.product.transport,
        consumerName: item.consumer.name,
      },
    });
  }

  const filterOrders = [...totalOrders]
    .filter((item) => {
      const order = searchProduct.toLowerCase();
      return item.consumer.name.toLowerCase().includes(order);
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const totalItems = filterOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastPage = correntPage * itemsPerPage;
  const indexOfFristPage = indexOfLastPage - itemsPerPage;
  const correntItems = filterOrders.slice(indexOfFristPage, indexOfLastPage);

  return (
    <>
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Toast ref={toast} />
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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={90}
                      animation="wave"
                      sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total de Pedidos",
                      total: totalOrder || 0,
                      icon: "format_list_numbered",
                    },
                    {
                      label: "Pedidos Pendentes",
                      total: pendentOrder || 0,
                      icon: "pending_actions",
                    },
                    {
                      label: "Aguardando Coleta",
                      total: incollection || 0,
                      icon: "local_shipping",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-surface-light p-4 rounded-xl border border-gray-200 flex items-center justify-between `}
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
                        className={`h-10 w-10 rounded-full ${item.icon === "pending_actions" ? "text-blue-600 bg-blue-100" : item.icon === "local_shipping" ? "bg-cyan-100 text-cyan-800" : item.icon === "format_list_numbered" ? "bg-green-50 text-green-600" : ""}  flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined">
                          {item.icon}{" "}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden overflow-x-auto mt-5">
                <div className="  p-4  border-b border-border-color flex gap-4 items-center overflow-hidden">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-1/2 text-gray-400 text-[20px]">
                      search
                    </span>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-full text-sm focus:ring-2 focus:ring-gray-400 text-text-main placeholder-gray-500"
                      placeholder="Buscar cliente..."
                      value={searchProduct}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border-color uppercase">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Consumidor
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Produto
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Quantidade
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
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={130}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={150}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={60}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={90}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5 flex justify-center">
                            <Skeleton
                              variant="rounded"
                              height={22}
                              width={75}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0", borderRadius: "999px" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <Skeleton
                                variant="rounded"
                                height={28}
                                width={65}
                                animation="wave"
                                sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                              />
                              <Skeleton
                                variant="rounded"
                                height={28}
                                width={65}
                                animation="wave"
                                sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : correntItems && correntItems.length > 0 ? (
                      correntItems.map((item, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <span className="text-sm font-semibold text-text-main">
                              {item.consumer.name}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-base font-medium text-text-secondary leading-relaxed capitalize">
                              {item.product.name}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-text-secondary font-medium">
                              {item.qtd}
                              {item.unit === "t" ? "ton" : item.unit}
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
                            <span
                              className={`inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium ${
                                item.status === "delivered"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : item.transport_status === "pendente"
                                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                                    : item.status === "incollection"
                                      ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                                      : item.status === "pendent"
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        : item.status === "confirmed"
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : item.status === "rejected"
                                            ? "bg-red-100 text-red-800 border border-red-200"
                                            : item.status === "ongoing"
                                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                                              : ""
                              }`}
                            >
                              {item.transport_status === "pendente"
                                ? "Aguardando resposta do transporte"
                                : item.status === "incollection"
                                  ? "aguardando à coleta"
                                  : item.status === "pendent"
                                    ? "pendente"
                                    : item.status === "confirmed"
                                      ? "confirmado"
                                      : item.status === "rejected"
                                        ? "rejeitado"
                                        : item.status === "delivered"
                                          ? "entregue"
                                          : item.status === "incollection"
                                            ? "aguardando coleta"
                                            : item.status === "ongoing"
                                              ? "em andamento"
                                              : ""}
                            </span>
                          </td>
                          {item.status === "pendent" ? (
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => TakeOrderId(item.id)}
                                  className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-red-600 transition-colors active:scale-90 cursor-pointer"
                                >
                                  Rejeitar
                                </button>
                                <button
                                  onClick={() => {
                                    handleAccept(item.id);
                                  }}
                                  className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
                                >
                                  Aceitar
                                </button>
                              </div>
                            </td>
                          ) : item.status === "confirmed" &&
                            item.transport_status != "pendente" ? (
                            <td className="px-6 py-5 text-right">
                              <button
                                onClick={() => handleSearchTransport(item)}
                                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
                              >
                                Contratar Transporte
                              </button>
                            </td>
                          ) : item.status === "incollection" ||
                            item.status === "ongoing" ||
                            item.status === "delivered" ? (
                            <td className="px-6 py-5 text-right">
                              <Link
                                to={"/rotas"}
                                className={
                                  "px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
                                }
                              >
                                Ir para rastreamento
                              </Link>
                            </td>
                          ) : (
                            ""
                          )}
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
                    Pedidos
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCorrentPage((prev) => prev - 1)}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 active:scale-90 cursor-pointer"
                      disabled={correntPage === 1}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCorrentPage((prev) => prev + 1)}
                      disabled={correntPage === totalPages || totalPages === 0}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 active:scale-90 disabled:opacity-50 cursor-pointer"
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
      <RejectOrder
        openReject={rejectOpen}
        onClose={() => setIsRejectOpen(false)}
        orderId={select.id}
      >
        <button
          className=" flex-1 min-w-30 h-12  bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em] cursor-pointer"
          onClick={() => setIsRejectOpen(false)}
        >
          <span className="truncate">Cancelar</span>
        </button>
      </RejectOrder>
    </>
  );
}
