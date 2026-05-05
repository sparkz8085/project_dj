import { useMemo, useRef, useState, useEffect } from 'react'
import LineWaves from './LineWaves'
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

function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login')
  const [signupForm, setSignupForm] = useState(defaultSignupForm)
  const [loginForm, setLoginForm] = useState(defaultLoginForm)
  const [forgotPasswordForm, setForgotPasswordForm] = useState(defaultForgotPasswordForm)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const cardRef = useRef(null)

  // Detect mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const title = useMemo(() => {
    if (mode === 'login') return 'Welcome back'
    if (mode === 'forgot') return 'Reset your password'
    return 'Create your StageKart account'
  }, [mode])

  // Trigger shake animation when error occurs
  useEffect(() => {
    if (error) {
      setShaking(true)
      const timer = setTimeout(() => setShaking(false), 600)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSignupSubmit = (event) => {
    event.preventDefault()
    setError('')

    const name = signupForm.name.trim()
    const email = signupForm.email.trim().toLowerCase()
    const password = signupForm.password.trim()

    if (!name || !email || !password) {
      setError('Please fill in all signup fields.')
      return
    }

    onSignup({ name, email, password })
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setError('')

    const email = loginForm.email.trim().toLowerCase()
    const password = loginForm.password.trim()

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    const result = onLogin({ email, password })

    if (!result?.ok) {
      setError(result?.message || 'Invalid credentials.')
    }
  }

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault()
    setError('')

    const email = forgotPasswordForm.email.trim().toLowerCase()

    if (!email) {
      setError('Please enter your email address.')
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
        <LineWaves
          speed={0.22}
          innerLineCount={14}
          outerLineCount={18}
          warpIntensity={0.9}
          rotation={-32}
          edgeFadeWidth={72}
          colorCycleSpeed={0.7}
          brightness={0.45}
          color1="#7dd3fc"
          color2="#ffffff"
          color3="#fde047"
          enableMouseInteraction
          mouseInfluence={1.4}
        />
      </div>
      <section
        ref={cardRef}
        className={`auth-card ${shaking ? 'shake' : ''} ${error ? 'error' : ''}`}
        onPointerMove={updateCardGlow}
        onPointerLeave={resetCardGlow}
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
              setError('')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => {
              setMode('signup')
              setError('')
            }}
          >
            Signup
          </button>
          <button
            type="button"
            className={mode === 'forgot' ? 'active' : ''}
            onClick={() => {
              setMode('forgot')
              setError('')
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
    </main>
  )
}

export default AuthPage