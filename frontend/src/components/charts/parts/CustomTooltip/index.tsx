import type { EnrichedPoint } from '../../types'
import css from './index.module.scss'

export const CustomTooltip = ({
  active,
  payload,
  measureLabel,
}: {
  active?: boolean
  payload?: Array<{ payload?: EnrichedPoint }>
  measureLabel: string
}) => {
  const point = active ? payload?.[0]?.payload : null
  if (!point) {
    return null
  }
  return (
    <div className={css.tooltip}>
      <div className={css.tooltipTitle}>{point.x}</div>
      <div className={css.tooltipRow}>
        <span className={css.tooltipDot} style={{ backgroundColor: point.fill }} />
        <span className={css.tooltipLabel}>{measureLabel}:</span>
        <span className={css.tooltipValue}>{point.y}</span>
      </div>
      {point.isAlert && <div className={css.tooltipAlert}>В запретной зоне</div>}
    </div>
  )
}
