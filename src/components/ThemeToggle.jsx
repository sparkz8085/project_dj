import { useEffect, useRef, useState } from 'react'
import './ThemeToggle.css'

const DOTS = Array.from({ length: 13 * 13 }, (_, index) => {
  const x = index % 13
  const y = Math.floor(index / 13)
  const dx = x - 6
  const dy = y - 6
  const sun = dx * dx + dy * dy <= 29
  const moon = dx * dx + dy * dy <= 29 && (dx - 3) * (dx - 3) + dy * dy > 25
  return { x, y, sun, moon }
})

export default function ThemeToggle({ theme, onToggle }) {
  const startX = useRef(null)
  const dragged = useRef(false)
  const [activityKey, setActivityKey] = useState(0)
  const [isIdle, setIsIdle] = useState(false)
  const isLight = theme === 'light'

  useEffect(() => {
    setIsIdle(false)
    const timeoutId = window.setTimeout(() => setIsIdle(true), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [activityKey])

  const wakeToggle = () => {
    setIsIdle(false)
    setActivityKey((current) => current + 1)
  }

  const handlePointerDown = (event) => {
    wakeToggle()
    startX.current = event.clientX
    dragged.current = false
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const handlePointerUp = (event) => {
    wakeToggle()
    if (startX.current !== null && Math.abs(event.clientX - startX.current) > 8) {
      dragged.current = true
      const nextLight = event.clientX > startX.current
      if (nextLight !== isLight) onToggle()
    }
    startX.current = null
  }
  const handleClick = () => {
    wakeToggle()
    if (dragged.current) { dragged.current = false; return }
    onToggle()
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${isLight ? 'is-light' : 'is-dark'} ${isIdle ? 'is-idle' : ''}`} 
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      onPointerDown={handlePointerDown}
      onMouseEnter={wakeToggle}
      onFocus={wakeToggle}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { startX.current = null }}
      onClick={handleClick}
    >
      <span className="theme-toggle-track" />
      <span className="theme-toggle-glow" />
      <span className="theme-toggle-thumb">
        <svg className="theme-toggle-matrix" viewBox="0 0 13 13" aria-hidden="true">
          {DOTS.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x + 0.5}
              cy={dot.y + 0.5}
              r={isLight ? (dot.moon ? 0.34 : 0) : (dot.sun ? 0.34 : 0)}
              className="theme-toggle-dot"
            />
          ))}
        </svg>
      </span>
      <span className="theme-toggle-label">{isLight ? 'LIGHT' : 'DARK'}</span>
    </button>
  )
}
