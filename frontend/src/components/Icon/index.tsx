import type { LucideProps } from 'lucide-react'
import {
  FileCode,
  FileCode2,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react'

const icons = {
  uploadCloud: UploadCloud,
  search: Search,
  trash: Trash2,
  moreHorizontal: MoreHorizontal,
  fileText: FileText,
  fileSpreadsheet: FileSpreadsheet,
  fileCode: FileCode,
  fileCode2: FileCode2,
} as const

export const Icon = ({ name, size = 18, ...restProps }: { name: keyof typeof icons } & LucideProps) => {
  const Component = icons[name]
  return <Component size={size} {...restProps} />
}
