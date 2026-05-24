import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSearchTransport } from "../../hooks/useSearchTransport/useSearchTransports";
import useNormalizedVehicles from "../../hooks/useNormalizedVehicle/useNormalizedVehicles";
import TransportCard from "../../components/transportCards/transportCard";
import Nav from "../../components/sideBar/sideBar";
export default function ContratarTransorte() {
  const [siderAberto, setSiderAberto] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const { id } = useParams();
  const { state } = useLocation();
  console.log(id, state.transportType, state.consumerName);
  const { data } = useSearchTransport(token, state.transportType);
  console.log(data);
  const carriers = useNormalizedVehicles(data?.vehicles);
  return (
    <>
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden overflow-y-auto bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden overflow-y-auto relative">
            <div className="h-16 w-full bg-white border-b border-border-color flex items-center px-8 shrink-0 z-10">
              <button
                className="md:hidden mr-3 text-text-secondary hover:text-text-main transition-colors"
                onClick={() => setSiderAberto(true)}
              >
                <span className="material-symbols-outlined text-2xl align-middle">
                  menu
                </span>
              </button>
              <div>
                <h2 className="md:text-2xl text-sm md:font-bold font-medium text-text-main tracking-tight">
                  Contratar Transportadora
                </h2>
                <p className="text-[11px] md:text-sm text-text-secondary">
                  Contrate a transportadora da sua escolha para iniciar a
                  entrega
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-xl md:text-3xl text-text-main font-semibold tracking-tight mb-1">
                  Transportadoras para{" "}
                  <span className="text-primary">{state.consumerName}</span>
                </h1>
                <p className="text-sm md:text-base text-text-secondary2">
                  Analise as opções disponíveis e selecione a melhor alternativa
                  para o seu frete.
                </p>
              </div>

              {carriers && carriers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carriers.map((item) => (
                    <TransportCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border border-border-color flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-text-secondary">
                      local_shipping
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-main mb-2">
                    Nenhuma transportadora disponível
                  </h2>
                  <p className="text-sm text-text-secondary2 max-w-sm leading-relaxed mb-8">
                    Não encontrámos transportadoras para o tipo de carga
                    selecionado. Tente novamente mais tarde.
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-color text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        arrow_back
                      </span>
                      Voltar aos pedidos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
