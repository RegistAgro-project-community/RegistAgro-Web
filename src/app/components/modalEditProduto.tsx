type AddPrudutoProps = {
  openEdit: boolean;
  children?: React.ReactNode;
};

function EditProduto({ openEdit, children }: AddPrudutoProps) {
  return (
    <div
      className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${openEdit ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
    >
      <div className="bg-surface-light w-full max-h-[90vh] max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-3 border-b border-border-color flex items-center justify-between bg-gray-100/50">
          <h3 className="text-lg font-bold text-text-main">Editar Produto</h3>
        </div>
        <div className="p-8 overflow-y-auto">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-secondary2 mb-2">
                Nome do Produto
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-border-color rounded-lg  focus:ring-1 focus:ring-primary-hover focus:border-primary-hover outline-none transition-all"
                value={"Tomate Verde"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary2 mb-2">
                Imagem do Produto
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border border-dashed border-border bg-background">
                  <img
                    src="/public/assets/Frango.png"
                    className="w-full h-full"
                    alt=""
                  />
                </div>
                <button
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  Alterar Imagem
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Quantidade
                </label>
                <div className="relative rounded-md shadow-md ">
                  <input
                    type="number"
                    placeholder="0"
                    className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-5 pr-2 py-3"
                  />
                  <div className=" absolute inset-y-0 right-0 flex items-center pr-0">
                    <select className="block text-sm font-medium text-text-main  rounded-lg h-full bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover   border-border">
                      <option disabled selected>
                        un.
                      </option>
                      <option value="">ton</option>
                      <option value="">kg</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Preço
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">Kz</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-10 pr-4 py-3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Categoria
                </label>
                <select className="block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover px-4 py-3 sm:text-sm font-semibold text-text-main mb-1.5">
                  <option>Selecione uma categoria</option>
                  <option value={"vegatais"}> Vegetais</option>
                  <option value={"frutas"}>Frutas</option>
                  <option value={"legumes"}>Legumes</option>
                  <option value={"carnes"}>Carnes</option>
                  <option value={"cereais"}>Cereais</option>
                  <option value={"raizes"}>Raizes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Tipo de transporte
                </label>
                <select className="block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover px-4 py-3 sm:text-sm font-semibold text-text-main mb-1.5">
                  <option selected disabled>
                    Selecione o transporte
                  </option>
                  <option value={"frigorifico"}> Transporte frigorifico</option>
                  <option value={"fechado"}>Transporte fechado</option>
                  <option value={"aberto_coberto"}>
                    Transporte aberto coberto
                  </option>
                  <option value={"aberto"}>Transporte aberto</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="px-8 py-6 border-t border-border-color bg-gray-100/50 flex items-center justify-end gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
export default EditProduto;
