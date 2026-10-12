const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

const formatSignedPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

const getPositionLabel = (longValue, shortValue) => {
  if (longValue > 0) return `LONG ${formatCurrency(longValue)}`
  if (shortValue > 0) return `SHORT -${formatCurrency(shortValue)}`
  return 'No current position'
}

function TradeTicket({
  company,
  position,
  cash,
  totalLongValue,
  totalShortValue,
  grossExposurePct,
  netExposurePct,
  tradeMode,
  setTradeMode,
  tradeType,
  setTradeType,
  tradeValue,
  setTradeValue,
  tradeShares,
  tradeAmount,
  tradeError,
  clearTradeError,
  onCancel,
  onExecute,
}) {
  const hasLong = company.longShares > 0
  const hasShort = company.shortShares > 0
  const actions = hasLong ? ['buy', 'sell'] : hasShort ? ['short', 'cover'] : ['buy', 'short']
  const currentLongValue = position.longValue
  const currentShortValue = position.shortValue
  const longChange = tradeMode === 'buy'
    ? tradeShares * company.price
    : tradeMode === 'sell'
      ? -tradeShares * company.price
      : 0
  const shortChange = tradeMode === 'short'
    ? tradeShares * company.price
    : tradeMode === 'cover'
      ? -tradeShares * company.price
      : 0
  const cashAfter = cash + (tradeMode === 'sell' || tradeMode === 'short' ? tradeAmount : -tradeAmount)
  const longValueAfter = Math.max(0, currentLongValue + longChange)
  const shortValueAfter = Math.max(0, currentShortValue + shortChange)
  const estimatedAumAfter = cashAfter + totalLongValue + longChange - totalShortValue - shortChange
  const newNetPosition = longValueAfter - shortValueAfter
  const weightAfter = estimatedAumAfter > 0 ? (newNetPosition / estimatedAumAfter) * 100 : 0
  const grossAfter = estimatedAumAfter > 0
    ? ((totalLongValue + longChange + totalShortValue + shortChange) / estimatedAumAfter) * 100
    : 0
  const netAfter = estimatedAumAfter > 0
    ? ((totalLongValue + longChange - totalShortValue - shortChange) / estimatedAumAfter) * 100
    : 0

  return (
    <aside className="panel trade-ticket-panel">
      <div className="panel-header">
        <div>
          <span className="research-kicker">Order Entry</span>
          <h2>Trade {company.ticker}</h2>
        </div>
        <button className="text-button" type="button" onClick={onCancel}>
          BACK TO RESEARCH
        </button>
      </div>

      <div className="ticket-security-summary">
        <div>
          <span>{company.name}</span>
          <strong>{formatCurrency(company.price)}</strong>
        </div>
        <div>
          <span>Current Position</span>
          <strong>{getPositionLabel(currentLongValue, currentShortValue)}</strong>
        </div>
        <div>
          <span>Available Cash</span>
          <strong>{formatCurrency(cash)}</strong>
        </div>
      </div>

      <div className="ticket-section">
        <h3>Action</h3>
        <div className="ticket-actions">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              className={tradeMode === action ? 'active' : ''}
              aria-pressed={tradeMode === action}
              onClick={() => {
                setTradeMode(action)
                clearTradeError()
              }}
            >
              {action.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="ticket-section">
        <h3>Trade Size</h3>
        <div className="ticket-size-toggle">
          <button
            type="button"
            className={tradeType === 'amount' ? 'active' : ''}
            onClick={() => {
              setTradeType('amount')
              clearTradeError()
            }}
          >
            Dollar Amount
          </button>
          <button
            type="button"
            className={tradeType === 'shares' ? 'active' : ''}
            onClick={() => {
              setTradeType('shares')
              clearTradeError()
            }}
          >
            Shares
          </button>
        </div>
        <label className="field-label" htmlFor="trade-value">
          {tradeType === 'amount' ? 'Dollar amount' : 'Shares'}
        </label>
        <input
          id="trade-value"
          type="number"
          min="0"
          step={tradeType === 'amount' ? '1000' : '0.01'}
          value={tradeValue}
          onChange={(event) => {
            setTradeValue(event.target.value)
            clearTradeError()
          }}
        />
        {tradeType === 'amount' ? (
          <div className="quick-order-sizes" aria-label="Quick trade sizes">
            {[1_000_000, 2_500_000, 5_000_000, 10_000_000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setTradeValue(String(amount))
                  clearTradeError()
                }}
              >
                {amount === 2_500_000 ? '$2.5M' : `$${amount / 1_000_000}M`}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section className="order-preview">
        <h3>Estimated Order</h3>
        <dl className="order-preview-grid">
          <div>
            <dt>Action</dt>
            <dd>{tradeMode.toUpperCase()} {company.ticker}</dd>
          </div>
          <div>
            <dt>Trade Value</dt>
            <dd>{formatCurrency(tradeAmount)}</dd>
          </div>
          <div>
            <dt>Current Position</dt>
            <dd>{getPositionLabel(currentLongValue, currentShortValue)}</dd>
          </div>
          <div>
            <dt>Estimated New Position</dt>
            <dd>{getPositionLabel(longValueAfter, shortValueAfter)}</dd>
          </div>
          <div>
            <dt>Portfolio Weight</dt>
            <dd>{Math.abs(position.weight).toFixed(1)}% → {Math.abs(weightAfter).toFixed(1)}%</dd>
          </div>
          <div>
            <dt>Cash After Trade</dt>
            <dd>{formatCurrency(cashAfter)}</dd>
          </div>
        </dl>
        <div className="exposure-impact">
          <h4>Exposure Impact</h4>
          <div>
            <span>Gross Exposure</span>
            <strong>{grossExposurePct.toFixed(1)}% <span>→</span> {grossAfter.toFixed(1)}%</strong>
          </div>
          <div>
            <span>Net Exposure</span>
            <strong>{formatSignedPercent(netExposurePct)} <span>→</span> {formatSignedPercent(netAfter)}</strong>
          </div>
        </div>
      </section>

      {tradeError ? <p className="error-message" role="alert">{tradeError}</p> : null}

      <div className="ticket-footer">
        <button className="text-button" type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button className="primary-button execute-trade-button" type="button" onClick={onExecute}>
          EXECUTE TRADE
        </button>
      </div>
    </aside>
  )
}

export default TradeTicket
