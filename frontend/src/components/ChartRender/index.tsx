import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { ChartConfig, ChartDataPoint } from '../../api/charts'
import styles from './index.module.scss'

type Props = {
  data: ChartDataPoint[]
  config: Pick<ChartConfig, 'type' | 'xAxis' | 'yAxis'>
  isLoading?: boolean
}

export const ChartRenderer = ({ data, config, isLoading }: Props) => {
  if (isLoading) {
    return <div className={styles.loadingMessage}>Построение графика...</div>
  }

  if (data.length === 0) {
    return <div className={styles.loadingMessage}>Выберите источник данных, измерение и меру для отображения</div>
  }

  switch (config.type) {
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="x"
              name={config.xAxis}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 13 }}
              dy={10}
            />
            <YAxis
              dataKey="y"
              name={config.yAxis}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 13 }}
              dx={-5}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Данные" data={data} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      )

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="y"
              nameKey="x"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={45}
              paddingAngle={2}
              animationBegin={0}
              animationDuration={750}
              label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      )

    case 'bar':
    default:
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="x" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13 }} dy={10} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13 }} dx={-5} />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="y" fill="#8fc1ff" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )
  }
}
