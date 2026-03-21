import { useMemo } from "react";
type Vehicle = {
  id: string;
  brand: string;
  plate: string;
  type: string;
  capacity: string;
  photo: string;
};

type CarrierGroup = {
  carrier: {
    id: string;
    name: string;
    phone: string;
  };
  vehicles: Vehicle[];
};
function useNormalizedVehicles(data: CarrierGroup[]) {
  return useMemo(() => {
    if (!data) return [];
    return data.flatMap((group: CarrierGroup) =>
      group.vehicles.map((vehicle: Vehicle) => ({
        id: vehicle.id,
        title: group.carrier.name,
        type: vehicle.type,
        capacity: vehicle.capacity,
        plate: vehicle.plate,
        carrierId: group.carrier.id,
        phone: group.carrier.phone,
        photo: vehicle.photo,
        brand: vehicle.brand,
      })),
    );
  }, [data]);
}

export default useNormalizedVehicles;
