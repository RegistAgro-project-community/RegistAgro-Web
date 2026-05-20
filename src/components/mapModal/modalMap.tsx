// import { useState, useEffect, useCallback } from "react";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import type { Library } from "@googlemaps/js-api-loader";

// const LIBRARIES: Library[] = ["places"];

// const TEST_DESTINATION = {
//   lat: -8.914,
//   lng: 13.191,
// };

// type MapProps = {
//   openMap: boolean;
//   onClose: () => void;
//   destination?: { lat: number; lng: number };
//   children?: React.ReactNode;
// };

// const initialPosition = { lat: -8.8383, lng: 13.2344 };

// function MapModal({ openMap, onClose, destination, children }: MapProps) {
//   const [expanded, setIsExpanded] = useState(false);

//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);

//   const [directionsError, setDirectionsError] = useState<string | null>(null);

//   const [userLocation, setUserLocation] = useState(initialPosition);
//   const [locationReady, setLocationReady] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries: LIBRARIES,
//   });

//   useEffect(() => {
//     if (!openMap) return;

//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setLocationReady(false);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//         setLocationReady(true);
//       },
//       (error) => {
//         console.error("Erro geolocalização:", error);
//         setLocationReady(true);
//       },
//     );
//   }, [openMap]);

//   useEffect(() => {
//     if (openMap) return;

//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setIsExpanded(false);
//     setDirections(null);
//     setDirectionsError(null);
//     setLocationReady(false);
//   }, [openMap]);

//   const activeDestination = destination ?? TEST_DESTINATION;

//   const calculateRoute = useCallback(() => {
//     if (!isLoaded || !locationReady) return;

//     const service = new google.maps.DirectionsService();

//     service.route(
//       {
//         origin: userLocation,
//         destination: activeDestination,
//         travelMode: google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         console.log("ROUTE STATUS:", status);

//         if (status === google.maps.DirectionsStatus.OK && result) {
//           setDirections(result);
//           setDirectionsError(null);
//         } else {
//           setDirections(null);
//           setDirectionsError("Não foi possível calcular a rota.");
//         }
//       },
//     );
//   }, [isLoaded, locationReady, userLocation, activeDestination]);

//   useEffect(() => {
//     calculateRoute();
//   }, [calculateRoute]);

//   const handleClose = () => {
//     setIsExpanded(false);
//     setDirections(null);
//     setDirectionsError(null);
//     setLocationReady(false);
//     onClose();
//   };

//   return (
//     <div
//       onClick={handleClose}
//       className={`fixed inset-0 flex items-center justify-center transition ${
//         openMap
//           ? "visible opacity-100 bg-black/20 backdrop-blur-sm z-60"
//           : "invisible opacity-0"
//       }`}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className={`flex flex-col overflow-hidden transition-all duration-300 ${
//           expanded ? "w-screen h-screen" : "w-100 h-100 rounded-xl"
//         }`}
//       >
//         <div className="flex justify-between items-center p-3 bg-green-100 text-green-700 font-semibold">
//           <span>Rastreamento do Veículo</span>

//           <div className="flex gap-2">
//             <button
//               onClick={() => setIsExpanded(!expanded)}
//               className="px-2 py-1 hover:bg-gray-200 rounded"
//             >
//               <span className="material-symbols-outlined">
//                 {expanded ? "fullscreen_exit" : "fullscreen"}
//               </span>
//             </button>

//             {children}
//           </div>
//         </div>

//         <div className="flex-1 relative">
//           {!isLoaded || !locationReady ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
//               {!locationReady ? "A obter localização..." : "Carregando mapa..."}
//             </div>
//           ) : null}

//           {directionsError && (
//             <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-700 text-sm px-3 py-1 rounded">
//               {directionsError}
//             </div>
//           )}

//           {isLoaded && locationReady && (
//             <GoogleMap
//               center={userLocation}
//               zoom={15}
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               options={{
//                 fullscreenControl: false,
//                 streetViewControl: false,
//                 mapTypeControl: false,
//                 keyboardShortcuts: false,
//               }}
//             >
//               {directions && (
//                 <DirectionsRenderer
//                   directions={directions}
//                   options={{
//                     suppressMarkers: true,
//                     polylineOptions: {
//                       strokeColor: "#16a34a",
//                       strokeWeight: 5,
//                     },
//                   }}
//                 />
//               )}

//               <Marker
//                 position={userLocation}
//                 title="Sua localização"
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                 }}
//               />

//               <Marker
//                 position={activeDestination}
//                 title="Destino"
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//                 }}
//               />
//             </GoogleMap>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MapModal;

import { useState, useEffect } from "react";
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

type LatLng = {
  lat: number;
  lng: number;
};

type MapProps = {
  openMap: boolean;
  onClose: () => void;
  destination?: LatLng;
  children?: React.ReactNode;
};
type MapControllerProps = {
  expanded: boolean;
  route: LatLngExpression[];
};

const TEST_DESTINATION: LatLng = {
  lat: -8.914,
  lng: 13.191,
};

const initialPosition: LatLng = {
  lat: -8.8383,
  lng: 13.2344,
};

function MapController({ expanded, route }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      if (route.length > 0) {
        const bounds = L.latLngBounds(route as [number, number][]);

        map.fitBounds(bounds, {
          padding: [50, 50],
        });
      }
    }, 200);
  }, [expanded, map, route]);

  return null;
}
function MapModal({ openMap, onClose, destination, children }: MapProps) {
  const [expanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng>(initialPosition);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeDestination: LatLng = destination ?? TEST_DESTINATION;

  useEffect(() => {
    if (!openMap) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
    );
  }, [openMap]);

  useEffect(() => {
    if (!openMap) return;

    const fetchRoute = async (): Promise<void> => {
      try {
        setError(null);

        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${activeDestination.lng},${activeDestination.lat}?overview=full&geometries=geojson`;

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
  }, [openMap, userLocation, activeDestination]);

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
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
              A obter localização...
            </div>
          )}

          {error && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 text-sm px-3 py-1 rounded z-10">
              {error}
            </div>
          )}

          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={15}
            style={{ width: "100%", height: "100%" }}
          >
            <MapController expanded={expanded} route={route} />

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[userLocation.lat, userLocation.lng]} />
            <Marker position={[activeDestination.lat, activeDestination.lng]} />
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
