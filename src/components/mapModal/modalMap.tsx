import { useState } from "react";
type MapPros = {
  openMap: boolean;
  onClose: () => void;
};

function MapModal({ openMap, onClose }: MapPros) {
  const [expanded, setIsExpanded] = useState(false);
  return (
    <>
      <div
        onClick={onClose}
        className={`
    fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${openMap ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
      >
        <div
          onClick={(e) => e.stopPropagation}
          className={`flex flex-col overflow-hidden transition-all duration-300 ${expanded ? "w-screen h-screen" : "w-100 h-100 rounded-xl"}`}
        >
          <div className="flex justify-between items-center p-3 border-b bg-blue-300">
            <span className="font-semibold">Tracking do veículo</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!expanded)}
                className="px-2 py-1 hover:bg-gray-200 rounded"
              >
                {expanded ? (
                  <span className="material-symbols-outlined">
                    fullscreen_exit
                  </span>
                ) : (
                  <span className="material-symbols-outlined">fullscreen</span>
                )}
              </button>
              <button
                onClick={() => onClose}
                className="px-2 py-1 hover:bg-red-200 rounded"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default MapModal;
