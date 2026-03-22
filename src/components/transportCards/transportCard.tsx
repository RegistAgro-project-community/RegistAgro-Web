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
type Props = {
  item: ProsTransport;
};
function TransportCard({ item }: Props) {
  return (
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
            <span className="text-text-secondary2 text-xs">• {item.brand}</span>
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

        <button className="w-full bg-primary text-white py-3 rounded-lg">
          Confirmar Transportadora
        </button>
      </div>
    </div>
  );
}

export default TransportCard;
