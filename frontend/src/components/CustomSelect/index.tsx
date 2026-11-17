import classNames from 'classnames'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../Icon'
import css from './index.module.scss'

export type SelectOption<T extends string | number> = {
  value: T
  label: ReactNode
}

type CustomSelectProps<T extends string | number> = {
  value: T | null
  options: SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  icon?: ReactNode
  footer?: ReactNode
  className?: string
}

export const CustomSelect = <T extends string | number>({
  value,
  options,
  onChange,
  placeholder = 'Выберите...',
  icon,
  footer,
  className,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={classNames(css.selectWrapper, className)} ref={wrapperRef}>
      <button type="button" className={css.triggerButton} onClick={() => setIsOpen((prev) => !prev)}>
        <div className={css.labelGroup}>
          {icon}
          <div className={classNames(css.selectedText, { [css.placeholder]: !selectedOption })}>
            {selectedOption ? selectedOption.label : placeholder}
          </div>
        </div>
        <Icon name="chevronDown" size={16} className={classNames(css.chevron, { [css.chevronOpen]: isOpen })} />
      </button>

      {isOpen && (
        <ul className={css.optionsList}>
          {options.length === 0 && !footer ? (
            <li className={css.emptyOption}>Нет доступных вариантов</li>
          ) : (
            options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={classNames(css.optionItem, {
                    [css.optionActive]: opt.value === value,
                  })}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))
          )}
          {footer && (
            <li className={css.footerItem} onClick={() => setIsOpen(false)}>
              {footer}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
