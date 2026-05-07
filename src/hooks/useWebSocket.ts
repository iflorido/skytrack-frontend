import { useEffect, useRef, useCallback } from 'react'
import { useFlightStore } from '../stores/flightStore'
import { LiveStateResponse } from '../types'

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.flyskytrack.com/api/v1/states/live'
const RECONNECT_DELAY_MS = 3000
const MAX_RECONNECT_DELAY_MS = 30000

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>()
  const reconnectDelay = useRef(RECONNECT_DELAY_MS)
  const mounted = useRef(true)

  const setAircraft = useFlightStore(s => s.setAircraft)
  const setConnectionStatus = useFlightStore(s => s.setConnectionStatus)

  const connect = useCallback(() => {
    if (!mounted.current) return

    setConnectionStatus('connecting')

    try {
      const socket = new WebSocket(WS_URL)
      ws.current = socket

      socket.onopen = () => {
        if (!mounted.current) return
        setConnectionStatus('connected')
        reconnectDelay.current = RECONNECT_DELAY_MS
      }

      socket.onmessage = (event) => {
        if (!mounted.current) return
        try {
          const data = JSON.parse(event.data) as LiveStateResponse
          if (data.type === 'ping') return  // ignorar heartbeats
          if (data.states) {
            setAircraft(data.states)
          }
        } catch {
          // mensaje malformado — ignorar
        }
      }

      socket.onclose = () => {
        if (!mounted.current) return
        setConnectionStatus('disconnected')
        ws.current = null
        // Reconexión con backoff exponencial
        reconnectTimeout.current = setTimeout(() => {
          reconnectDelay.current = Math.min(
            reconnectDelay.current * 1.5,
            MAX_RECONNECT_DELAY_MS
          )
          connect()
        }, reconnectDelay.current)
      }

      socket.onerror = () => {
        setConnectionStatus('error')
        socket.close()
      }
    } catch {
      setConnectionStatus('error')
    }
  }, [setAircraft, setConnectionStatus])

  useEffect(() => {
    mounted.current = true
    connect()

    return () => {
      mounted.current = false
      clearTimeout(reconnectTimeout.current)
      if (ws.current) {
        ws.current.onclose = null  // evitar reconexión en desmontaje
        ws.current.close()
      }
    }
  }, [connect])

  const sendPing = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send('ping')
    }
  }, [])

  return { sendPing }
}
