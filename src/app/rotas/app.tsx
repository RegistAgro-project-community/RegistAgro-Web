import { useState, useEffect } from "react";
import Nav from "../../components/sideBar/sideBar";
import DetalhePedido from "../../components/modalDetalhePedido";
import Cookies from "js-cookie";
import { useTracking } from "../../hooks/useTracking/useCarrier";
interface OrderData {
  id: string;
  client: string;
  carrier: string;
  date: string;
  status: string;
}
export default function Rotas() {
  const [siderAberto, setSiderAberto] = useState(false);
  const [abertoDetalhe, setAbertoDetalhe] = useState(false);
  const [waitingPickup, setIsWaitingPickup] = useState("");
  const [inTransit, setIsInTrasit] = useState("");
  const [delivered, setIsDelivered] = useState("");
  const [orders, setIsOrders] = useState<OrderData[]>([]);
  const token = Cookies.get("token");
  const [correntPage, setIsCorrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchOrder, setIsSearchOrder] = useState("");
  const { data } = useTracking(token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(e: any) {
    setIsSearchOrder(e.target.value);
    setIsCorrentPage(1);
    console.log(searchOrder);
  }
  useEffect(() => {
    if (data && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInTrasit(data.cardsData.inTransit.toString() || "0");
      setIsWaitingPickup(data.cardsData.waitingPickup.toString() || "0");
      setIsDelivered(data.cardsData.delivered.toString() || "0");
      setIsOrders([...data.orders]);
    }
  }, [token, data]);
  console.log(orders);

  const filteredOrders = orders
    .filter((item) => {
      const order = searchOrder.toLowerCase();
      return (
        item.client.toLowerCase().includes(order) ||
        item.carrier.toLowerCase().includes(order) ||
        item.status.toLowerCase().includes(order)
      );
    })
    .reverse();

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastPage = correntPage * itemsPerPage;
  const indexOfFristPage = indexOfLastPage - itemsPerPage;
  const correntItems = filteredOrders.slice(indexOfFristPage, indexOfLastPage);
  return (
    <>
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
                    Rastreamento de Entregas
                  </h2>
                  <p className="text-[11px] md:text-sm text-text-secondary ">
                    Monitore o status das entregas em tempo real
                  </p>
                </div>
              </div>
            </div>
            <div className="lex-1 overflow-auto p-8  bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Aguardando Coleta",
                    total: waitingPickup || 0,
                    icon: "package_2",
                  },
                  {
                    label: "Em Trânsito",
                    total: inTransit || 0,
                    icon: "local_shipping",
                  },
                  {
                    label: "Entregues Hoje",
                    total: delivered || 0,
                    icon: "done_all",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex items-center justify-between ${item.icon === "local_shipping" ? "hover:border-blue-300/50 " : item.icon === "package_2" ? "hover:border-orange-300/50" : item.icon === "done_all" ? "bg-primary/30 hover:border-green-300/50" : ""} transition-colors`}
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
                      className={`h-10 w-10 rounded-full ${item.icon === "local_shipping" ? "text-blue-600 bg-blue-100" : item.icon === "package_2" ? "bg-orange-100 text-orange-600" : item.icon === "done_all" ? "bg-green-50 text-green-600" : ""}  flex items-center justify-center`}
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
                      value={searchOrder}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                {/* Tabela */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border-color uppercase">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Destinátário
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Transportadora
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Previsão
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
                            <span className="text-sm font-semibold text-text-main ">
                              {item.client}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className=" text-base font-medium text-text-secondary leading-relaxed capitalize">
                              {item.carrier}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-text-secondary font-medium ">
                              {item.date}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium ${item.status === "delivered" ? "bg-gray-100 text-gray-600  border-gray-200" : item.status === "inTransit" ? "bg-blue-50 text-blue-600 border-blue-100" : item.status === "waitingPickup" ? "bg-green-100 text-green-800 border-green-200" : ""}  border  capitalize`}
                            >
                              {item.status === "delivered" ? "entregue": item.status === "waitingPickup" ? "aguardado  coleta": item.status === "inTransit" ? "Em Trânsito": ""}
                            </span>
                          </td>
                          <td className="px-6 py-4 ">
                            <div
                              className={`flex items-center  justify-end  gap-2`}
                            >
                              {item.status === "delivered" ? null : (
                                <>
                                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white  border active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all">
                                    <span className="material-symbols-outlined text-[16px]">
                                      call
                                    </span>
                                    Entrar em contacto com o motorista
                                  </button>
                                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white  border  active:scale-93 border-border-color hover:border-primary hover:text-primary text-text-secondary text-xs font-medium rounded-lg transition-all">
                                    <span className="material-symbols-outlined text-[16px]">
                                      map
                                    </span>
                                    Ver no mapa
                                  </button>
                                </>
                              )}
                              {item.status !== "delivered" ? null : (
                                <button
                                  onClick={() => setAbertoDetalhe(true)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-dark border active:scale-93  border-border-color hover:bg-gray-50 text-text-secondary text-xs font-medium rounded-lg transition-all`}
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    visibility
                                  </span>
                                  Detalhes
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
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
                {/* Paginação */}
                <div className="px-6 py-4 border-t border-border-color flex items-center justify-between">
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
                      onClick={() => setIsCorrentPage((prev) => prev - 1)}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 active:scale-90"
                      disabled={correntPage === 1}
                    >
                      Anterior
                    </button>

                    <button
                      onClick={() => setIsCorrentPage((prev) => prev + 1)}
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
      <DetalhePedido openDetalhe={abertoDetalhe}>
        <button
          onClick={() => setAbertoDetalhe(false)}
          className="flex-1 min-w-30 h-12  bg-gray-100 border border-border-color active:scale-93 transition-all hover:text-primary text-text-secondary md:px-4 px-3 md:py-5 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em]"
        >
          Fechar Detalhes
        </button>
      </DetalhePedido>
    </>
  );
}
