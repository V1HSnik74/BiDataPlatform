import { FormField } from '../FormField'
import styles from './index.module.scss'

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
      <div className={styles.dropSlot}>
        {value ? (
          <span className={badgeVariant === 'dimension' ? styles.dimensionBadge : styles.measureBadge}>{value}</span>
        ) : (
          <span className={styles.placeholderText}>{placeholder}</span>
        )}
      </div>
    </FormField>
  )
}
