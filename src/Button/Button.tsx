import { Button as BaseButton } from '@base-ui/react/button'
import type { ComponentProps, ReactNode } from 'react'

import { Icon, type IconName, type IconSize } from '../icons/Icon'
import { Spin, type SpinSize } from '../Spin/Spin'

export type ButtonView = 'primary-brand' | 'outlined-action' | 'flat' | 'flat-action' | 'flat-secondary'
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'
// Иконки темы Filled в размерах 12 и 16 — те, что стоят в наборе кнопки.
export type ButtonIcon = Extract<IconName, 'chevron-down' | 'dismiss' | 'edit' | 'eye' | 'search' | 'warning'>

export type ButtonProps = Omit<ComponentProps<'button'>, 'className' | 'style' | 'children'> & {
  /** Вид кнопки. В ките — ось `View`. */
  view?: ButtonView
  /** Размер. В ките — ось `Size`. */
  size?: ButtonSize
  /** Квадратная кнопка с одной иконкой — `startIcon`. В ките — ось `Icon only`. Нужен `aria-label`. */
  iconOnly?: boolean
  /** Иконка слева. В ките — опция `Start icon`. */
  startIcon?: ButtonIcon
  /** Иконка справа. В ките — опция `End icon`. */
  endIcon?: ButtonIcon
  /** Выбрана. В ките — `State=Selected`. Скринридеру кнопка объявляется нажатой. */
  selected?: boolean
  /** Идёт действие: текст и иконки невидимы и держат ширину, поверх спин. В ките — `State=Loading`. */
  loading?: boolean
  /** Текст кнопки. В ките — `Content`. */
  children?: ReactNode
  className?: string
  /** Только для витрины: показать `Hover` или `Focus` карточкой, без мыши и клавиатуры. */
  'data-ds-state'?: 'hover' | 'focus'
}

// Иконка и спин: 16 в XL и L, 12 в остальных; диаметр спина равен размеру иконки.
const ICON_SIZE: Record<ButtonSize, IconSize> = { xl: 16, l: 16, m: 12, s: 12, xs: 12 }
const SPIN_SIZE: Record<ButtonSize, SpinSize> = { xl: 'xs', l: 'xs', m: 'xxs', s: 'xxs', xs: 'xxs' }
const TEXT: Record<ButtonSize, string> = { xl: 'control-l', l: 'control-l', m: 'control-m', s: 'control-s', xs: 'control-s' }

// Кнопка. Поведение — Button из Base UI: нажатие, клавиатура, выключенное состояние.
export function Button({
  view = 'primary-brand',
  size = 'xl',
  iconOnly = false,
  startIcon,
  endIcon,
  selected,
  loading = false,
  disabled = false,
  type = 'button',
  children,
  className,
  ...button
}: ButtonProps) {
  const icon = ICON_SIZE[size]
  return (
    <BaseButton
      {...button}
      type={type}
      className={['ds-button', `ds-text-${TEXT[size]}`, className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-icon-only={iconOnly ? '' : undefined}
      data-selected={selected ? '' : undefined}
      data-loading={loading ? '' : undefined}
      aria-pressed={selected === undefined ? undefined : selected}
      aria-busy={loading || undefined}
      // В загрузке кнопка не принимает нажатие, но остаётся в обходе клавиатурой: фокус с неё не слетает.
      disabled={disabled || loading}
      focusableWhenDisabled={loading && !disabled}
    >
      <span className="ds-button__content">
        {startIcon ? <Icon name={startIcon} size={icon} /> : null}
        {iconOnly ? null : <span className="ds-button__text">{children}</span>}
        {endIcon && !iconOnly ? <Icon name={endIcon} size={icon} /> : null}
      </span>
      {loading ? (
        <span className="ds-button__spin">
          <Spin size={SPIN_SIZE[size]} />
        </span>
      ) : null}
    </BaseButton>
  )
}
