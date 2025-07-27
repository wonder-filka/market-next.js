'use client'

import { useI18n } from "@/locales/client";
import Link from "next/link";
import { useRef, useLayoutEffect, useState } from "react";

const prices = [
  { symbol: "BTCUSD", price: 118256.9, change: -0.56 },
  { symbol: "ETHUSD", price: 3591.17, change: -1.32 },
  { symbol: "GOLD", price: 3392.95, change: 0.12 },
  { symbol: "US30", price: 44976.92, change: 1.05 },
  { symbol: "WTI", price: 65.044, change: -0.23 },
  { symbol: "GBPUSD", price: 1.35679, change: 0.01 },
];

export const MainBlock = () => {
  const t = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(2); // повторов по умолчанию

  // Автоматически вычислять количество повторов для бесшовности
  useLayoutEffect(() => {
    function updateRepeats() {
      if (!trackRef.current) return;
      const containerWidth = trackRef.current.parentElement?.offsetWidth || 1;
      const trackWidth = trackRef.current.scrollWidth / repeat;
      const needed = Math.ceil(containerWidth / trackWidth) + 2; // +2 для 100% бесшовности
      setRepeat(needed);
    }
    updateRepeats();
    window.addEventListener("resize", updateRepeats);
    return () => window.removeEventListener("resize", updateRepeats);
  }, [repeat]);

  const fullPrices = Array.from({ length: repeat }, () => prices).flat();

  return (
    <div className="relative overflow-hidden max-w-screen flex flex-col justify-between">
      {/* Фоновое видео */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/video-fallback.jpg"
      >
        <source src="/home.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Центрированная секция */}
      <div className="relative z-20 flex flex-col items-center justify-center h-[65vh] text-center">
        <h1 className="max-w-3xl text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-6">
          Лучший брокер для стран СНГ и Восточной Европы
        </h1>
        <p className="text-lg md:text-2xl text-gray-100 mb-8 font-medium">
          Нам доверяют миллионы трейдеров по всему миру
        </p>
        <Link
          href="/registration"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 text-xl font-semibold transition"
        >
          Начать торговать
        </Link>
      </div>

      {/* Бесконечная бегущая строка с ценами */}
      <div className="absolute bottom-0 left-0 w-full z-30 bg-black/80 overflow-hidden h-14 flex items-center border-t border-white/10">
        <div
          ref={trackRef}
          className="marquee-track flex gap-12 px-6"
          style={{
            // Позволяет сделать 1 loop на всё содержимое
            width: 'max-content',
          }}
        >
          {fullPrices.map(({ symbol, price, change }, i) => (
            <span
              key={symbol + i}
              className={`flex items-center gap-2 font-mono text-lg min-w-[150px] ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-white"
                }`}
            >
              <span className="font-bold">{symbol}</span>
              <span>{price !== 0 ? price : "—"}</span>
              {/* <span>
                {change > 0 ? "▲" : change < 0 ? "▼" : ""} {Math.abs(change).toFixed(2)}%
              </span> */}
            </span>
          ))}
        </div>
        <style jsx>{`
          .marquee-track {
            animation: scrolling 30s linear infinite;
            will-change: transform;
          }
          @keyframes scrolling {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  )
}
