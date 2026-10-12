import { useMemo, useState } from 'react'
import './App.css'

const STARTING_CAPITAL = 100_000_000
const TOTAL_QUARTERS = 8

const REGIME_LIBRARY = [
  {
    name: 'Expansion',
    summary: 'Growth remains firm, credit is available, and risk appetite is elevated.',
    growth: 3.4,
    inflation: 2.6,
    rates: 4.1,
    commodity: 0.95,
    sentiment: 'Risk-on',
    marketBias: 0.04,
    ratesShock: 0.02,
    commodityShock: 0.01,
    financialStress: -0.02,
  },
  {
    name: 'Inflation Shock',
    summary: 'Price pressures rise, financing costs climb, and cyclical assets feel the squeeze.',
    growth: 1.6,
    inflation: 5.2,
    rates: 5.7,
    commodity: 1.14,
    sentiment: 'Defensive',
    marketBias: -0.03,
    ratesShock: 0.08,
    commodityShock: 0.09,
    financialStress: 0.06,
  },
  {
    name: 'Risk-Off',
    summary: 'Investors rotate away from growth and toward balance-sheet protection.',
    growth: 0.7,
    inflation: 3.1,
    rates: 4.8,
    commodity: 0.9,
    sentiment: 'Defensive',
    marketBias: -0.07,
    ratesShock: 0.05,
    commodityShock: -0.03,
    financialStress: 0.08,
  },
  {
    name: 'Commodity Boom',
    summary: 'Energy and materials leadership lifts inflation-sensitive sectors.',
    growth: 2.5,
    inflation: 4.1,
    rates: 4.4,
    commodity: 1.28,
    sentiment: 'Cyclical',
    marketBias: 0.05,
    ratesShock: 0.03,
    commodityShock: 0.14,
    financialStress: 0.01,
  },
]

const EVENT_LIBRARY = [
  {
    title: 'Technology spending accelerates',
    summary: 'Enterprise software and chip demand remain elevated across the market.',
    marketTailwind: 0.03,
    sectorEffects: { Technology: 0.18, Financials: 0.04, Energy: -0.02, Consumer: 0.01 },
  },
  {
    title: 'Oil prices surge',
    summary: 'Energy names benefit while shipping and consumer demand pressure rises.',
    marketTailwind: 0.01,
    sectorEffects: { Technology: -0.01, Financials: -0.03, Energy: 0.16, Consumer: -0.05 },
  },
  {
    title: 'Consumer confidence falls',
    summary: 'Household spending slows and discretionary retailers lose momentum.',
    marketTailwind: -0.02,
    sectorEffects: { Technology: -0.02, Financials: -0.02, Energy: -0.02, Consumer: -0.12 },
  },
  {
    title: 'Bank lending conditions tighten',
    summary: 'Credit standards harden, pressuring financial stocks and deal activity.',
    marketTailwind: -0.03,
    sectorEffects: { Technology: -0.01, Financials: -0.12, Energy: 0.03, Consumer: -0.02 },
  },
  {
    title: 'Strong economic growth surprises markets',
    summary: 'GDP outperformance lifts a broad set of cyclicals and industrial demand.',
    marketTailwind: 0.05,
    sectorEffects: { Technology: 0.08, Financials: 0.06, Energy: 0.06, Consumer: 0.07 },
  },
  {
    title: 'Inflation unexpectedly rises',
    summary: 'Input costs climb and buyers price in tighter margins across sectors.',
    marketTailwind: -0.02,
    sectorEffects: { Technology: -0.04, Financials: -0.01, Energy: 0.08, Consumer: -0.08 },
  },
  {
    title: 'Semiconductor supply chain disruption',
    summary: 'Chip makers and electronics suppliers face temporary capacity constraints.',
    marketTailwind: -0.01,
    sectorEffects: { Technology: -0.09, Financials: 0.02, Energy: 0.01, Consumer: -0.04 },
  },
  {
    title: 'Health and wellness demand rebounds',
    summary: 'Consumer staples and health-linked retail names outperform as spending shifts.',
    marketTailwind: 0.02,
    sectorEffects: { Technology: 0.01, Financials: 0.02, Energy: 0.02, Consumer: 0.12 },
  },
  {
    title: 'Shipping bottlenecks lift logistics costs',
    summary: 'Transport and distribution costs pressure margins across retail and industrial channels.',
    marketTailwind: -0.02,
    sectorEffects: { Technology: -0.05, Financials: -0.03, Energy: 0.02, Consumer: -0.09 },
  },
  {
    title: 'Infrastructure spending expands',
    summary: 'Government programs support utilities, materials, and connected service businesses.',
    marketTailwind: 0.04,
    sectorEffects: { Technology: 0.02, Financials: 0.04, Energy: 0.12, Consumer: 0.04 },
  },
  {
    title: 'Cybersecurity concerns intensify',
    summary: 'Security spending expands as digital protection takes priority for corporates.',
    marketTailwind: 0.02,
    sectorEffects: { Technology: 0.16, Financials: 0.01, Energy: 0.01, Consumer: 0.03 },
  },
  {
    title: 'Regulatory pressure on financials',
    summary: 'Oversight and compliance costs squeeze banks and capital markets businesses.',
    marketTailwind: -0.03,
    sectorEffects: { Technology: 0.02, Financials: -0.14, Energy: 0.03, Consumer: -0.04 },
  },
]

const INITIAL_COMPANIES = [
  {
    ticker: 'NOVA',
    name: 'Nova Systems',
    sector: 'Technology',
    price: 84.4,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'AI infrastructure and enterprise software company building cloud-scale productivity tools.',
    growth: 'High',
    volatility: 'High',
    sensitivity: 'Cloud demand and enterprise AI adoption',
    marketCap: 196000000000,
    revenueGrowth: 21.4,
    earningsGrowth: 28.7,
    operatingMargin: 24.1,
    pe: 38.5,
    debtToEbitda: 0.6,
    roe: 22.8,
    dividendYield: 0,
    beta: 1.42,
  },
  {
    ticker: 'VTX',
    name: 'Vertex Semiconductor',
    sector: 'Technology',
    price: 63.2,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Specialized chip designer serving data-center, automotive, and edge-device markets.',
    growth: 'High',
    volatility: 'High',
    sensitivity: 'Chip cycles and advanced manufacturing capacity',
    marketCap: 148000000000,
    revenueGrowth: 18.2,
    earningsGrowth: 24.3,
    operatingMargin: 22.5,
    pe: 34.2,
    debtToEbitda: 0.8,
    roe: 20.7,
    dividendYield: 0,
    beta: 1.36,
  },
  {
    ticker: 'MRC',
    name: 'Meridian Bank',
    sector: 'Financials',
    price: 44.8,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Regional lender with a focus on digital banking and SME credit relationships.',
    growth: 'Moderate',
    volatility: 'Medium',
    sensitivity: 'Interest spreads and lending conditions',
    marketCap: 92000000000,
    revenueGrowth: 9.1,
    earningsGrowth: 11.4,
    operatingMargin: 31.6,
    pe: 14.2,
    debtToEbitda: 2.4,
    roe: 13.5,
    dividendYield: 1.8,
    beta: 1.08,
  },
  {
    ticker: 'ATC',
    name: 'Atlas Capital',
    sector: 'Financials',
    price: 58.5,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Asset manager and merchant bank covering private credit and alternative investments.',
    growth: 'Moderate',
    volatility: 'Medium',
    sensitivity: 'Market liquidity and fee-generating activity',
    marketCap: 102000000000,
    revenueGrowth: 12.5,
    earningsGrowth: 14.8,
    operatingMargin: 28.9,
    pe: 19.3,
    debtToEbitda: 1.7,
    roe: 16.1,
    dividendYield: 1.5,
    beta: 1.18,
  },
  {
    ticker: 'HLE',
    name: 'Helios Energy',
    sector: 'Energy',
    price: 72.6,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Integrated energy producer focused on efficient extraction and clean-power infrastructure.',
    growth: 'Moderate',
    volatility: 'Medium-High',
    sensitivity: 'Commodity pricing and regulatory shifts',
    marketCap: 132000000000,
    revenueGrowth: 8.9,
    earningsGrowth: 16.2,
    operatingMargin: 18.7,
    pe: 17.3,
    debtToEbitda: 1.9,
    roe: 15.8,
    dividendYield: 2.1,
    beta: 1.28,
  },
  {
    ticker: 'NST',
    name: 'Northstar Resources',
    sector: 'Energy',
    price: 51.9,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Exploration and engineering company with a balanced upstream and midstream portfolio.',
    growth: 'Moderate',
    volatility: 'High',
    sensitivity: 'Oil and gas pricing and production costs',
    marketCap: 87000000000,
    revenueGrowth: 7.2,
    earningsGrowth: 12.1,
    operatingMargin: 16.9,
    pe: 15.8,
    debtToEbitda: 2.7,
    roe: 14.4,
    dividendYield: 1.4,
    beta: 1.34,
  },
  {
    ticker: 'AUR',
    name: 'Aurora Retail',
    sector: 'Consumer',
    price: 39.7,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Consumer discretionary retailer emphasizing brand partnerships and omnichannel retail.',
    growth: 'Moderate',
    volatility: 'Medium',
    sensitivity: 'Household spending and consumer sentiment',
    marketCap: 74000000000,
    revenueGrowth: 6.8,
    earningsGrowth: 9.4,
    operatingMargin: 11.2,
    pe: 21.8,
    debtToEbitda: 1.4,
    roe: 17.6,
    dividendYield: 0.9,
    beta: 1.02,
  },
  {
    ticker: 'SUM',
    name: 'Summit Foods',
    sector: 'Consumer',
    price: 48.1,
    longShares: 0,
    shortShares: 0,
    longCostBasis: 0,
    shortCostBasis: 0,
    description: 'Packaged food producer with a portfolio of branded convenience products and private-label lines.',
    growth: 'Stable',
    volatility: 'Low-Medium',
    sensitivity: 'Pricing power and grocery demand',
    marketCap: 68000000000,
    revenueGrowth: 4.7,
    earningsGrowth: 7.9,
    operatingMargin: 13.4,
    pe: 18.1,
    debtToEbitda: 1.2,
    roe: 18.9,
    dividendYield: 1.7,
    beta: 0.81,
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const randomBetween = (min, max) => min + Math.random() * (max - min)
const pickRandom = (items) => items[Math.floor(Math.random() * items.length)]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

const formatPercent = (value, digits = 1) => `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`

const formatSignedCurrency = (value) =>
  `${value >= 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`

function App() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [cash, setCash] = useState(STARTING_CAPITAL)
  const [quarter, setQuarter] = useState(1)
  const [benchmarkIndex, setBenchmarkIndex] = useState(100)
  const [macroState, setMacroState] = useState(REGIME_LIBRARY[0])
  const [lastEvent, setLastEvent] = useState({
    title: 'Quarterly briefing ready',
    summary: 'The market is stable and the fund can deploy capital prudently.',
  })
  const [eventLog, setEventLog] = useState([])
  const [selectedTicker, setSelectedTicker] = useState('NOVA')
  const [tradeMode, setTradeMode] = useState('buy')
  const [tradeType, setTradeType] = useState('amount')
  const [tradeValue, setTradeValue] = useState('1000000')
  const [tradeError, setTradeError] = useState('')

  const selectedCompany =
    companies.find((company) => company.ticker === selectedTicker) ?? companies[0]

  const totalLongValue = useMemo(
    () => companies.reduce((sum, company) => sum + company.longShares * company.price, 0),
    [companies],
  )

  const totalShortValue = useMemo(
    () => companies.reduce((sum, company) => sum + company.shortShares * company.price, 0),
    [companies],
  )

  const aum = cash + totalLongValue - totalShortValue

  const portfolioReturn = Number((((aum - STARTING_CAPITAL) / STARTING_CAPITAL) * 100).toFixed(2))
  const benchmarkReturn = Number((((benchmarkIndex - 100) / 100) * 100).toFixed(2))
  const alpha = Number((portfolioReturn - benchmarkReturn).toFixed(2))

  const longExposurePct = aum > 0 ? (totalLongValue / aum) * 100 : 0
  const shortExposurePct = aum > 0 ? (totalShortValue / aum) * 100 : 0
  const grossExposurePct = longExposurePct + shortExposurePct
  const netExposurePct = longExposurePct - shortExposurePct

  const portfolioRows = useMemo(
    () =>
      companies.map((company) => {
        const longValue = company.longShares * company.price
        const shortValue = company.shortShares * company.price
        const netValue = longValue - shortValue
        const longPnl = longValue - company.longCostBasis
        const shortPnl = company.shortCostBasis - shortValue
        const totalPnl = longPnl + shortPnl
        const weight = aum > 0 ? (netValue / aum) * 100 : 0

        return {
          ...company,
          longValue,
          shortValue,
          netValue,
          weight,
          totalPnl,
          longPnl,
          shortPnl,
        }
      }),
    [companies, aum],
  )

  const largestWeight = useMemo(
    () => Math.max(...portfolioRows.map((company) => company.weight), 0),
    [portfolioRows],
  )

  const sectorBreakdown = useMemo(() => {
    const sectorMap = {}

    portfolioRows.forEach((company) => {
      const sector = company.sector
      if (!sectorMap[sector]) {
        sectorMap[sector] = { sector, long: 0, short: 0 }
      }

      sectorMap[sector].long += company.longValue
      sectorMap[sector].short += company.shortValue
    })

    return Object.values(sectorMap).map((sector) => {
      const longPercent = aum > 0 ? (sector.long / aum) * 100 : 0
      const shortPercent = aum > 0 ? (sector.short / aum) * 100 : 0
      const netPercent = longPercent - shortPercent

      return {
        ...sector,
        longPercent,
        shortPercent,
        netPercent,
      }
    })
  }, [aum, portfolioRows])

  const fundScore = useMemo(() => {
    const cashRatio = (cash / STARTING_CAPITAL) * 100
    const diversification = sectorBreakdown.length * 6
    const score =
      50 +
      portfolioReturn * 1.1 +
      alpha * 2.4 +
      cashRatio * 0.3 +
      diversification -
      largestWeight * 0.7 -
      Math.abs(netExposurePct - 35) * 0.2

    return clamp(Math.round(score), 0, 100)
  }, [alpha, cash, largestWeight, netExposurePct, portfolioReturn, sectorBreakdown])

  const tradeShares =
    tradeType === 'shares'
      ? Number(tradeValue)
      : Number((Number(tradeValue) / selectedCompany.price).toFixed(4))

  const tradeAmount =
    tradeType === 'amount' ? Number(tradeValue) : Number((tradeShares * selectedCompany.price).toFixed(2))

  const executeTrade = () => {
    const requestedValue = Number(tradeValue)

    if (!Number.isFinite(requestedValue) || requestedValue <= 0) {
      setTradeError('Enter a positive trade amount before placing the order.')
      return
    }

    if (tradeMode === 'buy') {
      if (selectedCompany.shortShares > 0) {
        setTradeError('Cover the current short before establishing a long position in this stock.')
        return
      }

      if (tradeAmount > cash) {
        setTradeError(`Not enough cash. Maximum buy size is ${formatCurrency(cash)}.`)
        return
      }

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) => {
          if (company.ticker !== selectedTicker) return company

          const nextLongShares = company.longShares + tradeShares
          const nextLongCostBasis = company.longCostBasis + tradeAmount

          return {
            ...company,
            longShares: Number(nextLongShares.toFixed(4)),
            longCostBasis: Number(nextLongCostBasis.toFixed(2)),
          }
        }),
      )

      setCash((currentCash) => Number((currentCash - tradeAmount).toFixed(2)))
      setTradeError('')
      return
    }

    if (tradeMode === 'sell') {
      if (tradeShares > selectedCompany.longShares) {
        setTradeError(`You only own ${selectedCompany.longShares.toFixed(2)} long shares of ${selectedCompany.ticker}.`)
        return
      }

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) => {
          if (company.ticker !== selectedTicker) return company

          const remainingShares = company.longShares - tradeShares
          const remainingBasis =
            company.longShares > 0
              ? Number((company.longCostBasis * (remainingShares / company.longShares)).toFixed(2))
              : 0

          return {
            ...company,
            longShares: Number(Math.max(remainingShares, 0).toFixed(4)),
            longCostBasis: Number(remainingBasis.toFixed(2)),
          }
        }),
      )

      setCash((currentCash) => Number((currentCash + tradeAmount).toFixed(2)))
      setTradeError('')
      return
    }

    if (tradeMode === 'short') {
      if (selectedCompany.longShares > 0) {
        setTradeError('Sell the existing long position before opening a short in this stock.')
        return
      }

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) => {
          if (company.ticker !== selectedTicker) return company

          const nextShortShares = company.shortShares + tradeShares
          const nextShortCostBasis = company.shortCostBasis + tradeAmount

          return {
            ...company,
            shortShares: Number(nextShortShares.toFixed(4)),
            shortCostBasis: Number(nextShortCostBasis.toFixed(2)),
          }
        }),
      )

      setCash((currentCash) => Number((currentCash + tradeAmount).toFixed(2)))
      setTradeError('')
      return
    }

    if (tradeMode === 'cover') {
      if (tradeShares > selectedCompany.shortShares) {
        setTradeError(`You are short ${selectedCompany.shortShares.toFixed(2)} shares of ${selectedCompany.ticker}.`)
        return
      }

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) => {
          if (company.ticker !== selectedTicker) return company

          const remainingShortShares = company.shortShares - tradeShares
          const remainingShortBasis =
            company.shortShares > 0
              ? Number((company.shortCostBasis * (remainingShortShares / company.shortShares)).toFixed(2))
              : 0

          return {
            ...company,
            shortShares: Number(Math.max(remainingShortShares, 0).toFixed(4)),
            shortCostBasis: Number(remainingShortBasis.toFixed(2)),
          }
        }),
      )

      setCash((currentCash) => Number((currentCash - tradeAmount).toFixed(2)))
      setTradeError('')
    }
  }

  const advanceQuarter = () => {
    if (quarter >= TOTAL_QUARTERS) return

    const regime = pickRandom(REGIME_LIBRARY)
    const event = Math.random() < 0.7 ? pickRandom(EVENT_LIBRARY) : null
    const marketMove = randomBetween(-0.08, 0.12)

    const nextCompanies = companies.map((company) => {
      const sectorDrift =
        randomBetween(-0.06, 0.09) *
        (company.sector === 'Technology' ? 1.15 : company.sector === 'Financials' ? 0.9 : company.sector === 'Energy' ? 1.2 : 0.72)

      const betaImpact = marketMove * (company.beta - 0.9) * 0.9
      const valuationPressure = regime.ratesShock * (company.pe > 30 ? 0.75 : 0.2)
      const commodityImpact =
        company.sector === 'Energy'
          ? regime.commodityShock * 1.4
          : company.sector === 'Consumer'
            ? regime.commodityShock * -0.35
            : 0
      const leverageImpact = company.debtToEbitda > 2.4 ? regime.financialStress * 0.7 : 0
      const companySpecific = randomBetween(-0.1, 0.1) * (company.volatility === 'High' ? 1.4 : company.volatility === 'Medium-High' ? 1.2 : 0.75)
      const eventImpact = event ? event.sectorEffects[company.sector] ?? 0 : 0
      const totalReturn =
        marketMove * 0.42 +
        sectorDrift +
        betaImpact +
        valuationPressure +
        commodityImpact +
        leverageImpact +
        companySpecific +
        eventImpact +
        regime.marketBias * 0.45

      const nextPrice = Math.max(10, company.price * (1 + clamp(totalReturn, -0.24, 0.24)))

      return {
        ...company,
        price: Number(nextPrice.toFixed(2)),
      }
    })

    const benchmarkMove =
      marketMove * 0.7 +
      regime.marketBias * 0.7 +
      randomBetween(-0.02, 0.05) +
      (event ? event.marketTailwind : 0)

    const nextIndex = benchmarkIndex * (1 + benchmarkMove)
    const marketNarrative =
      event ?? {
        title: 'Quiet trading quarter',
        summary: 'No major macro event, and markets move in line with the broad risk environment.',
      }

    setCompanies(nextCompanies)
    setBenchmarkIndex(Number(nextIndex.toFixed(2)))
    setMacroState(regime)
    setLastEvent(marketNarrative)
    setEventLog((currentLog) => [{ quarter, ...marketNarrative }, ...currentLog].slice(0, 5))
    setQuarter((currentQuarter) => currentQuarter + 1)
    setTradeError('')
  }

  const portfolioSnapshot = portfolioRows.map((company) => ({
    ...company,
    longPnl: company.longPnl,
    shortPnl: company.shortPnl,
    totalPnl: company.totalPnl,
  }))

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PORTFOLIO MANAGEMENT SIMULATOR</p>
          <h1>Raja Equities LLC</h1>
        </div>
        <div className="quarter-pill">Quarter {Math.min(quarter, TOTAL_QUARTERS)} / {TOTAL_QUARTERS}</div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card primary">
          <span>AUM</span>
          <strong>{formatCurrency(aum)}</strong>
        </div>
        <div className="metric-card">
          <span>Portfolio Return</span>
          <strong>{formatPercent(portfolioReturn)}</strong>
        </div>
        <div className="metric-card">
          <span>Benchmark Return</span>
          <strong>{formatPercent(benchmarkReturn)}</strong>
        </div>
        <div className="metric-card">
          <span>Alpha</span>
          <strong>{formatPercent(alpha)}</strong>
        </div>
        <div className="metric-card">
          <span>Cash</span>
          <strong>{formatCurrency(cash)}</strong>
        </div>
        <div className="metric-card">
          <span>Gross Exposure</span>
          <strong>{grossExposurePct.toFixed(1)}%</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel macro-panel">
          <div className="panel-header">
            <h2>Macro Dashboard</h2>
            <span className="tag">{macroState.name}</span>
          </div>
          <p>{macroState.summary}</p>
          <div className="macro-grid">
            <div>
              <label>Growth</label>
              <strong>{macroState.growth.toFixed(1)}%</strong>
            </div>
            <div>
              <label>Inflation</label>
              <strong>{macroState.inflation.toFixed(1)}%</strong>
            </div>
            <div>
              <label>Rates</label>
              <strong>{macroState.rates.toFixed(1)}%</strong>
            </div>
            <div>
              <label>Commodities</label>
              <strong>{macroState.commodity.toFixed(2)}x</strong>
            </div>
          </div>
        </div>

        <div className="panel exposure-panel">
          <div className="panel-header">
            <h2>Exposure</h2>
          </div>
          <div className="exposure-row">
            <div>
              <span>Long</span>
              <strong>{longExposurePct.toFixed(1)}%</strong>
              <small>Directional equity exposure</small>
            </div>
            <div>
              <span>Short</span>
              <strong>{shortExposurePct.toFixed(1)}%</strong>
              <small>Hedging and tactical shorts</small>
            </div>
            <div>
              <span>Gross</span>
              <strong>{grossExposurePct.toFixed(1)}%</strong>
              <small>Long + short positions</small>
            </div>
            <div>
              <span>Net</span>
              <strong>{netExposurePct.toFixed(1)}%</strong>
              <small>Directional bias</small>
            </div>
          </div>
        </div>
      </section>

      <section className="summary-row">
        <div className="panel market-panel">
          <div className="panel-header">
            <h2>Market Briefing</h2>
            <span className="tag">{lastEvent.title}</span>
          </div>
          <p>{lastEvent.summary}</p>
          <div className="briefing-grid">
            <div>
              <label>Benchmark Index</label>
              <strong>{benchmarkIndex.toFixed(2)}</strong>
            </div>
            <div>
              <label>Fund Score</label>
              <strong>{fundScore}/100</strong>
            </div>
            <div>
              <label>Cash Buffer</label>
              <strong>{formatPercent((cash / STARTING_CAPITAL) * 100)}</strong>
            </div>
            <div>
              <label>Concentration</label>
              <strong>{Math.max(...portfolioRows.map((company) => company.weight), 0).toFixed(1)}%</strong>
            </div>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={advanceQuarter}
            disabled={quarter >= TOTAL_QUARTERS}
          >
            {quarter >= TOTAL_QUARTERS ? 'Simulation Complete' : 'ADVANCE QUARTER'}
          </button>
        </div>

        <div className="panel event-panel">
          <div className="panel-header">
            <h2>Recent Market Events</h2>
          </div>
          <ul className="event-list">
            {eventLog.length === 0 ? (
              <li>Quarterly conditions remain calm and non-eventful.</li>
            ) : (
              eventLog.map((event, index) => (
                <li key={`${event.title}-${index}`}>
                  <strong>Q{event.quarter || index + 1}</strong>
                  <span>{event.title}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="sector-section panel">
        <div className="panel-header">
          <h2>Sector Exposure</h2>
        </div>
        <div className="sector-list">
          {sectorBreakdown.map((sector) => (
            <div className="sector-row" key={sector.sector}>
              <div className="sector-name-row">
                <span>{sector.sector}</span>
                <strong>{sector.netPercent.toFixed(1)}%</strong>
              </div>
              <div className="bar-stack">
                <div className="bar long" style={{ width: `${Math.min(sector.longPercent, 70)}%` }} />
                <div className="bar short" style={{ width: `${Math.min(sector.shortPercent, 60)}%` }} />
              </div>
              <div className="sector-values">
                <span>Long {sector.longPercent.toFixed(1)}%</span>
                <span>Short {sector.shortPercent.toFixed(1)}%</span>
                <span>Net {sector.netPercent.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="portfolio-grid">
        <div className="panel portfolio-panel">
          <div className="panel-header">
            <h2>Portfolio</h2>
          </div>

          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Sector</th>
                <th>Price</th>
                <th>Long</th>
                <th>Short</th>
                <th>Net</th>
                <th>Weight</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolioSnapshot.map((company) => (
                <tr
                  key={company.ticker}
                  className={company.ticker === selectedTicker ? 'selected' : ''}
                  onClick={() => setSelectedTicker(company.ticker)}
                >
                  <td>{company.ticker}</td>
                  <td>{company.name}</td>
                  <td>{company.sector}</td>
                  <td>{formatCurrency(company.price)}</td>
                  <td>{company.longValue > 0 ? formatCurrency(company.longValue) : '$0.00'}</td>
                  <td>{company.shortValue > 0 ? formatCurrency(company.shortValue) : '$0.00'}</td>
                  <td>{formatCurrency(company.netValue)}</td>
                  <td>{company.weight.toFixed(1)}%</td>
                  <td className={company.totalPnl >= 0 ? 'positive' : 'negative'}>
                    {formatSignedCurrency(company.totalPnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="panel trade-panel">
          <div className="panel-header">
            <h2>Trade {selectedCompany.ticker}</h2>
          </div>

          <div className="company-summary">
            <div>
              <strong>{selectedCompany.name}</strong>
              <span>{selectedCompany.sector}</span>
            </div>
            <div className="company-price">{formatCurrency(selectedCompany.price)}</div>
          </div>

          <div className="trade-steps">
            <div className="toggle-row">
              <button
                type="button"
                className={tradeMode === 'buy' ? 'active' : ''}
                onClick={() => setTradeMode('buy')}
              >
                BUY
              </button>
              <button
                type="button"
                className={tradeMode === 'sell' ? 'active' : ''}
                onClick={() => setTradeMode('sell')}
              >
                SELL
              </button>
              <button
                type="button"
                className={tradeMode === 'short' ? 'active' : ''}
                onClick={() => setTradeMode('short')}
              >
                SHORT
              </button>
              <button
                type="button"
                className={tradeMode === 'cover' ? 'active' : ''}
                onClick={() => setTradeMode('cover')}
              >
                COVER
              </button>
            </div>

            <div className="toggle-row small">
              <button
                type="button"
                className={tradeType === 'amount' ? 'active' : ''}
                onClick={() => setTradeType('amount')}
              >
                Dollar Amount
              </button>
              <button
                type="button"
                className={tradeType === 'shares' ? 'active' : ''}
                onClick={() => setTradeType('shares')}
              >
                Shares
              </button>
            </div>
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
            onChange={(event) => setTradeValue(event.target.value)}
          />

          <div className="trade-stats">
            <div>
              <span>Price</span>
              <strong>{formatCurrency(selectedCompany.price)}</strong>
            </div>
            <div>
              <span>Long</span>
              <strong>{selectedCompany.longShares.toFixed(2)} sh</strong>
            </div>
            <div>
              <span>Short</span>
              <strong>{selectedCompany.shortShares.toFixed(2)} sh</strong>
            </div>
            <div>
              <span>Net</span>
              <strong>{(selectedCompany.longShares - selectedCompany.shortShares).toFixed(2)} sh</strong>
            </div>
            <div>
              <span>{tradeType === 'amount' ? 'Shares' : 'Dollar Value'}</span>
              <strong>
                {tradeType === 'amount'
                  ? tradeShares.toFixed(2)
                  : formatCurrency(tradeAmount)}
              </strong>
            </div>
            <div>
              <span>Direction</span>
              <strong>{tradeMode.toUpperCase()}</strong>
            </div>
          </div>

          <button className="primary-button full" type="button" onClick={executeTrade}>
            {tradeMode === 'buy' ? 'BUY' : tradeMode === 'sell' ? 'SELL' : tradeMode === 'short' ? 'SHORT' : 'COVER'} {selectedCompany.ticker}
          </button>

          {tradeError ? <p className="error-message">{tradeError}</p> : null}

          <div className="company-meta">
            <p>{selectedCompany.description}</p>
            <ul>
              <li>
                <span>Market Cap</span>
                <strong>{formatCurrency(selectedCompany.marketCap)}</strong>
              </li>
              <li>
                <span>Revenue Growth</span>
                <strong>{selectedCompany.revenueGrowth}%</strong>
              </li>
              <li>
                <span>EPS Growth</span>
                <strong>{selectedCompany.earningsGrowth}%</strong>
              </li>
              <li>
                <span>Operating Margin</span>
                <strong>{selectedCompany.operatingMargin}%</strong>
              </li>
              <li>
                <span>P/E</span>
                <strong>{selectedCompany.pe.toFixed(1)}x</strong>
              </li>
              <li>
                <span>Debt/EBITDA</span>
                <strong>{selectedCompany.debtToEbitda.toFixed(1)}x</strong>
              </li>
              <li>
                <span>ROE</span>
                <strong>{selectedCompany.roe}%</strong>
              </li>
              <li>
                <span>Dividend</span>
                <strong>{selectedCompany.dividendYield.toFixed(1)}%</strong>
              </li>
              <li>
                <span>Beta</span>
                <strong>{selectedCompany.beta.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default App
