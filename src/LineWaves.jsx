import { useEffect, useMemo, useState } from 'react'

function hexToRgba(hexColor, alpha) {
  const value = hexColor.trim()

  if (!value.startsWith('#')) {
    return value
  }

  const normalized = value.slice(1)
  const expanded = normalized.length === 3 ? normalized.split('').map((character) => character + character).join('') : normalized
  const red = Number.parseInt(expanded.slice(0, 2), 16)
  const green = Number.parseInt(expanded.slice(2, 4), 16)
  const blue = Number.parseInt(expanded.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function createPath({ lineIndex, totalLines, width, height, phase, warpIntensity, mouseX, mouseY, mouseInfluence, enableMouseInteraction }) {
  const centerY = height / 2
  const spread = height * 0.48
  const normalizedIndex = totalLines <= 1 ? 0.5 : lineIndex / (totalLines - 1)
  const lineCenter = centerY - spread + normalizedIndex * spread * 2
  const amplitude = (1 - Math.abs(normalizedIndex - 0.5) * 1.7) * 36 * warpIntensity
  const segments = 16
  const points = []

  for (let segment = 0; segment <= segments; segment += 1) {
    const x = (segment / segments) * width
    const normalizedX = x / width
    const primaryWave = Math.sin(normalizedX * Math.PI * 3.4 + phase + lineIndex * 0.18)
    const secondaryWave = Math.cos(normalizedX * Math.PI * 1.6 + phase * 0.62 + normalizedIndex * 4.1)
    const baseY = lineCenter + primaryWave * amplitude + secondaryWave * amplitude * 0.24
    const distanceToPointer = enableMouseInteraction ? Math.abs(baseY - mouseY) / height : 1
    const mouseFalloff = enableMouseInteraction ? Math.max(0, 1 - distanceToPointer * 2.5) : 0
    const mouseOffset = enableMouseInteraction ? ((mouseX - width / 2) / width) * 48 * mouseInfluence * mouseFalloff : 0

    points.push([x, baseY + mouseOffset])
  }

  return pointsToPath(points)
}

function pointsToPath(points) {
  if (points.length === 0) {
    return ''
  }

  const [startX, startY] = points[0]
  let path = `M ${startX.toFixed(2)} ${startY.toFixed(2)}`

  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index]
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }

  return path
}

export default function LineWaves({
  speed = 0.3,
  innerLineCount = 32,
  outerLineCount = 36,
  warpIntensity = 1,
  rotation = -45,
  edgeFadeWidth = 0,
  colorCycleSpeed = 1,
  brightness = 0.2,
  color1 = '#ffffff',
  color2 = '#ffffff',
  color3 = '#ffffff',
  enableMouseInteraction = false,
  mouseInfluence = 2,
}) {
  const [phase, setPhase] = useState(0)
  const [pointer, setPointer] = useState({ x: 500, y: 500 })

  useEffect(() => {
    let frameId = 0
    const startTime = performance.now()

    const animate = (time) => {
      const elapsed = (time - startTime) / 1000
      setPhase(elapsed * (1.6 + speed * 2.2))
      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frameId)
  }, [speed])

  const lines = useMemo(() => {
    const width = 1000
    const height = 1000
    const palette = [color1, color2, color3]

    return Array.from({ length: outerLineCount }, (_, lineIndex) => {
      const color = hexToRgba(palette[lineIndex % palette.length], Math.min(0.7, 0.16 + brightness * 0.26))
      const innerBoost = lineIndex < innerLineCount ? 0.1 : 0

      return {
        id: `line-${lineIndex}`,
        opacity: 0.38 + (lineIndex / Math.max(1, outerLineCount - 1)) * 0.34,
        d: createPath({
          lineIndex,
          totalLines: outerLineCount,
          width,
          height,
          phase: phase * (0.9 + colorCycleSpeed * 0.22) + lineIndex * 0.08,
          warpIntensity: warpIntensity + innerBoost,
          mouseX: pointer.x,
          mouseY: pointer.y,
          mouseInfluence,
          enableMouseInteraction,
        }),
        stroke: color,
      }
    })
  }, [
    brightness,
    color1,
    color2,
    color3,
    colorCycleSpeed,
    enableMouseInteraction,
    innerLineCount,
    mouseInfluence,
    outerLineCount,
    phase,
    pointer.x,
    pointer.y,
    warpIntensity,
  ])

  const fadeSize = Math.max(0, edgeFadeWidth)

  return (
    <div
      className="line-waves"
      aria-hidden="true"
      style={{
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        filter: `brightness(${0.98 + brightness * 0.48}) saturate(1.02) contrast(1)`,
      }}
      onPointerMove={(event) => {
        if (!enableMouseInteraction) {
          return
        }

        const bounds = event.currentTarget.getBoundingClientRect()
        setPointer({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        })
      }}
      onPointerLeave={() => {
        if (enableMouseInteraction) {
          setPointer({ x: 500, y: 500 })
        }
      }}
    >
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id="line-waves-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="10%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="90%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="line-waves-glow" x="-16%" y="-16%" width="132%" height="132%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="line-waves-mask">
            <rect width="1000" height="1000" fill="url(#line-waves-fade)" />
            {fadeSize > 0 ? (
              <rect
                x={fadeSize}
                y={fadeSize}
                width={1000 - fadeSize * 2}
                height={1000 - fadeSize * 2}
                fill="white"
              />
            ) : null}
          </mask>
        </defs>

        <g mask="url(#line-waves-mask)" filter="url(#line-waves-glow)">
          {lines.map((line) => (
            <path
              key={line.id}
              d={line.d}
              fill="none"
              stroke={line.stroke}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={Math.min(line.opacity, 0.42)}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}