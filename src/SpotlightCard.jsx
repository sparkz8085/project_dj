import { useRef } from 'react'
import './SpotlightCard.css'

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  disabled = false,
}) => {
  const divRef = useRef(null)

  const handleMouseMove = (event) => {
    if (disabled || !divRef.current) {
      return
    }

    const rect = divRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
    divRef.current.style.setProperty('--spotlight-color', spotlightColor)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={disabled ? undefined : handleMouseMove}
      className={`card-spotlight ${disabled ? 'spotlight-disabled' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}

export default SpotlightCard
