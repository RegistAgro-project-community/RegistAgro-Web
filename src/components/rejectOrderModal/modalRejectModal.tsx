import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useRejectOrders } from "../../hooks/useRejectOrders/useRejectOrder";

type RejectOrdersProps = {
  openReject: boolean;
  orderId: string;
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
function RejectOrder({ openReject, children, orderId }: RejectOrdersProps) {
  const [modalOpen, setModalOpen] = useState(openReject);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const token = Cookies.get("token");
  const { mutate: rejectOrder } = useRejectOrders(token);
  function handleRejectOrder() {
    setLoading(true);
    rejectOrder(orderId, {
      onSuccess: (data) => {
        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: data.message,
          life: 2000,
        });
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
  }
  useEffect(() => {
    setModalOpen(openReject);
  }, [openReject]);
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
        <div className="w-full max-w-120 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col ">
          <div className="flex justify-center pt-7 ">
            {" "}
            <div className="p-4 w-13 h-13  bg-red-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-red-400 text-4xl">
                warning
              </span>
            </div>
          </div>
          <div className="px-8 pt-6">
            <h3 className="text-text-main tracking-tight text-2xl font-bold leading-tight text-center">
              Rejeitar Pedido
            </h3>
            <div className="px-8 pt-2">
              <p className="text-text-main text-base font-normal leading-normal text-center">
                Tem certeza que deseja rejeitar este pedido?
              </p>
            </div>
            <div className="px-8 pt-2">
              <p className="text-text-secondary2 text-sm font-normal leading-normal text-center">
                Esta ação não poderá ser desfeita e o pedido será marcado como
                rejeitado.
              </p>
              <div className="flex justify-center p-8">
                <div className="flex flex-col  sm:flex-row flex-1 gap-3 max-w-full">
                  {children}
                  <button
                    onClick={handleRejectOrder}
                    className="flex-1 min-w-43 h-12 bg-primary hover:bg-primary-hover  items-center justify-center active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Confirmar Rejeição</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default RejectOrder;
