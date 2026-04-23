import SpotlightCard from './SpotlightCard'
import './ComboPage.css'

function ComboPage({ comboPacks, cart, formatCurrency, updateQuantity, onBack, onProceed }) {
  const selectedCount = comboPacks.reduce((count, pack) => count + (cart[pack.id] || 0), 0)
  const selectedTotal = comboPacks.reduce((sum, pack) => {
    const quantity = cart[pack.id] || 0
    return sum + quantity * pack.price
  }, 0)

  return (
    <div className="combo-page storefront">
      <header className="topbar">
        <div>
          <p className="eyebrow">Combo packages</p>
          <div className="brand-row">
            <h1>StageKart Combos</h1>
            <span className="brand-badge">Build your booking</span>
          </div>
        </div>

        <div className="combo-page-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back to catalog
          </button>
          <button type="button" className="checkout-button" onClick={onProceed} disabled={!selectedCount}>
            Go to checkout
          </button>
        </div>
      </header>

      <main className="combo-page-layout">
        <section className="catalog combo-page-panel">
          <div className="section-head">
            <div>
              <h3>Select a combo pack</h3>
              <p>Pick one or more ready-made packages and add them to your booking.</p>
            </div>
            <span className="section-chip">{comboPacks.length} packs available</span>
          </div>

          <div className="combo-grid">
            {comboPacks.map((pack) => {
              const quantity = cart[pack.id] || 0

              return (
                <SpotlightCard key={pack.id} className="combo-select-card">
                  <div className="product-topline">
                    <span className="tag" style={{ background: pack.accentSoft, color: pack.accentColor }}>
                      {pack.tag}
                    </span>
                    <span className="discount" style={{ background: pack.accentSoft, color: pack.accentColor }}>
                      Flat rate
                    </span>
                  </div>
                  <div className="product-image-frame">
                    <img className="product-image" src={pack.image} alt={pack.name} loading="lazy" />
                  </div>
                  <h4>{pack.name}</h4>
                  <p>{pack.note}</p>
                  <div className="price-row">
                    <strong>{formatCurrency(pack.price)}</strong>
                    <span className="strike">Per pack</span>
                  </div>
                    <div className="combo-components" style={{ border: `1px solid ${pack.accentSoft}` }}>
                    <span>Included components</span>
                    <ul>
                      {pack.components.map((component) => (
                        <li key={component.label}>
                            <strong style={{ color: pack.accentColor }}>{component.quantity}x</strong>
                          <span>{component.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="quantity-row">
                    <button type="button" onClick={() => updateQuantity(pack.id, -1)} disabled={!quantity}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(pack.id, 1)}>
                      +
                    </button>
                  </div>
                  <button type="button" className="add-button" onClick={() => updateQuantity(pack.id, 1)}>
                    Add to booking
                  </button>
                </SpotlightCard>
              )
            })}
          </div>
        </section>

        <aside className="combo-summary-column">
          <SpotlightCard className="combo-summary-card">
            <div className="duration-title">
              <span>Selected packs</span>
              <strong>{selectedCount}</strong>
            </div>
            <p className="combo-summary-text">
              Total combo value {formatCurrency(selectedTotal)} before duration charges are applied in checkout.
            </p>
            <ul className="combo-summary-list">
              {comboPacks.filter((pack) => (cart[pack.id] || 0) > 0).map((pack) => (
                <li key={pack.id}>
                  <div>
                    <span>{pack.name}</span>
                    <small>
                      {pack.components.map((component) => `${component.quantity}x ${component.label}`).join(' + ')}
                    </small>
                  </div>
                  <strong style={{ color: pack.accentColor }}>
                    {(cart[pack.id] || 0)} x {formatCurrency(pack.price)}
                  </strong>
                </li>
              ))}
              {selectedCount === 0 ? <li className="combo-empty">No combo selected yet.</li> : null}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="combo-summary-card">
            <h4>How it works</h4>
            <p className="combo-summary-text">
              Choose one or more combo packs here, then continue to checkout to review everything together.
            </p>
            <button type="button" className="checkout-button" onClick={onProceed} disabled={!selectedCount}>
              Continue booking
            </button>
          </SpotlightCard>
        </aside>
      </main>
    </div>
  )
}

export default ComboPage
