import { useId } from 'react'
import { ReferenceArea, ReferenceLine, usePlotArea } from 'recharts'
import { ALERT_COLOR, type ChartConstraints } from '../../../api/charts'
import { formatCompact } from '../formatters'

type ThresholdRectProps = {
  y?: number
  fill?: string
  isAbove: boolean
}

const DangerHatchPattern = ({ id }: { id: string }) => (
  <defs>
    <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill={ALERT_COLOR} fillOpacity="0.12" />
      <line x1="0" y1="0" x2="0" y2="10" stroke={ALERT_COLOR} strokeWidth="1.5" strokeOpacity="0.45" />
    </pattern>
  </defs>
)

const ThresholdRectShape = ({ y, fill, isAbove }: ThresholdRectProps) => {
  const plotArea = usePlotArea()
  if (typeof y !== 'number' || !plotArea) {
    return null
  }
  const plotTop = plotArea.y
  const plotBottom = plotArea.y + plotArea.height
  const thresholdY = Math.min(plotBottom, Math.max(plotTop, y))
  const rectY = isAbove ? plotTop : thresholdY
  const rectHeight = isAbove ? thresholdY - plotTop : plotBottom - thresholdY
  if (rectHeight <= 0) {
    return null
  }
  return (
    <rect
      x={plotArea.x}
      y={rectY}
      width={plotArea.width}
      height={rectHeight}
      fill={fill}
      style={{ pointerEvents: 'none' }}
    />
  )
}

export const ThresholdOverlay = ({ constraints }: { constraints: ChartConstraints }) => {
  const patternId = useId()
  const threshold = constraints.thresholdValue
  if (threshold === null) {
    return null
  }
  const isAbove = constraints.thresholdCondition === 'above'
  const labelText = `${constraints.thresholdLabel || 'Порог'}: ${formatCompact(threshold)}`
  return (
    <>
      <DangerHatchPattern id={patternId} />
      <ReferenceArea
        y1={threshold}
        y2={threshold}
        fill={`url(#${patternId})`}
        zIndex={600}
        shape={<ThresholdRectShape isAbove={isAbove} />}
      />
      <ReferenceLine
        y={threshold}
        stroke={ALERT_COLOR}
        strokeDasharray="6 4"
        strokeWidth={2}
        ifOverflow="extendDomain"
        zIndex={601}
        label={{
          value: labelText,
          position: isAbove ? 'insideTopRight' : 'insideBottomRight',
          fill: ALERT_COLOR,
          fontSize: 12,
          fontWeight: 600,
        }}
      />
    </>
  )
}
