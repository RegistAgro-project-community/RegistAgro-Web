// interface DeliveryAddress {
//   street: string;
//   neighborhood: string;
//   city: string;
//   province: string;
// }
// interface Products {
//   name: string;
//   weight: string;
//   qty: number;
// }
// interface OrderData {
//   id: string;
//   client: string;
//   carrier: string;
//   date: string;
//   status: string;
//   driver: string;
//   deliveryAddress: DeliveryAddress;
//   products: Products;
// }
interface Consumer {
  name: string;
}
interface Product {
  name: string;
  transport: string;
}
interface Transport {
  carrier: string;
  plate: string;
  start_at: string;
  delivered_at: string;
}
interface OrderData {
  transport: Transport;
  consumer: Consumer;
  product: Product;
  status: string;
  delivery_adress: string;
  transport_status: string | null;
  value: number;
  qtd: number;
  unit: string;
  id: string;
  created_at: string;
}
type DetalhePros = {
  openDetalhe: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  order: OrderData | null;
};
const formatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
function DetalhePedido({ openDetalhe, onClose, children, order }: DetalhePros) {
  return (
    <div
      onClick={onClose}
      className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${openDetalhe ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light  w-full max-w-xl rounded-2xl shadow-modal overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <div className="px-8 py-6 border-b border-border-color flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-text-main ">
              Detalhes da Entrega
            </h3>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold  border  ${
              order?.status === "delivered"
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : order?.status === "incollection"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : order?.status === "ongoing"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : ""
            }`}
          >
            {order?.status === "delivered"
              ? "entregue"
              : order?.status === "incollection"
                ? "aguardando coleta"
                : order?.status === "ongoing"
                  ? "Em andamento"
                  : order?.status === "canceled"
                    ? "cancelado"
                    : ""}
          </span>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-19 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                  Cliente
                </p>
                <p className="text-sm font-semibold text-text-main ">
                  {order?.consumer.name}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                  Endereço de Entrega
                </p>
                <p className="text-sm text-text-main  leading-relaxed">
                  <span className="font-semibold text-primary">
                    {order?.delivery_adress}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                  Transportadora
                </p>
                <p className="text-sm font-semibold text-text-main ">
                  {order?.transport.carrier}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                  Placa do Carro
                </p>
                <p className="text-sm font-semibold text-text-main ">
                  {order?.transport.plate}
                </p>
              </div>
            </div>
          </div>
          {order?.status === "delivered" ? (
            <>
              <div className="bg-green-50/50  border border-green-100  rounded-xl p-4 mb-6">
                <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    verified
                  </span>
                  Comprovativo de Entrega
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600">
                      event_available
                    </span>
                    <div>
                      <p className="text-xs text-text-secondary">
                        Entregue em:
                      </p>
                      <p className="text-sm font-bold text-text-main ">
                        {formatter.format(
                          new Date(order?.transport.delivered_at),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-3">
              Produtos na Entrega
            </p>
            <div className="border border-border-color rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light und-dark text-text-secondary border-b border-border-color">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Item</th>
                    <th className="px-4 py-2 font-semibold text-right">
                      Quantidade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-text-main ">
                  <tr>
                    <td className="px-4 py-3">{order?.product.name}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {order?.qtd}
                      {order?.unit === "t" ? "ton" : order?.unit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default DetalhePedido;
