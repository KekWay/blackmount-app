'use client'

interface RadarDataPoint {
  subject: string
  val: number
}

export function CustomRadar({ data, size = 160 }: { data: RadarDataPoint[]; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const n = data.length
  if (n < 3) return null

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2
  const pt = (i: number, v: number) => ({
    x: cx + r * (v / 100) * Math.cos(angle(i)),
    y: cy + r * (v / 100) * Math.sin(angle(i)),
  })

  const levels = [25, 50, 75, 100]

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="font-manrope">
      {levels.map((lv) => (
        <polygon
          key={`grid-${lv}`}
          points={data.map((_, i) => { const p = pt(i, lv); return `${p.x},${p.y}` }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const p = pt(i, 100)
        return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      })}
      <polygon
        points={data.map((d, i) => { const p = pt(i, d.val); return `${p.x},${p.y}` }).join(' ')}
        fill="#888ae5" fillOpacity={0.25} stroke="#888ae5" strokeWidth={2}
      />
      {data.map((d, i) => {
        const p = pt(i, d.val)
        return <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={2.5} fill="#888ae5" />
      })}
      {data.map((d, i) => {
        const labelR = r + 14
        const lx = cx + labelR * Math.cos(angle(i))
        const ly = cy + labelR * Math.sin(angle(i))
        const a = angle(i)
        const anchor = Math.abs(a) < 0.1 || Math.abs(a - Math.PI) < 0.1 ? 'middle' : a > -Math.PI / 2 && a < Math.PI / 2 ? 'start' : 'end'
        return (
          <text key={`label-${i}`} x={lx} y={ly} textAnchor={anchor} dominantBaseline="central"
            fill="rgba(255,255,255,0.4)" fontSize={9} fontWeight={600}>
            {d.subject}
          </text>
        )
      })}
    </svg>
  )
}
