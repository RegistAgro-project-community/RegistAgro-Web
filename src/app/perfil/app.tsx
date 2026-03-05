import { useState, useEffect, useRef } from "react";
import Nav from "../../components/sideBar/sideBar";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import EditarPerfil from "../../components/EditProfileModal/modalEditProfile";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../hooks/useProfile/useProfile";
import { useUploadImg } from "../../hooks/useUploadsImg/useUploadImg";
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
export default function PerfilUsuario() {
  const [siderAberto, setSiderAberto] = useState(false);
  const [abertoEdit, setAbertoEdit] = useState(false);

  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useRef<Toast>(null);
  const token = Cookies.get("token");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    adress: "",
    email: "",
    phone: "",
    province: "",
    dataISO: "",
    nif: "",
  });

  const { data, isLoading, error } = useProfile(token);
  const userImgMutation = useMutation({
    mutationFn: handleFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profile"] });
    },
  });
  useEffect(() => {
    if (!data) return;
    setFormData((prev) => ({
      ...prev,
      name: data.data?.name || "",
      phone: data.data?.phone || "",
      email: data.data?.email || "",
      province: data.data?.province || "",
      adress: data.data?.adress || "",
      dataISO: data.data?.created_at || "",
      nif: data.nif || "",
    }));
    setImg(data.data?.profile || "");
  }, [data, token]);
  const { mutate: uploadImg } = useUploadImg(token);
  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("img", file);
    setLoading(true);
    setUpload(true);
    uploadImg(
      { formData },
      {
        onSuccess: (data) => {
          toast.current?.show({
            severity: "success",
            summary: "Tudo certo",
            detail: data.message,
            life: 2000,
          });
          setLoading(false);
          setUpload(false);
          window.dispatchEvent(new Event("UpdateStatusModal"));
        },
        onError: (err) => {
          setLoading(false);
          setUpload(false);
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
  useEffect(() => {
    const fecharModal = async () => {
      setAbertoEdit(false);
      console.log(abertoEdit);
    };
    fecharModal();
    window.addEventListener("UpdateStatusModal", fecharModal);
    return () => {
      window.removeEventListener("UpdateStatusModal", fecharModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const date = new Date(formData.dataISO);
  const dataFormat = date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (error) console.log(error);
  return (
    <>
      <Toast ref={toast} position="top-right" />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          userImgMutation.mutate(e);
        }}
      />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
        </div>
      )}
      <div className="bg-background text-text-main">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
              </div>
            )}
            <div className="flex-1 overflow-auto p-8  bg-background">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex">
                    <button
                      className="md:hidden  mr-3 text-text-secondary hover:text-text-main transition-colors"
                      onClick={() => setSiderAberto(true)}
                    >
                      <span className="material-symbols-outlined text-2xl align-middle">
                        menu
                      </span>
                    </button>
                    <h1 className="text-text-main  text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                      Perfil da Fazenda
                    </h1>
                  </div>

                  <p className="text-text-muted dark:text-gray-400 mt-1 text-sm">
                    Gerencie as informações públicas e dados fiscais do seu
                    negócio.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg active:scale-90"
                    onClick={() => setAbertoEdit(true)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                    <span>Editar perfil</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-light  rounded-2xl border border-gray-100  shadow-soft overflow-hidden">
                  <div className="h-32 bg-linear-to-r from-green-50 to-emerald-100  relative">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(#4cae4f 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  </div>
                  <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex items-end justify-between mb-6">
                      <div className="relative bg-white p-1.5 rounded-xl shadow-md inline-block">
                        <div
                          className="size-24 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${img ? `${img}` : "https://api-registagro.onrender.com/upload/users/user-30-01-2026_145927.jpg"})`,
                          }}
                        ></div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={upload}
                          className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-full shadow-lg hover:bg-primary-hover scale-90 hover:scale-95 transition-all border-2 border-white flex items-center justify-center cursor-pointer"
                          title="Alterar foto"
                        >
                          <span className="material-symbols-outlined text-[1px]">
                            photo_camera
                          </span>
                        </button>
                      </div>

                      <div className="hidden sm:block">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-primary text-xs font-bold uppercase tracking-wider border border-green-200">
                          Verificado
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Nome da Fazenda
                        </p>
                        <p className="text-text-main  text-lg font-medium">
                          {formData.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Nif
                        </p>
                        <p className="text-text-main  text-lg font-medium font-mono">
                          {formData.nif}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Contacto Principal
                        </p>
                        <div className="flex items-center gap-2 text-text-main  text-lg font-medium">
                          <span className="material-symbols-outlined text-primary text-sm">
                            call
                          </span>
                          +244 {formData.phone}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-text-muted text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          E-mail Comercial
                        </p>
                        <div className="flex items-center gap-2 text-text-main  text-lg font-medium">
                          <span className="material-symbols-outlined text-primary text-sm">
                            mail
                          </span>
                          {formData.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100  shadow-soft overflow-hidden flex flex-col h-40">
                    <div className="p-5 border-b border-gray-100  flex items-center justify-between">
                      <h3 className="font-bold text-text-main ">Localização</h3>
                      <button className="text-primary hover:text-green-600 text-xs font-bold uppercase tracking-wide">
                        Ver no mapa
                      </button>
                    </div>
                    <div className="p-5 bg-white ">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-text-muted mt-1 shrink-0">
                          pin_drop
                        </span>
                        <div>
                          <p className="text-text-main  font-medium">
                            {formData.adress}
                          </p>
                          <p className="text-text-muted  text-gray-400 text-sm mt-0.5">
                            {formData.province}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-light  rounded-2xl border border-gray-100  shadow-soft p-5">
                    <h3 className="font-bold text-text-main  text-sm mb-4">
                      Status da conta
                    </h3>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50  border border-green-100 ">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[18px]">
                            check
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-green-800 tracking-wide">
                            Ativa
                          </p>
                          <p className="text-xs text-green-700 ">
                            Desde {dataFormat}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <EditarPerfil openEditPerfil={abertoEdit}>
        <button
          onClick={() => setAbertoEdit(false)}
          className="w-full py-2 text-text-muted hover:text-primary font-medium text-sm transition-all underline underline-offset-4 decoration-text-muted/30 active:scale-90"
          type="button"
        >
          Cancelar
        </button>
      </EditarPerfil>
    </>
  );
}
