export type SpinSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'

export type SpinProps = {
  /** Диаметр. В ките — ось `Size`. */
  size?: SpinSize
  /**
   * Подпись для скринридера: что сейчас происходит. Текст даёт страница — своих формулировок у библиотеки нет.
   * Без подписи спин для скринридера не существует: смысл несёт то, что рядом.
   */
  'aria-label'?: string
  className?: string
}

// Диаметр и толщина линии — числа набора кита 739:9029: переменных размера у компонента нет.
const GEOMETRY: Record<SpinSize, { diameter: number; stroke: number }> = {
  xxs: { diameter: 12, stroke: 1.5 },
  xs: { diameter: 16, stroke: 2 },
  s: { diameter: 24, stroke: 2 },
  m: { diameter: 28, stroke: 2 },
  l: { diameter: 32, stroke: 2 },
  xl: { diameter: 36, stroke: 2 },
}

const ARC = 150 / 360

// Индикатор загрузки: дуга 150°, вращается равномерно. Цвет — цвет текста вокруг, по умолчанию акцентный.
export function Spin({ size = 'xs', 'aria-label': label, className }: SpinProps) {
  const { diameter, stroke } = GEOMETRY[size]
  const radius = (diameter - stroke) / 2
  const length = 2 * Math.PI * radius
  return (
    <span
      className={['ds-spin', className].filter(Boolean).join(' ')}
      data-size={size}
      // Область «статус» объявляет скринридеру свой текст, а не атрибут: подпись лежит внутри скрытым текстом.
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      style={{ width: diameter, height: diameter }}
    >
      {label ? <span className="ds-spin__label">{label}</span> : null}
      <svg aria-hidden="true" viewBox={`0 0 ${diameter} ${diameter}`} width={diameter} height={diameter}>
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${length * ARC} ${length}`}
        />
      </svg>
    </span>
  )
}
