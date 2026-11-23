import { useMemo, useState } from 'react'
import { DEFAULT_CHART_CONFIG, type CurveMode, type CustomChartBlueprint } from '../../api/charts'
import { buildCustomChartDefinition, ChartRenderer } from '../charts'
import css from './index.module.scss'

type DraftBlueprint = Omit<CustomChartBlueprint, 'id'>

const SAMPLE_DATA = [
  { x: 'A', y: 120 },
  { x: 'B', y: 240 },
  { x: 'C', y: 180 },
  { x: 'D', y: 310 },
]

const INITIAL_DRAFT: DraftBlueprint = {
  name: '',
  icon: 'barChart',
  coordinateSystem: 'cartesian',
  showBars: true,
  showLine: true,
  showArea: false,
  showDots: true,
  curveMode: 'monotone',
  innerRadiusPercent: 60,
  startAngle: 180,
  endAngle: 0,
}

const LAYER_OPTIONS = [
  { key: 'showBars', label: 'Столбцы' },
  { key: 'showLine', label: 'Линия' },
  { key: 'showArea', label: 'Область' },
  { key: 'showDots', label: 'Узлы (точки)' },
] as const

const CURVE_OPTIONS: Array<{ value: CurveMode; label: string }> = [
  { value: 'monotone', label: 'Плавная' },
  { value: 'linear', label: 'Прямая' },
  { value: 'step', label: 'Ступеньки' },
]

export const CustomChartModal = ({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (blueprint: DraftBlueprint) => void
}) => {
  const [draft, setDraft] = useState<DraftBlueprint>(INITIAL_DRAFT)
  const updateDraft = (patch: Partial<DraftBlueprint>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  const previewDefinitions = useMemo(
    () => ({
      preview_custom: buildCustomChartDefinition({
        ...draft,
        id: 'preview_custom',
        name: draft.name.trim() || 'Новый график',
      }),
    }),
    [draft]
  )

  const hasValidCartesianLayer = draft.showBars || draft.showLine || draft.showArea || draft.showDots

  const canSubmit = draft.name.trim().length > 0 && (draft.coordinateSystem === 'polar' || hasValidCartesianLayer)
  if (!isOpen) {
    return null
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }
    const resolvedIcon = draft.coordinateSystem === 'polar' ? 'pieChart' : draft.showBars ? 'barChart' : 'scatterChart'
    onCreate({
      ...draft,
      name: draft.name.trim(),
      icon: resolvedIcon,
    })
    setDraft(INITIAL_DRAFT)
    onClose()
  }
  const isHalfArc = draft.startAngle === 180

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <h3 className={css.title}>Конструктор нового типа графика</h3>
          <button type="button" className={css.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={css.body}>
          <div className={css.controls}>
            <div className={css.field}>
              <label className={css.label}>Название типа графика</label>
              <input
                type="text"
                className={css.input}
                maxLength={24}
                placeholder="Название типа"
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
              />
            </div>
            <div className={css.field}>
              <span className={css.label}>Система координат</span>
              <div className={css.segmented}>
                <button
                  type="button"
                  className={draft.coordinateSystem === 'cartesian' ? css.segBtnActive : css.segBtn}
                  onClick={() => updateDraft({ coordinateSystem: 'cartesian' })}
                >
                  Декартова (X / Y)
                </button>
                <button
                  type="button"
                  className={draft.coordinateSystem === 'polar' ? css.segBtnActive : css.segBtn}
                  onClick={() => updateDraft({ coordinateSystem: 'polar' })}
                >
                  Радиальная / Круг
                </button>
              </div>
            </div>
            {draft.coordinateSystem === 'cartesian' ? (
              <>
                <div className={css.field}>
                  <span className={css.label}>Комбинация слоёв отображения</span>
                  <div className={css.layerGrid}>
                    {LAYER_OPTIONS.map(({ key, label }) => (
                      <label key={key} className={css.layerCheck}>
                        <input
                          type="checkbox"
                          checked={Boolean(draft[key])}
                          onChange={(e) => updateDraft({ [key]: e.target.checked })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {(draft.showLine || draft.showArea) && (
                  <div className={css.field}>
                    <span className={css.label}>Геометрия линии</span>
                    <div className={css.segmentedTriple}>
                      {CURVE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          className={draft.curveMode === value ? css.segBtnActive : css.segBtn}
                          onClick={() => updateDraft({ curveMode: value })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={css.field}>
                  <span className={css.label}>Форма дуги</span>
                  <div className={css.segmented}>
                    <button
                      type="button"
                      className={isHalfArc ? css.segBtnActive : css.segBtn}
                      onClick={() => updateDraft({ startAngle: 180, endAngle: 0 })}
                    >
                      Полукруг (Gauge 180°)
                    </button>
                    <button
                      type="button"
                      className={!isHalfArc ? css.segBtnActive : css.segBtn}
                      onClick={() => updateDraft({ startAngle: 90, endAngle: -270 })}
                    >
                      Полный круг (360°)
                    </button>
                  </div>
                </div>
                <div className={css.field}>
                  <span className={css.label}>Внутренний вырез</span>
                  <div className={css.rangeRow}>
                    <input
                      type="range"
                      min={0}
                      max={85}
                      step={5}
                      value={draft.innerRadiusPercent ?? 60}
                      onChange={(e) => updateDraft({ innerRadiusPercent: Number(e.target.value) })}
                    />
                    <span className={css.rangeVal}>{draft.innerRadiusPercent ?? 60}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={css.previewBox}>
            <span className={css.previewTitle}>Предпросмотр типа графика</span>
            <div className={css.previewChart}>
              <ChartRenderer
                data={SAMPLE_DATA}
                config={{
                  ...DEFAULT_CHART_CONFIG,
                  fileId: 1,
                  xAxis: 'Категория',
                  yAxis: 'Значение',
                  type: 'preview_custom',
                }}
                customDefinitions={previewDefinitions}
              />
            </div>
          </div>
        </div>
        <div className={css.footer}>
          <button type="button" className={css.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={css.submitBtn} disabled={!canSubmit} onClick={handleSubmit}>
            Добавить в список типов
          </button>
        </div>
      </div>
    </div>
  )
}
