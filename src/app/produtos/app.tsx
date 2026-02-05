import Nav from "../components/nav";
import AddPruduto from "../components/modalAddProduto";
import EditProduto from "../components/modalEditProduto";
import DeleteProduto from "../components/modalDeleteProduto";
import { useState } from "react";
export default function Produtos() {
  const [siderAberto, setSiderAberto] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [abertoEdit, setAbertoEdit] = useState(false);
  const [abertoDelete, setAbertoDelete] = useState(false);
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
                    Gestão de Produtos
                  </h2>
                  <p className="text-sm text-text-secondary sm:block hidden">
                    Gerencie o estoque da sua fazenda
                  </p>
                </div>
              </div>

              <button
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm"
                onClick={() => setAberto(true)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>{" "}
                <span className="">Adicionar Produto</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8  bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total de Produtos", total: 124, icon: "grass" },
                  { label: "Baixo Estoque", total: 6, icon: "warning" },
                  { label: "Ganho", total: 10500, icon: "attach_money" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex items-center justify-between ${item.icon === "attach_money" ? "hover:border-blue-300/50 " : item.icon === "warning" ? "hover:border-orange-300/50" : item.icon === "grass" ? "bg-primary/30 hover:border-green-300/50" : ""} transition-colors`}
                  >
                    <div>
                      <p className="text-sm text-text-secondary font-medium">
                        {item.label}
                      </p>
                      <p className="text-2xl font-bold text-text-main mt-2">
                        {item.total} {item.icon === "attach_money" ? " Kz" : ""}
                      </p>
                    </div>
                    <div
                      className={`h-10 w-10 rounded-full ${item.icon === "attach_money" ? "text-blue-600 bg-blue-100" : item.icon === "warning" ? "bg-orange-100 text-orange-600" : item.icon === "grass" ? "bg-primary/30 text-primary" : ""}  flex items-center justify-center`}
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
                <div className="  p-4  border-b border-border-color flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-1/2 text-gray-400 text-[20px]">
                      search
                    </span>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-background border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-text-main placeholder-gray-400"
                      placeholder="Buscar produto..."
                    />
                  </div>
                </div>
                {/* Tabela */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border-color uppercase">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Nome do Produto
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Quantidade
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Preço
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Transporte
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {[
                      {
                        nome: "Alface",
                        categoria: "verduras",
                        quant: "20t",
                        preco: "10.000",
                        transporte: "Caminhão Refigerado",
                        lote: "Lote #2025-A",
                        unidade: "t",
                      },
                      {
                        nome: "Alface",
                        categoria: "verduras",
                        quant: "20t",
                        preco: "10.000",
                        transporte: "Caminhão Refigerado",
                        lote: "Lote #2025-A",
                        unidade: "t",
                      },
                      {
                        nome: "Alface",
                        categoria: "verduras",
                        quant: "20t",
                        preco: "10.000",
                        transporte: "Caminhão Refigerado",
                        lote: "Lote #2025-A",
                        unidade: "t",
                      },
                      {
                        nome: "Alface",
                        categoria: "verduras",
                        quant: "20t",
                        preco: "10.000",
                        transporte: "Caminhão Refigerado",
                        lote: "Lote #2025-A",
                        unidade: "t",
                      },
                      {
                        nome: "Alface",
                        categoria: "verduras",
                        quant: "20t",
                        preco: "10.000",
                        transporte: "Caminhão Refigerado",
                        lote: "Lote #2025-A",
                        unidade: "t",
                      },
                    ].map((item) => (
                      <tr
                        key={item.nome}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-text-main text-sm">
                            {item.nome}
                          </p>
                          <p className="text-xs text-gray-500">{item.lote}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-600">
                            {item.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-fw-medium">
                            {item.quant}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-text-main">
                            {item.preco}
                            <span className="text-xs  text-gray-500">
                              /{item.unidade}
                            </span>
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-text-secondary">
                            {item.transporte}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-start gap-2">
                            <button
                              onClick={() => setAbertoEdit(true)}
                              className="material-symbols-outlined text-[20px] p-2 text-gray-500 hover:text-green-600 hover:bg-green-600/10 rounded-lg transition-colors active:scale-90"
                            >
                              edit
                            </button>
                            <button
                              onClick={() => setAbertoDelete(true)}
                              className="material-symbols-outlined text-[20px] p-2 text-gray-500 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-colors active:scale-90"
                            >
                              delete
                            </button>
                          </div>
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
          </main>
        </div>
      </div>
      <AddPruduto open={aberto}>
        <button
          className=" bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm"
          onClick={() => setAberto(false)}
        >
          Cancelar
        </button>
        <button className=" bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm">
          Salvar Produto
        </button>
      </AddPruduto>
      <EditProduto openEdit={abertoEdit}>
        <button
          className=" bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg  font-bold  text-sm"
          onClick={() => setAbertoEdit(false)}
        >
          Cencelar
        </button>
        <button className=" bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm">
          Salvar Alteração
        </button>
      </EditProduto>
      <DeleteProduto openDelete={abertoDelete}>
        <button
          className=" flex-1 min-w-30 h-12  bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-text-main md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em]"
          onClick={() => setAbertoDelete(false)}
        >
          <span className="truncate">Cancelar</span>
        </button>
        <button className="flex-1 min-w-43 h-12 bg-primary hover:bg-primary-hover  items-center justify-center active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em]">
          <span className="truncate">Confirmar Remoção</span>
        </button>
      </DeleteProduto>
    </>
  );
}
