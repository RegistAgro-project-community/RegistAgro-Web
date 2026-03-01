import type { AxiosError } from "axios";
import axios from "../api/axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
type DetalhePros = {
  openEditPerfil: boolean;
  children?: React.ReactNode;
};
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}
interface FormData {
  id: string;
  name: string;
  adress: string;
  email: string;
  phone: string;
  province: string;
  created_at: string;
}
interface BackendResponse {
  valid?: boolean;
  message?: string;
  data?: FormData;
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
  const queryClient = useQueryClient();
  const toast = useRef<Toast>(null);
  const User_URL = "/users/profile";
  const UserUPDATE_URL = "/users/update";
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);

  async function fetchPerfil() {
    try {
      const res = await axios.get<BackendResponse>(User_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      return res.data;
    } catch (err) {
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
        } else {
          mensagem = "erro inesperado.";
        }
        console.log(mensagem);
      } else {
        console.log("Erro Server");
      }
    }
  }
  const { data: Perfil } = useQuery({
    queryKey: ["editPerfil", token],
    queryFn: fetchPerfil,
    retry: 1,
  });
  useEffect(() => {
    if (!Perfil) return;
    setFormData((prev) => ({
      ...prev,
      name: Perfil.data?.name || "",
      province: Perfil.data?.province || "",
      adress: Perfil.data?.adress || "",
    }));
  }, [Perfil]);

  async function AtualizarDados(event: React.FormEvent) {
    event.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.put<BackendResponse>(
        UserUPDATE_URL,
        {
          name: formData.name,
          adress: formData.adress,
          province: formData.province,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      const valido = res.data.message;
      toast.current?.show({
        severity: "success",
        summary: "Tudo certo",
        detail: valido,
        life: 2000,
      });

      if (res.status === 200) {
        window.dispatchEvent(new Event("AtualizarStatusModal"));
        setLoading(false);
        setIsModalOpen(false);
      }
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
  function PegarDados(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const userEdit = useMutation({
    mutationFn: AtualizarDados,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Perfil"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

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
                onChange={PegarDados}
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
                onChange={PegarDados}
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
                  onChange={PegarDados}
                />
              </div>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={(e) => {
                  userEdit.mutate(e)
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
