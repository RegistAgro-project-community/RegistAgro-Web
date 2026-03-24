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
  const navegate = useNavigate();
  const { mutate: hideTransport } = useHideTransport(token);

  async function handleHideTransport(vehicleId: string) {
    console.log(id, vehicleId);
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
          navegate("/pedidos");
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
      <div className="bg-white border border-[#f1f3f1] rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-sm hover:shadow-md">
        <div
          className="h-40 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${item.photo || "/assets/image/carrinha.png"})`,
          }}
        />

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {item.type}
              </span>
              <span className="text-text-secondary2 text-xs">
                • {item.brand}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-6 flex-1">
            <div className="flex justify-between text-sm">
              <span>Capacidade</span>
              <span className="font-medium">{item.capacity}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Placa</span>
              <span className="font-medium">{item.plate}</span>
            </div>
          </div>

          <button
            onClick={() => handleHideTransport(item.id)}
            className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer active:scale-90"
          >
            Confirmar Transportadora
          </button>
        </div>
      </div>
    </>
  );
}

export default TransportCard;
