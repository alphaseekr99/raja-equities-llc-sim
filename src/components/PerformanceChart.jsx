import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const formatSignedPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

const PerformanceTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  const point = payload[0].payload
  const fundReturn = point.fundReturn ?? point.fundIndex - 100
  const benchmarkReturn = point.benchmarkReturn ?? point.benchmarkIndex - 100
  const alpha = point.alpha ?? fundReturn - benchmarkReturn

  return (
    <div className="performance-tooltip">
      <strong>{label}</strong>
      <div>
        <span>Raja Equities</span>
        <b>{point.fundIndex.toFixed(1)}</b>
      </div>
      <div>
        <span>Return</span>
        <b className={fundReturn >= 0 ? 'positive' : 'negative'}>{formatSignedPercent(fundReturn)}</b>
      </div>
      <div className="performance-tooltip-separator">
        <span>Benchmark</span>
        <b>{point.benchmarkIndex.toFixed(1)}</b>
      </div>
      <div>
        <span>Return</span>
        <b>{formatSignedPercent(benchmarkReturn)}</b>
      </div>
      <div className="performance-tooltip-alpha">
        <span>Alpha</span>
        <b className={alpha >= 0 ? 'positive' : 'negative'}>
          {formatSignedPercent(alpha)}
        </b>
      </div>
    </div>
  )
}

function PerformanceChart({ data, fundReturn, benchmarkReturn, alpha }) {
  const [selectedPoint, setSelectedPoint] = useState(null)
  const indexes = data.flatMap((point) => [point.fundIndex, point.benchmarkIndex])
  const minimum = Math.min(...indexes)
  const maximum = Math.max(...indexes)
  const padding = Math.max((maximum - minimum) * 0.18, 1)
  const selected = data.find((point) => point.label === selectedPoint)

  const selectChartPoint = (chartState) => {
    if (chartState?.activeLabel) setSelectedPoint(chartState.activeLabel)
  }

  return (
    <section className="panel performance-panel" aria-label="Fund performance versus benchmark">
      <div className="performance-heading">
        <div>
          <h2>Performance</h2>
          <p>Fund vs Benchmark</p>
        </div>
        <div className="performance-legend" aria-label="Chart legend">
          <span><i className="legend-fund" />Raja Equities</span>
          <span><i className="legend-benchmark" />Benchmark Index</span>
        </div>
      </div>

      <div className="performance-summary">
        <div className="performance-summary-fund">
          <span>Raja Equities</span>
          <strong className={fundReturn >= 0 ? 'positive' : 'negative'}>
            {formatSignedPercent(fundReturn)}
          </strong>
        </div>
        <div className="performance-summary-benchmark">
          <span>Benchmark</span>
          <strong>{formatSignedPercent(benchmarkReturn)}</strong>
        </div>
        <div className="performance-summary-alpha">
          <span>Alpha</span>
          <strong className={alpha >= 0 ? 'positive' : 'negative'}>{formatSignedPercent(alpha)}</strong>
        </div>
      </div>

      <div className="performance-chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 12, bottom: 2, left: 4 }}
            onClick={selectChartPoint}
          >
            <CartesianGrid stroke="rgba(151, 171, 199, 0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              interval={0}
              tick={{ fill: '#91a6c4', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(151, 171, 199, 0.2)' }}
              tickMargin={9}
              minTickGap={0}
            />
            <YAxis
              domain={[Math.floor(minimum - padding), Math.ceil(maximum + padding)]}
              tickCount={5}
              tick={{ fill: '#91a6c4', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={28}
              tickFormatter={(value) => Number(value).toFixed(0)}
              label={{
                value: 'Performance Index',
                angle: -90,
                position: 'insideLeft',
                fill: '#91a6c4',
                fontSize: 10,
                offset: 2,
              }}
            />
            <Tooltip
              content={<PerformanceTooltip />}
              cursor={{ stroke: 'rgba(151, 171, 199, 0.25)', strokeDasharray: '3 3' }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="benchmarkIndex"
              name="Benchmark Index"
              stroke="#8998ad"
              strokeWidth={1.7}
              dot={{ r: 2, fill: '#8998ad', strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#aab7c9', stroke: '#101b2a', strokeWidth: 2 }}
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey="fundIndex"
              name="Raja Equities"
              stroke="#69c4e8"
              strokeWidth={2.6}
              dot={{ r: 2.5, fill: '#69c4e8', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#69c4e8', stroke: '#101b2a', strokeWidth: 2 }}
              animationDuration={400}
            />
            {data.length === 1 ? (
              <>
                <ReferenceDot x="START" y={data[0].benchmarkIndex} r={4} fill="#8998ad" stroke="#101b2a" />
                <ReferenceDot x="START" y={data[0].fundIndex} r={2.5} fill="#69c4e8" stroke="#101b2a" />
              </>
            ) : null}
          </LineChart>
        </ResponsiveContainer>
        {selected ? (
          <div className="performance-touch-tooltip" role="status">
            <button type="button" aria-label="Close chart details" onClick={() => setSelectedPoint(null)}>
              ×
            </button>
            <PerformanceTooltip active payload={[{ payload: selected }]} label={selected.label} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PerformanceChart
