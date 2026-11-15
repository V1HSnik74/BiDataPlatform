import { FormField } from '../FormField'
import css from './index.module.scss'

export const AxisSlot = ({
  label,
  value,
  placeholder,
  badgeVariant,
}: {
  label: string
  value: string
  placeholder: string
  badgeVariant: 'dimension' | 'measure'
}) => {
  return (
    <FormField label={label}>
      <div className={css.dropSlot}>
        {value ? (
          <span className={badgeVariant === 'dimension' ? css.dimensionBadge : css.measureBadge}>{value}</span>
        ) : (
          <span className={css.placeholderText}>{placeholder}</span>
        )}
      </div>
    </FormField>
  )
}
