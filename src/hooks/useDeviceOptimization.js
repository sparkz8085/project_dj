import { useEffect, useRef, useState } from 'react'

export const PERFORMANCE_PRESETS = {
  ULTRA_LOW: {
    name: 'ultra-low',
    label: 'Ultra Low',
    lineWaves: {
      innerLineCount: 2,
      outerLineCount: 3,
      lineSegmentCount: 6,
      maxFps: 12,
      warpIntensity: 0.14,
      colorCycleSpeed: 0.12,
      brightness: 0.08,
      edgeFadeWidth: 12,
      enableMouseInteraction: false,
      reducedMotion: true,
    },
    cardEffects: {
      backdropBlur: 0,
      borderOpacity: 0.08,
      shadowOpacity: 0.14,
      enableGlowEffect: false,
      reducedMotion: true,
    },
    general: {
      enablePointerTracking: false,
      enableSpotlightCards: false,
      animationDuration: 220,
      reduceImageQuality: true,
    },
  },
  LOW: {
    name: 'low',
    label: 'Low',
    lineWaves: {
      innerLineCount: 4,
      outerLineCount: 6,
      lineSegmentCount: 8,
      maxFps: 20,
      warpIntensity: 0.28,
      colorCycleSpeed: 0.24,
      brightness: 0.16,
      edgeFadeWidth: 24,
      enableMouseInteraction: false,
      reducedMotion: false,
    },
    cardEffects: {
      backdropBlur: 8,
      borderOpacity: 0.1,
      shadowOpacity: 0.18,
      enableGlowEffect: false,
      reducedMotion: true,
    },
    general: {
      enablePointerTracking: false,
      enableSpotlightCards: false,
      animationDuration: 320,
      reduceImageQuality: true,
    },
  },
  MEDIUM: {
    name: 'medium',
    label: 'Medium',
    lineWaves: {
      innerLineCount: 8,
      outerLineCount: 10,
      lineSegmentCount: 10,
      maxFps: 30,
      warpIntensity: 0.48,
      colorCycleSpeed: 0.38,
      brightness: 0.28,
      edgeFadeWidth: 42,
      enableMouseInteraction: false,
      reducedMotion: false,
    },
    cardEffects: {
      backdropBlur: 14,
      borderOpacity: 0.12,
      shadowOpacity: 0.22,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: false,
      enableSpotlightCards: false,
      animationDuration: 450,
      reduceImageQuality: false,
    },
  },
  HIGH: {
    name: 'high',
    label: 'High',
    lineWaves: {
      innerLineCount: 10,
      outerLineCount: 14,
      lineSegmentCount: 12,
      maxFps: 45,
      warpIntensity: 0.64,
      colorCycleSpeed: 0.5,
      brightness: 0.36,
      edgeFadeWidth: 56,
      enableMouseInteraction: true,
      reducedMotion: false,
    },
    cardEffects: {
      backdropBlur: 20,
      borderOpacity: 0.14,
      shadowOpacity: 0.26,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: true,
      enableSpotlightCards: true,
      animationDuration: 560,
      reduceImageQuality: false,
    },
  },
  ULTRA: {
    name: 'ultra',
    label: 'Ultra',
    lineWaves: {
      innerLineCount: 12,
      outerLineCount: 16,
      lineSegmentCount: 14,
      maxFps: 60,
      warpIntensity: 0.78,
      colorCycleSpeed: 0.62,
      brightness: 0.42,
      edgeFadeWidth: 70,
      enableMouseInteraction: true,
      reducedMotion: false,
    },
    cardEffects: {
      backdropBlur: 26,
      borderOpacity: 0.14,
      shadowOpacity: 0.28,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: true,
      enableSpotlightCards: true,
      animationDuration: 600,
      reduceImageQuality: false,
    },
  },
}

const PRESET_ORDER = [
  PERFORMANCE_PRESETS.ULTRA_LOW,
  PERFORMANCE_PRESETS.LOW,
  PERFORMANCE_PRESETS.MEDIUM,
  PERFORMANCE_PRESETS.HIGH,
  PERFORMANCE_PRESETS.ULTRA,
]

const getPresetByName = (presetName) =>
  PRESET_ORDER.find((preset) => preset.name === presetName) || PERFORMANCE_PRESETS.MEDIUM

const canUseDom = () => typeof window !== 'undefined' && typeof navigator !== 'undefined'

function detectGpuCapability() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) {
      return { gpuCapability: 'not-supported' }
    }

    const details = { gpuCapability: 'supported' }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

    if (debugInfo) {
      details.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      details.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }

    return details
  } catch {
    return { gpuCapability: 'not-supported' }
  }
}

function detectDeviceSpecs(extraSpecs = {}) {
  if (!canUseDom()) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenWidth: 1280,
      screenHeight: 720,
      pixelRatio: 1,
      memory: null,
      cores: null,
      networkSpeed: null,
      saveData: false,
      prefersReducedMotion: false,
      prefersReducedData: false,
      gpuCapability: 'unknown',
      ...extraSpecs,
    }
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const pixelRatio = window.devicePixelRatio || 1
  const pointerIsCoarse = window.matchMedia('(pointer: coarse)').matches
  const hoverIsAvailable = window.matchMedia('(hover: hover)').matches

  return {
    isMobile: screenWidth < 768 || pointerIsCoarse,
    isTablet: screenWidth >= 768 && screenWidth < 1100 && pointerIsCoarse,
    isDesktop: screenWidth >= 1024 && !pointerIsCoarse,
    screenWidth,
    screenHeight,
    pixelRatio,
    viewportPixels: Math.round(screenWidth * screenHeight * pixelRatio * pixelRatio),
    memory: navigator.deviceMemory || null,
    cores: navigator.hardwareConcurrency || null,
    networkSpeed: connection?.effectiveType || null,
    downlink: connection?.downlink || null,
    saveData: Boolean(connection?.saveData),
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
    pointerIsCoarse,
    hoverIsAvailable,
    ...detectGpuCapability(),
    ...extraSpecs,
  }
}

function scoreDevice(specs) {
  let score = 55
  const reasons = []

  if (specs.memory) {
    if (specs.memory <= 2) {
      score -= 28
      reasons.push('low memory')
    } else if (specs.memory <= 4) {
      score -= 14
      reasons.push('limited memory')
    } else if (specs.memory >= 8) {
      score += 10
      reasons.push('ample memory')
    }
  }

  if (specs.cores) {
    if (specs.cores <= 2) {
      score -= 22
      reasons.push('few CPU cores')
    } else if (specs.cores <= 4) {
      score -= 8
    } else if (specs.cores >= 8) {
      score += 10
      reasons.push('many CPU cores')
    }
  }

  if (specs.isMobile) {
    score -= 12
    reasons.push('mobile layout')
  } else if (specs.isDesktop) {
    score += 8
  }

  if (specs.viewportPixels > 6_000_000) {
    score -= 10
    reasons.push('high pixel workload')
  }

  if (specs.pixelRatio >= 3) {
    score -= 8
  }

  if (specs.networkSpeed === 'slow-2g' || specs.networkSpeed === '2g') {
    score -= 24
    reasons.push('slow network')
  } else if (specs.networkSpeed === '3g') {
    score -= 12
    reasons.push('moderate network')
  } else if (specs.networkSpeed === '4g') {
    score += 4
  }

  if (specs.saveData || specs.prefersReducedData) {
    score -= 24
    reasons.push('data saver')
  }

  if (specs.prefersReducedMotion) {
    score = Math.min(score, 32)
    reasons.push('reduced motion')
  }

  if (specs.batteryLevel !== null && specs.batteryLevel <= 0.2 && !specs.batteryCharging) {
    score -= 20
    reasons.push('low battery')
  }

  if (specs.gpuCapability === 'not-supported') {
    score -= 10
    reasons.push('limited graphics')
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
  }
}

function selectOptimalPreset(specs) {
  const { score, reasons } = scoreDevice(specs)

  let preset = PERFORMANCE_PRESETS.MEDIUM

  if (score <= 22) {
    preset = PERFORMANCE_PRESETS.ULTRA_LOW
  } else if (score <= 42) {
    preset = PERFORMANCE_PRESETS.LOW
  } else if (score <= 64) {
    preset = PERFORMANCE_PRESETS.MEDIUM
  } else if (score <= 82) {
    preset = PERFORMANCE_PRESETS.HIGH
  } else {
    preset = PERFORMANCE_PRESETS.ULTRA
  }

  return {
    ...preset,
    score,
    reasons,
  }
}

function createSnapshot(extraSpecs) {
  const specs = detectDeviceSpecs(extraSpecs)
  return {
    specs,
    preset: selectOptimalPreset(specs),
    isReady: true,
  }
}

export function useDeviceOptimization() {
  const manualPresetRef = useRef(null)
  const batteryRef = useRef(null)
  const [snapshot, setSnapshot] = useState(() => createSnapshot())

  useEffect(() => {
    let resizeTimer = 0
    let disposed = false
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reducedDataQuery = window.matchMedia('(prefers-reduced-data: reduce)')

    const updateSnapshot = (extraSpecs) => {
      if (manualPresetRef.current) {
        setSnapshot({
          ...createSnapshot(extraSpecs),
          preset: getPresetByName(manualPresetRef.current),
        })
        return
      }

      setSnapshot(createSnapshot(extraSpecs))
    }

    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => updateSnapshot(), 160)
    }

    const handleBatteryChange = () => {
      const battery = batteryRef.current

      if (!battery) {
        return
      }

      updateSnapshot({
        batteryCharging: battery.charging,
        batteryLevel: battery.level,
      })
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    const handleEnvironmentChange = () => updateSnapshot()

    window.addEventListener('visibilitychange', handleEnvironmentChange)
    connection?.addEventListener('change', handleEnvironmentChange)
    reducedMotionQuery.addEventListener('change', handleEnvironmentChange)
    reducedDataQuery.addEventListener('change', handleEnvironmentChange)

    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        if (disposed) {
          return
        }

        batteryRef.current = battery
        battery.addEventListener('chargingchange', handleBatteryChange)
        battery.addEventListener('levelchange', handleBatteryChange)
        handleBatteryChange()
      })
    }

    return () => {
      disposed = true
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.removeEventListener('visibilitychange', handleEnvironmentChange)
      connection?.removeEventListener('change', handleEnvironmentChange)
      reducedMotionQuery.removeEventListener('change', handleEnvironmentChange)
      reducedDataQuery.removeEventListener('change', handleEnvironmentChange)

      if (batteryRef.current) {
        batteryRef.current.removeEventListener('chargingchange', handleBatteryChange)
        batteryRef.current.removeEventListener('levelchange', handleBatteryChange)
      }
    }
  }, [])

  const setCustomPreset = (presetName) => {
    const customPreset = getPresetByName(presetName)
    manualPresetRef.current = customPreset.name
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      preset: {
        ...customPreset,
        score: currentSnapshot.preset?.score ?? 0,
        reasons: ['manual override'],
      },
    }))
  }

  const clearCustomPreset = () => {
    manualPresetRef.current = null
    setSnapshot(createSnapshot())
  }

  return {
    ...snapshot,
    setCustomPreset,
    clearCustomPreset,
  }
}
