import { useState } from "react";
import Nav from "../components/nav";
export default function PerfilUsuario() {
  const [siderAberto, setSiderAberto] = useState(false);
  return (
    <>
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="flex-1 overflow-auto p-8  bg-background">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex">
                    <button
                      className="md:hidden  mr-3 text-text-secondary hover:text-text-main transition-colors"
                      onClick={() => setSiderAberto(true)}
                    >
                      <span className="material-symbols-outlined text-2xl align-middle">
                        menu
                      </span>
                    </button>
                    <h1 className="text-text-main  text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                      Perfil da Fazenda
                    </h1>
                  </div>

                  <p className="text-text-muted dark:text-gray-400 mt-1 text-sm">
                    Gerencie as informações públicas e dados fiscais do seu
                    negócio.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg ">
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                    <span>Editar perfil</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-light  rounded-2xl border border-gray-100  shadow-soft overflow-hidden">
                  <div className="h-32 bg-linear-to-r from-green-50 to-emerald-100  relative">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(#4cae4f 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  </div>
                  <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex items-end justify-between mb-6">
                      <div className="bg-white  p-1.5 rounded-xl shadow-md inline-block">
                        <div
                          className="size-24 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage: "url('/assets/logo_fazenda.png')",
                          }}
                        ></div>
                      </div>
                      <div className="hidden sm:block">
                        <span className="px-3 py-1 rounded-full bg-green-100  text-primary text-xs font-bold uppercase tracking-wider border border-green-200 ">
                          Verificado
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Nome da Fazenda
                        </p>
                        <p className="text-text-main  text-lg font-medium">
                          Fazenda Santa CCCCC
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Nif
                        </p>
                        <p className="text-text-main  text-lg font-medium font-mono">
                          500123456
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Contacto Principal
                        </p>
                        <div className="flex items-center gap-2 text-text-main  text-lg font-medium">
                          <span className="material-symbols-outlined text-primary text-sm">
                            call
                          </span>
                          +244 912345678
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          E-mail Comercial
                        </p>
                        <div className="flex items-center gap-2 text-text-main  text-lg font-medium">
                          <span className="material-symbols-outlined text-primary text-sm">
                            mail
                          </span>
                          contato@santacecilia.pt
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100  shadow-soft overflow-hidden flex flex-col h-40">
                    <div className="p-5 border-b border-gray-100  flex items-center justify-between">
                      <h3 className="font-bold text-text-main ">Localização</h3>
                      <button className="text-primary hover:text-green-600 text-xs font-bold uppercase tracking-wide">
                        Ver no mapa
                      </button>
                    </div>
                    <div className="p-5 bg-white ">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-text-muted mt-1 shrink-0">
                          pin_drop
                        </span>
                        <div>
                          <p className="text-text-main  font-medium">
                            Estrada Rural, km 4
                          </p>
                          <p className="text-text-muted  text-gray-400 text-sm mt-0.5">
                            7000-123 Évora, Portugal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-light  rounded-2xl border border-gray-100  shadow-soft p-5">
                    <h3 className="font-bold text-text-main  text-sm mb-4">
                      Status da conta
                    </h3>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50  border border-green-100 ">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[18px]">
                            check
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-green-800 tracking-wide">
                            Ativa
                          </p>
                          <p className="text-xs text-green-700 ">
                            Desde Jan 2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      Perfil
    </>
  );
}
