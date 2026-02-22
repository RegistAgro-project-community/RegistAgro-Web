import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import type { AxiosError } from "axios";
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  qtd: string;
  unit: string;
}
type AddPrudutoProps = {
  openEdit: boolean;
  children?: React.ReactNode;
  product: Product | null;
};
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}

interface BackendResponse {
  valid?: boolean;
  message?: string;
  error?: ZodIssue[] | string;
}

function Editproduct({ openEdit, children, product }: AddPrudutoProps) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(openEdit);
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    unit: "",
  });
  useEffect(() => {
    if (product) {
      console.log(product);

      const priceNumber = product.price.replace(/[^0-9.]/g, "");

      const qtdMatch = product.qtd.match(/^(\d+(?:\.\d+)?)(kg|ton)$/i);
      const stockNumber = qtdMatch
        ? qtdMatch[1]
        : product.qtd.replace(/[^0-9.]/g, "");
      const stockUnit = qtdMatch
        ? qtdMatch[2].toLowerCase() === "ton"
          ? "t"
          : qtdMatch[2].toLowerCase()
        : "";

      setFormData({
        name: product.name,
        description: product.description,
        price: Number(priceNumber),
        stock: Number(stockNumber),
        unit: stockUnit,
      });
    }
  }, [product]);
  useEffect(() => {
    setModalOpen(openEdit);
  }, [openEdit]);
  const pegarValor = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };
  const token = Cookies.get("token");
  async function handleProductEdit() {
    setLoading(true);

    try {
      const res = await axios.put<BackendResponse>(
        `/products/update/product/${product?.id}`,
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          unit: formData.unit,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      console.log(product?.id);
      const valido = res.data.message;
      toast.current?.show({
        severity: "success",
        summary: "Tudo certo",
        detail: valido,
        life: 2000,
      });
      setLoading(false);
      window.dispatchEvent(new Event("perfilAtualizado"));
      setTimeout(() => {
        setModalOpen(false);
      }, 500);
    } catch (err) {
      setLoading(false);
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
      <div
        className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${modalOpen ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
          </div>
        )}
        <div className="bg-surface-light w-full max-h-[90vh] max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b border-border-color flex items-center justify-between bg-gray-100/50">
            <h3 className="text-lg font-bold text-text-main">Editar product</h3>
          </div>
          <div className="p-8 overflow-y-auto">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-secondary2 mb-2">
                  Nome do product
                </label>
                <input
                  type="text"
                  value={formData.name}
                  name="name"
                  onChange={pegarValor}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg  focus:ring-1 focus:ring-primary-hover shadow-sm focus:border-primary-hover outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary2 mb-1.5">
                   Estoque
                  </label>
                  <div className="relative rounded-md shadow-md ">
                    <input
                      type="number"
                      placeholder="0"
                      name="stock"
                      value={formData.stock}
                      onChange={pegarValor}
                      className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-5 pr-2 py-3"
                    />
                    <div className=" absolute inset-y-0 right-0 flex items-center pr-0">
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={pegarValor}
                        className="block text-sm font-medium text-text-secondary2  rounded-lg h-full bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover   border-border"
                      >
                        <option disabled selected>
                          un.
                        </option>
                        <option value="t">ton</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary2 mb-1.5">
                    Preço
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">Kz</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={pegarValor}
                      name="price"
                      className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-10 pr-4 py-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary2 mb-1.5">
                  Descrição
                </label>
                <textarea
                  name="description"
                  onChange={pegarValor}
                  value={formData.description}
                  className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover   py-3"
                ></textarea>
              </div>
            </form>
          </div>
          <div className="px-8 py-6 border-t border-border-color bg-gray-100/50 flex items-center justify-end gap-6">
            {children}
            <button
              onClick={handleProductEdit}
              type="submit"
              className=" bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm"
            >
              Salvar Alteração
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Editproduct;
