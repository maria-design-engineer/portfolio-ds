import type { ReactNode } from 'react'

import { Icon } from '../icons/Icon'

export type ChipColor = 'neutral' | 'blue' | 'green' | 'teal' | 'orange'
export type ChipVariant = 'tint' | 'stroke' | 'fill'
export type ChipSize = 'm' | 's'
/** Иконка слева — 16. */
export type ChipStartIcon =
  | 'apps-regular'
  | 'brightness-low-regular'
  | 'circle-small'
  | 'design-ideas-regular'
  | 'form-multiple-collection-regular'
  | 'chevron-down'
  | 'dismiss'
  | 'edit'
  | 'eye'
  | 'search'
  | 'warning'
/** Иконка справа — 12. */
export type ChipEndIcon = 'dismiss-regular' | 'chevron-down' | 'dismiss' | 'edit' | 'eye' | 'search' | 'warning'

type Common = {
  /** Размер: `m` на десктопе, `s` на мобилке. В ките — ось `size`. */
  size?: ChipSize
  /** Иконка слева. В ките — опция `icon-left`. */
  startIcon?: ChipStartIcon
  /** Иконка справа. В ките — опция `icon-right`. */
  endIcon?: ChipEndIcon
  /** Текст метки. В ките — `текст`. */
  children?: ReactNode
  className?: string
}

// В ките оси `conditionals` и `style` ходят парой: Default + tint · active + stroke · active + fill.
// В коде это одно свойство `variant`. У `neutral` есть только `tint`.
export type ChipProps = Common &
  (
    | { /** Цвет. В ките — ось `color`. */ color?: 'neutral'; /** Вид. */ variant?: 'tint' }
    | { color: Exclude<ChipColor, 'neutral'>; variant?: ChipVariant }
  )

// Метка: короткое слово в капсуле. Не нажимается.
export function Chip({ color = 'neutral', variant = 'tint', size = 'm', startIcon, endIcon, children, className }: ChipProps) {
  return (
    <span
      className={['ds-chip', `ds-text-control-${size}`, className].filter(Boolean).join(' ')}
      data-color={color}
      data-variant={variant}
      data-size={size}
    >
      {startIcon ? <Icon name={startIcon} size={16} /> : null}
      <span className="ds-chip__text">{children}</span>
      {endIcon ? <Icon name={endIcon} size={12} /> : null}
    </span>
  )
}
