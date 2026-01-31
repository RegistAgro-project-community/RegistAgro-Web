type AddPrudutoProps = {
  open: boolean;
  children?: React.ReactNode
};
function AddPruduto({ open, children }: AddPrudutoProps) {
  return (
    <div
      className={`
    fixed inset-0  overflow-y-auto ${open ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-surface-light text-left shadow-2xl border-border-color">
          <div className="px-6 py-6 border-b border-border-color flex items-center justify-between bg-[#f9faf9]">
            <h3 className="text-lg font-bold text-text-main">
              Adicionar Produto
            </h3>
          </div>
          <div className="px-6 py-6">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Milho Verde"
                  className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Imagem do Produto
                </label>
                <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 hover:border-primary-hover hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="text-center">
                    <span className="material-symbols-outlined mx-auto  text-gray-400 group-hover:text-primary transition-all  text-[40px]">
                      cloud_upload
                    </span>
                    <div className="mt-2 flex text-sm  text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-b-md bg-transparent font-medium text-primary hover:text-text-main focus-within:outline-none">
                        {" "}
                        <span>Clique para Enviar</span>
                        <input className="sr-only" type="file" />
                      </label>
                      <p className="pl-1"> ou araste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG até 5MB
                    </p>
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                     <select className="block text-sm font-medium text-text-main  rounded-lg h-full bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover ">
                      <option disabled selected >un.</option>
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
            </form>
        </div>
            <div className="bg-gray-50 px-6 py-5 flex flex-col gap-3 border-t border-border-color ">{children}</div>
          </div>
      </div>
    </div>
  );
}
export default AddPruduto;
