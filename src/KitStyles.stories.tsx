import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Страница читает сами файлы стилей и токенов: что в коде, то и на странице.
import stylesCss from './kit-styles.css?raw'
import { readCollections, readTextStyles, readVariables, substitute, type TextStyle } from './showcase/css.stories.helpers'
import tokensCss from './tokens.css?raw'

const texts = readTextStyles(stylesCss)
const variables = readVariables(stylesCss)
const shadows = [...variables].filter(([name]) => name.startsWith('--ds-elevation-'))
const gridNames = [...new Set([...variables.keys()].flatMap((name) => name.match(/^--ds-grid-(\d+)-/)?.[1] ?? []))]

const responsive = readCollections(tokensCss).flatMap((c) => c.tokens).filter((t) => t.mobile !== undefined)
const desktopValues = new Map([...variables, ...responsive.map((t) => [t.name, t.value] as const)])
const mobileValues = new Map([...variables, ...responsive.map((t) => [t.name, t.mobile ?? t.value] as const)])
const byMode = (style: TextStyle) => /--ds-font-size-/.test(style.font)

// «900 64px / 68px 'Golos Text', …» → «900 · 64 / 68 · Golos Text»
function short(font: string, values: Map<string, string>): string {
  const [weight, size, , height, ...family] = substitute(font, values).split(/\s+/)
  const name = family.join(' ').split(',')[0].replace(/'/g, '')
  return `${weight} · ${parseFloat(size)} / ${parseFloat(height)} · ${name}`
}

const page: CSSProperties = { padding: 32, background: 'var(--ds-color-bg-default)', color: 'var(--ds-color-fg-primary)' }
const cell: CSSProperties = {
  padding: '12px 24px 12px 0',
  borderBottom: '1px solid var(--ds-color-fg-border-subtle)',
  textAlign: 'left',
  verticalAlign: 'middle',
}
const head: CSSProperties = { ...cell, color: 'var(--ds-color-fg-secondary)', fontWeight: 400 }
const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, monospace', whiteSpace: 'nowrap' }
const title = { margin: '0 0 12px' }

const sample = (style: TextStyle) =>
  style.name === 'decor-mono' ? 'design engineer · product designer' : 'Дизайн-система Design 123'

function KitStylesPage() {
  return (
    <div className="ds-text-control-m" style={page}>
      <h1 className="ds-text-h3" style={{ margin: '0 0 8px' }}>
        Стили
      </h1>
      <p style={{ margin: '0 0 32px', color: 'var(--ds-color-fg-secondary)' }}>
        Всего стилей: {texts.length + shadows.length + gridNames.length} · текстовых {texts.length} · теней{' '}
        {shadows.length} · сеток {gridNames.length}
      </p>

      <section style={{ marginBottom: 48 }}>
        <h2 className="ds-text-subhead" style={title}>
          Текст — {texts.length}
        </h2>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={head}>Класс</th>
              <th style={head}>Desktop</th>
              <th style={head}>Образец Desktop</th>
              <th style={head}>Mobile</th>
              <th style={head}>Образец Mobile</th>
            </tr>
          </thead>
          <tbody>
            {texts.map((style) => (
              <tr key={style.name}>
                <td style={{ ...cell, ...mono }}>ds-text-{style.name}</td>
                <td style={{ ...cell, ...mono }}>{short(style.font, desktopValues)}</td>
                <td style={{ ...cell, whiteSpace: 'nowrap' }} data-ds-mode="desktop">
                  <span className={`ds-text-${style.name}`}>{sample(style)}</span>
                </td>
                <td style={{ ...cell, ...mono }}>{byMode(style) ? short(style.font, mobileValues) : 'тот же'}</td>
                <td style={{ ...cell, whiteSpace: 'nowrap' }} data-ds-mode="mobile">
                  {byMode(style) ? <span className={`ds-text-${style.name}`}>{sample(style)}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 className="ds-text-subhead" style={title}>
          Тени — {shadows.length}
        </h2>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {shadows.map(([name, value]) => (
              <tr key={name}>
                <td style={{ ...cell, padding: '24px 48px 24px 24px' }}>
                  <div
                    style={{
                      width: 120,
                      height: 72,
                      borderRadius: 'var(--ds-radius-block-16)',
                      background: 'var(--ds-color-bg-default)',
                      boxShadow: `var(${name})`,
                    }}
                  />
                </td>
                <td style={{ ...cell, ...mono }}>{name}</td>
                <td style={{ ...cell, ...mono }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="ds-text-subhead" style={title}>
          Сетки — {gridNames.length}
        </h2>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={head}>Сетка</th>
              <th style={head}>Колонок</th>
              <th style={head}>Поля</th>
              <th style={head}>Между колонками</th>
            </tr>
          </thead>
          <tbody>
            {gridNames.map((grid) => (
              <tr key={grid}>
                <td style={{ ...cell, ...mono }}>--ds-grid-{grid}-…</td>
                <td style={{ ...cell, ...mono }}>{variables.get(`--ds-grid-${grid}-columns`)}</td>
                <td style={{ ...cell, ...mono }}>{variables.get(`--ds-grid-${grid}-margin`)}</td>
                <td style={{ ...cell, ...mono }}>{variables.get(`--ds-grid-${grid}-gutter`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

// Заголовок и размер, который браузер посчитал на самом элементе.
function Measured({ mode }: { mode: 'desktop' | 'mobile' }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [size, setSize] = useState('')
  useEffect(() => {
    if (!ref.current) return
    const computed = getComputedStyle(ref.current)
    setSize(`${parseFloat(computed.fontSize)} / ${parseFloat(computed.lineHeight)}`)
  }, [])
  return (
    <div data-ds-mode={mode} style={{ marginBottom: 32 }}>
      <div className="ds-text-control-m" style={{ marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }}>
        data-ds-mode="{mode}" · ds-text-h1 · посчитано браузером: {size}
      </div>
      <h1 ref={ref} className="ds-text-h1" style={{ margin: 0 }}>
        Заголовок блока
      </h1>
    </div>
  )
}

function ForcedModePage() {
  return (
    <div style={page}>
      <Measured mode="desktop" />
      <Measured mode="mobile" />
    </div>
  )
}

const meta = {
  title: 'Токены',
  component: KitStylesPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof KitStylesPage>

export default meta
type Story = StoryObj<typeof meta>

export const Styles: Story = { name: 'Стили' }

// Режим на контейнере не зависит от ширины окна: h1 — 40 / 48 в Desktop и 18 / 22 в Mobile.
export const ForcedMode: Story = { name: 'Режим на контейнере', render: () => <ForcedModePage /> }
