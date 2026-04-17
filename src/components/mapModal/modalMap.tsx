import { useState, useEffect } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
type MapPros = {
  openMap: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

function MapModal({ openMap, onClose, children }: MapPros) {
  const [expanded, setIsExpanded] = useState(false);
  //   Luanda A Bengo
  //   const initialPosition = {
  //     lat: -9.1042,
  //     lng: 13.7289,
  //   }; Luanda
  const initialPosition = {
    lat: -8.8383,
    lng: 13.2344,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  useEffect(() => {
    const expandedFalse = async () => {
      setIsExpanded(false);
    };
    if (openMap === false) {
      expandedFalse();
    }
  });
  return (
    <>
      <div
        onClick={onClose}
        className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center  ${openMap ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible "}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex flex-col overflow-hidden transition-all duration-300 ${expanded ? "w-screen h-screen" : "w-100 h-100 rounded-xl"}`}
        >
          <div className="flex justify-between items-center p-3  bg-green-100 text-green-700 font-semibold">
            <span className="font-semibold">Rastreamento do Veículo</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!expanded)}
                className="px-2 py-1  flex items-center justify-center hover:text-gray-600 cursor-pointer hover:bg-gray-200  rounded"
              >
                {expanded ? (
                  <span className="material-symbols-outlined">
                    fullscreen_exit
                  </span>
                ) : (
                  <span className="material-symbols-outlined">fullscreen</span>
                )}
              </button>
              {children}
            </div>
          </div>
          <div className="flex-1  bg-orange-500" />
          {!isLoaded && <div className="text-white">Carregando mapa...</div>}
          {isLoaded && (
            <GoogleMap
              center={initialPosition}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              zoom={15}
              options={{
                fullscreenControl: false,
                draggable: false,
                streetViewControl: false,
                keyboardShortcuts: false,
                mapTypeControl: false,
              }}
            ></GoogleMap>
          )}
        </div>
      </div>
    </>
  );
}
export default MapModal;
