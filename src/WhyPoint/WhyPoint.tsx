import { useId, type ComponentProps, type ReactNode } from 'react'

// Рисованная галочка — экземпляр `.illustrations`, name=check из кита: закрашенный мазок кисти на рамке 40×48.
import checkSvg from './check.svg?raw'

const BRUSH = checkSvg.match(/ d="([^"]+)"/)?.[1] ?? ''

// Осевая линия мазка — вектор того же экземпляра в Figma, с его матрицей положения и поворота.
// Развёрнута от короткого штриха к длинному: так галочку пишут от руки.
const AXIS = 'M31.8318 0 L42.6522 18.3696 C42.6522 18.3696 18.5528 17.801 0 26.6334'
const AXIS_TRANSFORM = 'matrix(-0.3328214 0.9429899 0.9429899 0.3328214 14.2854824 -6.1904764)'

// Галочка «пишется»: линия-шторка открывает мазок от начала к концу. Шторка шире мазка — 16 против 10,5.
function Check() {
  const mask = useId()
  return (
    <svg viewBox="0 0 40 48" focusable="false">
      <mask id={mask} maskUnits="userSpaceOnUse" x="-8" y="-8" width="56" height="64">
        <path
          className="ds-why-point__stroke"
          d={AXIS}
          transform={AXIS_TRANSFORM}
          pathLength={1}
          fill="none"
          stroke="#fff"
          strokeWidth="16"
          strokeLinecap="square"
        />
      </mask>
      {/* Бледная галочка плашки `tab`: лежит всегда, яркая рисуется поверх. У строки `list` её нет. */}
      <path className="ds-why-point__ghost" d={BRUSH} />
      <path d={BRUSH} mask={`url(#${mask})`} />
    </svg>
  )
}

export type WhyPointView = 'list' | 'tab'

export type WhyPointProps = Omit<ComponentProps<'button'>, 'className' | 'style' | 'children'> & {
  /** Вид: `list` — строка списка на десктопе, `tab` — плашка на мобилке. В ките — ось `view`. */
  view?: WhyPointView
  /** Пункт выбран. В ките — `state=selected`. Скринридеру кнопка объявляется нажатой. */
  selected?: boolean
  /** Текст пункта. В ките — `text`. */
  children?: ReactNode
  className?: string
  /** Только для витрины: показать `hover` карточкой, без мыши. */
  'data-ds-state'?: 'hover'
}

// Пункт списка в блоке «Зачем»: рисованная галочка и строка текста. Нажатие выбирает пункт.
export function WhyPoint({ view = 'list', selected = false, type = 'button', children, className, ...button }: WhyPointProps) {
  return (
    <button
      // Своя разметка выбора — «нажатая кнопка». Страница, которая собирает из пунктов вкладки,
      // передаёт свою роль: тогда aria-pressed не ставится. Пропы страницы идут следом и старше своих.
      aria-pressed={button.role && button.role !== 'button' ? undefined : selected}
      {...button}
      type={type}
      className={['ds-why-point', className].filter(Boolean).join(' ')}
      data-view={view}
      data-selected={selected ? '' : undefined}
    >
      <span className="ds-why-point__check" aria-hidden="true">
        <Check />
      </span>
      <span className={`ds-why-point__text ds-text-${view === 'list' ? 'body-1' : 'body-2'}`}>{children}</span>
    </button>
  )
}
