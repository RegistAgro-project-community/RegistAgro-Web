import { useState, useEffect, useCallback } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import type { Library } from "@googlemaps/js-api-loader";


const LIBRARIES: Library[] = ["places"];


const TEST_DESTINATION = {
  lat: -8.914,
  lng: 13.191,
};

type MapProps = {
  openMap: boolean;
  onClose: () => void;
  destination?: { lat: number; lng: number };
  children?: React.ReactNode;
};

const initialPosition = { lat: -8.8383, lng: 13.2344 };

function MapModal({ openMap, onClose, destination, children }: MapProps) {
  const [expanded, setIsExpanded] = useState(false);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [directionsError, setDirectionsError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState(initialPosition);
  const [locationReady, setLocationReady] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (!openMap) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocationReady(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationReady(true);
      },
      (error) => {
        console.error("Erro geolocalização:", error);
        setLocationReady(true);
      },
    );
  }, [openMap]);

  useEffect(() => {
    if (openMap) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExpanded(false);
    setDirections(null);
    setDirectionsError(null);
    setLocationReady(false);
  }, [openMap]);

  const activeDestination = destination ?? TEST_DESTINATION;

  const calculateRoute = useCallback(() => {
    if (!isLoaded || !locationReady) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: userLocation,
        destination: activeDestination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("ROUTE STATUS:", status);

        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          setDirectionsError(null);
        } else {
          setDirections(null);
          setDirectionsError("Não foi possível calcular a rota.");
        }
      },
    );
  }, [isLoaded, locationReady, userLocation, activeDestination]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  const handleClose = () => {
    setIsExpanded(false);
    setDirections(null);
    setDirectionsError(null);
    setLocationReady(false);
    onClose();
  };

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
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              <span className="material-symbols-outlined">
                {expanded ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>

            {children}
          </div>
        </div>

        <div className="flex-1 relative">
          {!isLoaded || !locationReady ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
              {!locationReady ? "A obter localização..." : "Carregando mapa..."}
            </div>
          ) : null}

          {directionsError && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-700 text-sm px-3 py-1 rounded">
              {directionsError}
            </div>
          )}

          {isLoaded && locationReady && (
            <GoogleMap
              center={userLocation}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                keyboardShortcuts: false,
              }}
            >
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: "#16a34a",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}

              <Marker
                position={userLocation}
                title="Sua localização"
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />

              <Marker
                position={activeDestination}
                title="Destino"
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapModal;
