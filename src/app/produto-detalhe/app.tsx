import Nav from "../../components/sideBar/sideBar";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import Cookies from "js-cookie";
import type { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import Tooltip from "@mui/material/Tooltip";

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

const transportLabel: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  frigorifico: { label: "Frigorífico", icon: "ac_unit", color: "#3b82f6" },
  fechado: { label: "Fechado", icon: "inventory_2", color: "#8b5cf6" },
  aberto_coberto: { label: "Aberto Coberto", icon: "garage", color: "#f59e0b" },
  aberto: { label: "Aberto", icon: "local_shipping", color: "#10b981" },
};

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [siderAberto, setSiderAberto] = useState(false);
  const [produto, setProduto] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [upload, setUpload] = useState(false);
  const toast = useRef<Toast>(null);

  const buscarDetalhes = async (silencioso = false) => {
    const token = Cookies.get("token");
    try {
      if (!silencioso) setLoading(true);

      const res = await axios.get<BackendResponse>(
        `/products/farms/get/product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setProduto(res.data.product);
    } catch (err) {
      const error = err as AxiosError<BackendResponse>;
      if (error.response) {
        const data = error.response.data;
        let mensagem = "";
        if (Array.isArray(data?.error)) {
          mensagem = data.error.map((e: ZodIssue) => e.message).join(", ");
        } else if (data?.message) {
          mensagem = data.message;
        } else if (data?.info) {
          mensagem = data.info;
          if (!silencioso) setProduto(null);
        } else {
          mensagem = "erro inesperado.";
        }
        console.log(mensagem);
      } else {
        console.log("Erro Server");
      }
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) buscarDetalhes(false);

    const handleFotoAtualizada = () => buscarDetalhes(true);
    window.addEventListener("fotoAtualizada", handleFotoAtualizada);
    return () =>
      window.removeEventListener("fotoAtualizada", handleFotoAtualizada);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const token = Cookies.get("token");
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("img", file);
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

      if (res.status === 200) {
        if (res.data.product?.photo) {
          setProduto((prev) =>
            prev ? { ...prev, photo: res.data.product.photo } : prev,
          );
        } else {
          window.dispatchEvent(new Event("fotoAtualizada"));
        }

        setUpload(false);
        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: res.data.message,
          life: 3000,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
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
    }
  }

  const transport = produto
    ? (transportLabel[produto.transport] ?? {
        label: produto.transport,
        icon: "local_shipping",
        color: "#6b7280",
      })
    : null;

  const preco = produto
    ? produto.price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " Kz"
    : null;

  const formattedDate = produto
    ? new Date(produto.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

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
      <div className="bg-[#f5f7f4] text-[#1a2016] min-h-screen">
        <div className="flex h-screen w-full overflow-hidden">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />

          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <header className="h-16 bg-white border-b border-[#e8ede6] flex items-center justify-between px-8 shrink-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden bg-transparent border-0 cursor-pointer text-[#6b7e64] p-1 mr-1"
                  onClick={() => setSiderAberto(true)}
                >
                  <span className="material-symbols-outlined text-2xl">
                    menu
                  </span>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-[#1a2016] m-0 tracking-tight">
                    Detalhes do Produto
                  </h1>
                  <p className="text-[13px] text-[#8a9e83] m-0 mt-0.5 hidden sm:block">
                    Visualize e gerencie informações específicas
                  </p>
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-[#f5f7f4]">
              <div className="max-w-240 mx-auto flex flex-col gap-5">
                <Link
                  to="/produtos"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4a7a40] hover:text-[#2e5c26] transition-colors no-underline w-fit"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    arrow_back
                  </span>
                  Voltar para Produtos
                </Link>
                {loading && (
                  <div className="bg-white rounded-[20px] border border-[#e3ebe0] overflow-hidden flex flex-col md:flex-row shadow-[0_2px_16px_rgba(74,122,64,0.07)] animate-pulse">
                    <div className="md:w-70 md:min-w-70 p-6 bg-[#f9faf8] flex items-center justify-center">
                      <div className="w-full aspect-square rounded-2xl bg-[#e8ede6]" />
                    </div>
                    <div className="flex-1 p-7 md:px-8 flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="h-8 w-2/3 rounded-lg bg-[#e8ede6]" />
                        <div className="h-4 w-1/3 rounded-lg bg-[#eef2ec]" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-20 rounded-[14px] bg-[#e8ede6]"
                          />
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-1/4 rounded bg-[#eef2ec]" />
                        <div className="h-16 rounded-lg bg-[#eef2ec]" />
                      </div>
                    </div>
                  </div>
                )}
                {!loading && !produto && (
                  <div className="bg-white rounded-[20px] border border-[#e3ebe0] p-16 flex flex-col items-center gap-3 shadow-[0_2px_16px_rgba(74,122,64,0.07)]">
                    <span
                      className="material-symbols-outlined text-gray-300"
                      style={{ fontSize: 64 }}
                    >
                      search_off
                    </span>
                    <p className="text-[#8a9e83] text-sm font-medium">
                      Produto não encontrado.
                    </p>
                  </div>
                )}
                {!loading && produto && transport && (
                  <div className="bg-white rounded-[20px] border border-[#e3ebe0] overflow-hidden flex flex-col md:flex-row shadow-[0_2px_16px_rgba(74,122,64,0.07)]">
                    <div className="md:w-70 md:min-w-70 md:shrink-0 p-6 md:border-r border-b md:border-b-0 border-[#f0f4ee] bg-[#f9faf8] flex items-center justify-center">
                      {produto.photo ? (
                        <div className="w-full aspect-square rounded-2xl overflow-hidden relative">
                          <img
                            src={produto.photo}
                            alt={produto.name}
                            className="w-full h-full object-cover block transition-opacity duration-500"
                            style={{ opacity: imageLoaded ? 1 : 0 }}
                            onLoad={() => setImageLoaded(true)}
                          />
                          {!imageLoaded && (
                            <div className="absolute inset-0 animate-pulse bg-[#e8ede6]" />
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 text-[#2e5c26] text-[11px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#d4e8ce]">
                            {produto.type}
                          </div>
                          <button
                            className="absolute bottom-3 right-3 bg-[#2e5c26] hover:bg-[#4a7a40] text-white border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(46,92,38,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={upload}
                            title="Alterar imagem"
                          >
                            {upload ? (
                              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 20 }}
                              >
                                add_a_photo
                              </span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="w-full aspect-square rounded-2xl bg-linear-to-br from-[#eef4ec] to-[#e5f0e0] border-2 border-dashed border-[#c8ddc3] flex items-center justify-center relative">
                          <span
                            className="material-symbols-outlined text-[#a3b99a]"
                            style={{ fontSize: 96 }}
                          >
                            nutrition
                          </span>
                          <button
                            className="absolute bottom-3 right-3 bg-[#2e5c26] hover:bg-[#4a7a40] text-white border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(46,92,38,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={upload}
                            title="Adicionar imagem"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 20 }}
                            >
                              add_a_photo
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 p-7 md:px-8 flex flex-col gap-6 overflow-hidden">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-[28px] font-extrabold text-[#1a2016] m-0 tracking-tight leading-tight">
                          {produto.name}
                        </h2>
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#8a9e83] font-medium">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14 }}
                          >
                            calendar_today
                          </span>
                          Cadastrado em {formattedDate}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#f6f9f5] border border-[#e3ebe0] rounded-[14px] p-3.5 flex flex-col gap-0.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(46,92,38,0.1)]">
                          <p className="text-[11px] font-semibold text-[#8a9e83] uppercase tracking-[0.6px] m-0">
                            Estoque
                          </p>
                          <p className="text-2xl font-extrabold text-[#1a2016] m-0 tracking-tight leading-tight">
                            {produto.stock}
                          </p>
                          <p className="text-[11px] text-[#a0b099] m-0">
                            {produto.unit}
                          </p>
                        </div>
                        <Tooltip title={preco ?? ""} placement="top" arrow>
                          <div className="bg-linear-to-br from-[#2e5c26] to-[#4a7a40] rounded-[14px] p-3.5 flex flex-col gap-0.5 shadow-[0_4px_16px_rgba(46,92,38,0.25)] transition-all hover:-translate-y-0.5 cursor-default min-w-0">
                            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.6px] m-0">
                              Preço
                            </p>
                            <p className="text-2xl font-extrabold text-white m-0 tracking-tight leading-tight truncate">
                              {preco}
                            </p>
                            <p className="text-[11px] text-white/60 m-0">
                              por {produto.unit}
                            </p>
                          </div>
                        </Tooltip>
                        <div className="bg-[#f6f9f5] border border-[#e3ebe0] rounded-[14px] p-3.5 flex flex-col gap-0.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(46,92,38,0.1)]">
                          <p className="text-[11px] font-semibold text-[#8a9e83] uppercase tracking-[0.6px] m-0">
                            Unidade
                          </p>
                          <p className="text-xl font-extrabold text-[#1a2016] m-0 tracking-tight leading-tight">
                            {produto.unit}
                          </p>
                          <p className="text-[11px] text-[#a0b099] m-0">
                            medida
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 min-w-0">
                        <p className="text-[11px] font-bold text-[#8a9e83] uppercase tracking-[0.8px] m-0">
                          Descrição
                        </p>
                        <p className="text-sm text-[#3d4e38] leading-relaxed m-0 max-h-24 overflow-y-auto wrap-break-words pr-1">
                          {produto.description || "—"}
                        </p>
                      </div>

                      <div>
                        <div
                          className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border"
                          style={{
                            borderColor: transport.color + "33",
                            background: transport.color + "0d",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 22, color: transport.color }}
                          >
                            {transport.icon}
                          </span>
                          <div>
                            <p className="text-[11px] font-bold text-[#8a9e83] uppercase tracking-[0.8px] m-0">
                              Transporte Recomendado
                            </p>
                            <p
                              className="text-[15px] font-bold m-0 capitalize"
                              style={{ color: transport.color }}
                            >
                              {transport.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
