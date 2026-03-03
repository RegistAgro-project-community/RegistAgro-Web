import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import type { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import { useAddProducts } from "../../hooks/useAddProducts/useAddProduct";

type AddPrudutoProps = {
  open: boolean;
  children?: React.ReactNode;
};
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}
interface BackendError {
  message?: string;
  info?: string;
  error?: ZodIssue[] | string;
}
function AddPruduto({ open, children }: AddPrudutoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(open);

  const token = Cookies.get("token");
  const toast = useRef<Toast>(null);
  useEffect(() => {
    setModalOpen(open);
  }, [open]);
  const initialFormData = {
    name: "",
    description: "",
    price: "" as number | "",
    stock: "" as number | "",
    unit: "un",
    type: "",
    transport: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const pegarValor = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  function removeImage() {
    setImage(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  function limparFormulario() {
    setFormData(initialFormData);
    removeImage();
  }
  const { mutate: addProduct } = useAddProducts(token);
  function handleAddProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!image) {
      toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Selecione uma imagem",
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("img", image);
    data.append(
      "data",
      JSON.stringify({
        ...formData,
      }),
    );
    addProduct(data, {
      onSuccess: (data) => {
        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: data.message,
          life: 2000,
        });
        limparFormulario();
        setModalOpen(false);
        setLoading(false);
        window.dispatchEvent(new Event("UpdateStatusModal"));
      },
      onError: (err) => {
        setLoading(false);
        const error = err as AxiosError<BackendError>;
        let mensagem = "";
        if (Array.isArray(error.response?.data.error)) {
          mensagem = error.response?.data.error
            .map((e: ZodIssue) => e.message)
            .join(", ");
        } else if (typeof error.response?.data.error === "string") {
          mensagem = error.response?.data.error;
        } else if (error.response?.data.info) {
          mensagem = error.response?.data.info;
        } else if (error.response?.data.message) {
          mensagem = error.response?.data.message;
        } else {
          mensagem = "erro inesperado.";
        }
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: mensagem,
        });
      },
    });

    // if (res.status === 201) {
    //   window.dispatchEvent(new Event("perfilAtualizado"));
    //   limparFormulario();
    //   setLoading(false);
    //   setModalOpen(false);
    // }
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div
        className={`
          fixed inset-0  overflow-y-auto ${isModalOpen ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
          </div>
        )}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl bg-surface-light text-left shadow-2xl border-border-color">
            <div className="px-6 py-3 border-b border-border-color flex items-center justify-between bg-[#f9faf9]">
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
                    name="name"
                    onChange={pegarValor}
                    placeholder="Ex: Milho Verde"
                    value={formData.name}
                    className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">
                    Imagem do Produto
                  </label>
                  <div
                    onClick={() => inputRef.current?.click()}
                    className={`${image ? "hidden" : ""} flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 hover:border-primary-hover hover:bg-gray-50 transition-all cursor-pointer group`}
                  >
                    <div className="text-center">
                      <span className="material-symbols-outlined mx-auto  text-gray-400 group-hover:text-primary transition-all  text-[40px]">
                        cloud_upload
                      </span>
                      <div className="mt-2 flex text-sm  text-gray-600 justify-center">
                        <label className="relative cursor-pointer rounded-b-md bg-transparent font-medium text-primary hover:text-text-main focus-within:outline-none">
                          {" "}
                          <span>Clique para Enviar</span>
                        </label>
                        <p className="pl-1"> ou araste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG até 5MB
                      </p>
                    </div>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {image && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50 border-gray-300 border rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <span className="material-symbols-outlined text-base">
                          description
                        </span>
                        <span className="font-medium">{image.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-700 transition  flex "
                      >
                        <span className="material-symbols-outlined text-base">
                          close
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">
                    Categoria
                  </label>
                  <select
                    className="block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover px-4 py-3 sm:text-sm font-semibold text-text-main mb-1.5"
                    name="type"
                    value={formData.type}
                    onChange={pegarValor}
                  >
                    <option selected>Selecione uma categoria</option>
                    <option value={"vegetais"}> Vegetais</option>
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
                      Estoque
                    </label>
                    <div className="relative rounded-md shadow-md ">
                      <input
                        type="number"
                        placeholder="0"
                        name="stock"
                        onChange={pegarValor}
                        value={formData.stock}
                        className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-5 pr-2 py-3"
                      />
                      <div className=" absolute inset-y-0 right-0 flex items-center pr-0">
                        <select
                          className="block text-sm font-medium text-text-main  rounded-lg h-full bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover  border-border"
                          value={formData.unit}
                          name="unit"
                          onChange={pegarValor}
                        >
                          <option selected>un.</option>
                          <option value="t">ton</option>
                          <option value="kg">kg</option>
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
                        onChange={pegarValor}
                        value={formData.price}
                        name="price"
                        className="block w-full rounded-lg border-gray-300 bg-white text-text-main focus:ring-primary  shadow-sm focus:border-primary:hover pl-10 pr-4 py-3"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">
                    Tipo de transporte
                  </label>
                  <select
                    className="block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-primary-hover focus:ring-primary-hover px-4 py-3 sm:text-sm font-semibold text-text-secondary2 mb-1.5"
                    onChange={pegarValor}
                    value={formData.transport}
                    name="transport"
                  >
                    <option selected>Selecione o transporte</option>
                    <option value={"frigorifico"}>
                      {" "}
                      Transporte frigorifico
                    </option>
                    <option value={"fechado"}>Transporte fechado</option>
                    <option value={"aberto_coberto"}>
                      Transporte aberto coberto
                    </option>
                    <option value={"aberto"}>Transporte aberto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">
                    descrição
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
                onClick={handleAddProduct}
                className=" bg-primary hover:bg-primary-hover active:scale-93 transition-all text-white md:px-5 px-3 md:py-2.5 py-2 rounded-lg shadow-lg shadow-primary/25 font-bold  text-sm"
                type="submit"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPruduto;
