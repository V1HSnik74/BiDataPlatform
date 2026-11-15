import classNames from 'classnames'
import css from './index.module.scss'

type FieldBadgeSectionProps = {
  title: string
  items: string[]
  selectedItem: string
  badgeVariant: 'dimension' | 'measure'
  onSelect: (item: string) => void
}

export const FieldBadgeSection = ({ title, items, selectedItem, badgeVariant, onSelect }: FieldBadgeSectionProps) => {
  return (
    <div className={css.sectionBlock}>
      <span className={css.sectionTitle}>{title}</span>
      <div className={css.badgeCloud}>
        {items.length > 0 ? (
          items.map((field) => (
            <button
              key={field}
              type="button"
              className={classNames(badgeVariant === 'dimension' ? css.dimensionBadge : css.measureBadge, {
                [css.badgeActive]: selectedItem === field,
              })}
              onClick={() => onSelect(field)}
            >
              {field}
            </button>
          ))
        ) : (
          <span className={css.emptyHint}>Нет доступных полей</span>
        )}
      </div>
    </div>
  )
}
