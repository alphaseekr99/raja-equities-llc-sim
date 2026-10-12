const formatSignedPercent = (value) => `${value >= 0 ? '+' : '-'}${Math.abs(value).toFixed(1)}%`

const getInvestmentCharacteristics = (company) => {
  const growth = company.revenueGrowth >= 18
    ? 'High Revenue Growth'
    : company.revenueGrowth < 6
      ? 'Moderate Revenue Growth'
      : 'Steady Revenue Growth'
  const valuation = company.pe >= 30
    ? 'Premium Valuation'
    : company.pe < 15
      ? 'Lower Valuation Multiple'
      : 'Moderate Valuation'
  const beta = company.beta >= 1.2
    ? 'High Beta'
    : company.beta < 0.85
      ? 'Low Beta'
      : 'Market-Like Beta'
  const leverage = company.debtToEbitda <= 1
    ? 'Low Leverage'
    : company.debtToEbitda >= 3
      ? 'Higher Leverage'
      : 'Moderate Leverage'

  return [growth, valuation, beta, leverage, `${company.volatility} Volatility`]
}

function SecurityResearchPanel({
  company,
  position,
  sectorNetExposure,
  tradeConfirmation,
  formatCurrency,
  formatSignedCurrency,
  onOpenTrading,
}) {
  const hasLong = position.longValue > 0
  const hasShort = position.shortValue > 0
  const positionDescription = hasLong
    ? `LONG ${formatCurrency(position.longValue)}`
    : hasShort
      ? `SHORT -${formatCurrency(position.shortValue)}`
      : 'No current position'
  const fundamentals = [
    ['Revenue Growth', `${company.revenueGrowth.toFixed(1)}%`],
    ['Earnings Growth', `${company.earningsGrowth.toFixed(1)}%`],
    ['Operating Margin', `${company.operatingMargin.toFixed(1)}%`],
    ['P/E', `${company.pe.toFixed(1)}x`],
    ['Debt / EBITDA', `${company.debtToEbitda.toFixed(1)}x`],
    ['ROE', `${company.roe.toFixed(1)}%`],
    ['Dividend Yield', `${company.dividendYield.toFixed(1)}%`],
    ['Beta', company.beta.toFixed(2)],
  ]

  return (
    <aside className="panel security-research-panel">
      <div className="panel-header research-header">
        <div>
          <span className="research-kicker">Security Research</span>
          <h2>{company.name}</h2>
          <p>{company.sector}</p>
        </div>
        <strong className="research-ticker">{company.ticker}</strong>
      </div>

      {tradeConfirmation ? (
        <div className="trade-confirmation" role="status">
          <span>Order Executed</span>
          <strong>{tradeConfirmation}</strong>
        </div>
      ) : null}

      <section className="research-section market-data-section">
        <h3>Market Data</h3>
        <div className="research-market-grid">
          <div>
            <span>Current Price</span>
            <strong>{formatCurrency(company.price)}</strong>
          </div>
          <div>
            <span>Quarter Return</span>
            <strong className={company.quarterReturn >= 0 ? 'positive' : 'negative'}>
              {formatSignedPercent(company.quarterReturn ?? 0)}
            </strong>
          </div>
          <div>
            <span>Previous Quarter</span>
            <strong className={company.previousQuarterReturn >= 0 ? 'positive' : 'negative'}>
              {company.previousQuarterReturn != null ? formatSignedPercent(company.previousQuarterReturn) : '—'}
            </strong>
          </div>
          <div>
            <span>Sector</span>
            <strong>{company.sector}</strong>
          </div>
          <div>
            <span>Beta</span>
            <strong>{company.beta.toFixed(2)}</strong>
          </div>
          <div>
            <span>Volatility</span>
            <strong>{company.volatility}</strong>
          </div>
        </div>
      </section>

      <section className="research-section">
        <h3>Company Overview</h3>
        <p className="research-overview">{company.description}</p>
      </section>

      <section className="research-section">
        <h3>Fundamentals</h3>
        <dl className="research-fundamentals">
          {fundamentals.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="research-market-detail">
          <span>Volatility</span>
          <strong>{company.volatility}</strong>
        </div>
      </section>

      <section className="research-section">
        <h3>Investment Characteristics</h3>
        <ul className="characteristic-list">
          {getInvestmentCharacteristics(company).map((characteristic) => (
            <li key={characteristic}>{characteristic}</li>
          ))}
        </ul>
      </section>

      <section className="research-section research-position-section">
        <h3>Your Fund Position</h3>
        <div className="research-position">
          <strong className={hasShort ? 'negative' : hasLong ? 'positive' : ''}>
            {positionDescription}
          </strong>
          <dl>
            <div>
              <dt>Portfolio Weight</dt>
              <dd>{Math.abs(position.weight).toFixed(1)}%</dd>
            </div>
            <div>
              <dt>Position P&amp;L</dt>
              <dd className={position.totalPnl >= 0 ? 'positive' : 'negative'}>
                {formatSignedCurrency(position.totalPnl)}
              </dd>
            </div>
            <div>
              <dt>Sector Net Exposure</dt>
              <dd>{sectorNetExposure >= 0 ? '+' : ''}{sectorNetExposure.toFixed(1)}%</dd>
            </div>
          </dl>
        </div>
      </section>

      <button className="primary-button open-trading-button" type="button" onClick={onOpenTrading}>
        OPEN TRADING
      </button>
    </aside>
  )
}

export default SecurityResearchPanel
