import { Field } from '@base-ui/react/field'
import { useCallback, useRef, type ComponentProps, type Ref } from 'react'

import { Icon, type IconSize } from '../icons/Icon'

export type TextInputSize = 's' | 'm' | 'l' | 'xl'

export type TextInputProps = Omit<ComponentProps<'input'>, 'size' | 'className' | 'style'> & {
  /** Размер поля. В ките — ось `Size`. */
  size?: TextInputSize
  /** Подпись внутри поля, слева от текста. В ките — опция `Label`. */
  label?: string
  /** Иконка поиска слева. В ките — опция `Start icon`. */
  startIcon?: boolean
  /** Крестик справа: стирает текст поля. В ките — опция `Clear button`. */
  clearable?: boolean
  /** Подпись крестика для скринридера. Текст даёт страница: своих формулировок у библиотеки нет. */
  clearLabel?: string
  /** Иконка карандаша справа. В ките — опция `Edit icon`. */
  editIcon?: boolean
  /** Иконка глаза справа. В ките — опция `Eye icon`. */
  eyeIcon?: boolean
  /** Серый текст справа. В ките — опция `Additional`. */
  additional?: string
  /** Ошибка: красная обводка. Без `errorText` — `Error inline`, с ним — `Error outline`. */
  error?: boolean
  /** Иконка ошибки справа, В ките — опция `Error icon`: по умолчанию видна в `Error inline`. */
  errorIcon?: boolean
  /** Текст ошибки под полем. Высоту поля не меняет. */
  errorText?: string
  className?: string
  /** Только для витрины: показать `Hover` или `Active` карточкой, без мыши и клавиатуры. */
  'data-ds-state'?: 'hover' | 'active'
}

const ICON_SIZE: Record<TextInputSize, IconSize> = { xl: 16, l: 16, m: 12, s: 12 }
// Стиль текста поля по размеру — таблица профиля: XL и L — control/l, M — control/m, S — control/s.
export const FIELD_TEXT: Record<TextInputSize, string> = { xl: 'control-l', l: 'control-l', m: 'control-m', s: 'control-s' }

// Стереть текст так, чтобы страница узнала об этом через свой onChange — и при своём value, и без него.
export function clearControl(control: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!control) return
  const proto = control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(control, '')
  control.dispatchEvent(new Event('input', { bubbles: true }))
  control.focus()
}

// Одна ссылка на поле для двоих: компоненту — чтобы работал крестик, странице — чтобы поставить фокус.
export function useSharedRef<T>(outer: Ref<T> | undefined) {
  const inner = useRef<T | null>(null)
  const set = useCallback(
    (node: T | null) => {
      inner.current = node
      if (typeof outer === 'function') outer(node)
      else if (outer) outer.current = node
    },
    [outer],
  )
  return [inner, set] as const
}

// Однострочное поле ввода. Поведение — Field из Base UI: связь ошибки и поля, состояния атрибутами.
export function TextInput({
  size = 'xl',
  label,
  startIcon = false,
  clearable = false,
  clearLabel,
  editIcon = false,
  eyeIcon = false,
  additional,
  error = false,
  errorIcon,
  errorText,
  disabled = false,
  className,
  'data-ds-state': dsState,
  ref,
  ...input
}: TextInputProps) {
  const [control, setControl] = useSharedRef<HTMLInputElement>(ref)
  const icon = ICON_SIZE[size]
  const text = FIELD_TEXT[size]
  const showClear = clearable && !disabled
  // По мастерам кита иконка стоит в `Error inline`; в `Error outline` ошибку несёт строка под полем.
  const showErrorIcon = error && (errorIcon ?? !errorText)
  const hasRight = showClear || editIcon || eyeIcon || Boolean(additional) || showErrorIcon

  return (
    <Field.Root
      className={['ds-field', 'ds-text-input', className].filter(Boolean).join(' ')}
      data-size={size}
      data-ds-state={dsState}
      invalid={error}
      disabled={disabled}
    >
      <div className={`ds-field__box ds-text-${text}`} onClick={(event) => !(event.target as Element).closest('button') && control.current?.focus()}>
        <span className="ds-field__left">
          {startIcon ? <Icon name="search" size={icon} /> : null}
          {label ? <span className={`ds-field__label ds-text-${text}-strong`}>{label}</span> : null}
          <Field.Control className="ds-field__control" {...input} ref={setControl} />
        </span>
        {hasRight ? (
          <span className="ds-field__right">
            {showClear ? (
              <button
                type="button"
                className="ds-field__slot ds-field__clear"
                aria-label={clearLabel}
                onClick={() => clearControl(control.current)}
              >
                <Icon name="dismiss" size={icon} />
              </button>
            ) : null}
            {editIcon ? (
              <span className="ds-field__slot">
                <Icon name="edit" size={icon} />
              </span>
            ) : null}
            {eyeIcon ? (
              <span className="ds-field__slot">
                <Icon name="eye" size={icon} />
              </span>
            ) : null}
            {additional ? <span className="ds-field__additional ds-text-control-s">{additional}</span> : null}
            {showErrorIcon ? (
              <span className="ds-field__error-icon">
                <Icon name="warning" size={icon} />
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
      {error && errorText ? (
        <Field.Error className="ds-field__error ds-text-control-m" match>
          {errorText}
        </Field.Error>
      ) : null}
    </Field.Root>
  )
}
