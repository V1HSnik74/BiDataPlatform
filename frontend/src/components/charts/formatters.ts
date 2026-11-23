export const AXIS_TICK_STYLE = { fill: '#64748b', fontSize: 12 }

export const formatCompact = (val: unknown): string => {
  if (val === null || val === undefined || typeof val === 'boolean') {
    return ''
  }
  const num = Number(val)
  if (Number.isNaN(num)) {
    return String(val)
  }
  if (Math.abs(num) >= 1_000_000) {
    return `${Number((num / 1_000_000).toFixed(1))}M`
  }
  if (Math.abs(num) >= 1_000) {
    return `${Number((num / 1_000).toFixed(1))}k`
  }
  return String(num)
}
