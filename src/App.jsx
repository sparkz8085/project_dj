import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AuthPage from './AuthPage'
import ComboPage from './ComboPage'
import SpotlightCard from './SpotlightCard'
import CheckoutPage from './CheckoutPage'
import PaymentPage from './PaymentPage'

const USERS_STORAGE_KEY = 'stagekart-users'
const SESSION_STORAGE_KEY = 'stagekart-session'

const products = [
  {
    id: 'smoke-fog-machine',
    name: 'Smoke / Fog Machine',
    tag: 'Stage atmosphere',
    price: 8999,
    discount: 12,
    note: 'High-output haze for entrances, reveals, and dance-floor moments.',
    image: buildProductArtwork({
      title: 'Fog',
      subtitle: 'Atmosphere',
      gradient: ['#101a34', '#3b82f6'],
      glow: '#a5f3fc',
    }),
  },
  {
    id: 'led-bars-strip-lights',
    name: 'LED Bars / Strip Lights',
    tag: 'Ambient wash',
    price: 6499,
    discount: 10,
    note: 'Linear color washes for truss, walls, and backdrop accents.',
    image: buildProductArtwork({
      title: 'LED',
      subtitle: 'Wash',
      gradient: ['#1f2937', '#8b5cf6'],
      glow: '#f0abfc',
    }),
  },
  {
    id: 'strobe-lights',
    name: 'Strobe Lights',
    tag: 'Peak energy',
    price: 4599,
    discount: 14,
    note: 'Sharp flash effects that punch up drops and hype transitions.',
    image: buildProductArtwork({
      title: 'Strobe',
      subtitle: 'Pulse',
      gradient: ['#111827', '#f97316'],
      glow: '#fde68a',
    }),
  },
  {
    id: 'laser-lights',
    name: 'Laser Lights',
    tag: 'Beam effects',
    price: 7899,
    discount: 15,
    note: 'Precise beams and patterns that fill the room with motion.',
    image: buildProductArtwork({
      title: 'Laser',
      subtitle: 'Beams',
      gradient: ['#08111f', '#ec4899'],
      glow: '#67e8f9',
    }),
  },
  {
    id: 'moving-head-lights',
    name: 'Moving Head Lights',
    tag: 'Dynamic rig',
    price: 12499,
    discount: 18,
    note: 'Pan and tilt heads for sweeps, color changes, and show cues.',
    image: buildProductArtwork({
      title: 'Move',
      subtitle: 'Head',
      gradient: ['#0f172a', '#14b8a6'],
      glow: '#99f6e4',
    }),
  },
  {
    id: 'par-lights',
    name: 'PAR Lights',
    tag: 'Reliable coverage',
    price: 3799,
    discount: 11,
    note: 'Workhorse flood lighting for clean, even color coverage.',
    image: buildProductArtwork({
      title: 'PAR',
      subtitle: 'Wash',
      gradient: ['#172554', '#f59e0b'],
      glow: '#fef08a',
    }),
  },
  {
    id: 'dj-speakers-pair',
    name: 'DJ Speakers (Pair)',
    tag: 'Audio equipment',
    price: 6000,
    discount: 0,
    note: 'High-output main speakers for clean coverage at weddings, clubs, and stage shows.',
    image: buildProductArtwork({
      title: 'DJ',
      subtitle: 'Speakers',
      gradient: ['#0f172a', '#2563eb'],
      glow: '#93c5fd',
    }),
  },
  {
    id: 'subwoofer-bass-unit',
    name: 'Subwoofer Bass Unit',
    tag: 'Audio equipment',
    price: 4500,
    discount: 0,
    note: 'Deep low-end reinforcement that adds punch to dance floors and live events.',
    image: buildProductArtwork({
      title: 'Bass',
      subtitle: 'Unit',
      gradient: ['#111827', '#7c3aed'],
      glow: '#c4b5fd',
    }),
  },
  {
    id: 'dj-mixer-controller',
    name: 'DJ Mixer Controller',
    tag: 'Audio equipment',
    price: 3500,
    discount: 0,
    note: 'Hands-on mixing control for smooth transitions, cueing, and live performance.',
    image: buildProductArtwork({
      title: 'DJ',
      subtitle: 'Mixer',
      gradient: ['#0f172a', '#0ea5e9'],
      glow: '#7dd3fc',
    }),
  },
  {
    id: 'wireless-microphone',
    name: 'Wireless Microphone',
    tag: 'Audio equipment',
    price: 1200,
    discount: 0,
    note: 'Reliable wireless vocal mic for announcements, hosting, and stage use.',
    image: buildProductArtwork({
      title: 'Wireless',
      subtitle: 'Mic',
      gradient: ['#111827', '#14b8a6'],
      glow: '#5eead4',
    }),
  },
  {
    id: 'dj-headphones',
    name: 'DJ Headphones',
    tag: 'Audio equipment',
    price: 800,
    discount: 0,
    note: 'Closed-back monitoring headphones for cueing and booth monitoring.',
    image: buildProductArtwork({
      title: 'DJ',
      subtitle: 'Headphones',
      gradient: ['#0f172a', '#475569'],
      glow: '#cbd5e1',
    }),
  },
  {
    id: 'par-lights-set-4',
    name: 'PAR Lights (Set of 4)',
    tag: 'Lighting equipment',
    price: 3200,
    discount: 0,
    note: 'Compact wash lighting for stage color, ambience, and backdrop accents.',
    image: buildProductArtwork({
      title: 'PAR',
      subtitle: 'Set',
      gradient: ['#172554', '#f59e0b'],
      glow: '#fde68a',
    }),
  },
  {
    id: 'moving-head-lights-pair',
    name: 'Moving Head Lights (Pair)',
    tag: 'Lighting equipment',
    price: 10500,
    discount: 0,
    note: 'Motorized fixtures for sweeping beams, motion effects, and dynamic shows.',
    image: buildProductArtwork({
      title: 'Moving',
      subtitle: 'Heads',
      gradient: ['#0f172a', '#14b8a6'],
      glow: '#99f6e4',
    }),
  },
  {
    id: 'laser-lights-rental',
    name: 'Laser Lights',
    tag: 'Lighting equipment',
    price: 6500,
    discount: 0,
    note: 'Sharp beam patterns that create instant club-style energy in the room.',
    image: buildProductArtwork({
      title: 'Laser',
      subtitle: 'FX',
      gradient: ['#08111f', '#ec4899'],
      glow: '#67e8f9',
    }),
  },
  {
    id: 'strobe-lights-rental',
    name: 'Strobe Lights',
    tag: 'Lighting equipment',
    price: 3800,
    discount: 0,
    note: 'Fast flash bursts for drop hits, hype moments, and performance cues.',
    image: buildProductArtwork({
      title: 'Strobe',
      subtitle: 'Flash',
      gradient: ['#111827', '#f97316'],
      glow: '#fde68a',
    }),
  },
  {
    id: 'led-bar-lights',
    name: 'LED Bar Lights',
    tag: 'Lighting equipment',
    price: 5500,
    discount: 0,
    note: 'Linear light bars for stage edges, truss lines, and background washes.',
    image: buildProductArtwork({
      title: 'LED',
      subtitle: 'Bar',
      gradient: ['#1f2937', '#8b5cf6'],
      glow: '#f0abfc',
    }),
  },
  {
    id: 'smoke-fog-machine-rental',
    name: 'Smoke / Fog Machine',
    tag: 'Effects',
    price: 7500,
    discount: 0,
    note: 'Atmospheric haze for reveal shots, lighting beams, and dance-floor drama.',
    image: buildProductArtwork({
      title: 'Fog',
      subtitle: 'Machine',
      gradient: ['#101a34', '#3b82f6'],
      glow: '#a5f3fc',
    }),
  },
  {
    id: 'snow-machine',
    name: 'Snow Machine',
    tag: 'Effects',
    price: 9000,
    discount: 0,
    note: 'Snowfall-style effect for festive moments, stage reveals, and special themes.',
    image: buildProductArtwork({
      title: 'Snow',
      subtitle: 'FX',
      gradient: ['#0f172a', '#38bdf8'],
      glow: '#e0f2fe',
    }),
  },
  {
    id: 'cold-pyro-machine',
    name: 'Cold Pyro Machine (Sparkular)',
    tag: 'Effects',
    price: 12000,
    discount: 0,
    note: 'Indoor-safe spark effect for high-impact entrances, intros, and finales.',
    image: buildProductArtwork({
      title: 'Cold',
      subtitle: 'Pyro',
      gradient: ['#111827', '#f43f5e'],
      glow: '#fda4af',
    }),
  },
  {
    id: 'truss-structure',
    name: 'Truss Structure (10-20 ft)',
    tag: 'Stage & setup',
    price: 8000,
    discount: 0,
    note: 'Load-bearing truss framework for lights, banners, and stage dressing.',
    image: buildProductArtwork({
      title: 'Truss',
      subtitle: 'Frame',
      gradient: ['#111827', '#64748b'],
      glow: '#cbd5e1',
    }),
  },
  {
    id: 'dj-booth-table',
    name: 'DJ Booth Table',
    tag: 'Stage & setup',
    price: 2000,
    discount: 0,
    note: 'Clean presentation table for the DJ console, laptops, and controller setup.',
    image: buildProductArtwork({
      title: 'DJ',
      subtitle: 'Booth',
      gradient: ['#1e293b', '#0f766e'],
      glow: '#99f6e4',
    }),
  },
  {
    id: 'led-wall-panel',
    name: 'LED Wall Panel',
    tag: 'Stage & setup',
    price: 15000,
    discount: 0,
    note: 'Per-panel display module for video backdrops, branding, and visual walls.',
    image: buildProductArtwork({
      title: 'LED',
      subtitle: 'Panel',
      gradient: ['#020617', '#22c55e'],
      glow: '#86efac',
    }),
  },
  {
    id: 'stage-platform',
    name: 'Stage Platform',
    tag: 'Stage & setup',
    price: 6000,
    discount: 0,
    note: 'Modular raised platform for performer visibility, speeches, and show layout.',
    image: buildProductArtwork({
      title: 'Stage',
      subtitle: 'Platform',
      gradient: ['#172554', '#f97316'],
      glow: '#fdba74',
    }),
  },
  {
    id: 'power-generator',
    name: 'Power Generator (Backup)',
    tag: 'Utilities',
    price: 5000,
    discount: 0,
    note: 'Reliable backup power to keep sound and lighting running during outages.',
    image: buildProductArtwork({
      title: 'Power',
      subtitle: 'Backup',
      gradient: ['#111827', '#facc15'],
      glow: '#fef08a',
    }),
  },
  {
    id: 'cables-wiring-setup',
    name: 'Cables & Wiring Setup',
    tag: 'Utilities',
    price: 1500,
    discount: 0,
    note: 'Complete cabling and wiring support for a clean, organized event setup.',
    image: buildProductArtwork({
      title: 'Cables',
      subtitle: 'Setup',
      gradient: ['#0f172a', '#7c3aed'],
      glow: '#ddd6fe',
    }),
  },
  {
    id: 'dmx-controller',
    name: 'DMX Controller',
    tag: 'Utilities',
    price: 2500,
    discount: 0,
    note: 'Light-control controller for synchronized scenes, cues, and transitions.',
    image: buildProductArtwork({
      title: 'DMX',
      subtitle: 'Control',
      gradient: ['#0f172a', '#06b6d4'],
      glow: '#67e8f9',
    }),
  },
]

const comboPacks = [
  {
    id: 'basic-party-pack',
    name: 'Basic Party Pack',
    tag: 'Combo package',
    price: 9999,
    discount: 0,
    spotlightColor: 'rgba(34, 197, 94, 0.26)',
    accentColor: '#22c55e',
    accentSoft: 'rgba(34, 197, 94, 0.12)',
    note: 'Speakers + PAR Lights + Mic. A lean starter pack for private parties and house events.',
    components: [
      { label: 'DJ Speakers (Pair)', quantity: 1 },
      { label: 'PAR Lights (Set of 4)', quantity: 1 },
      { label: 'Wireless Microphone', quantity: 1 },
    ],
    image: buildProductArtwork({
      title: 'Basic',
      subtitle: 'Pack',
      gradient: ['#0f172a', '#22c55e'],
      glow: '#86efac',
    }),
  },
  {
    id: 'club-pack',
    name: 'Club Pack',
    tag: 'Combo package',
    price: 19999,
    discount: 0,
    spotlightColor: 'rgba(236, 72, 153, 0.28)',
    accentColor: '#ec4899',
    accentSoft: 'rgba(236, 72, 153, 0.12)',
    note: 'Speakers + Moving Head + Laser + Fog. Built for high-energy club and stage nights.',
    components: [
      { label: 'DJ Speakers (Pair)', quantity: 1 },
      { label: 'Moving Head Lights (Pair)', quantity: 1 },
      { label: 'Laser Lights', quantity: 1 },
      { label: 'Smoke / Fog Machine', quantity: 1 },
    ],
    image: buildProductArtwork({
      title: 'Club',
      subtitle: 'Pack',
      gradient: ['#111827', '#ec4899'],
      glow: '#f9a8d4',
    }),
  },
  {
    id: 'premium-wedding-pack',
    name: 'Premium Wedding Pack',
    tag: 'Combo package',
    price: 39999,
    discount: 0,
    spotlightColor: 'rgba(245, 158, 11, 0.28)',
    accentColor: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.12)',
    note: 'Full setup + LED wall + pyro + truss. The complete showpiece package for big weddings.',
    components: [
      { label: 'DJ Speakers (Pair)', quantity: 2 },
      { label: 'Moving Head Lights (Pair)', quantity: 2 },
      { label: 'LED Wall Panel', quantity: 4 },
      { label: 'Cold Pyro Machine (Sparkular)', quantity: 1 },
      { label: 'Truss Structure (10-20 ft)', quantity: 1 },
    ],
    image: buildProductArtwork({
      title: 'Premium',
      subtitle: 'Wedding',
      gradient: ['#0f172a', '#f59e0b'],
      glow: '#fde68a',
    }),
  },
]

const allProducts = [...products, ...comboPacks]

function buildProductArtwork({ title, subtitle, gradient, glow }) {
  const [startColor, endColor] = gradient

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="${title} product illustration">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stop-color="${glow}" stop-opacity="0.9" />
          <stop offset="70%" stop-color="${glow}" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${glow}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="420" rx="36" fill="url(#bg)" />
      <circle cx="180" cy="110" r="140" fill="url(#glow)" />
      <circle cx="490" cy="300" r="110" fill="rgba(255,255,255,0.08)" />
      <g opacity="0.18">
        <rect x="70" y="276" width="500" height="20" rx="10" fill="#ffffff" />
        <rect x="112" y="230" width="416" height="18" rx="9" fill="#ffffff" />
      </g>
      <g transform="translate(320 178)">
        <rect x="-104" y="-58" width="208" height="116" rx="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" />
        <rect x="-72" y="-30" width="144" height="60" rx="18" fill="rgba(255,255,255,0.18)" />
        <rect x="-18" y="52" width="36" height="84" rx="12" fill="rgba(255,255,255,0.22)" />
        <circle cx="0" cy="0" r="38" fill="${glow}" fill-opacity="0.28" />
        <circle cx="0" cy="0" r="22" fill="#ffffff" fill-opacity="0.7" />
        <path d="M0 -96 L24 -48 L-24 -48 Z" fill="rgba(255,255,255,0.24)" />
      </g>
      <text x="56" y="84" fill="#fff" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700">${title}</text>
      <text x="56" y="128" fill="rgba(255,255,255,0.82)" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600">${subtitle}</text>
    </svg>
  `)}`
}

const durations = [
  { label: '2 hours', hours: 2, multiplier: 1 },
  { label: '3 hours', hours: 3, multiplier: 1.08 },
  { label: '4 hours', hours: 4, multiplier: 1.15 },
  { label: '5 hours', hours: 5, multiplier: 1.22 },
  { label: '6 hours', hours: 6, multiplier: 1.3 },
  { label: '8 hours', hours: 8, multiplier: 1.42 },
  { label: '10 hours', hours: 10, multiplier: 1.55 },
  { label: '12 hours', hours: 12, multiplier: 1.7 },
  { label: '16 hours', hours: 16, multiplier: 1.92 },
  { label: '24 hours', hours: 24, multiplier: 2.25 },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const getViewFromHash = () => {
  if (window.location.hash === '#combos') {
    return 'combos'
  }

  if (window.location.hash === '#checkout') {
    return 'checkout'
  }

  if (window.location.hash === '#payment') {
    return 'payment'
  }

  return 'catalog'
}

function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [cart, setCart] = useState({})
  const [selectedDuration, setSelectedDuration] = useState(durations[4])
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState(() => getViewFromHash())
  const [activeComboIndex, setActiveComboIndex] = useState(0)

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const saveSession = (user) => {
    setAuthUser(user)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
  }

  const openCatalogPage = () => {
    window.location.hash = ''
  }

  const openComboPage = () => {
    window.location.hash = 'combos'
  }

  const handleSignup = ({ name, email, password }) => {
    const users = getStoredUsers()
    const existingUser = users.find((user) => user.email === email)

    if (existingUser) {
      alert('An account with this email already exists. Please login instead.')
      return
    }

    const newUser = { name, email, password }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]))
    saveSession({ name, email })
  }

  const handleLogin = ({ email, password }) => {
    const users = getStoredUsers()
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password,
    )

    if (!matchedUser) {
      return { ok: false, message: 'Invalid email or password.' }
    }

    saveSession({ name: matchedUser.name, email: matchedUser.email })
    return { ok: true }
  }

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (comboPacks.length <= 1) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setActiveComboIndex((currentIndex) => (currentIndex + 1) % comboPacks.length)
    }, 5000)

    return () => window.clearInterval(timerId)
  }, [])

  const activeComboPack = comboPacks[activeComboIndex % comboPacks.length]

  const cartItems = useMemo(() => {
    return allProducts
      .map((product) => {
        const quantity = cart[product.id] || 0
        const discountedPrice = Math.round(product.price * (1 - product.discount / 100))

        return {
          ...product,
          quantity,
          discountedPrice,
          lineTotal: quantity * discountedPrice,
        }
      })
      .filter((product) => product.quantity > 0)
  }, [cart])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return products
    }

    return products.filter((product) => {
      const searchableText = [product.name, product.tag, product.note]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [searchQuery])

  const equipmentTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const durationCharge = Math.round(equipmentTotal * (selectedDuration.multiplier - 1))
  const grandTotal = equipmentTotal + durationCharge
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.price - item.discountedPrice),
    0,
  )

  const updateQuantity = (productId, delta) => {
    setCart((currentCart) => {
      const currentQuantity = currentCart[productId] || 0
      const nextQuantity = Math.max(0, currentQuantity + delta)

      if (nextQuantity === 0) {
        const nextCart = { ...currentCart }
        delete nextCart[productId]
        return nextCart
      }

      return {
        ...currentCart,
        [productId]: nextQuantity,
      }
    })
  }

  const openPaymentPage = () => {
    if (cartItems.length > 0) {
      window.location.hash = 'payment'
    }
  }

  const openCheckoutPage = () => {
    if (cartItems.length > 0) {
      window.location.hash = 'checkout'
    }
  }

  const returnToCatalog = () => {
    window.location.hash = ''
  }

  const returnToCheckout = () => {
    window.location.hash = 'checkout'
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setAuthUser(null)
    window.location.hash = ''
    setSearchQuery('')
  }

  if (!authUser) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />
  }

  if (view === 'checkout') {
    return (
      <CheckoutPage
        cartItems={cartItems}
        selectedDuration={selectedDuration}
        durations={durations}
        setSelectedDuration={setSelectedDuration}
        equipmentTotal={equipmentTotal}
        durationCharge={durationCharge}
        totalSavings={totalSavings}
        grandTotal={grandTotal}
        formatCurrency={formatCurrency}
        onBack={returnToCatalog}
        onProceed={openPaymentPage}
      />
    )
  }

  if (view === 'combos') {
    return (
      <ComboPage
        comboPacks={comboPacks}
        cart={cart}
        formatCurrency={formatCurrency}
        updateQuantity={updateQuantity}
        onBack={openCatalogPage}
        onProceed={openCheckoutPage}
      />
    )
  }

  if (view === 'payment') {
    return <PaymentPage amount={grandTotal} onBack={returnToCheckout} />
  }

  return (
    <div className="storefront">
      <header className="topbar">
        <div>
          <p className="eyebrow">Live DJ setup rentals</p>
          <div className="brand-row">
            <h1>StageKart</h1>
            <span className="brand-badge">One Stop DJ Rental</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button type="button" className="logout-button" onClick={openComboPage}>
            Combo packs
          </button>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <label className="searchbar" aria-label="Search DJ equipment">
            <span className="search-icon">Search</span>
            <input
                type="search"
                placeholder="Search audio, lighting, effects, and packs"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-pill">10%+ off on every component</span>
          <h2>Book a full show rig for weddings, clubs, and private events.</h2>
          <p>
            Mix and match production gear, then choose your rental duration to update the
            checkout total instantly.
          </p>

          <div className="hero-stats">
            <div>
              <strong>20+</strong>
              <span>rental options</span>
            </div>
            <div>
              <strong>10</strong>
              <span>duration choices</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>max booking window</span>
            </div>
          </div>
        </div>

        <aside className="hero-summary">
          <span>Current basket</span>
          <strong>{cartItems.length} item types selected</strong>
          <p>
            Equipment total {formatCurrency(equipmentTotal)} before the chosen rental duration is
            applied.
          </p>
          <button type="button" className="checkout-button" onClick={openComboPage}>
            Browse combo packs
          </button>
        </aside>
      </section>

      <section className="combo-overview">
        <div className="section-head">
          <div>
            <h3>Combo packs at a glance</h3>
            <p>One combo appears at a time and automatically changes every 5 seconds.</p>
          </div>
          <span className="section-chip">3 curated packages</span>
        </div>

        <div className="combo-overview-shell">
          <SpotlightCard
            key={activeComboPack.id}
            className="combo-overview-card combo-marquee-card"
            spotlightColor={activeComboPack.spotlightColor}
          >
            <div className="product-topline">
              <span className="tag" style={{ background: activeComboPack.accentSoft, color: activeComboPack.accentColor }}>
                {activeComboPack.tag}
              </span>
              <span className="discount" style={{ background: activeComboPack.accentSoft, color: activeComboPack.accentColor }}>
                {formatCurrency(activeComboPack.price)}
              </span>
            </div>
            <h4>{activeComboPack.name}</h4>
            <p>{activeComboPack.note}</p>
            <div className="combo-components">
              <span>Included components</span>
              <ul>
                {activeComboPack.components.map((component) => (
                  <li key={component.label}>
                    <strong>{component.quantity}x</strong>
                    <span>{component.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="combo-overview-footer">
              <span>
                {activeComboIndex + 1} of {comboPacks.length}
              </span>
              <div className="combo-overview-dots" aria-hidden="true">
                {comboPacks.map((pack, index) => (
                  <span key={pack.id} className={index === activeComboIndex ? 'active' : ''} />
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <main className="layout">
        <section className="catalog">
          <div className="section-head">
            <div>
              <h3>Audio, Lighting, Effects & Packs</h3>
              <p>Full event inventory with exact pack prices and fixed-rate rentals.</p>
            </div>
            <span className="section-chip">20+ items ready to book</span>
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
              const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
              const quantity = cart[product.id] || 0

              return (
                <SpotlightCard key={product.id} className="product-card">
                  <div className="product-topline">
                    <span className="tag">{product.tag}</span>
                    {product.discount > 0 ? (
                      <span className="discount">{product.discount}% off</span>
                    ) : (
                      <span className="discount">Flat rate</span>
                    )}
                  </div>
                  <div className="product-image-frame">
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <h4>{product.name}</h4>
                  <p>{product.note}</p>
                  <div className="price-row">
                    <strong>{formatCurrency(discountedPrice)}</strong>
                    {product.discount > 0 ? <span className="strike">{formatCurrency(product.price)}</span> : null}
                  </div>
                  <div className="quantity-row">
                    <button type="button" onClick={() => updateQuantity(product.id, -1)}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(product.id, 1)}>
                      +
                    </button>
                  </div>
                  <button type="button" className="add-button" onClick={() => updateQuantity(product.id, 1)}>
                    Add to booking
                  </button>
                </SpotlightCard>
              )
              })
            ) : (
              <div className="no-results">
                <h4>No products found</h4>
                <p>Try searching by product name, tag, or description.</p>
              </div>
            )}
          </div>

          <div className="catalog-actions">
            <button type="button" className="checkout-button" onClick={openCheckoutPage} disabled={!cartItems.length}>
              Review basket and checkout
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
