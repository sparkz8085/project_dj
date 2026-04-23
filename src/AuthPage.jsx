import { useMemo, useRef, useState } from 'react'
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

function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login')
  const [signupForm, setSignupForm] = useState(defaultSignupForm)
  const [loginForm, setLoginForm] = useState(defaultLoginForm)
  const [error, setError] = useState('')
  const cardRef = useRef(null)

  const title = useMemo(() => {
    return mode === 'login' ? 'Welcome back' : 'Create your StageKart account'
  }, [mode])

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

  const updateCardGlow = (event) => {
    const card = cardRef.current

    if (!card) {
      return
    }

    const bounds = card.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    card.style.setProperty('--glow-x', `${Math.max(0, Math.min(100, x))}%`)
    card.style.setProperty('--glow-y', `${Math.max(0, Math.min(100, y))}%`)
    card.style.setProperty('--glow-tilt-x', `${(x - 50) / 12}deg`)
    card.style.setProperty('--glow-tilt-y', `${(50 - y) / 12}deg`)
  }

  const resetCardGlow = () => {
    const card = cardRef.current

    if (!card) {
      return
    }

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
        className="auth-card"
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
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="Enter your password"
              />
            </label>

            <button type="submit" className="auth-button">
              Login
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
              <input
                type="password"
                value={signupForm.password}
                onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                placeholder="Create a password"
              />
            </label>

            <button type="submit" className="auth-button">
              Create account
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default AuthPage