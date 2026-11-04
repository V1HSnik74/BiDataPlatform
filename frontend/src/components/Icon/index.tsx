import type { LucideProps } from 'lucide-react'
import {
  FileCode,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Search,
  Trash2,
  UploadCloud,
  ArrowLeft,
  ChevronDown,
  ChevronsUpDown,
  BarChart2,
  ScatterChart,
  PieChart,
} from 'lucide-react'

const icons = {
  uploadCloud: UploadCloud,
  search: Search,
  trash: Trash2,
  fileText: FileText,
  fileSpreadsheet: FileSpreadsheet,
  fileCode: FileCode,
  fileCode2: FileCode2,
  back: ArrowLeft,
  chevronDown: ChevronDown,
  chevronsUpDown: ChevronsUpDown,
  barChart: BarChart2,
  scatterChart: ScatterChart,
  pieChart: PieChart,
} as const

export const Icon = ({ name, size = 18, ...restProps }: { name: keyof typeof icons } & LucideProps) => {
  const Component = icons[name]
  return <Component size={size} {...restProps} />
}
