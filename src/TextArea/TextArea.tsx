import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'

type ControlProps = ComponentProps<typeof Field.Control>

import { Icon, type IconSize } from '../icons/Icon'
import { clearControl, FIELD_TEXT, useSharedRef } from '../TextInput/TextInput'

export type TextAreaSize = 's' | 'm' | 'l' | 'xl'

export type TextAreaProps = Omit<ComponentProps<'textarea'>, 'className' | 'style'> & {
  /** Размер поля: шрифт, отступы, скругление. Высота у всех размеров одна — 102. В ките — ось `Size`. */
  size?: TextAreaSize
  /** Крестик справа сверху: стирает текст поля. В ките — опция `Clear button`. */
  clearable?: boolean
  /** Подпись крестика для скринридера. Текст даёт страница: своих формулировок у библиотеки нет. */
  clearLabel?: string
  /** Серый текст под полем, справа. В ките — опция `Additional`. */
  additional?: string
  /** Ошибка: красная обводка. Без `errorText` — `Error inline`, с ним — `Error outline`. */
  error?: boolean
  /** Иконка ошибки справа сверху, В ките — опция `Error icon`: по умолчанию видна в `Error inline`. */
  errorIcon?: boolean
  /** Текст ошибки под полем. Высоту поля не меняет. */
  errorText?: string
  className?: string
  /** Только для витрины: показать `Hover` или `Active` карточкой, без мыши и клавиатуры. */
  'data-ds-state'?: 'hover' | 'active'
}

const ICON_SIZE: Record<TextAreaSize, IconSize> = { xl: 16, l: 16, m: 12, s: 12 }

// Многострочное поле ввода. Не растёт с текстом: длинный текст прокручивается внутри.
export function TextArea({
  size = 'xl',
  clearable = false,
  clearLabel,
  additional,
  error = false,
  errorIcon,
  errorText,
  disabled = false,
  className,
  'data-ds-state': dsState,
  ref,
  ...textarea
}: TextAreaProps) {
  const [control, setControl] = useSharedRef<HTMLTextAreaElement>(ref)
  const icon = ICON_SIZE[size]
  const text = FIELD_TEXT[size]
  // Поле, которое нельзя править, нельзя править и крестиком.
  const showClear = clearable && !disabled && !textarea.readOnly
  // Атрибуты, которых у input нет, идут прямо в textarea; остальные — в Base UI, как у TextInput:
  // так форма видит имя и значение поля и привязывает к нему ошибку по имени.
  const { rows, cols, wrap, ...control_ } = textarea
  // По мастерам кита иконка стоит в `Error inline`; в `Error outline` ошибку несёт строка под полем.
  const showErrorIcon = error && (errorIcon ?? !errorText)
  const showError = error && Boolean(errorText)

  return (
    <Field.Root
      className={['ds-field', 'ds-text-area', className].filter(Boolean).join(' ')}
      data-size={size}
      data-ds-state={dsState}
      // Имя — и корню поля: форма привязывает ошибку по имени уже при серверной отрисовке, до браузера.
      name={textarea.name}
      invalid={error || undefined}
      disabled={disabled}
    >
      <div className={`ds-field__box ds-text-${text}`} onClick={(event) => !(event.target as Element).closest('button') && control.current?.focus()}>
        <Field.Control
          className="ds-field__control"
          render={<textarea rows={rows} cols={cols} wrap={wrap} />}
          {...(control_ as ControlProps)}
          ref={setControl as ControlProps['ref']}
        />
        {showClear || showErrorIcon ? (
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
            {showErrorIcon ? (
              <span className="ds-field__error-icon">
                <Icon name="warning" size={icon} />
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
      {showError || additional ? (
        <div className="ds-field__bottom">
          {showError ? (
            <Field.Error className="ds-field__error ds-text-control-m" match>
              {errorText}
            </Field.Error>
          ) : (
            <Field.Error className="ds-field__error ds-text-control-m" />
          )}
          {additional ? (
            <span className={`ds-field__additional ds-text-control-${size === 's' ? 's' : 'm'}`}>{additional}</span>
          ) : null}
        </div>
      ) : (
        // Своего текста нет — строка покажет сообщение формы, если форма привязала ошибку к полю по имени.
        <Field.Error className="ds-field__error ds-text-control-m" />
      )}
    </Field.Root>
  )
}
