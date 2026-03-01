import Nav from "../../components/nav";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import Cookies from "js-cookie";
import type { AxiosError } from "axios";
import { Toast } from "primereact/toast";

interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}
interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  price: number;
  stock: number;
  transport: string;
  type: string;
  unit: string;
  created_at: string;
}
interface BackendResponse {
  product: Product;
  valid?: boolean;
  message?: string;
  info?: string;
  error?: ZodIssue[] | string;
}

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [siderAberto, setSiderAberto] = useState(false);
  const [produto, setProduto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [upload, setUpload] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const buscarDetalhes = async () => {
      const token = Cookies.get("token");
      try {
        setLoading(true);

        const res = await axios.get<BackendResponse>(
          `/products/farms/get/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setLoading(false);
        console.log(res.data.product);
        setProduto(res.data.product);
      } catch (err) {
        setLoading(false);
        const error = err as AxiosError<BackendResponse>;
        if (error.response) {
          const data = error.response.data;
          let mensagem = "";
          if (Array.isArray(data?.error)) {
            mensagem = data.error.map((e: ZodIssue) => e.message).join(", ");
          }
          if (Array.isArray(data?.error)) {
            mensagem = data.error
              .map((e) => (typeof e === "string" ? e : e.message))
              .join(", ");
          } else if (data?.message) {
            mensagem = data.message;
          } else if (data?.info) {
            mensagem = data.info;
            setProduto(null);
          } else {
            mensagem = "erro inesperado.";
          }
          console.log(mensagem);
        } else {
          console.log("Erro Server");
        }
      }
    };

    if (id) {
      buscarDetalhes();
    }

    window.addEventListener("perfilAtualizado", buscarDetalhes);
    return () => {
      window.removeEventListener("perfilAtualizado", buscarDetalhes);
    };
  }, [id]);

  if (loading)
    return (
      <div className="p-20 text-center">Carregando dados do produto...</div>
    );
  if (!produto)
    return (
      <div className="p-20 text-center">
        Produto não encontrado.{" "}
        <Link
          className="text-sm font-medium hover:text-primary-hover text-primary transition-colors"
          to={"/produtos"}
        >
          {" "}
          Voltar para Produtos
        </Link>
      </div>
    );
  console.log(":Produto ", produto);
  console.log(produto?.photo);
  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const token = Cookies.get("token");
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("img", file);
    setLoadingImg(true);
    setUpload(true);
    try {
      const res = await axios.patch<BackendResponse>(
        `/products/upload/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      window.dispatchEvent(new Event("perfilAtualizado"));
      if (res.status === 200) {
        console.log(res);
        setTimeout(() => {
          const valido = res.data.message;
          setUpload(false);
          setLoadingImg(false);
          toast.current?.show({
            severity: "success",
            summary: "Tudo certo",
            detail: valido,
            life: 3000,
          });
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      setUpload(false);
      const error = err as AxiosError<BackendResponse>;
      if (error.response) {
        const data = error.response.data;
        let mensagem = "";
        if (Array.isArray(data?.error)) {
          mensagem = data.error.map((e: ZodIssue) => e.message).join(", ");
        } else if (typeof data?.error === "string") {
          mensagem = data.error;
        } else if (data?.message) {
          mensagem = data.message;
        } else {
          mensagem = "erro inesperado.";
        }
        console.log(data);

        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: mensagem,
          life: 2000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Erro de conexão com o Servidor",
          life: 2000,
        });
      }
      console.error("Erro no axios", error);
    }
  }
  return (
    <>
      <Toast ref={toast} position="top-right" />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFile}
      />
      {loadingImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
        </div>
      )}
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
                    Detalhes do Produto
                  </h2>
                  <p className="text-sm text-text-secondary sm:block hidden">
                    Visualize e gerencie informações específicas
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-background-light">
              <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <div>
                  <Link
                    to="/produtos"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary text-primary transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      arrow_back
                    </span>
                    Voltar para Produtos
                  </Link>
                </div>

                <div className="bg-surface-light border border-border-color rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-border-color flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#131613]">
                        {produto.name}
                      </h3>
                      <p className="text-sm">
                        Cadastrado em{" "}
                        {new Date(produto?.created_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-1/3 shrink-0 relative group">
                        {produto?.photo ? (
                          <div className="relative">
                            <img
                              src={produto?.photo}
                              alt={produto?.name}
                              className="aspect-square w-full rounded-xl object-cover border border-border-color"
                            />

                            <button
                              className="absolute bottom-3 right-3 bg-white/60 hover:bg-white p-2 rounded-full shadow-lg flex items-center justify-center border border-gray-200 transition-all active:scale-95 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={upload}
                              title="Alterar imagem"
                            >
                              <span
                                className="material-symbols-outlined text-primary hover:text-primary-hover "
                                style={{ fontSize: "24px" }}
                              >
                                add_a_photo
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-square w-full rounded-xl bg-red-50 flex items-center justify-center border-2 border-dashed border-red-100 relative">
                            <span
                              className="material-symbols-outlined text-red-500/80"
                              style={{ fontSize: "120px" }}
                            >
                              nutrition
                            </span>
                            <button
                              className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg flex items-center justify-center text-white transition-all"
                              onClick={() => {}}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "24px" }}
                              >
                                add_a_photo
                              </span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Categoria
                          </p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {produto?.type}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Unidade
                          </p>
                          <p className="text-base font-medium text-[#131613]">
                            {produto?.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Quantidade em Estoque
                          </p>
                          <p className="text-2xl font-bold text-[#131613]">
                            {produto?.stock} {produto?.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Preço Unitário
                          </p>
                          <p className="text-2xl font-bold text-[#131613]">
                            {produto?.price}
                            <span className="text-sm font-normal text-gray-500">
                              /{produto?.unit}
                            </span>
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Descrição
                          </p>
                          <p className="text-base text-gray-700">
                            {produto?.description}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-text-secondary2 uppercase tracking-wider mb-1">
                            Transporte Recomendado
                          </p>
                          <div className="flex items-center gap-2 text-base font-medium text-[#131613] bg-blue-50 p-3 rounded-lg border border-blue-100  capitalize">
                            <span className="material-symbols-outlined text-blue-500">
                              local_shipping
                            </span>
                            {produto?.transport === "frigorifico"
                              ? "frigorifico"
                              : produto?.transport === "fechado"
                                ? "fechado"
                                : produto?.transport === "aberto_coberto"
                                  ? "aberto coberto"
                                  : produto?.transport === "aberto"
                                    ? "aberto"
                                    : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ...  Histórico de Vendas ... */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
