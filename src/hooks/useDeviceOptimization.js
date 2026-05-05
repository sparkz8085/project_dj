import { useEffect, useState } from 'react'

export const PERFORMANCE_PRESETS = {
  ULTRA_LOW: {
    name: 'ultra-low',
    label: 'Ultra Low',
    lineWaves: {
      innerLineCount: 3,
      outerLineCount: 4,
      warpIntensity: 0.2,
      colorCycleSpeed: 0.2,
      brightness: 0.1,
      edgeFadeWidth: 20,
      enableMouseInteraction: false,
    },
    cardEffects: {
      backdropBlur: 8,
      borderOpacity: 0.08,
      shadowOpacity: 0.2,
      enableGlowEffect: false,
      reducedMotion: true,
    },
    general: {
      enablePointerTracking: false,
      animationDuration: 300,
      reduceImageQuality: true,
    },
  },
  LOW: {
    name: 'low',
    label: 'Low',
    lineWaves: {
      innerLineCount: 6,
      outerLineCount: 8,
      warpIntensity: 0.4,
      colorCycleSpeed: 0.35,
      brightness: 0.2,
      edgeFadeWidth: 30,
      enableMouseInteraction: false,
    },
    cardEffects: {
      backdropBlur: 12,
      borderOpacity: 0.12,
      shadowOpacity: 0.25,
      enableGlowEffect: true,
      reducedMotion: true,
    },
    general: {
      enablePointerTracking: false,
      animationDuration: 400,
      reduceImageQuality: true,
    },
  },
  MEDIUM: {
    name: 'medium',
    label: 'Medium',
    lineWaves: {
      innerLineCount: 10,
      outerLineCount: 14,
      warpIntensity: 0.6,
      colorCycleSpeed: 0.55,
      brightness: 0.35,
      edgeFadeWidth: 50,
      enableMouseInteraction: false,
    },
    cardEffects: {
      backdropBlur: 18,
      borderOpacity: 0.14,
      shadowOpacity: 0.27,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: false,
      animationDuration: 500,
      reduceImageQuality: false,
    },
  },
  HIGH: {
    name: 'high',
    label: 'High',
    lineWaves: {
      innerLineCount: 12,
      outerLineCount: 16,
      warpIntensity: 0.75,
      colorCycleSpeed: 0.6,
      brightness: 0.4,
      edgeFadeWidth: 60,
      enableMouseInteraction: true,
    },
    cardEffects: {
      backdropBlur: 24,
      borderOpacity: 0.14,
      shadowOpacity: 0.28,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: true,
      animationDuration: 600,
      reduceImageQuality: false,
    },
  },
  ULTRA: {
    name: 'ultra',
    label: 'Ultra',
    lineWaves: {
      innerLineCount: 14,
      outerLineCount: 18,
      warpIntensity: 0.9,
      colorCycleSpeed: 0.7,
      brightness: 0.45,
      edgeFadeWidth: 72,
      enableMouseInteraction: true,
    },
    cardEffects: {
      backdropBlur: 28,
      borderOpacity: 0.14,
      shadowOpacity: 0.28,
      enableGlowEffect: true,
      reducedMotion: false,
    },
    general: {
      enablePointerTracking: true,
      animationDuration: 600,
      reduceImageQuality: false,
    },
  },
}

function detectDeviceSpecs() {
  const specs = {
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    memory: null,
    cores: null,
    networkSpeed: null,
    gpuCapability: null,
  }

  // Detect device memory (Mobile Devices Info API)
  if (navigator.deviceMemory) {
    specs.memory = navigator.deviceMemory
  }

  // Detect CPU cores
  if (navigator.hardwareConcurrency) {
    specs.cores = navigator.hardwareConcurrency
  }

  // Detect network speed (Network Information API)
  if (navigator.connection) {
    const connection = navigator.connection
    specs.networkSpeed = connection.effectiveType // '4g', '3g', '2g', 'slow-2g'
    specs.saveData = connection.saveData || false
  }

  // Detect GPU capability via WebGL
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      specs.gpuCapability = 'supported'
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        specs.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        specs.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
  } catch (e) {
    specs.gpuCapability = 'not-supported'
  }

  // Detect if reduced motion is preferred
  specs.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  specs.prefersLowPowerMode = window.matchMedia('(prefers-color-scheme: dark)').matches

  return specs
}

function selectOptimalPreset(specs) {
  // Check for accessibility preferences first
  if (specs.prefersReducedMotion) {
    return PERFORMANCE_PRESETS.LOW
  }

  // Save data mode
  if (specs.saveData) {
    return PERFORMANCE_PRESETS.LOW
  }

  // Mobile optimization
  if (specs.isMobile) {
    // Budget device: low memory, slow network
    if ((specs.memory && specs.memory <= 2) || specs.networkSpeed === 'slow-2g' || specs.networkSpeed === '2g') {
      return PERFORMANCE_PRESETS.ULTRA_LOW
    }

    // Low-end mobile: 2-4GB memory or 3G
    if ((specs.memory && specs.memory <= 4) || specs.networkSpeed === '3g') {
      return PERFORMANCE_PRESETS.LOW
    }

    // Mid-range mobile: 4-8GB memory or good 4G
    if ((specs.memory && specs.memory <= 8) || specs.networkSpeed === '4g') {
      return PERFORMANCE_PRESETS.MEDIUM
    }

    // High-end mobile: 8GB+ memory
    return PERFORMANCE_PRESETS.HIGH
  }

  // Tablet optimization
  if (specs.isTablet) {
    // Low-end tablet
    if ((specs.memory && specs.memory <= 4) || specs.networkSpeed === '3g') {
      return PERFORMANCE_PRESETS.MEDIUM
    }

    // Mid-range to high-end tablet
    if (specs.memory && specs.memory <= 8) {
      return PERFORMANCE_PRESETS.HIGH
    }

    return PERFORMANCE_PRESETS.HIGH
  }

  // Desktop optimization
  if (specs.isDesktop) {
    // Older desktop or laptop with limited resources
    if ((specs.cores && specs.cores <= 2) || (specs.memory && specs.memory <= 4)) {
      return PERFORMANCE_PRESETS.HIGH
    }

    // Modern desktop/laptop
    return PERFORMANCE_PRESETS.ULTRA
  }

  // Default fallback
  return PERFORMANCE_PRESETS.MEDIUM
}

export function useDeviceOptimization() {
  const [preset, setPreset] = useState(null)
  const [specs, setSpecs] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initial detection
    const detectedSpecs = detectDeviceSpecs()
    const optimalPreset = selectOptimalPreset(detectedSpecs)

    setSpecs(detectedSpecs)
    setPreset(optimalPreset)
    setIsReady(true)

    // Listen for resize to update mobile detection
    const handleResize = () => {
      const updatedSpecs = detectDeviceSpecs()
      const updatedPreset = selectOptimalPreset(updatedSpecs)

      setSpecs(updatedSpecs)
      setPreset(updatedPreset)
    }

    // Listen for connection changes
    const handleConnectionChange = () => {
      const updatedSpecs = detectDeviceSpecs()
      const updatedPreset = selectOptimalPreset(updatedSpecs)

      setSpecs(updatedSpecs)
      setPreset(updatedPreset)
    }

    window.addEventListener('resize', handleResize)
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  // Manually override preset if needed
  const setCustomPreset = (presetName) => {
    const customPreset = Object.values(PERFORMANCE_PRESETS).find((p) => p.name === presetName)
    if (customPreset) {
      setPreset(customPreset)
    }
  }

  return {
    preset,
    specs,
    isReady,
    setCustomPreset,
  }
}
