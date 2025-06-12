'use client'

import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LiveCryptoChart() {
  const [data, setData] = useState<{ time: string, price: number }[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Binance WebSocket для пары BTCUSDT (1s update)
    ws.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.current.onmessage = event => {
      const msg = JSON.parse(event.data);
      setData(prev => {
        // Добавим новый тик и оставим только последние 60 секунд
        const next = [
          ...prev,
          { time: new Date(msg.T).toLocaleTimeString(), price: Number(msg.p) }
        ];
        return next.slice(-60);
      });
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className="w-full h-72 bg-muted rounded-lg shadow p-4">
      <h2 className="mb-2 text-lg font-bold">BTC/USDT (live Binance)</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={['dataMin', 'dataMax']} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10b981" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
