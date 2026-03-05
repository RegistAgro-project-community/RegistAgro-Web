import type { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useProfile } from "../../hooks/useProfile/useProfile";
import { useUpdateData } from "../../hooks/useUpdateData/useUpdateData";
type DetalhePros = {
  openEditPerfil: boolean;
  children?: React.ReactNode;
};
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}
interface BackendError {
  valid?: boolean;
  message?: string;

  info?: string;
  error?: ZodIssue[] | string;
}
function EditarPerfil({ openEditPerfil, children }: DetalhePros) {
  const [formData, setFormData] = useState({
    name: "",
    adress: "",
    province: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(openEditPerfil);
  useEffect(() => {
    setIsModalOpen(openEditPerfil);
  }, [openEditPerfil]);
  const toast = useRef<Toast>(null);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const { data } = useProfile(token);
  useEffect(() => {
    if (!data) return;
    setFormData((prev) => ({
      ...prev,
      name: data.data?.name || "",
      province: data.data?.province || "",
      adress: data.data?.adress || "",
    }));
  }, [data]);
  const { mutate: updateProfile } = useUpdateData(token);
  async function handleUpdateData(event: React.FormEvent) {
    event.preventDefault();
    console.log(formData);
    setLoading(true);
    updateProfile(
      { formData },
      {
        onSuccess: (data) => {
          toast.current?.show({
            severity: "success",
            summary: "Tudo certo",
            detail: data.message,
            life: 2000,
          });
          setIsModalOpen(false);
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
            mensagem = "Erro inesperado.";
          }
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: mensagem,
          });
        },
      },
    );
  }
  function takeData(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div
        className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${isModalOpen ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
          </div>
        )}

        <div className="bg-surface-light  rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-gray-100  flex justify-between items-center">
            <h3 className="text-xl font-bold text-text-main ">
              Editar Nome e Endereço
            </h3>
          </div>
          <form className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main ">
                Nome da Fazenda
              </label>
              <input
                className="w-full rounded-lg border-gray-200 y-700   focus:ring-primary focus:border-primary px-4 py-2.5 transition-all"
                placeholder="Digite o nome da fazenda"
                type="text"
                name="name"
                value={formData.name}
                onChange={takeData}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main ">
                Província
              </label>
              <input
                className="w-full rounded-lg border-gray-200 y-700   focus:ring-primary focus:border-primary px-4 py-2.5 transition-all"
                placeholder="Digite a província"
                type="text"
                name="province"
                onChange={takeData}
                value={formData.province}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main 200">
                Endereço/Localização
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
                  location_on
                </span>
                <input
                  className="w-full pl-10 rounded-lg border-gray-200   focus:ring-primary focus:border-primary px-4 py-2.5 transition-all"
                  placeholder="Digite o endereço..."
                  type="text"
                  value={formData.adress}
                  name="adress"
                  onChange={takeData}
                />
              </div>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={(e) => {
                  handleUpdateData(e);
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg  transition-all active:scale-90"
                type="submit"
              >
                Guardar Alterações
              </button>
              {children}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default EditarPerfil;
