import SpotlightCard from './SpotlightCard'
import './CheckoutPage.css'

function CheckoutPage({
  cartItems,
  selectedDuration,
  durations,
  setSelectedDuration,
  equipmentTotal,
  durationCharge,
  totalSavings,
  grandTotal,
  formatCurrency,
  onBack,
  onProceed,
}) {
  return (
    <div className="checkout-page storefront">
      <header className="topbar">
        <div>
          <p className="eyebrow">Basket and checkout</p>
          <div className="brand-row">
            <h1>StageKart Checkout</h1>
            <span className="brand-badge">Review your order</span>
          </div>
        </div>

        <button type="button" className="back-button" onClick={onBack}>
          Back to catalog
        </button>
      </header>

      <main className="checkout-page-layout">
        <section className="catalog checkout-page-panel">
          <div className="section-head checkout-head">
            <div>
              <h3>Basket</h3>
              <p>Review the items you added before moving to payment.</p>
            </div>
          </div>

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
              <p className="empty-state">Add components from the catalog to see your basket.</p>
            )}
          </SpotlightCard>
        </section>

        <aside className="checkout checkout-page-panel">
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
                  className={duration.label === selectedDuration.label ? 'active' : ''}
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
            <button type="button" className="checkout-button" onClick={onProceed} disabled={!cartItems.length}>
              Proceed to payment
            </button>
            <p className="payment-note">This opens a dedicated payment page with your QR code.</p>
          </SpotlightCard>
        </aside>
      </main>
    </div>
  )
}

export default CheckoutPage