import Cookies from "js-cookie";
import type { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import { useHideTransport } from "../../hooks/useHideTransport/useHideTransport";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";

type ProsTransport = {
  id: string;
  title: string;
  type: string;
  capacity: string;
  plate: string;
  carrierId: string;
  phone: string;
  photo: string;
  brand: string;
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
  warning?: string;
  error?: ZodIssue[] | string;
}

type Props = {
  item: ProsTransport;
};

function TransportCard({ item }: Props) {
  const token = Cookies.get("token");
  const { id } = useParams();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { mutate: hideTransport } = useHideTransport(token);

  async function handleHideTransport(vehicleId: string) {
    hideTransport(
      { orderId: id || "", vehicleId },
      {
        onSuccess: (data) => {
          toast.current?.show({
            severity: "success",
            summary: "Tudo certo",
            detail: data.message,
            life: 2000,
          });
          navigate("/pedidos");
        },
        onError: (err) => {
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
          } else if (error.response?.data.warning) {
            mensagem = error.response?.data.warning;
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
  return (
    <>
      <Toast ref={toast} position="top-right" />

      <div className="bg-white border border-[#f1f3f1] rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col group">
        <div
          className="h-44 bg-center bg-no-repeat bg-cover relative"
          style={{
            backgroundImage: `url(${item.photo || "/assets/image/carrinha.png"})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 left-3 bg-white/90 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {item.type}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-text-main leading-snug mb-0.5">
              {item.title}
            </h3>
            <p className="text-xs text-text-secondary2">{item.brand}</p>
          </div>
          <div className="space-y-2.5 mb-6 flex-1">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1.5 text-text-secondary2">
                <span className="material-symbols-outlined text-base">
                  inventory_2
                </span>
                Capacidade
              </span>
              <span className="font-medium text-text-main">
                {item.capacity}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1.5 text-text-secondary2">
                <span className="material-symbols-outlined text-base">pin</span>
                Placa
              </span>
              <span className="font-mono font-medium text-text-main tracking-wider">
                {item.plate}
              </span>
            </div>

            {item.phone && (
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1.5 text-text-secondary2">
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                  Contacto
                </span>
                <span className="font-medium text-text-main">{item.phone}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => handleHideTransport(item.id)}
            className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white text-sm font-semibold py-3 rounded-xl cursor-pointer transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            Confirmar Transportadora
          </button>
        </div>
      </div>
    </>
  );
}

export default TransportCard;
