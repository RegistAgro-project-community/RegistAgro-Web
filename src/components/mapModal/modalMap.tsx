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
};

const initialPosition: LatLng = {
  lat: -8.8383,
  lng: 13.2344,
};

function MapController({
  expanded,
  route,
  carrierLocation,
}: MapControllerProps) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [expanded, map]);


  useEffect(() => {
    if (hasFitted.current) return;
    console.log("route:", route.length);
    console.log("carrierLocation:", carrierLocation);
    if (route.length > 0) {
      const bounds = L.latLngBounds(route as [number, number][]);
      map.fitBounds(bounds, { padding: [50, 50] });
      hasFitted.current = true;
      return;
    }

    if (carrierLocation) {
      console.log("setView a executar com zoom 8");
      map.setView([carrierLocation.lat, carrierLocation.lng], 1);
      hasFitted.current = true; 
    }
  }, [route, carrierLocation, map]);

  return null;
}

function MapModal({ openMap, onClose, orderId, token, children }: MapProps) {
  const [expanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng>(initialPosition);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
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

  const farmIcon = L.divIcon({
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
        <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3zm0 2.7L19 12v7h-4v-5H9v5H5v-7l7-6.3z"/>
        <path d="M10 12h4v4h-4z"/>
      </svg>
    </div>
  `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  const { data: carrierData } = useLocationCarrier(
    openMap ? token : undefined,
    orderId ?? "",
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const carrierLocation: LatLng | null =
    carrierData?.latitude && carrierData?.longitude
      ? {
          lat: Number(carrierData.latitude),
          lng: Number(carrierData.longitude),
        } 
      : null;

  useEffect(() => {
    if (!openMap) return;
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
      },
    );
  }, [openMap]);

  useEffect(() => {
    if (!openMap || !carrierLocation) return;

    const fetchRoute = async (): Promise<void> => {
      try {
        setError(null);

        const url = `https://router.project-osrm.org/route/v1/driving/${Number(userLocation.lng)},${Number(userLocation.lat)};${Number(carrierLocation.lng)},${Number(carrierLocation.lat)}?overview=full&geometries=geojson`;

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
  }, [openMap, userLocation, carrierLocation]);

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
          {loadingLocation && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 z-10">
              A obter localização...
            </div>
          )}

          {!carrierLocation && !loadingLocation && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded z-10">
              A aguardar posição do transporte...
            </div>
          )}

          {error && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 text-sm px-3 py-1 rounded z-10">
              {error}
            </div>
          )}

          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={8}
            style={{ width: "100%", height: "100%" }}
          >
            <MapController
              expanded={expanded}
              route={route}
              carrierLocation={carrierLocation}
            />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={farmIcon}
            />

            {carrierLocation && (
              <Marker
                position={[carrierLocation.lat, carrierLocation.lng]}
                icon={truckIcon}
              />
            )}

            {route.length > 0 && (
              <Polyline positions={route} color="green" weight={5} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapModal;
