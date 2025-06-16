'use client'

import React, { useEffect, useState, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  title: string
  wsUrl?: string
  restUrl?: string
  mapData: (d: any) => { time: string, price: number }
  updateInterval?: number // ms
}

export function LiveChart({ title, wsUrl, restUrl, mapData, updateInterval = 10000 }: Props) {
  const [data, setData] = useState<{ time: string, price: number }[]>([])
  const ws = useRef<WebSocket | null>(null)

  // WebSocket для крипты
  useEffect(() => {
    if (!wsUrl) return
    ws.current = new WebSocket(wsUrl)
    ws.current.onmessage = event => {
      const msg = JSON.parse(event.data)
      setData(prev => {
        const next = [...prev, mapData(msg)]
        return next.slice(-60)
      })
    }
    return () => ws.current?.close()
    // eslint-disable-next-line
  }, [wsUrl])

  // REST для всего остального
  useEffect(() => {
    if (!restUrl) return
    let timer: NodeJS.Timeout
    const fetchData = async () => {
      const resp = await fetch(restUrl)
      const json = await resp.json()
      setData(prev => {
        const next = [...prev, mapData(json)]
        return next.slice(-60)
      })
      timer = setTimeout(fetchData, updateInterval)
    }
    fetchData()
    return () => timer && clearTimeout(timer)
    // eslint-disable-next-line
  }, [restUrl, updateInterval])

  return (
    <div className="bg-muted rounded-xl p-4 shadow w-full max-w-[500px] min-h-[300px]">
      <h3 className="mb-2 font-bold">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10b981" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
