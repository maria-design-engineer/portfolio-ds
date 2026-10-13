import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Field } from '@base-ui/react/field'
import type { ComponentProps, ReactNode } from 'react'

import { Icon, type IconSize } from '../icons/Icon'

export type CheckboxSize = 'm' | 'l' | 'xl'

export type CheckboxProps = Omit<ComponentProps<'span'>, 'className' | 'style' | 'children' | 'onChange'> & {
  /** Размер. В ките — ось `Size`. */
  size?: CheckboxSize
  /** Отмечена. В ките — ось `Checked`. Значение держит страница: вместе с ним нужен `onCheckedChange`. */
  checked?: boolean
  /** Отмечена при появлении; дальше значение держит сам компонент. */
  defaultChecked?: boolean
  /** Человек отметил или снял галочку. */
  onCheckedChange?: (checked: boolean) => void
  /** Выключена: нажатие не принимает, из обхода клавиатурой выходит. В ките — `State=Disabled`. */
  disabled?: boolean
  /** Отметку сменить нельзя, фокус при этом остаётся на галочке. */
  readOnly?: boolean
  /** Обязательна: скринридеру объявляется обязательной. */
  required?: boolean
  /** Ошибка: красные обводка квадрата и подпись. В ките — `State=Error`. Текста ошибки у компонента нет, его ставит страница. */
  error?: boolean
  /** Имя поля в форме. */
  name?: string
  /** Значение, которое уходит с формой, когда галочка отмечена. */
  value?: string
  /** Подпись справа от квадрата. В ките — опция `Content`. Без неё остаётся один квадрат: имя для скринридера даёт страница. */
  children?: ReactNode
  className?: string
  /** Только для витрины: показать `Hover` или `Focus` карточкой, без мыши и клавиатуры. */
  'data-ds-state'?: 'hover' | 'focus'
}

// Иконка галочки: 16 в XL, 12 в L и M. Стиль подписи: XL и L — control/l, M — control/m.
const ICON_SIZE: Record<CheckboxSize, IconSize> = { xl: 16, l: 12, m: 12 }
const TEXT: Record<CheckboxSize, string> = { xl: 'control-l', l: 'control-l', m: 'control-m' }

// Галочка. Поведение — Checkbox из Base UI: отметка мышью и пробелом, скрытое поле для формы;
// связь с подписью и состояние ошибки — Field из Base UI, как у полей.
export function Checkbox({
  size = 'xl',
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  readOnly,
  required,
  error = false,
  name,
  value,
  children,
  className,
  'data-ds-state': dsState,
  ...box
}: CheckboxProps) {
  const hasLabel = children !== undefined && children !== null && children !== false && children !== ''

  return (
    <Field.Root
      // Корень — строчный элемент: галочка стоит внутри абзаца и рядом с текстом.
      render={<span />}
      className={['ds-checkbox', className].filter(Boolean).join(' ')}
      data-size={size}
      data-ds-state={dsState}
      // Свой признак «отметку не сменить»: атрибут Base UI data-readonly стоит только у квадрата, подписи он не виден.
      data-readonly={readOnly ? '' : undefined}
      name={name}
      invalid={error || undefined}
      disabled={disabled}
    >
      <BaseCheckbox.Root
        {...box}
        className="ds-checkbox__box"
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange ? (next) => onCheckedChange(next) : undefined}
        readOnly={readOnly}
        required={required}
        value={value}
      >
        <BaseCheckbox.Indicator className="ds-checkbox__check">
          <Icon name="checkmark" size={ICON_SIZE[size]} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {/* Подпись — настоящая метка: нажатие на неё отмечает галочку, скринридер читает её как имя. */}
      {hasLabel ? <Field.Label className={`ds-checkbox__label ds-text-${TEXT[size]}`}>{children}</Field.Label> : null}
    </Field.Root>
  )
}
