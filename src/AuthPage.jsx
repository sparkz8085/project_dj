import { useMemo, useRef, useState, useEffect } from 'react'
import LineWaves from './LineWaves'
import PerformanceMonitor from './components/PerformanceMonitor'
import './AuthPage.css'

const defaultSignupForm = {
  name: '',
  email: '',
  password: '',
}

const defaultLoginForm = {
  email: '',
  password: '',
}

const defaultForgotPasswordForm = {
  email: '',
}

function AuthPage({ onLogin, onSignup, optimization }) {
  const [mode, setMode] = useState('login')
  const [signupForm, setSignupForm] = useState(defaultSignupForm)
  const [loginForm, setLoginForm] = useState(defaultLoginForm)
  const [forgotPasswordForm, setForgotPasswordForm] = useState(defaultForgotPasswordForm)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const cardRef = useRef(null)
  const shakeStartTimerRef = useRef(null)
  const shakeEndTimerRef = useRef(null)
  
  const { preset, specs, isReady } = optimization
  
  // Derived values from preset
  const isMobile = specs?.isMobile ?? window.innerWidth < 768
  const enablePointerTracking = preset?.general?.enablePointerTracking ?? false
  const animationDuration = preset?.general?.animationDuration ?? 600

  const title = useMemo(() => {
    if (mode === 'login') return 'Welcome back'
    if (mode === 'forgot') return 'Reset your password'
    return 'Create your StageKart account'
  }, [mode])

  const showInvalidState = (message) => {
    setError(message)
    setShaking(false)

    window.clearTimeout(shakeStartTimerRef.current)
    window.clearTimeout(shakeEndTimerRef.current)

    shakeStartTimerRef.current = window.setTimeout(() => setShaking(true), 0)
    shakeEndTimerRef.current = window.setTimeout(() => setShaking(false), animationDuration)
  }

  const clearInvalidState = () => {
    setError('')
    setShaking(false)
    window.clearTimeout(shakeStartTimerRef.current)
    window.clearTimeout(shakeEndTimerRef.current)
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(shakeStartTimerRef.current)
      window.clearTimeout(shakeEndTimerRef.current)
    }
  }, [])

  const handleSignupSubmit = (event) => {
    event.preventDefault()
    setError('')

    const name = signupForm.name.trim()
    const email = signupForm.email.trim().toLowerCase()
    const password = signupForm.password.trim()

    // Validation checks
    if (!name) {
      showInvalidState('Please enter your full name.')
      return
    }
    
    if (name.length < 2) {
      showInvalidState('Name must be at least 2 characters long.')
      return
    }

    if (!email) {
      showInvalidState('Please enter your email address.')
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showInvalidState('Please enter a valid email address.')
      return
    }

    if (!password) {
      showInvalidState('Please create a password.')
      return
    }

    if (password.length < 6) {
      showInvalidState('Password must be at least 6 characters long.')
      return
    }

    const result = onSignup({ name, email, password })

    if (!result?.ok) {
      showInvalidState(result?.message || 'Unable to create account.')
    }
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setError('')

    const email = loginForm.email.trim().toLowerCase()
    const password = loginForm.password.trim()

    // Validation checks
    if (!email) {
      showInvalidState('Please enter your email address.')
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showInvalidState('Please enter a valid email address.')
      return
    }

    if (!password) {
      showInvalidState('Please enter your password.')
      return
    }

    if (password.length < 6) {
      showInvalidState('Password must be at least 6 characters long.')
      return
    }

    const result = onLogin({ email, password })

    if (!result?.ok) {
      showInvalidState(result?.message || 'Invalid credentials.')
    }
  }

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault()
    setError('')

    const email = forgotPasswordForm.email.trim().toLowerCase()

    // Validation checks
    if (!email) {
      showInvalidState('Please enter your email address.')
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showInvalidState('Please enter a valid email address.')
      return
    }

    setError('')
    alert(`Password reset link sent to ${email}`)
    setForgotPasswordForm({ email: '' })
    setMode('login')
  }

  const handleGmailLogin = () => {
    alert('Gmail login functionality would be implemented with OAuth')
  }

  const updateCardGlow = (event) => {
    if (isMobile) return // Disable on mobile for performance
    
    const card = cardRef.current
    if (!card) return

    const bounds = card.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    card.style.setProperty('--glow-x', `${Math.max(0, Math.min(100, x))}%`)
    card.style.setProperty('--glow-y', `${Math.max(0, Math.min(100, y))}%`)
    card.style.setProperty('--glow-tilt-x', `${(x - 50) / 12}deg`)
    card.style.setProperty('--glow-tilt-y', `${(50 - y) / 12}deg`)
  }

  const resetCardGlow = () => {
    if (isMobile) return // Disable on mobile for performance
    
    const card = cardRef.current
    if (!card) return

    card.style.setProperty('--glow-x', '50%')
    card.style.setProperty('--glow-y', '30%')
    card.style.setProperty('--glow-tilt-x', '0deg')
    card.style.setProperty('--glow-tilt-y', '0deg')
  }

  return (
    <main className="auth-shell">
      <div className="auth-background" aria-hidden="true">
        {isReady && preset ? (
          <LineWaves
            speed={0.22}
            innerLineCount={preset.lineWaves.innerLineCount}
            outerLineCount={preset.lineWaves.outerLineCount}
            warpIntensity={preset.lineWaves.warpIntensity}
            rotation={-32}
            edgeFadeWidth={preset.lineWaves.edgeFadeWidth}
            colorCycleSpeed={preset.lineWaves.colorCycleSpeed}
            brightness={preset.lineWaves.brightness}
            color1="#7dd3fc"
            color2="#ffffff"
            color3="#fde047"
            enableMouseInteraction={preset.lineWaves.enableMouseInteraction}
            mouseInfluence={1.4}
            lineSegmentCount={preset.lineWaves.lineSegmentCount}
            maxFps={preset.lineWaves.maxFps}
            reducedMotion={preset.lineWaves.reducedMotion}
          />
        ) : (
          <LineWaves
            speed={0.22}
            innerLineCount={8}
            outerLineCount={12}
            warpIntensity={0.5}
            rotation={-32}
            edgeFadeWidth={40}
            colorCycleSpeed={0.4}
            brightness={0.3}
            color1="#7dd3fc"
            color2="#ffffff"
            color3="#fde047"
            enableMouseInteraction={false}
            mouseInfluence={1.4}
            lineSegmentCount={8}
            maxFps={24}
            reducedMotion={false}
          />
        )}
      </div>
      <section
        ref={cardRef}
        className={`auth-card ${shaking ? 'shake' : ''} ${error ? 'error' : ''}`}
        style={
          preset && isReady
            ? {
                '--backdrop-blur': `${preset.cardEffects.backdropBlur}px`,
                '--border-opacity': preset.cardEffects.borderOpacity,
                '--shadow-opacity': preset.cardEffects.shadowOpacity,
              }
            : {}
        }
        onPointerMove={enablePointerTracking ? updateCardGlow : undefined}
        onPointerLeave={enablePointerTracking ? resetCardGlow : undefined}
      >
        <div className="auth-hero">
          <p className="eyebrow">StageKart access</p>
          <h1>{title}</h1>
          <p>
            Sign in or create an account to unlock the StageKart shopping experience and checkout
            flow.
          </p>
          <p>(Your data is encrypted & safe)</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login')
              clearInvalidState()
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => {
              setMode('signup')
              clearInvalidState()
            }}
          >
            Signup
          </button>
          <button
            type="button"
            className={mode === 'forgot' ? 'active' : ''}
            onClick={() => {
              setMode('forgot')
              clearInvalidState()
            }}
          >
            Forgot Password
          </button>
        </div>

        {error ? <p className="auth-error">{error}</p> : null}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Password</span>
              <div className="password-input-wrapper">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <button type="submit" className="auth-button">
              Login
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button type="button" className="gmail-button" onClick={handleGmailLogin}>
              <svg className="gmail-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.283 10.356h-8.327v3.057h4.983c-.23 1.27-.910 2.330-1.937 3.023v2.468h3.14c1.837-1.686 2.897-4.156 2.897-7.045 0-.559-.037-1.099-.112-1.623z"/>
                <path d="M11.956 14.534c-.316 0-.635-.035-.954-.104v2.332h-.468V9.99c.281-.035.653-.05.954-.05 2.206 0 3.862 1.594 3.862 3.738 0 2.159-1.656 3.856-3.862 3.856zm-.954-6.845v3.467c.317.053.625.073.954.073 1.65 0 2.859-1.198 2.859-2.771 0-1.573-1.209-2.769-2.859-2.769z"/>
                <path d="M6.956 12.855c-.329 0-.635-.035-.911-.104v2.332h-.468V9.99c.276-.035.645-.05.911-.05 2.206 0 3.862 1.594 3.862 3.738 0 2.159-1.656 3.856-3.862 3.856zm-.911-6.845v3.467c.317.053.625.073.911.073 1.65 0 2.859-1.198 2.859-2.771 0-1.573-1.209-2.769-2.859-2.769z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Sign in with Email
            </button>
          </form>
        ) : mode === 'forgot' ? (
          <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
            <p className="forgot-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={forgotPasswordForm.email}
                onChange={(event) => setForgotPasswordForm({ email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>

            <button type="submit" className="auth-button">
              Send Reset Link
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <label>
              <span>Full name</span>
              <input
                type="text"
                value={signupForm.name}
                onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
                placeholder="Your name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={signupForm.email}
                onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Password</span>
              <div className="password-input-wrapper">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <button type="submit" className="auth-button">
              Create account
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button type="button" className="gmail-button" onClick={handleGmailLogin}>
              <svg className="gmail-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.283 10.356h-8.327v3.057h4.983c-.23 1.27-.910 2.330-1.937 3.023v2.468h3.14c1.837-1.686 2.897-4.156 2.897-7.045 0-.559-.037-1.099-.112-1.623z"/>
                <path d="M11.956 14.534c-.316 0-.635-.035-.954-.104v2.332h-.468V9.99c.281-.035.653-.05.954-.05 2.206 0 3.862 1.594 3.862 3.738 0 2.159-1.656 3.856-3.862 3.856zm-.954-6.845v3.467c.317.053.625.073.954.073 1.65 0 2.859-1.198 2.859-2.771 0-1.573-1.209-2.769-2.859-2.769z"/>
                <path d="M6.956 12.855c-.329 0-.635-.035-.911-.104v2.332h-.468V9.99c.276-.035.645-.05.911-.05 2.206 0 3.862 1.594 3.862 3.738 0 2.159-1.656 3.856-3.862 3.856zm-.911-6.845v3.467c.317.053.625.073.911.073 1.65 0 2.859-1.198 2.859-2.771 0-1.573-1.209-2.769-2.859-2.769z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Sign up with Gmail
            </button>
          </form>
        )}
      </section>

      <PerformanceMonitor preset={preset} specs={specs} isReady={isReady} />
    </main>
  )
}

export default AuthPage
