import cn from 'classnames'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { Icon } from '../Icon'
import css from './index.module.scss'

export type InputProps = {
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  hasError?: boolean
} & ComponentProps<'input'>

export const Input = ({ leftIcon, rightSlot, hasError, className, ref, ...props }: InputProps) => {
  return (
    <div className={cn(css.inputWrapper, className)}>
      {leftIcon && <span className={css.leftIcon}>{leftIcon}</span>}
      <input
        ref={ref}
        className={cn(css.input, {
          [css.withLeftIcon]: !!leftIcon,
          [css.withRightSlot]: !!rightSlot,
          [css.inputError]: hasError,
        })}
        {...props}
      />
      {rightSlot && <div className={css.rightSlot}>{rightSlot}</div>}
    </div>
  )
}

export const PasswordInput = (props: Omit<InputProps, 'type' | 'rightSlot'>) => {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button type="button" className={css.passwordToggleBtn} onClick={() => setVisible((v) => !v)} tabIndex={-1}>
          {visible ? <Icon name="hidePass" size={16} /> : <Icon name="showPass" size={16} />}
        </button>
      }
      {...props}
    />
  )
}
