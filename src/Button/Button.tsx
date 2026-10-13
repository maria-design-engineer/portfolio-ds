import { Button as BaseButton } from '@base-ui/react/button'
import type { ComponentProps, ReactNode } from 'react'

import { Icon, type IconName, type IconSize } from '../icons/Icon'
import { Spin, type SpinSize } from '../Spin/Spin'

export type ButtonView = 'primary-brand' | 'outlined-action' | 'flat' | 'flat-action' | 'flat-secondary'
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'
// Иконки темы Filled в размерах 12 и 16 — те, что стоят в наборе кнопки.
export type ButtonIcon = Extract<IconName, 'arrow-left' | 'chevron-down' | 'dismiss' | 'edit' | 'eye' | 'search' | 'warning'>

export type ButtonProps = Omit<ComponentProps<'button'>, 'className' | 'style' | 'children'> & {
  /** Вид кнопки. В ките — ось `View`. */
  view?: ButtonView
  /** Размер. В ките — ось `Size`. */
  size?: ButtonSize
  /** Квадратная кнопка с одной иконкой — `startIcon`, без неё `endIcon`. В ките — ось `Icon only`. Нужен `aria-label`. */
  iconOnly?: boolean
  /** Иконка слева. В ките — опция `Start icon`. */
  startIcon?: ButtonIcon
  /** Иконка справа. В ките — опция `End icon`. */
  endIcon?: ButtonIcon
  /** Выбрана. В ките — `State=Selected`. Скринридеру кнопка объявляется нажатой. */
  selected?: boolean
  /** Идёт действие: текст и иконки невидимы и держат ширину, поверх спин. В ките — `State=Loading`. */
  loading?: boolean
  /**
   * Адрес: с ним кнопка — ссылка, тег `a`. Вид тот же. Для действия, которое уводит со страницы.
   * У ссылки нет загрузки, выбранного и выключенного состояний: `loading`, `selected`, `disabled` не действуют.
   */
  href?: string
  /** Куда открыть ссылку. Действует вместе с `href`. */
  target?: string
  /** Отношение ссылки. Действует вместе с `href`. */
  rel?: string
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
  href,
  target,
  rel,
  ...button
}: ButtonProps) {
  const icon = ICON_SIZE[size]
  const hasText = children !== undefined && children !== null && children !== false && children !== ''
  // Кнопка не рисует пустых частей: без текста она — «только иконка», какой бы из двух иконок её ни задали.
  const onlyIcon = iconOnly || (!hasText && Boolean(startIcon ?? endIcon))
  const single = startIcon ?? endIcon
  // С адресом кнопка — ссылка: родной `a`, тот же вид. Подписи доступности страницы переходят на ссылку.
  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={button['aria-label']}
        aria-describedby={button['aria-describedby']}
        // Ссылка на страницу, которая открыта сейчас: скринридер говорит «текущая страница».
        aria-current={button['aria-current']}
        id={button.id}
        className={['ds-button', `ds-text-${TEXT[size]}`, className].filter(Boolean).join(' ')}
        data-view={view}
        data-size={size}
        data-icon-only={onlyIcon ? '' : undefined}
      >
        <span className="ds-button__content">
          {onlyIcon ? (
            single ? <Icon name={single} size={icon} /> : null
          ) : (
            <>
              {startIcon ? <Icon name={startIcon} size={icon} /> : null}
              {hasText ? <span className="ds-button__text">{children}</span> : null}
              {endIcon ? <Icon name={endIcon} size={icon} /> : null}
            </>
          )}
        </span>
      </a>
    )
  }
  return (
    <BaseButton
      // Значения страницы для aria-pressed и aria-busy старше своих: пропы страницы идут следом.
      aria-pressed={selected === undefined ? undefined : selected}
      aria-busy={loading || undefined}
      {...button}
      type={type}
      className={['ds-button', `ds-text-${TEXT[size]}`, className].filter(Boolean).join(' ')}
      data-view={view}
      data-size={size}
      data-icon-only={onlyIcon ? '' : undefined}
      data-selected={selected ? '' : undefined}
      data-loading={loading ? '' : undefined}
      // Свой признак выключенной кнопки: атрибут Base UI data-disabled стоит и у кнопки в загрузке.
      data-off={disabled ? '' : undefined}
      // В загрузке кнопка не принимает нажатие, но остаётся в обходе клавиатурой: фокус с неё не слетает.
      disabled={disabled || loading}
      focusableWhenDisabled={loading && !disabled}
    >
      <span className="ds-button__content">
        {onlyIcon ? (
          single ? <Icon name={single} size={icon} /> : null
        ) : (
          <>
            {startIcon ? <Icon name={startIcon} size={icon} /> : null}
            {hasText ? <span className="ds-button__text">{children}</span> : null}
            {endIcon ? <Icon name={endIcon} size={icon} /> : null}
          </>
        )}
      </span>
      {loading ? (
        <span className="ds-button__spin">
          <Spin size={SPIN_SIZE[size]} />
        </span>
      ) : null}
    </BaseButton>
  )
}
