import { useRef, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, GripHorizontal } from 'lucide-react'
import { PanelId } from '../../types'
import { usePanelStore } from '../../stores/panelStore'
import clsx from 'clsx'

interface Props {
  id: PanelId
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  minWidth?: number
}

export default function DraggablePanel({
  id, title, icon, children, className, minWidth = 280
}: Props) {
  const { panels, togglePanel, movePanel, minimizePanel } = usePanelStore()
  const panel = panels[id]
  const dragStart = useRef<{ mouseX: number; mouseY: number; panelX: number; panelY: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panelX: panel.position.x,
      panelY: panel.position.y,
    }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragStart.current) return
      const dx = ev.clientX - dragStart.current.mouseX
      const dy = ev.clientY - dragStart.current.mouseY
      const newX = Math.max(0, dragStart.current.panelX + dx)
      const newY = Math.max(0, dragStart.current.panelY + dy)
      movePanel(id, { x: newX, y: newY })
    }

    const onMouseUp = () => {
      dragStart.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [id, panel.position, movePanel])

  if (!panel.open) return null

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={clsx('panel', className)}
        style={{
          left: panel.position.x,
          top: panel.position.y,
          minWidth,
        }}
      >
        {/* Header arrastrable */}
        <div className="panel-header" onMouseDown={onMouseDown}>
          <div className="flex items-center gap-2">
            {icon && <span className="text-[var(--accent)]">{icon}</span>}
            <span className="text-sm font-medium text-[var(--text)] mono uppercase tracking-wider">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <GripHorizontal size={14} className="text-[var(--text-dim)] mr-1" />
            <button
              className="icon-btn"
              onClick={() => minimizePanel(id)}
              title={panel.minimized ? 'Expandir' : 'Minimizar'}
            >
              <Minus size={14} />
            </button>
            <button
              className="icon-btn"
              onClick={() => togglePanel(id)}
              title="Cerrar"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Contenido colapsable */}
        <AnimatePresence>
          {!panel.minimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
