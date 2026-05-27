import Nav from "../../components/sideBar/sideBar";
import AddPruduto from "../../components/addProductModal/modalAddProduct";
import EditProduto from "../../components/editProductModal/modalEditProduto";
import DeleteProduto from "../../components/delectProductModal/modalDelectProduct";
import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts/useProduct";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  price: string;
  qtd: string;
  transport: string;
  type: string;
  unit: string;
  created_at: string;
}
export default function Produtos() {
  const navegate = useNavigate();
  const [siderAberto, setSiderAberto] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [correntPage, setCorrentPage] = useState(1);
  const itemsPerPage = 4;
  const [searchProduct, setSearchProduct] = useState("");
  const [abertoEdit, setAbertoEdit] = useState(false);
  const [abertoDelete, setAbertoDelete] = useState(false);
  const [totalProduto, setTotalProduto] = useState("");
  const [estoqueBaixo, setEstoqueBaixo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ganho, setGanho] = useState("");
  const [produtos, setProdutos] = useState<Product[]>([]);
  const token = Cookies.get("token");
  const toast = useRef<Toast>(null);
  const [selecionado, setSelecionado] = useState({ id: "" });
  const [productSelect, setProductSelect] = useState<Product | null>(null);
  const preparacaoDelete = (id: string) => {
    setSelecionado({ id });
    setAbertoDelete(true);
  };
  const handleEdit = (product: Product) => {
    setProductSelect(product);
    setAbertoEdit(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(e: any) {
    setSearchProduct(e.target.value);
    setCorrentPage(1);
    console.log(searchProduct);
  }

  const { data, error } = useProducts(token);
  useEffect(() => {
    if (token && data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalProduto(data.totalProducts.toString() || "0");
      setEstoqueBaixo(data.low_stock.toString() || "0");
      setGanho(data.balance);
      setProdutos([...data.products]);
      setIsLoading(false);
    }else{
      setIsLoading(false)
    }
  }, [token, data]);

  useEffect(() => {
    const modalStatus = async () => {
      setAbertoDelete(false);
      setAbertoEdit(false);
      setAberto(false);
    };
    modalStatus();
    window.addEventListener("UpdateStatusModal", modalStatus);
    return () => {
      window.removeEventListener("UpdateStatusModal", modalStatus);
    };
  }, [token]);
  console.log(produtos);
  const filteredProducts = produtos
    .filter((item) => {
      const product = searchProduct.toLowerCase();
      return (
        item.name.toLowerCase().includes(product) ||
        item.type.toLowerCase().includes(product) ||
        item.transport.toLowerCase().includes(product)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  if (error) {
    console.log(error);
  }
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastPage = correntPage * itemsPerPage;
  const indexOfFristPage = indexOfLastPage - itemsPerPage;
  const correntItems = filteredProducts.slice(
    indexOfFristPage,
    indexOfLastPage,
  );
  return (
    <>
      <Toast ref={toast} position="top-right" />
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
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm cursor-pointer"
                onClick={() => setAberto(true)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>{" "}
                <span className="">Adicionar Produto</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8  bg-background">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      label: "Total de Produtos",
                      total: totalProduto || 0,
                      icon: "grass",
                    },
                    {
                      label: "Baixo Estoque",
                      total: estoqueBaixo || 0,
                      icon: "warning",
                    },
                    {
                      label: "Ganhos",
                      total: Number(ganho.replace(/[^\d]/g, "")) || 0,
                      icon: "attach_money",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-surface-light p-4 rounded-xl border border-gray-300 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-text-secondary font-medium">
                          {item.label}
                        </p>

                        <Tooltip
                          title={
                            item.icon === "attach_money"
                              ? item.total.toLocaleString("pt-AO", {
                                  style: "currency",
                                  currency: "AOA",
                                })
                              : item.total
                          }
                          arrow
                        >
                          <p className="text-2xl font-bold text-text-main mt-2 truncate">
                            {item.icon === "attach_money"
                              ? item.total.toLocaleString("pt-AO", {
                                  style: "currency",
                                  currency: "AOA",
                                })
                              : item.total}
                          </p>
                        </Tooltip>
                      </div>

                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${
                      item.icon === "attach_money"
                        ? "text-blue-600 bg-blue-100"
                        : item.icon === "warning"
                          ? "bg-orange-100 text-orange-600"
                          : item.icon === "grass"
                            ? "bg-primary/30 text-primary"
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
              )}
              <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden overflow-x-auto mt-5">
                <div className="  p-4  border border-border-color flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-1/2 text-gray-400 text-[20px]">
                      search
                    </span>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-gray-400 text-text-main placeholder-gray-500"
                      placeholder="Buscar produto..."
                      value={searchProduct}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background uppercase">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Nome do Produto
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Estoque
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center">
                        Preço
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center">
                        Transporte
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
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
                              width={140}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="rounded"
                              height={22}
                              width={80}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0", borderRadius: "999px" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={40}
                              animation="wave"
                              sx={{ bgcolor: "#f0f0f0" }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <Skeleton
                              variant="text"
                              height={20}
                              width={80}
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
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <Skeleton
                                variant="rounded"
                                height={32}
                                width={32}
                                animation="wave"
                                sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                              />
                              <Skeleton
                                variant="rounded"
                                height={32}
                                width={32}
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
                          <td
                            className="px-6 py-5 cursor-pointer"
                            onClick={() =>
                              navegate(`/produtos/produto-detalhe/${item.id}`)
                            }
                          >
                            <p className="font-bold text-text-main text-sm">
                              {item.name}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-600">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-fw-medium">
                              {item.qtd}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-text-main text-center">
                              {item.price}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-sm text-text-secondary capitalize ">
                              {item.transport === "Caminhão aberto_coberto"
                                ? "Caminhão aberto coberto"
                                : item.transport}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-start gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="material-symbols-outlined text-[20px] p-2 text-gray-500 hover:text-green-600 hover:bg-green-600/10 rounded-lg transition-colors active:scale-90 cursor-pointer"
                              >
                                edit
                              </button>
                              <button
                                onClick={() => preparacaoDelete(item.id)}
                                className="material-symbols-outlined text-[20px] p-2 text-gray-500 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-colors active:scale-90 cursor-pointer"
                              >
                                delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center w-full">
                            <p className="text-gray-500 font-medium">
                              {produtos.length === 0
                                ? "Sem produtos cadastrados"
                                : filteredProducts.length === 0
                                  ? "Produto não encontrado"
                                  : ""}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
      <AddPruduto open={aberto}>
        <button
          className=" bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm cursor-pointer"
          onClick={() => setAberto(false)}
        >
          Cancelar
        </button>
      </AddPruduto>
      <EditProduto openEdit={abertoEdit} product={productSelect}>
        <button
          className=" bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg  font-bold  text-sm cursor-pointer"
          onClick={() => setAbertoEdit(false)}
        >
          Cencelar
        </button>
      </EditProduto>
      <DeleteProduto
        onClose={() => setAbertoDelete(false)}
        openDelete={abertoDelete}
        produtoId={selecionado.id}
      >
        <button
          className=" flex-1 min-w-30 h-12  bg-red-500 hover:bg-red-600 active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em] cursor-pointer"
          onClick={() => setAbertoDelete(false)}
        >
          <span className="truncate">Cancelar</span>
        </button>
      </DeleteProduto>
    </>
  );
}
