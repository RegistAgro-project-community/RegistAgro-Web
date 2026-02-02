type AddPrudutoProps = {
  openDelete: boolean;
  children?: React.ReactNode;
};
function DeleteProduto({ openDelete, children }: AddPrudutoProps) {
  return (
    <div
      className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${openDelete ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
    >
      <div className="w-full max-w-120 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col ">
        <div className="flex justify-center pt-7 ">
          {" "}
          <div className="p-4 w-13 h-13  bg-red-50 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-4xl">
              warning
            </span>
          </div>
        </div>
        <div className="px-8 pt-6">
          <h3 className="text-text-main tracking-tight text-2xl font-bold leading-tight text-center">
            Remover Produto
          </h3>
          <div className="px-8 pt-2">
            <p className="text-text-main text-base font-normal leading-normal text-center">
              Tem certeza que deseja remover este produto do catálogo?
            </p>
          </div>
          <div className="px-8 pt-2">
            <p className="text-text-secondary2 text-sm font-normal leading-normal text-center">
              Esta ação não poderá ser desfeita e afetará os estoque.
            </p>
            <div className="flex justify-center p-8">
              <div className="flex flex-col  sm:flex-row flex-1 gap-3 max-w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeleteProduto;
