import { PERFORMANCE_PRESETS } from '../hooks/useDeviceOptimization'
import './PerformanceMonitor.css'

export default function PerformanceMonitor({ preset, specs, isReady }) {
  if (!isReady || !preset || !specs) {
    return null
  }

  const getNetworkLabel = (networkSpeed) => {
    const labels = {
      '4g': '4G LTE',
      '3g': '3G',
      '2g': '2G',
      'slow-2g': 'Slow 2G',
    }
    return labels[networkSpeed] || networkSpeed || 'Unknown'
  }

  const getPresetColor = (presetName) => {
    const colors = {
      'ultra-low': '#ff6b6b',
      low: '#ffa94d',
      medium: '#74c0fc',
      high: '#51cf66',
      ultra: '#a78bfa',
    }
    return colors[presetName] || '#fff'
  }

  return (
    <div className="performance-monitor">
      <button className="monitor-toggle" title="Device Performance Info">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </button>

      <div className="monitor-content">
        <div className="monitor-header">
          <h3>Performance Optimization</h3>
          <span
            className="preset-badge"
            style={{ backgroundColor: getPresetColor(preset.name) }}
          >
            {preset.label}
          </span>
        </div>

        <div className="monitor-section">
          <h4>Device Info</h4>
          <ul>
            <li>
              <span>Type:</span> {specs.isDesktop ? 'Desktop' : specs.isTablet ? 'Tablet' : 'Mobile'}
            </li>
            <li>
              <span>Resolution:</span> {specs.screenWidth} × {specs.screenHeight}
            </li>
            <li>
              <span>Pixel Ratio:</span> {specs.pixelRatio}x
            </li>
          </ul>
        </div>

        {(specs.memory || specs.cores || specs.networkSpeed) && (
          <div className="monitor-section">
            <h4>System Resources</h4>
            <ul>
              {specs.memory && (
                <li>
                  <span>Memory:</span> {specs.memory}GB
                </li>
              )}
              {specs.cores && (
                <li>
                  <span>CPU Cores:</span> {specs.cores}
                </li>
              )}
              {specs.networkSpeed && (
                <li>
                  <span>Network:</span> {getNetworkLabel(specs.networkSpeed)}
                </li>
              )}
              {specs.saveData && (
                <li className="alert">
                  <span>Data Saver:</span> Enabled
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="monitor-section">
          <h4>Optimization Settings</h4>
          <ul>
            <li>
              <span>LineWaves Lines:</span> {preset.lineWaves.innerLineCount} / {preset.lineWaves.outerLineCount}
            </li>
            <li>
              <span>Backdrop Blur:</span> {Math.round(preset.cardEffects.backdropBlur)}px
            </li>
            <li>
              <span>Pointer Tracking:</span> {preset.general.enablePointerTracking ? '✓ On' : '✗ Off'}
            </li>
            <li>
              <span>Reduced Motion:</span> {preset.cardEffects.reducedMotion ? '✓ Yes' : '✗ No'}
            </li>
          </ul>
        </div>

        <div className="monitor-footer">
          <small>Auto-optimized for your device • May change on network/device changes</small>
        </div>
      </div>
    </div>
  )
}
