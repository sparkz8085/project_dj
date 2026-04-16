import { useMemo, useState } from 'react'
import './App.css'
import SpotlightCard from './SpotlightCard'

const products = [
  {
    id: 'smoke-fog-machine',
    name: 'Smoke / Fog Machine',
    tag: 'Stage atmosphere',
    price: 8999,
    discount: 12,
    note: 'High-output haze for entrances, reveals, and dance-floor moments.',
  },
  {
    id: 'led-bars-strip-lights',
    name: 'LED Bars / Strip Lights',
    tag: 'Ambient wash',
    price: 6499,
    discount: 10,
    note: 'Linear color washes for truss, walls, and backdrop accents.',
  },
  {
    id: 'strobe-lights',
    name: 'Strobe Lights',
    tag: 'Peak energy',
    price: 4599,
    discount: 14,
    note: 'Sharp flash effects that punch up drops and hype transitions.',
  },
  {
    id: 'laser-lights',
    name: 'Laser Lights',
    tag: 'Beam effects',
    price: 7899,
    discount: 15,
    note: 'Precise beams and patterns that fill the room with motion.',
  },
  {
    id: 'moving-head-lights',
    name: 'Moving Head Lights',
    tag: 'Dynamic rig',
    price: 12499,
    discount: 18,
    note: 'Pan and tilt heads for sweeps, color changes, and show cues.',
  },
  {
    id: 'par-lights',
    name: 'PAR Lights',
    tag: 'Reliable coverage',
    price: 3799,
    discount: 11,
    note: 'Workhorse flood lighting for clean, even color coverage.',
  },
]

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

function App() {
  const [cart, setCart] = useState({
    'smoke-fog-machine': 1,
    'moving-head-lights': 1,
  })
  const [selectedDuration, setSelectedDuration] = useState(durations[4])

  const cartItems = useMemo(() => {
    return products
      .map((product) => {
        const quantity = cart[product.id] || 0
        const discountedPrice = Math.round(
          product.price * (1 - product.discount / 100),
        )

        return {
          ...product,
          quantity,
          discountedPrice,
          lineTotal: quantity * discountedPrice,
        }
      })
      .filter((product) => product.quantity > 0)
  }, [cart])

  const equipmentTotal = cartItems.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  )
  const durationCharge = Math.round(
    equipmentTotal * (selectedDuration.multiplier - 1),
  )
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
          <input
            type="search"
            placeholder="Search lights, fog, and show effects"
          />
        </label>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-pill">10%+ off on every component</span>
          <h2>Book a full show rig for weddings, clubs, and private events.</h2>
          <p>
            Mix and match production gear, then choose your rental duration to
            update the checkout total instantly.
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
            Equipment total {formatCurrency(equipmentTotal)} before the chosen
            rental duration is applied.
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
              const discountedPrice = Math.round(
                product.price * (1 - product.discount / 100),
              )
              const quantity = cart[product.id] || 0

              return (
                <SpotlightCard key={product.id} className="product-card">
                  <div className="product-topline">
                    <span className="tag">{product.tag}</span>
                    <span className="discount">{product.discount}% off</span>
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
                  <button
                    type="button"
                    className="add-button"
                    onClick={() => updateQuantity(product.id, 1)}
                  >
                    Add to booking
                  </button>
                </SpotlightCard>
              )
            })}
          </div>
        </section>

        <aside className="checkout">
          <div className="section-head checkout-head">
            <div>
              <h3>Checkout</h3>
              <p>Pick the rental duration to recalculate the total.</p>
            </div>
          </div>

          <SpotlightCard className="duration-card">
            <div className="duration-title">
              <span>Service duration</span>
              <strong>{selectedDuration.label}</strong>
            </div>

            <div className="duration-grid">
              {durations.map((duration) => (
                <button
                  key={duration.label}
                  type="button"
                  className={
                    duration.label === selectedDuration.label ? 'active' : ''
                  }
                  onClick={() => setSelectedDuration(duration)}
                >
                  <span>{duration.label}</span>
                  <small>x{duration.multiplier.toFixed(2)}</small>
                </button>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="bill-card">
            <div className="bill-row">
              <span>Equipment subtotal</span>
              <strong>{formatCurrency(equipmentTotal)}</strong>
            </div>
            <div className="bill-row">
              <span>Duration adjustment</span>
              <strong>{formatCurrency(durationCharge)}</strong>
            </div>
            <div className="bill-row">
              <span>Total savings from discounts</span>
              <strong>{formatCurrency(totalSavings)}</strong>
            </div>
            <div className="bill-total">
              <span>Payable amount</span>
              <strong>{formatCurrency(grandTotal)}</strong>
            </div>
            <button type="button" className="checkout-button">
              Proceed to book
            </button>
          </SpotlightCard>

          <SpotlightCard className="order-list">
            <h4>Order summary</h4>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div>
                    <span>{item.name}</span>
                    <small>
                      {item.quantity} x {formatCurrency(item.discountedPrice)}
                    </small>
                  </div>
                  <strong>{formatCurrency(item.lineTotal)}</strong>
                </div>
              ))
            ) : (
              <p className="empty-state">Add components to see your booking summary.</p>
            )}
          </SpotlightCard>
        </aside>
      </main>
    </div>
  )
}

export default App
