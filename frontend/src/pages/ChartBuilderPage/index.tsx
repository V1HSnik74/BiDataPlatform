import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { DEFAULT_CHART_CONFIG, type ChartConfig } from '../../api/charts'
import { graphsApi } from '../../api/graphs'
import { uploadApi } from '../../api/uploads'
import { AxisSlot } from '../../components/AxisSlot'
import { ChartRenderer } from '../../components/ChartRender'
import { CustomSelect, type SelectOption } from '../../components/CustomSelect'
import { FieldBadgeSection } from '../../components/FieldBadgeSection'
import { FileLabel } from '../../components/FileLabel'
import { FormField } from '../../components/FormField'
import { Icon } from '../../components/Icon'
import { useDebounce } from '../../hooks/useDebounce'
import styles from './index.module.scss'

const CHART_TYPES = [
  { type: 'bar', icon: 'barChart' },
  { type: 'scatter', icon: 'scatterChart' },
  { type: 'pie', icon: 'pieChart' },
] as const

const AGGREGATION_OPTIONS: SelectOption<ChartConfig['aggregation']>[] = [
  { value: 'SUM', label: 'СУММА' },
  { value: 'AVG', label: 'СРЕДНЕЕ' },
  { value: 'COUNT', label: 'КОЛИЧЕСТВО' },
]

type BackendChartResponse = {
  labels?: string[]
  datasets?: Array<{ label: string; data: number[] }>
}

export const ChartBuilder = () => {
  const [config, setConfig] = useState<ChartConfig>(DEFAULT_CHART_CONFIG)
  const debouncedTopN = useDebounce(config.topN, 300)

  const { data: userFiles = [] } = useQuery({
    queryKey: ['user-uploads'],
    queryFn: () => uploadApi.getUploads(),
  })

  const currentFileId = config.fileId ?? userFiles[0]?.id ?? null
  const activeFile = userFiles.find((f) => f.id === currentFileId)

  const updateConfig = <T extends keyof ChartConfig>(key: T, value: ChartConfig[T]) => {
    setConfig((prev) => ({ ...prev, fileId: currentFileId, [key]: value }))
  }

  const handleSelectFile = (fileId: number) => {
    setConfig((prev) => ({ ...prev, fileId, xAxis: '', yAxis: '' }))
  }

  const fileOptions = useMemo(
    () =>
      userFiles.map((file) => ({
        value: file.id,
        label: <FileLabel filename={file.filename} />,
      })),
    [userFiles]
  )

  const { data: rawChartData, isLoading } = useQuery({
    queryKey: ['chart-preview', currentFileId, config.xAxis, config.yAxis, config.aggregation, debouncedTopN],
    queryFn: () =>
      graphsApi.previewGraph({
        title: config.title || 'Безымянный график',
        chart_type: 'bar',
        upload_id: currentFileId!,
        x_axis: config.xAxis,
        y_axis: [config.yAxis],
        aggregation_func: config.aggregation,
        limit: debouncedTopN,
      }),
    enabled: Boolean(currentFileId && config.xAxis && config.yAxis),
    staleTime: 1000 * 60 * 10,
  })

  const chartData = useMemo(() => {
    const res = rawChartData as BackendChartResponse | undefined
    const labels = res?.labels
    const values = res?.datasets?.[0]?.data

    if (!Array.isArray(labels) || !Array.isArray(values)) {
      return []
    }
    return labels.slice(0, debouncedTopN).map((label, idx) => ({
      x: String(label),
      y: Number(values[idx] ?? 0),
    }))
  }, [rawChartData, debouncedTopN])

  return (
    <div className={styles.builderLayout}>
      <header className={styles.topBar}>
        <div className={styles.topLeftControls}>
          <button type="button" className={styles.backBtn}>
            <Icon name="back" size={20} />
          </button>
          <span className={styles.pageTitle}>Конструктор графиков</span>
          <input
            type="text"
            className={styles.reportTitleInput}
            value={config.title}
            onChange={(e) => updateConfig('title', e.target.value)}
          />
          <div className={styles.sourceSelectorWrapper}>
            <span className={styles.sourceLabel}>Источник данных</span>
            <CustomSelect
              className={styles.sourceSelectDropdown}
              value={currentFileId}
              options={fileOptions}
              onChange={handleSelectFile}
              placeholder="Выберите файл"
            />
          </div>
        </div>
        <div className={styles.topRightControls}>
          <button type="button" className={styles.saveBtn}>
            Сохранить на дашборд
          </button>
        </div>
      </header>
      <div className={styles.workspace}>
        <aside className={styles.fieldsSidebar}>
          <h2 className={styles.sidebarHeader}>Доступные поля</h2>
          <FieldBadgeSection
            title="ИЗМЕРЕНИЯ"
            items={activeFile?.dimensions ?? []}
            selectedItem={config.xAxis}
            badgeVariant="dimension"
            onSelect={(field) => updateConfig('xAxis', field)}
          />
          <div className={styles.sectionDivider} />
          <FieldBadgeSection
            title="МЕРЫ"
            items={activeFile?.measures ?? []}
            selectedItem={config.yAxis}
            badgeVariant="measure"
            onSelect={(field) => updateConfig('yAxis', field)}
          />
        </aside>
        <section className={styles.configSidebar}>
          <FormField label="Тип графика">
            <div className={styles.chartTypeGroup}>
              {CHART_TYPES.map(({ type, icon }) => (
                <button
                  key={type}
                  type="button"
                  className={classNames(styles.typeBtn, {
                    [styles.typeBtnActive]: config.type === type,
                  })}
                  onClick={() => updateConfig('type', type)}
                >
                  <Icon name={icon} size={18} />
                </button>
              ))}
            </div>
          </FormField>
          <AxisSlot
            label="Ось X (измерение)"
            value={config.xAxis}
            placeholder="Выберите поле"
            badgeVariant="dimension"
          />
          <AxisSlot label="Ось Y (мера)" value={config.yAxis} placeholder="Выберите меру" badgeVariant="measure" />
          <FormField label="Агрегация">
            <CustomSelect
              value={config.aggregation}
              options={AGGREGATION_OPTIONS}
              onChange={(val) => updateConfig('aggregation', val)}
            />
          </FormField>
          <FormField label="Лимит Top-N">
            <div className={styles.numberInputWrapper}>
              <input
                type="number"
                value={config.topN}
                onChange={(e) => updateConfig('topN', Math.max(1, Number(e.target.value)))}
                className={styles.numberInput}
                min={1}
                max={50}
              />
              <Icon name="chevronsUpDown" size={16} className={styles.stepperIcon} />
            </div>
          </FormField>
        </section>
        <main className={styles.previewCard}>
          <h1 className={styles.chartTitle}>{config.title}</h1>
          <div className={styles.chartArea}>
            <ChartRenderer data={chartData} config={{ ...config, fileId: currentFileId }} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  )
}
