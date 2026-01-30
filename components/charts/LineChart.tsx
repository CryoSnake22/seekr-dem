'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { scaleLinear, scaleTime } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'

export interface ChartDataPoint {
  date: string | Date
  [key: string]: string | number | Date | undefined
}

export interface LineConfig {
  dataKey: string
  stroke: string
  strokeWidth?: number
}

export interface ReferenceLineConfig {
  y: number
  stroke: string
  strokeDasharray?: string
  strokeOpacity?: number
}

interface LineChartProps {
  data: ChartDataPoint[]
  lines: LineConfig[]
  referenceLines?: ReferenceLineConfig[]
  xAxisFormatter?: (value: Date) => string
  yAxisFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
  tooltipLabelFormatter?: (value: Date) => string
  yDomain?: [number, number]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  yAxisLabel?: string
}

export function LineChart({
  data,
  lines,
  referenceLines = [],
  xAxisFormatter = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  yAxisFormatter = (v) => `${v}%`,
  tooltipFormatter = (v, n) => [`${v.toFixed(1)}%`, n],
  tooltipLabelFormatter = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  yDomain = [0, 100],
  height = 320,
  showGrid = true,
  showLegend = true,
  yAxisLabel,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: ChartDataPoint; index: number } | null>(null)

  // Update width on resize
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(containerRef.current)
    setContainerWidth(containerRef.current.offsetWidth)

    return () => observer.disconnect()
  }, [])

  const margin = { top: 20, right: 20, bottom: 40, left: 60 }
  const width = containerWidth || 800
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Parse dates and prepare data
  const parsedData = useMemo((): ChartDataPoint[] => {
    return data.map(d => ({
      ...d,
      date: typeof d.date === 'string' ? new Date(d.date) : d.date,
    } as ChartDataPoint))
  }, [data])

  // Scales
  const xScale = useMemo(() => {
    const dates = parsedData.map(d => d.date as Date)
    return scaleTime()
      .domain([Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))])
      .range([0, innerWidth])
  }, [parsedData, innerWidth])

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain(yDomain)
      .range([innerHeight, 0])
      .nice()
  }, [yDomain, innerHeight])

  // Line generators
  const lineGenerators = useMemo(() => {
    return lines.map(lineConfig => ({
      config: lineConfig,
      generator: line<ChartDataPoint>()
        .defined(d => d[lineConfig.dataKey] !== undefined && d[lineConfig.dataKey] !== null)
        .x(d => xScale(d.date as Date))
        .y(d => yScale(Number(d[lineConfig.dataKey])))
        .curve(curveMonotoneX),
    }))
  }, [lines, xScale, yScale])

  // Grid lines
  const gridLines = useMemo(() => {
    const yTicks = yScale.ticks(5)
    const xTicks = xScale.ticks(6)
    return { yTicks, xTicks }
  }, [xScale, yScale])

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left - margin.left
    const mouseY = e.clientY - rect.top - margin.top

    if (mouseX < 0 || mouseX > innerWidth || mouseY < 0 || mouseY > innerHeight) {
      setHoveredPoint(null)
      return
    }

    // Find closest data point
    const mouseDate = xScale.invert(mouseX)
    const bisectDate = (arr: ChartDataPoint[], date: Date) => {
      let left = 0
      let right = arr.length - 1
      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const midDate = arr[mid].date as Date
        if (midDate.getTime() === date.getTime()) return mid
        if (midDate.getTime() < date.getTime()) left = mid + 1
        else right = mid - 1
      }
      return Math.max(0, Math.min(arr.length - 1, left))
    }

    const index = bisectDate(parsedData, mouseDate)
    const point = parsedData[index]
    if (point) {
      setHoveredPoint({
        x: xScale(point.date as Date),
        y: mouseY,
        data: point,
        index,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <g className="grid" opacity={0.1}>
              {gridLines.yTicks.map((tick, i) => (
                <line
                  key={`y-${i}`}
                  x1={0}
                  x2={innerWidth}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                />
              ))}
              {gridLines.xTicks.map((tick, i) => (
                <line
                  key={`x-${i}`}
                  x1={xScale(tick)}
                  x2={xScale(tick)}
                  y1={0}
                  y2={innerHeight}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                />
              ))}
            </g>
          )}

          {/* Reference lines */}
          {referenceLines.map((refLine, i) => (
            <line
              key={`ref-${i}`}
              x1={0}
              x2={innerWidth}
              y1={yScale(refLine.y)}
              y2={yScale(refLine.y)}
              stroke={refLine.stroke}
              strokeDasharray={refLine.strokeDasharray || '3 3'}
              strokeOpacity={refLine.strokeOpacity || 0.3}
            />
          ))}

          {/* Lines */}
          {lineGenerators.map(({ config, generator }) => {
            const pathData = generator(parsedData)
            return pathData ? (
              <path
                key={config.dataKey}
                d={pathData}
                fill="none"
                stroke={config.stroke}
                strokeWidth={config.strokeWidth || 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
          })}

          {/* Data points */}
          {lineGenerators.map(({ config }) => (
            <g key={`${config.dataKey}-dots`}>
              {parsedData.map((d, i) => {
                const value = d[config.dataKey]
                if (value === undefined || value === null) return null
                return (
                  <circle
                    key={i}
                    cx={xScale(d.date as Date)}
                    cy={yScale(Number(value))}
                    r={hoveredPoint?.index === i ? 6 : 4}
                    fill={config.stroke}
                    stroke="white"
                    strokeWidth={hoveredPoint?.index === i ? 2 : 0}
                  />
                )
              })}
            </g>
          ))}

          {/* X Axis */}
          <g transform={`translate(0,${innerHeight})`}>
            <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="#9CA3AF" />
            {xScale.ticks(6).map((tick, i) => (
              <g key={i} transform={`translate(${xScale(tick)},0)`}>
                <line y1={0} y2={6} stroke="#9CA3AF" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#9CA3AF"
                  fontSize="12"
                >
                  {xAxisFormatter(tick)}
                </text>
              </g>
            ))}
          </g>

          {/* Y Axis */}
          <g>
            <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#9CA3AF" />
            {yScale.ticks(5).map((tick, i) => (
              <g key={i} transform={`translate(0,${yScale(tick)})`}>
                <line x1={-6} x2={0} stroke="#9CA3AF" />
                <text
                  x={-10}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="#9CA3AF"
                  fontSize="12"
                >
                  {yAxisFormatter(tick)}
                </text>
              </g>
            ))}
            {yAxisLabel && (
              <text
                transform={`translate(-45,${innerHeight / 2}) rotate(-90)`}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="12"
              >
                {yAxisLabel}
              </text>
            )}
          </g>

          {/* Hover interaction area */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'crosshair' }}
          />

          {/* Hover line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              x2={hoveredPoint.x}
              y1={0}
              y2={innerHeight}
              stroke="#9CA3AF"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.5}
            />
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${hoveredPoint.x + margin.left + 10}px`,
            top: `${hoveredPoint.y + margin.top - 50}px`,
            pointerEvents: 'none',
          }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm shadow-lg"
        >
          <div className="text-gray-400 mb-1 text-xs">
            {tooltipLabelFormatter(hoveredPoint.data.date as Date)}
          </div>
          {lines.map(lineConfig => {
            const value = hoveredPoint.data[lineConfig.dataKey]
            if (value === undefined || value === null) return null
            const [formattedValue, label] = tooltipFormatter(Number(value), lineConfig.dataKey)
            return (
              <div key={lineConfig.dataKey} className="flex items-center gap-2">
                <div
                  className="w-3 h-0.5 rounded"
                  style={{ backgroundColor: lineConfig.stroke }}
                />
                <span className="text-gray-200 text-xs">
                  {label}: <span className="font-semibold text-white">{formattedValue}</span>
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {lines.map(lineConfig => (
            <div key={lineConfig.dataKey} className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 rounded"
                style={{ backgroundColor: lineConfig.stroke }}
              />
              <span className="text-gray-400">{lineConfig.dataKey}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
