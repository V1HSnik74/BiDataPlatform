import { useState } from 'react'
import type { ChartConstraints, ThresholdCondition } from '../../api/charts'
import { Icon } from '../Icon'
import css from './index.module.scss'

const parseOptionalNumber = (raw: string): number | null => {
  if (raw.trim() === '') {
    return null
  }
  const num = Number(raw)
  return Number.isFinite(num) ? num : null
}

export const ChartConstraintsSection = ({
  value,
  supportsReferenceLine,
  onChange,
}: {
  value: ChartConstraints
  supportsReferenceLine: boolean
  onChange: (next: ChartConstraints) => void
}) => {
  const hasActiveConstraints =
    (supportsReferenceLine && value.thresholdValue !== null) || value.minValue !== null || value.maxValue !== null
  const [isOpen, setIsOpen] = useState(hasActiveConstraints)

  const update = <K extends keyof ChartConstraints>(key: K, val: ChartConstraints[K]) => {
    onChange({ ...value, [key]: val })
  }

  const handleReset = () => {
    onChange({
      thresholdValue: null,
      thresholdLabel: 'Порог',
      thresholdCondition: 'above',
      minValue: null,
      maxValue: null,
    })
  }

  return (
    <div className={css.wrapper}>
      <button type="button" className={css.headerBtn} onClick={() => setIsOpen((prev) => !prev)}>
        <span className={css.headerTitle}>
          <span>Ограничения и пороги</span>
          {hasActiveConstraints && <span className={css.activeDot} />}
        </span>
        <Icon name="chevronDown" size={16} className={isOpen ? css.chevronOpen : css.chevron} />
      </button>
      {isOpen && (
        <div className={css.body}>
          {supportsReferenceLine && (
            <div className={css.group}>
              <div className={css.groupHeader}>
                <span className={css.groupLabel}>Целевой порог (линия)</span>
                {value.thresholdValue !== null && (
                  <button type="button" className={css.clearLink} onClick={() => update('thresholdValue', null)}>
                    Сбросить
                  </button>
                )}
              </div>
              <div className={css.rowTwoCols}>
                <input
                  type="number"
                  className={css.input}
                  placeholder="Значение..."
                  value={value.thresholdValue ?? ''}
                  onChange={(e) => update('thresholdValue', parseOptionalNumber(e.target.value))}
                />
                <input
                  type="text"
                  className={css.input}
                  placeholder="Подпись"
                  value={value.thresholdLabel}
                  onChange={(e) => update('thresholdLabel', e.target.value)}
                />
              </div>
              {value.thresholdValue !== null && (
                <div className={css.conditionToggle}>
                  {(
                    [
                      { id: 'above', label: 'Выделять выше порога' },
                      { id: 'below', label: 'Выделять ниже порога' },
                    ] as const
                  ).map((item: { id: ThresholdCondition; label: string }) => (
                    <button
                      key={item.id}
                      type="button"
                      className={value.thresholdCondition === item.id ? css.toggleActive : css.toggleBtn}
                      onClick={() => update('thresholdCondition', item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className={css.group}>
            <div className={css.groupHeader}>
              <span className={css.groupLabel}>Фильтр значений (от / до)</span>
              {(value.minValue !== null || value.maxValue !== null) && (
                <button type="button" className={css.clearLink} onClick={handleReset}>
                  Очистить
                </button>
              )}
            </div>
            <div className={css.rowTwoCols}>
              <input
                type="number"
                className={css.input}
                placeholder="Мин."
                value={value.minValue ?? ''}
                onChange={(e) => update('minValue', parseOptionalNumber(e.target.value))}
              />
              <input
                type="number"
                className={css.input}
                placeholder="Макс."
                value={value.maxValue ?? ''}
                onChange={(e) => update('maxValue', parseOptionalNumber(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
