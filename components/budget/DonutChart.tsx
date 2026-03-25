'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartData } from '@/types/budget'
import { formatEuro } from '@/lib/budget/frequency-converter'

interface DonutChartProps {
  data: ChartData[]
  centerValue?: number
}

/**
 * Custom Tooltip - Minimalist White Card
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm text-slate-600">{data.name}</p>
        <p className="text-lg font-semibold text-slate-900 tabular-nums">
          {formatEuro(data.value)}
        </p>
        <p className="text-sm font-semibold mt-1 tabular-nums" style={{ color: data.color }}>
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

/**
 * DonutChart Component
 * Redesigned with Refined Minimalism aesthetic
 * Pink Primary + Grey Secondary colors
 */
export function DonutChart({ data, centerValue }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="w-full">
      {/* Hero Section - Chart + Stats Side by Side */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Chart - Left Side (Desktop) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative">
            {/* Donut Chart */}
            <ResponsiveContainer width={320} height={320}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={800}
                  animationBegin={200}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                      style={{
                        transition: 'opacity 300ms ease',
                        filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Value - Reserve */}
            {centerValue !== undefined && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Reserve
                </span>
                <span
                  className={`text-4xl font-bold tabular-nums ${centerValue > 0 ? 'text-emerald-600' : 'text-red-500'}`}
                >
                  {formatEuro(centerValue)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats - Right Side (Desktop) */}
        <div className="w-full lg:w-1/2 space-y-2">
          {data.map((entry, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                borderLeftWidth: activeIndex === index ? '3px' : '1px',
                borderLeftColor: activeIndex === index ? entry.color : '#e2e8f0',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Color Indicator */}
                <div
                  className="w-3 h-3 rounded-full transition-transform group-hover:scale-125 duration-200"
                  style={{ backgroundColor: entry.color }}
                />
                {/* Name */}
                <span className="font-medium text-sm text-slate-700">{entry.name}</span>
              </div>

              {/* Value + Percentage */}
              <div className="text-right">
                <div className="text-base font-semibold tabular-nums text-slate-900">{formatEuro(entry.value)}</div>
                <div
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: entry.color }}
                >
                  {entry.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
