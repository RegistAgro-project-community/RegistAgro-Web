import { useState, useEffect } from "react";

const slides = [
  {
    image: "/assets/image/carrosel/carrosel-img-1.jpg",
    title: "Irrigação Inteligente no Sul de Angola",
    description:
      "Sistemas automatizados ajudam agricultores do Cunene e Namibe a otimizar o uso da água e aumentar a produtividade mesmo em períodos de seca.",
  },
  {
    image: "/assets/image/carrosel/carrosel-img-2.jpg",
    title: "Monitoramento com Drones",
    description:
      "Drones permitem analisar grandes áreas agrícolas no Huambo e Bié, identificando pragas e falhas com precisão.",
  },
  {
    image: "/assets/image/carrosel/carrosel-img-3.jpg",
    title: "Comercialização Digital Rural",
    description:
      "Plataformas conectam produtores angolanos diretamente aos consumidores urbanos, aumentando renda e reduzindo intermediários.",
  },
  {
    image: "/assets/image/carrosel/carrosel-img-4.jpg",
    title: "Mecanização Agrícola Moderna",
    description:
      "Máquinas modernas aumentam eficiência produtiva em províncias como Malanje e Uíge.",
  },
  {
    image: "/assets/image/carrosel-img-5.jpg",
    title: "Sensores Inteligentes no Solo",
    description:
      "Tecnologia de sensores permite monitorar nutrientes e umidade do solo em tempo real.",
  },
];

export default function AgroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (prev === slides.length - 1) {
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full md:h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${
            index === current
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-105 z-0"
          }`}
        >
          <img
            src={`${slide.image}?auto=format&fit=crop&w=1600&q=80`}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div
              className={`text-white p-8 md:p-16 max-w-3xl transition-all duration-1000 ${
                index === current
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-sm md:text-lg text-gray-200">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-green-600 scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
