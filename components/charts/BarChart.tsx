'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { scaleLinear, scaleBand } from 'd3-scale'

export interface BarChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

interface BarChartProps {
  data: BarChartDataPoint[]
  orientation?: 'horizontal' | 'vertical'
  xAxisFormatter?: (value: number) => string
  yAxisFormatter?: (value: string) => string
  tooltipFormatter?: (point: BarChartDataPoint) => string
  height?: number
  showGrid?: boolean
  showValues?: boolean
  barColor?: string
  barGradient?: boolean
  maxValue?: number
  onClick?: (point: BarChartDataPoint) => void
}

export function BarChart({
  data,
  orientation = 'horizontal',
  xAxisFormatter = (v) => `${v}%`,
  yAxisFormatter = (v) => v,
  tooltipFormatter,
  height = 400,
  showGrid = true,
  showValues = true,
  barColor = '#10B981',
  barGradient = true,
  maxValue,
  onClick,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredBar, setHoveredBar] = useState<BarChartDataPoint | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  const margin = orientation === 'horizontal'
    ? { top: 10, right: 60, bottom: 30, left: 150 }
    : { top: 20, right: 20, bottom: 80, left: 60 }

  const width = containerWidth || 800
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const xScale = useMemo(() => {
    if (orientation === 'horizontal') {
      const domain = maxValue !== undefined ? maxValue : Math.max(...data.map(d => d.value))
      return scaleLinear()
        .domain([0, domain])
        .range([0, innerWidth])
        .nice()
    } else {
      return scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerWidth])
        .padding(0.3)
    }
  }, [data, innerWidth, orientation, maxValue])

  const yScale = useMemo(() => {
    if (orientation === 'horizontal') {
      return scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerHeight])
        .padding(0.3)
    } else {
      const domain = maxValue !== undefined ? maxValue : Math.max(...data.map(d => d.value))
      return scaleLinear()
        .domain([0, domain])
        .range([innerHeight, 0])
        .nice()
    }
  }, [data, innerHeight, orientation, maxValue])

  // Grid lines
  const gridTicks = useMemo(() => {
    if (orientation === 'horizontal') {
      return (xScale as any).ticks(5)
    } else {
      return (yScale as any).ticks(5)
    }
  }, [xScale, yScale, orientation])

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>, point: BarChartDataPoint) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setHoveredBar(point)
  }

  const handleMouseLeave = () => {
    setHoveredBar(null)
  }

  const handleClick = (point: BarChartDataPoint) => {
    if (onClick) {
      onClick(point)
    }
  }

  const getBarColor = (point: BarChartDataPoint) => {
    if (point.color) return point.color

    // Priority-based coloring if metadata contains priority
    if (point.metadata?.priority_level) {
      const priority = point.metadata.priority_level
      if (priority === 'critical') return '#EF4444' // red-500
      if (priority === 'high') return '#F97316' // orange-500
      if (priority === 'medium') return '#10B981' // emerald-500
      if (priority === 'low') return '#6B7280' // gray-500
    }

    return barColor
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          {barGradient && (
            <>
              <linearGradient id="bar-gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="bar-gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="bar-gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </>
          )}
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <g className="grid" opacity={0.1}>
              {gridTicks.map((tick: number, i: number) => (
                orientation === 'horizontal' ? (
                  <line
                    key={i}
                    x1={(xScale as any)(tick)}
                    x2={(xScale as any)(tick)}
                    y1={0}
                    y2={innerHeight}
                    stroke="white"
                    strokeDasharray="3 3"
                  />
                ) : (
                  <line
                    key={i}
                    x1={0}
                    x2={innerWidth}
                    y1={(yScale as any)(tick)}
                    y2={(yScale as any)(tick)}
                    stroke="white"
                    strokeDasharray="3 3"
                  />
                )
              ))}
            </g>
          )}

          {/* Bars */}
          {data.map((point, i) => {
            const color = getBarColor(point)
            let fillColor = color

            // Use gradient for priority colors
            if (barGradient) {
              if (color === '#EF4444') fillColor = 'url(#bar-gradient-red)'
              else if (color === '#F97316') fillColor = 'url(#bar-gradient-orange)'
              else if (color === '#10B981') fillColor = 'url(#bar-gradient-emerald)'
            }

            const isHovered = hoveredBar?.label === point.label

            if (orientation === 'horizontal') {
              const y = (yScale as any)(point.label)
              const barWidth = (xScale as any)(point.value)
              const barHeight = (yScale as any).bandwidth()

              return (
                <g key={i}>
                  <rect
                    x={0}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={fillColor}
                    opacity={isHovered ? 1 : 0.9}
                    rx={4}
                    onMouseMove={(e) => handleMouseMove(e, point)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(point)}
                    style={{
                      cursor: onClick ? 'pointer' : 'default',
                      transition: 'opacity 0.2s, transform 0.2s',
                      transform: isHovered ? 'scaleX(1.02)' : 'scaleX(1)',
                      transformOrigin: 'left',
                    }}
                  />
                  {showValues && (
                    <text
                      x={barWidth + 5}
                      y={y + barHeight / 2}
                      alignmentBaseline="middle"
                      fill="#A1A1AA"
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {xAxisFormatter(point.value)}
                    </text>
                  )}
                </g>
              )
            } else {
              const x = (xScale as any)(point.label)
              const barHeight = innerHeight - (yScale as any)(point.value)
              const barWidth = (xScale as any).bandwidth()

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={(yScale as any)(point.value)}
                    width={barWidth}
                    height={barHeight}
                    fill={fillColor}
                    opacity={isHovered ? 1 : 0.9}
                    rx={4}
                    onMouseMove={(e) => handleMouseMove(e, point)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(point)}
                    style={{
                      cursor: onClick ? 'pointer' : 'default',
                      transition: 'opacity 0.2s, transform 0.2s',
                      transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                      transformOrigin: 'bottom',
                    }}
                  />
                  {showValues && (
                    <text
                      x={x + barWidth / 2}
                      y={(yScale as any)(point.value) - 5}
                      textAnchor="middle"
                      fill="#A1A1AA"
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {xAxisFormatter(point.value)}
                    </text>
                  )}
                </g>
              )
            }
          })}

          {/* X Axis */}
          {orientation === 'vertical' && (
            <g transform={`translate(0,${innerHeight})`}>
              <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="#9CA3AF" />
              {data.map((point, i) => {
                const x = (xScale as any)(point.label)
                const barWidth = (xScale as any).bandwidth()
                return (
                  <g key={i} transform={`translate(${x + barWidth / 2},0)`}>
                    <line y1={0} y2={6} stroke="#9CA3AF" />
                    <text
                      y={20}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="12"
                      transform="rotate(-45)"
                      style={{ transformOrigin: 'center' }}
                    >
                      {yAxisFormatter(point.label)}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Y Axis */}
          {orientation === 'horizontal' ? (
            <g>
              {data.map((point, i) => {
                const y = (yScale as any)(point.label)
                const barHeight = (yScale as any).bandwidth()
                return (
                  <text
                    key={i}
                    x={-10}
                    y={y + barHeight / 2}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="500"
                  >
                    {yAxisFormatter(point.label)}
                  </text>
                )
              })}
            </g>
          ) : (
            <g>
              <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#9CA3AF" />
              {(yScale as any).ticks(5).map((tick: number, i: number) => (
                <g key={i} transform={`translate(0,${(yScale as any)(tick)})`}>
                  <line x1={-6} x2={0} stroke="#9CA3AF" />
                  <text
                    x={-10}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fill="#9CA3AF"
                    fontSize="12"
                  >
                    {xAxisFormatter(tick)}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredBar && tooltipFormatter && (
        <div
          style={{
            position: 'absolute',
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 40}px`,
            pointerEvents: 'none',
          }}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-lg whitespace-nowrap z-10"
        >
          <div className="text-white font-medium">
            {tooltipFormatter(hoveredBar)}
          </div>
        </div>
      )}
    </div>
  )
}
