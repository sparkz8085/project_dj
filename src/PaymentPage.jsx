import { useEffect, useState } from 'react'
import './PaymentPage.css'

const payeeName = 'DJBooking'
const payeeUpiId = 'yourname@upi'
const currency = 'INR'
const defaultAmount = 1499

const buildUpiLink = (amount) =>
  `upi://pay?pa=${payeeUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${currency}`

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

function PaymentPage({ amount: initialAmount = defaultAmount, onBack }) {
  const [amount, setAmount] = useState(initialAmount)
  const [upiLink, setUpiLink] = useState(buildUpiLink(initialAmount))

  useEffect(() => {
    const safeAmount =
      Number.isFinite(initialAmount) && initialAmount > 0 ? initialAmount : defaultAmount

    setAmount(safeAmount)
  }, [initialAmount])

  useEffect(() => {
    const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : defaultAmount

    setUpiLink(buildUpiLink(safeAmount))
  }, [amount])

  const handleAmountChange = (event) => {
    const nextAmount = Number(event.target.value)
    setAmount(Number.isFinite(nextAmount) && nextAmount > 0 ? nextAmount : defaultAmount)
  }

  const simulateAmountChange = () => {
    setAmount((currentAmount) => {
      if (currentAmount >= 2999) {
        return 999
      }

      return currentAmount + 250
    })
  }

  return (
    <main className="payment-app">
      <section className="payment-card" aria-label="UPI payment QR code generator">
        <p className="eyebrow">UPI payment</p>
        <h1>DJ Booking QR</h1>
        <p className="subtitle">Scan QR to pay</p>

        <label className="amount-field" htmlFor="amount">
          <span>Total amount</span>
          <input
            id="amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={handleAmountChange}
            inputMode="numeric"
          />
        </label>

        <div className="amount-total">{formatAmount(amount)}</div>

        <div className="qr-panel">
          <img
            className="qr-image"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}`}
            alt="UPI QR code for payment"
          />
        </div>

        <p className="fallback-text">After payment, upload screenshot for confirmation</p>

        {onBack ? (
          <button type="button" className="back-button" onClick={onBack}>
            Back to shopping
          </button>
        ) : null}

        <button type="button" className="simulate-button" onClick={simulateAmountChange}>
          Simulate amount change
        </button>
      </section>
    </main>
  )
}

export default PaymentPage
