export type ProbeProps = {
  label?: string
}

// Пробный компонент окружения: доказывает, что сборка, стили и витрина работают.
// Компоненты библиотеки собирает Frontend; этот — убрать с первым настоящим.
export function Probe({ label = 'ds: окружение работает' }: ProbeProps) {
  return <span className="ds-probe">{label}</span>
}
