import classNames from 'classnames'
import { Icon } from '../Icon'
import styles from './index.module.scss'

export const FileLabel = ({
  filename,
  className,
  iconSize = 16,
  showIcon = true,
}: {
  filename: string
  className?: string
  iconSize?: number
  showIcon?: boolean
}) => {
  const getFileIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
      return <Icon name="fileSpreadsheet" size={iconSize} className={classNames(styles.fileIcon, styles.xlsx)} />
    }
    if (lower.endsWith('.json')) {
      return <Icon name="fileCode" size={iconSize} className={classNames(styles.fileIcon, styles.json)} />
    }
    if (lower.endsWith('.xml')) {
      return <Icon name="fileCode2" size={iconSize} className={classNames(styles.fileIcon, styles.xml)} />
    }
    return <Icon name="fileText" size={iconSize} className={classNames(styles.fileIcon, styles.csv)} />
  }

  return (
    <div className={classNames(styles.fileLabel, className)} title={filename}>
      {showIcon && getFileIcon(filename)}
      <span className={styles.fileName}>{filename}</span>
    </div>
  )
}
