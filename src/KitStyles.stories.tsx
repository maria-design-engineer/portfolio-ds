import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

// Страница читает сам файл стилей: что в коде, то и на странице.
import stylesCss from './kit-styles.css?raw'

type Declaration = { name: string; value: string }

const declarations: Declaration[] = [...stylesCss.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map(([, name, value]) => ({
  name,
  value: value.trim(),
}))

const texts = declarations.filter((d) => d.name.startsWith('--text-'))
const shadows = declarations.filter((d) => d.name.startsWith('--elevation-'))
const gridNames = [...new Set(declarations.flatMap((d) => d.name.match(/^--grid-(\d+)-/)?.[1] ?? []))]
const gridValue = (grid: string, part: string) =>
  declarations.find((d) => d.name === `--grid-${grid}-${part}`)?.value ?? ''

const page: CSSProperties = {
  padding: 32,
  background: 'var(--color-bg-default)',
  color: 'var(--color-fg-primary)',
  font: 'var(--text-control-m)',
}
const cell: CSSProperties = {
  padding: '12px 24px 12px 0',
  borderBottom: '1px solid var(--color-fg-border-subtle)',
  textAlign: 'left',
  verticalAlign: 'middle',
}
const head: CSSProperties = { ...cell, color: 'var(--color-fg-secondary)', fontWeight: 400 }
const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, monospace', whiteSpace: 'nowrap' }
const title: CSSProperties = { margin: '0 0 12px', font: 'var(--text-subhead)' }

function sampleStyle(name: string): CSSProperties {
  const letterSpacing = name === '--text-body-2' ? 'var(--letter-spacing-body-2)' : undefined
  return { font: `var(${name})`, letterSpacing, whiteSpace: 'nowrap' }
}

function KitStylesPage() {
  return (
    <div style={page}>
      <h1 style={{ margin: '0 0 8px', font: 'var(--text-h3)' }}>Стили</h1>
      <p style={{ margin: '0 0 32px', color: 'var(--color-fg-secondary)' }}>
        Всего стилей: {texts.length + shadows.length + gridNames.length} · текстовых {texts.length} · теней{' '}
        {shadows.length} · сеток {gridNames.length}
      </p>

      <section style={{ marginBottom: 48 }}>
        <h2 style={title}>Текст — {texts.length}</h2>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={head}>Образец</th>
              <th style={head}>Стиль</th>
              <th style={head}>Значение</th>
            </tr>
          </thead>
          <tbody>
            {texts.map((text) => (
              <tr key={text.name}>
                <td style={cell}>
                  <span style={sampleStyle(text.name)}>
                    {text.name === '--text-decor-mono' ? 'design engineer · product designer' : 'Дизайн-система Design 123'}
                  </span>
                </td>
                <td style={{ ...cell, ...mono }}>{text.name}</td>
                <td style={{ ...cell, ...mono }}>{text.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={title}>Тени — {shadows.length}</h2>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {shadows.map((shadow) => (
              <tr key={shadow.name}>
                <td style={{ ...cell, padding: '24px 48px 24px 24px' }}>
                  <div
                    style={{
                      width: 120,
                      height: 72,
                      borderRadius: 'var(--radius-block-16)',
                      background: 'var(--color-bg-default)',
                      boxShadow: `var(${shadow.name})`,
                    }}
                  />
                </td>
                <td style={{ ...cell, ...mono }}>{shadow.name}</td>
                <td style={{ ...cell, ...mono }}>{shadow.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={title}>Сетки — {gridNames.length}</h2>
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
                <td style={{ ...cell, ...mono }}>--grid-{grid}-…</td>
                <td style={{ ...cell, ...mono }}>{gridValue(grid, 'columns')}</td>
                <td style={{ ...cell, ...mono }}>{gridValue(grid, 'margin')}</td>
                <td style={{ ...cell, ...mono }}>{gridValue(grid, 'gutter')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
