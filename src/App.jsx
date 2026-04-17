import { useEffect, useMemo, useState } from 'react'
import './App.css'
import SpotlightCard from './SpotlightCard'
import CheckoutPage from './CheckoutPage'
import PaymentPage from './PaymentPage'

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
]

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
  if (window.location.hash === '#checkout') {
    return 'checkout'
  }

  if (window.location.hash === '#payment') {
    return 'payment'
  }

  return 'catalog'
}

function App() {
  const [cart, setCart] = useState({
    'smoke-fog-machine': 1,
    'moving-head-lights': 1,
  })
  const [selectedDuration, setSelectedDuration] = useState(durations[4])
  const [view, setView] = useState(() => getViewFromHash())

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const cartItems = useMemo(() => {
    return products
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

        <label className="searchbar" aria-label="Search DJ equipment">
          <span className="search-icon">Search</span>
          <input type="search" placeholder="Search lights, fog, and show effects" />
        </label>
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
              <strong>6</strong>
              <span>core lighting effects</span>
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
        </aside>
      </section>

      <main className="layout">
        <section className="catalog">
          <div className="section-head">
            <div>
              <h3>DJ Setup Components</h3>
              <p>Reasonable rental pricing with the sale price shown first.</p>
            </div>
            <span className="section-chip">Minimum 10% off each</span>
          </div>

          <div className="product-grid">
            {products.map((product) => {
              const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
              const quantity = cart[product.id] || 0

              return (
                <SpotlightCard key={product.id} className="product-card">
                  <div className="product-topline">
                    <span className="tag">{product.tag}</span>
                    <span className="discount">{product.discount}% off</span>
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
                    <span className="strike">{formatCurrency(product.price)}</span>
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
            })}
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
