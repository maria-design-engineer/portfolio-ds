import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties } from 'react'

import { iconList } from './Icon'

// Каталог набора иконок. Грузится только в витрине: в пакет для сайта едут лишь иконки из таблицы Icon.tsx.
const files = {
  ...import.meta.glob<string>('../../node_modules/@fluentui/svg-icons/icons/*_12_{filled,regular}.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  ...import.meta.glob<string>('../../node_modules/@fluentui/svg-icons/icons/*_16_{filled,regular}.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  ...import.meta.glob<string>('../../node_modules/@fluentui/svg-icons/icons/*_20_{filled,regular}.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
}

type Theme = 'filled' | 'regular'
type Entry = { name: string; size: number; theme: Theme; svg: string }

const entries: Entry[] = Object.entries(files).flatMap(([path, svg]) => {
  const match = path.match(/\/([a-z0-9_]+)_(\d+)_(filled|regular)\.svg$/)
  return match ? [{ name: match[1], size: Number(match[2]), theme: match[3] as Theme, svg }] : []
})

// Подключённые в библиотеку: имя в коде «dismiss-regular» ↔ файл «dismiss_…_regular».
const connected = new Set(
  iconList.flatMap(({ name, sizes }) => {
    const theme: Theme = name.endsWith('-regular') ? 'regular' : 'filled'
    const file = name.replace(/-regular$/, '').replace(/-/g, '_')
    return sizes.map((size) => `${file}_${size}_${theme}`)
  }),
)
const codeName = (entry: Entry) => entry.name.replace(/_/g, '-') + (entry.theme === 'regular' ? '-regular' : '')

const LIMIT = 600
const sizes = [12, 16, 20]
const themes: Theme[] = ['filled', 'regular']

const page: CSSProperties = { padding: 32, color: 'var(--ds-color-fg-primary)' }
const bar: CSSProperties = { display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 24px' }
const input: CSSProperties = {
  width: 280,
  height: 34,
  padding: '0 12px',
  border: '1px solid var(--ds-color-fg-border)',
  borderRadius: 'var(--ds-radius-control-m)',
  font: 'inherit',
  color: 'inherit',
}
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 8 }
const tile: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: '16px 8px 12px',
  border: '1px solid var(--ds-color-fg-border-subtle)',
  borderRadius: 'var(--ds-radius-block-12)',
  textAlign: 'center',
  wordBreak: 'break-word',
}

function Choice<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ color: 'var(--ds-color-fg-secondary)' }}>{label}</span>
      {options.map((option) => (
        <label key={option} style={{ display: 'flex', gap: 4, alignItems: 'center', cursor: 'pointer' }}>
          <input type="radio" checked={value === option} onChange={() => onChange(option)} />
          {option}
        </label>
      ))}
    </span>
  )
}

function IconsPage() {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState(16)
  const [theme, setTheme] = useState<Theme>('filled')
  const [onlyConnected, setOnlyConnected] = useState(false)

  const found = useMemo(() => {
    const words = query.toLowerCase().trim().split(/[\s_-]+/).filter(Boolean)
    return entries.filter(
      (entry) =>
        entry.size === size &&
        entry.theme === theme &&
        words.every((word) => entry.name.includes(word)) &&
        (!onlyConnected || connected.has(`${entry.name}_${entry.size}_${entry.theme}`)),
    )
  }, [query, size, theme, onlyConnected])

  return (
    <div className="ds-text-control-m" style={page}>
      <h1 className="ds-text-h3" style={{ margin: '0 0 8px' }}>
        Иконки
      </h1>
      <p style={{ margin: '0 0 24px', color: 'var(--ds-color-fg-secondary)' }}>
        Набор лежит в библиотеке целиком. Подключено в код: {iconList.length} — они помечены оранжевой рамкой и
        едут в пакет для сайта. Остальные подключаются по имени, когда понадобятся.
      </p>
      <div style={bar}>
        <input style={input} type="search" placeholder="Поиск по имени: arrow, mail, chevron" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Choice label="Размер" value={size} options={sizes} onChange={setSize} />
        <Choice label="Тема" value={theme} options={themes} onChange={setTheme} />
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={onlyConnected} onChange={(event) => setOnlyConnected(event.target.checked)} />
          только подключённые
        </label>
      </div>
      <p style={{ margin: '0 0 16px', color: 'var(--ds-color-fg-secondary)' }}>
        Найдено: {found.length}
        {found.length > LIMIT ? ` · показаны первые ${LIMIT}, уточни поиск` : ''}
      </p>
      <div style={grid}>
        {found.slice(0, LIMIT).map((entry) => {
          const isConnected = connected.has(`${entry.name}_${entry.size}_${entry.theme}`)
          return (
            <div
              key={`${entry.name}-${entry.size}-${entry.theme}`}
              className="ds-text-control-s"
              style={{ ...tile, borderColor: isConnected ? 'var(--ds-color-fg-focus)' : undefined }}
            >
              <span
                style={{ display: 'block', width: entry.size, height: entry.size, fill: 'currentColor' }}
                dangerouslySetInnerHTML={{ __html: entry.svg }}
              />
              <span style={{ color: 'var(--ds-color-fg-secondary)' }}>{codeName(entry)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const meta = {
  title: 'Токены',
  component: IconsPage,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof IconsPage>

export default meta

export const Icons: StoryObj<typeof meta> = { name: 'Иконки' }
