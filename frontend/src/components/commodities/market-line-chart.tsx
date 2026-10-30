'use client'

import * as React from 'react'

export interface MarketPricePoint {
  date: string
  timestamp: number
  price: number
}

interface MarketLineChartProps {
  points: MarketPricePoint[]
  label: string
  intraday?: boolean
}

const formatPrice = (value: number) => Math.round(value).toLocaleString('vi-VN')
const formatDate = (value: number, intraday: boolean) =>
  new Date(value).toLocaleString(
    'vi-VN',
    intraday
      ? { hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: '2-digit' }
  )

export function MarketLineChart({
  points,
  label,
  intraday = false,
}: MarketLineChartProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(780)
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const resize = () => setWidth(Math.max(host.clientWidth, 320))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  if (!points.length) return null

  const height = 340
  const left = 20
  const right = 76
  const top = 24
  const bottom = 37
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const prices = points.map((point) => point.price)
  const minimum = Math.min(...prices)
  const maximum = Math.max(...prices)
  const padding = Math.max((maximum - minimum) * 0.12, maximum * 0.006, 100)
  const low = Math.max(0, minimum - padding)
  const high = maximum + padding
  const start = points[0].timestamp
  const end = points[points.length - 1].timestamp
  const x = (timestamp: number) =>
    left +
    (end === start
      ? plotWidth / 2
      : ((timestamp - start) / (end - start)) * plotWidth)
  const y = (price: number) =>
    top + ((high - price) / (high - low)) * plotHeight
  const latest = points[points.length - 1]
  const latestX = x(latest.timestamp)
  const latestY = y(latest.price)
  const hovered = hoverIndex === null ? null : points[hoverIndex]
  const hoverX = hovered ? x(hovered.timestamp) : 0
  const hoverY = hovered ? y(hovered.price) : 0
  const ticks = Array.from(
    { length: 5 },
    (_, index) => high - ((high - low) * index) / 4
  )
  const timeTicks =
    end === start
      ? [start]
      : Array.from(
          { length: 6 },
          (_, index) => start + ((end - start) * index) / 5
        )
  const finalColor =
    points.length > 1 && latest.price < points[points.length - 2].price
      ? '#fb817e'
      : '#56d99a'

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    let nearest = 0
    for (let index = 1; index < points.length; index++) {
      if (
        Math.abs(x(points[index].timestamp) - pointerX) <
        Math.abs(x(points[nearest].timestamp) - pointerX)
      )
        nearest = index
    }
    setHoverIndex(nearest)
  }

  return (
    <div
      ref={hostRef}
      className="relative h-[340px] w-full select-none"
      role="img"
      aria-label={`${label}: ${points.length} mốc giá đã ghi nhận, từ ${formatPrice(points[0].price)} đến ${formatPrice(latest.price)} đồng một kg`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full touch-pan-y"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={left}
              y1={y(tick)}
              x2={width - right + 8}
              y2={y(tick)}
              stroke="#34463d"
              strokeWidth="1"
              strokeDasharray={index === 4 ? undefined : '3 5'}
            />
            <text
              x={width - right + 17}
              y={y(tick) + 4}
              fill="#a9b9ae"
              fontSize="11"
            >{`${Math.round(tick / 1000)}k`}</text>
          </g>
        ))}
        {timeTicks.map((tick, index) => (
          <text
            key={index}
            x={x(tick)}
            y={height - 10}
            textAnchor={
              index === 0
                ? 'start'
                : index === timeTicks.length - 1
                  ? 'end'
                  : 'middle'
            }
            fill="#a9b9ae"
            fontSize="11"
          >
            {formatDate(tick, intraday)}
          </text>
        ))}
        <line
          x1={left}
          x2={width - right + 8}
          y1={latestY}
          y2={latestY}
          stroke={finalColor}
          strokeWidth="1"
          strokeDasharray="4 5"
          opacity="0.7"
        />
        {points.slice(1).map((point, index) => {
          const previous = points[index]
          const color =
            point.price > previous.price
              ? '#56d99a'
              : point.price < previous.price
                ? '#fb817e'
                : '#8ca99a'
          return (
            <line
              key={`${point.timestamp}-${index}`}
              x1={x(previous.timestamp)}
              y1={y(previous.price)}
              x2={x(point.timestamp)}
              y2={y(point.price)}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          )
        })}
        <circle
          cx={latestX}
          cy={latestY}
          r="6"
          fill={finalColor}
          stroke="#102017"
          strokeWidth="2"
        />
        <rect
          x={width - right + 9}
          y={latestY - 13}
          width={65}
          height={26}
          rx={5}
          fill={finalColor}
        />
        <text
          x={width - right + 41}
          y={latestY + 4}
          fill="#102017"
          textAnchor="middle"
          fontWeight="700"
          fontSize="11"
        >
          {formatPrice(latest.price)}
        </text>
        {hovered && (
          <>
            <line
              x1={hoverX}
              x2={hoverX}
              y1={top}
              y2={height - bottom}
              stroke="#c2d8c8"
              strokeDasharray="4 4"
              opacity="0.75"
            />
            <circle
              cx={hoverX}
              cy={hoverY}
              r="5"
              fill="#f4fbf5"
              stroke="#102017"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-md border border-[#45584b] bg-[#1d2b22] px-3 py-2 text-xs text-[#eef6ef] shadow-xl"
          style={{
            left: Math.min(Math.max(hoverX - 82, 6), Math.max(width - 172, 6)),
          }}
        >
          <span className="block text-[#b6c7b9]">
            {new Date(hovered.timestamp).toLocaleString('vi-VN')}
          </span>
          <strong className="mt-0.5 block text-sm tabular-nums">
            {formatPrice(hovered.price)} đ/kg
          </strong>
        </div>
      )}
    </div>
  )
}
