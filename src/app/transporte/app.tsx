import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useSearchTransport } from "../../hooks/useSearchTransport/useSearchTransports";
import useNormalizedVehicles from "../../hooks/useNormalizedVehicle/useNormalizedVehicles";
import TransportCard from "../../components/transportCards/transportCard";
import Nav from "../../components/sideBar/sideBar";
export default function ContratarTransorte() {
  const [siderAberto, setSiderAberto] = useState(false);
  const token = Cookies.get("token");
  const { id } = useParams();
  const { state } = useLocation();
  console.log(id, state.transportType, state.consumerName);
  const { data } = useSearchTransport(token, state.transportType);
  console.log(data);
  const carriers = useNormalizedVehicles(data.vehicles);
  // const carriers = [
  //   {
  //     title: "TransAgro Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "Luanda Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "TransAgro Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "Bengo Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "TransAgro Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "TransAgro Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  //   {
  //     title: "TransAgro Express",
  //     type: "Carga Geral",
  //     availability: " Disponível em 24h",
  //     forecast: "2 dias úteis",
  //     capacity: "12 Toneladas",
  //   },
  // ];
  return (
    <>
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden overflow-y-auto bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden overflow-y-auto relative">
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
                    Contratar Transportadora
                  </h2>
                  <p className="text-[11px] md:text-sm text-text-secondary ">
                    Contrate transportadora a sua escolha para inciar a entrega
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 max-w-6xl mx-auto w-full">
              <div className="mb-10 bg-white rounded-xl p-6 border border-border-color shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-text-secondary font-bold">
                      Etapa Atual
                    </span>
                    <p className="text-lg font-bold">Seleção de Transporte</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Passo 2 de 3</span>
                  </div>
                </div>

                <div className="relative w-full h-2.5 bg-border-color  rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{ width: "44%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <div className="flex items-center gap-1.5 text-primary font-medium">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    <span>
                      <span className=" hidden md:block ">Pedido</span> Aceito
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <span className="material-symbols-outlined text-sm">
                      radio_button_checked
                    </span>
                    <span>
                      Seleção{" "}
                      <span className=" hidden md:block ">
                        de Transporte
                      </span>{" "}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary2">
                    <span className="material-symbols-outlined text-sm">
                      radio_button_unchecked
                    </span>
                    <span>Finalização</span>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h1 className="text-[16px] md:text-3xl text-text-main font-semibold tracking-tight mb-2">
                  Contratar Transportadora para {state.consumerName}
                </h1>
                <p className="text-[14px] md:text-[16px] text-text-secondary2">
                  Analise as opções de logística disponíveis e selecione a
                  melhor alternativa para o seu frete.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {carriers.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white  border border-[#f1f3f1]  rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-sm hover:shadow-md"
                  >
                    <div
                      className="h-40 bg-center bg-no-repeat bg-cover relative"
                      style={{
                        backgroundImage: "url('/assets/image/carrinha.png')",
                      }}
                    ></div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold leading-tight mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {item.type}
                          </span>
                          <span className="text-text-secondary2 text-xs">
                            • {item.availability}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6 flex-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary2">
                            Capacidade
                          </span>
                          <span className="font-medium">{item.capacity}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary2">Previsão</span>
                          <span className="font-medium">{item.forecast}</span>
                        </div>
                      </div>
                      <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-sm">
                          local_shipping
                        </span>{" "}
                        Confirmar Transportadora
                      </button>
                    </div>
                  </div>
                ))} */}
                {carriers.map((item) => (
                  <TransportCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
