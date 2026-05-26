import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationCarrier } from "../../hooks/useGetLocationCarrier/useGetLocationCarriers";

type LatLng = {
  lat: number;
  lng: number;
};

type MapProps = {
  openMap: boolean;
  onClose: () => void;
  orderId?: string;
  token?: string;
  children?: React.ReactNode;
};

type MapControllerProps = {
  expanded: boolean;
  route: LatLngExpression[];
  carrierLocation: LatLng | null;
  destinationLocation: LatLng | null;
  orderId?: string;
};

function MapController({
  expanded,
  route,
  carrierLocation,
  destinationLocation,
  orderId,
}: MapControllerProps) {
  const map = useMap();
  const fittedWithRoute = useRef(false);
  useEffect(() => {
    fittedWithRoute.current = false;
  }, [orderId]);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [expanded, map]);

  useEffect(() => {
    if (route.length > 0 && !fittedWithRoute.current) {
      const bounds = L.latLngBounds(route as [number, number][]);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });

      fittedWithRoute.current = true;
      return;
    }

    if (route.length === 0 && carrierLocation && destinationLocation) {
      const bounds = L.latLngBounds([
        [carrierLocation.lat, carrierLocation.lng],
        [destinationLocation.lat, destinationLocation.lng],
      ]);

      map.fitBounds(bounds, {
        padding: [60, 60],
      });

      return;
    }
    if (route.length === 0 && carrierLocation && !destinationLocation) {
      map.setView([carrierLocation.lat, carrierLocation.lng], 15);
    }
  }, [route, carrierLocation, destinationLocation, map]);

  return null;
}

function MapModal({ openMap, onClose, orderId, token, children }: MapProps) {
  const [expanded, setIsExpanded] = useState(false);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [error, setError] = useState<string | null>(null);

  const truckIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        background: #16a34a;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  const destinationIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        background: #2563eb;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  const { data: carrierData } = useLocationCarrier(
    openMap ? token : undefined,
    orderId ?? "",
  );
  const carrierLocation: LatLng | null =
    carrierData?.origin?.[0] && carrierData?.origin?.[1]
      ? {
          lat: Number(carrierData.origin[0]),
          lng: Number(carrierData.origin[1]),
        }
      : null;
  const destinationLocation: LatLng | null =
    carrierData?.destination?.[0] && carrierData?.destination?.[1]
      ? {
          lat: Number(carrierData.destination[0]),
          lng: Number(carrierData.destination[1]),
        }
      : null;
  useEffect(() => {
    setRoute([]);
    setError(null);
  }, [orderId]);
  useEffect(() => {
    if (!openMap || !carrierLocation || !destinationLocation) return;

    const fetchRoute = async (): Promise<void> => {
      try {
        setError(null);

        const url = `https://router.project-osrm.org/route/v1/driving/${carrierLocation.lng},${carrierLocation.lat};${destinationLocation.lng},${destinationLocation.lat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          setError("Não foi possível calcular a rota.");
          return;
        }

        const coords: LatLngExpression[] =
          data.routes[0].geometry.coordinates.map((c: number[]) => [
            c[1],
            c[0],
          ]);

        setRoute(coords);
      } catch (e) {
        console.error(e);
        setError("Erro ao buscar rota.");
      }
    };

    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    openMap,
    carrierLocation?.lat,
    carrierLocation?.lng,
    destinationLocation?.lat,
    destinationLocation?.lng,
  ]);
  useEffect(() => {
  if (!openMap) {
    setIsExpanded(false);
  }
}, [openMap]);

  const handleClose = (): void => {
    setIsExpanded(false);
    setRoute([]);
    setError(null);
    onClose();
  };

  if (!openMap) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex items-center justify-center transition ${
        openMap
          ? "visible opacity-100 bg-black/20 backdrop-blur-sm z-60"
          : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col overflow-hidden transition-all duration-300 ${
          expanded ? "w-screen h-screen" : "w-100 h-100 rounded-xl"
        }`}
      >
        <div className="flex justify-between items-center p-3 bg-green-100 text-green-700 font-semibold">
          <span>Rastreamento do Veículo</span>

          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!expanded)}
              className="px-2 py-1 hover:bg-gray-200 rounded flex items-center"
            >
              <span className="material-symbols-outlined">
                {expanded ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>

            {children}
          </div>
        </div>

        <div className="flex-1 relative">
          {openMap && !carrierLocation && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

              <p className="mt-4 text-sm font-medium text-green-700">
                A carregar localização do transporte...
              </p>
            </div>
          )}
          {!carrierLocation && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded z-10">
              A aguardar posição do transporte...
            </div>
          )}
          {error && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 text-sm px-3 py-1 rounded z-10">
              {error}
            </div>
          )}

          {carrierLocation ? (
            <MapContainer
              key={orderId}
              center={[carrierLocation.lat, carrierLocation.lng]}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
            >
              <MapController
                expanded={expanded}
                route={route}
                carrierLocation={carrierLocation}
                destinationLocation={destinationLocation}
                orderId={orderId}
              />

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Transportador */}
              <Marker
                position={[carrierLocation.lat, carrierLocation.lng]}
                icon={truckIcon}
              />

              {/* Destino */}
              {destinationLocation && (
                <Marker
                  position={[destinationLocation.lat, destinationLocation.lng]}
                  icon={destinationIcon}
                />
              )}

              {/* Linha da rota */}
              {route.length > 0 && (
                <Polyline positions={route} color="green" weight={5} />
              )}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

              <p className="mt-4 text-sm font-medium text-green-700">
                A carregar localização do transporte...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapModal;
