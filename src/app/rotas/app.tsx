/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/sideBar/sideBar";
import DetalhePedido from "../../components/PedidoDetalheModal/modalDetalhePedido";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
// import { useTracking } from "../../hooks/useTracking/useCarrier";
import { useOrders } from "../../hooks/userOrders/useOrders";
import Skeleton from "@mui/material/Skeleton";
import MapModal from "../../components/mapModal/modalMap";
import { useFlowProduct } from "../../hooks/useStartFlowProduct/useStartFlowProducts";
// interface DeliveryAddress {
//   street: string;
//   neighborhood: string;
//   city: string;
//   province: string;
// }
// interface Products {
//   name: string;
//   weight: string;
//   qty: number;
// }
// interface OrderData {
//   id: string;
//   client: string;
//   carrier: string;
//   date: string;
//   driver: string;
//   status: string;
//   deliveryAddress: DeliveryAddress;
//   products: Products;
// }
interface Consumer {
  name: string;
}
interface Product {
  name: string;
  transport: string;
}
interface Transport {
  carrier: string;
  plate: string;
  start_at: string;
  delivered_at: string;
}
interface OrderData {
  transport: Transport;
  consumer: Consumer;
  product: Product;
  status: string;
  delivery_adress: string;
  transport_status: string | null;
  value: number;
  qtd: number;
  unit: string;
  id: string;
  created_at: string;
}

export default function Rotas() {
  const [isLoading, setIsLoading] = useState(true);
  const [siderAberto, setSiderAberto] = useState(false);
  const [abertoDetalhe, setAbertoDetalhe] = useState(false);
  const [openMap, setIsOpenMap] = useState(false);
  const [incollection, setIsIncollection] = useState("");
  const [ongoing, setIsOngoing] = useState("");
  const [delivered, setIsDelivered] = useState("");
  const [orders, setIsOrders] = useState<OrderData[]>([]);
  const token = Cookies.get("token");
  const toast = useRef<Toast>(null);
  const [correntPage, setIsCorrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchOrder, setIsSearchOrder] = useState("");
  const [orderSelected, setIsOrderSelected] = useState<OrderData | null>(null);
  const { data } = useOrders(token);
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const [mapOrderId, setMapOrderId] = useState<string>("");
  const { mutate: flowProduct } = useFlowProduct(token);
  function handleFlowProduct(id: string) {
    flowProduct(id, {
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
          detail: "Não foi possível escoar produto",
          life: 2000,
        });
      },
    });
  }
  function handleOpenMap(id: string) {
    setMapOrderId(id);
    setIsOpenMap(true);
  }
  function handleShowDetail(order: OrderData) {
    setIsOrderSelected(order);
    console.log(orderSelected);
    setAbertoDetalhe(true);
  }
  function handleSearch(e: any) {
    setIsSearchOrder(e.target.value);
    setIsCorrentPage(1);
  }
  // useEffect(() => {
  //   if (data && token) {
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setIsOngoing(data.cardsData.ongoing.toString() || "0");
  //     setIsIncollection(data.cardsData.incollection.toString() || "0");
  //     setIsDelivered(data.cardsData.delivered.toString() || "0");
  //     setIsOrders([...data.orders]);
  //     setIsLoading(false);
  //   }
  // }, [token, data]);
  useEffect(() => {
    if (data && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOngoing(data.ongoing.toString() || "0");
      setIsIncollection(data.incollection.toString() || "0");
      setIsDelivered(data.delivered.toString() || "0");
      setIsOrders([...data.orders]);
      setIsLoading(false);
    }
  }, [token, data]);
  console.log(data);
  // const filteredOrders = orders
  //   .filter((item) => {
  //     const order = searchOrder.toLowerCase();
  //     return (
  //       item.client.toLowerCase().includes(order) ||
  //       item.carrier.toLowerCase().includes(order) ||
  //       item.status.toLowerCase().includes(order)
  //     );
  //   })
  //   .reverse();
  const filteredOrders = orders
    .filter((item) => {
      if (!item.transport || !item.consumer) return false;
      const order = searchOrder.toLowerCase();
      const validStatus = ["incollection", "ongoing", "delivered"].includes(
        item.status,
      );
      const matchesSearch =
        item.consumer.name.toLowerCase().includes(order) ||
        item.transport.carrier.toLowerCase().includes(order) ||
        item.status.toLowerCase().includes(order);
      return validStatus && matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastPage = correntPage * itemsPerPage;
  const indexOfFristPage = indexOfLastPage - itemsPerPage;
  const correntItems = filteredOrders.slice(indexOfFristPage, indexOfLastPage);

  return (
    <>
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Toast ref={toast} />
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="h-16 w-full bg-white border-b border-border-color flex items-center justify-between px-8 shrink-0 z-10">
              <div className="flex items-center gap-2">
                <button
                  className="md:hidden mr-1 text-text-secondary hover:text-text-main transition-colors"
                  onClick={() => setSiderAberto(true)}
                >
                  <span className="material-symbols-outlined text-2xl align-middle">
                    menu
                  </span>
                </button>
                <div>
                  <h2 className="md:text-2xl text-sm md:font-bold font-medium text-text-main tracking-tight">
                    Rastreamento de Entregas
                  </h2>
                  <p className="text-[11px] md:text-sm text-text-secondary">
                    Monitore o status das entregas em tempo real
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading
                  ? [...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={90}
                        animation="wave"
                        sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                      />
                    ))
                  : [
                      {
                        label: "Aguardando Coleta",
                        total: incollection || 0,
                        icon: "package_2",
                      },
                      {
                        label: "Em Andamento",
                        total: ongoing || 0,
                        icon: "local_shipping",
                      },
                      {
                        label: "Entregues",
                        total: delivered || 0,
                        icon: "done_all",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-surface-light p-4 rounded-xl border border-border-color flex items-center justify-between"
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
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            item.icon === "local_shipping"
                              ? "text-blue-600 bg-blue-100"
                              : item.icon === "package_2"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : item.icon === "done_all"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : ""
                          }`}
                        >
                          <span className="material-symbols-outlined">
                            {item.icon}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>

              <div className="bg-white rounded-xl border border-border-color overflow-hidden overflow-x-auto mt-5">
                <div className="p-4 border border-border-color flex gap-4 items-center overflow-hidden">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-1/2 text-gray-400 text-[20px]">
                      search
                    </span>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-full text-sm focus:ring-2 focus:ring-gray-400 text-text-main placeholder-gray-500"
                      placeholder="Buscar cliente..."
                      value={searchOrder}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border-color uppercase">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Destinátário
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Transportadora
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center">
                        Início
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
                              width={140}
                              height={20}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              width={150}
                              height={20}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              width={90}
                              height={20}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5 flex justify-center">
                            <Skeleton
                              variant="rounded"
                              width={100}
                              height={22}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0", borderRadius: "999px" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <Skeleton
                                variant="rounded"
                                width={200}
                                height={30}
                                animation="wave"
                                sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                              />
                              <Skeleton
                                variant="rounded"
                                width={100}
                                height={30}
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
                            <span
                              onClick={() => handleShowDetail(item)}
                              className="text-sm font-semibold text-text-main cursor-pointer"
                            >
                              {item.consumer.name}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-base font-medium text-text-secondary leading-relaxed capitalize">
                              {item.transport.carrier}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-text-secondary font-medium text-center">
                              {formatter.format(
                                new Date(item.transport.start_at),
                              )}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium border capitalize ${
                                item.status === "delivered"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : item.status === "ongoing"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : item.status === "incollection"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : ""
                              }`}
                            >
                              {item.status === "delivered"
                                ? "entregue"
                                : item.status === "incollection"
                                  ? "aguardando coleta"
                                  : item.status === "ongoing"
                                    ? "Em andamento"
                                    : ""}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {item.status === "incollection" ? (
                                <>
                                  <button
                                    onClick={() => handleFlowProduct(item.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      play_arrow
                                    </span>
                                    Começar a escoar
                                  </button>
                                  <button
                                    onClick={() => handleOpenMap(item.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      map
                                    </span>
                                    Ver no mapa
                                  </button>
                                </>
                              ) : item.status === "ongoing" ? (
                                <>
                                  <button
                                    onClick={() => handleShowDetail(item)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      visibility
                                    </span>
                                    Detalhes
                                  </button>
                                  <button
                                    onClick={() => handleOpenMap(item.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      map
                                    </span>
                                    Ver no mapa
                                  </button>
                                </>
                              ) : item.status === "delivered" ? (
                                <button
                                  onClick={() => handleShowDetail(item)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-dark border active:scale-93 border-border-color hover:bg-gray-50 text-text-secondary text-xs font-medium rounded-lg transition-all cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    visibility
                                  </span>
                                  Detalhes
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center w-full">
                            <p className="text-gray-500 font-medium">
                              {orders.length === 0
                                ? "Sem entregas no momento."
                                : filteredOrders.length === 0
                                  ? "Cliente não encontrado."
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
                    Transportes
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCorrentPage((prev) => prev - 1)}
                      disabled={correntPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 active:scale-90 cursor-pointer"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setIsCorrentPage((prev) => prev + 1)}
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

      <DetalhePedido
        onClose={() => setAbertoDetalhe(false)}
        openDetalhe={abertoDetalhe}
        order={orderSelected}
      >
        <button
          onClick={() => setAbertoDetalhe(false)}
          className="flex-1 min-w-30 h-12 bg-gray-100 border border-border-color active:scale-93 transition-all hover:text-primary text-text-secondary md:px-4 px-3 md:py-5 py-3 rounded-lg shadow-lg font-bold text-sm leading-normal tracking-[0.015em] cursor-pointer"
        >
          Fechar Detalhes
        </button>
      </DetalhePedido>
      <MapModal
        openMap={openMap}
        onClose={() => setIsOpenMap(false)}
        orderId={mapOrderId}
        token={token}
      >
        <button
          onClick={() => setIsOpenMap(false)}
          className="px-2 py-1 flex items-center justify-center hover:text-gray-600 hover:bg-red-200 rounded cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </MapModal>
    </>
  );
}
