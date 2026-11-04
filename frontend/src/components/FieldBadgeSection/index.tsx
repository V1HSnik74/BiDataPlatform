import classNames from 'classnames'
import styles from './index.module.scss'

type FieldBadgeSectionProps = {
  title: string
  items: string[]
  selectedItem: string
  badgeVariant: 'dimension' | 'measure'
  onSelect: (item: string) => void
}

export const FieldBadgeSection = ({ title, items, selectedItem, badgeVariant, onSelect }: FieldBadgeSectionProps) => {
  return (
    <div className={styles.sectionBlock}>
      <span className={styles.sectionTitle}>{title}</span>
      <div className={styles.badgeCloud}>
        {items.length > 0 ? (
          items.map((field) => (
            <button
              key={field}
              type="button"
              className={classNames(badgeVariant === 'dimension' ? styles.dimensionBadge : styles.measureBadge, {
                [styles.badgeActive]: selectedItem === field,
              })}
              onClick={() => onSelect(field)}
            >
              {field}
            </button>
          ))
        ) : (
          <span className={styles.emptyHint}>Нет доступных полей</span>
        )}
      </div>
    </div>
  )
}
