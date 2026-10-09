import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

// Страница читает сам файл токенов: что в коде, то и на странице. Второго списка нет.
import tokensCss from './tokens.css?raw'

type Token = { name: string; value: string; mobile?: string }
type Collection = { name: string; tokens: Token[] }

const DECLARATION = /(--[a-z0-9-]+):\s*([^;]+);/g

function readDeclarations(css: string): Token[] {
  return [...css.matchAll(DECLARATION)].map(([, name, value]) => ({ name, value: value.trim() }))
}

function readCollections(css: string): Collection[] {
  const [desktop, mobile = ''] = css.split('@mode Mobile')
  const mobileValues = new Map(readDeclarations(mobile).map((t) => [t.name, t.value]))

  return desktop
    .split('@collection ')
    .slice(1)
    .map((chunk) => ({
      name: chunk.match(/^[A-Za-z]+/)?.[0] ?? '',
      tokens: readDeclarations(chunk).map((t) => ({ ...t, mobile: mobileValues.get(t.name) })),
    }))
}

const collections = readCollections(tokensCss)
const all = new Map(collections.flatMap((c) => c.tokens).map((t) => [t.name, t.value]))
const total = collections.reduce((sum, c) => sum + c.tokens.length, 0)

// Значение, на которое ссылается переменная Semantic: var(--ink-900) → #15181f.
function resolve(value: string): string {
  const ref = value.match(/^var\((--[a-z0-9-]+)\)$/)?.[1]
  return ref ? resolve(all.get(ref) ?? value) : value
}

const isColor = (value: string) => /^(#|rgb)/.test(resolve(value))

const page: CSSProperties = {
  padding: 32,
  background: 'var(--color-bg-default)',
  color: 'var(--color-fg-primary)',
  font: '13px/18px system-ui, sans-serif',
}
const cell: CSSProperties = {
  padding: '8px 16px 8px 0',
  borderBottom: '1px solid var(--color-fg-border-subtle)',
  textAlign: 'left',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
}
const head: CSSProperties = { ...cell, color: 'var(--color-fg-secondary)', fontWeight: 400 }
const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, monospace' }
const swatch: CSSProperties = {
  display: 'inline-block',
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--color-fg-border)',
  verticalAlign: 'middle',
}

function Sample({ token }: { token: Token }) {
  if (isColor(token.value)) return <span style={{ ...swatch, background: `var(${token.name})` }} />
  if (token.name.startsWith('--radius'))
    return <span style={{ ...swatch, borderRadius: `min(var(${token.name}), 16px)`, background: 'var(--color-bg-subtle)' }} />
  if (token.name.startsWith('--space'))
    return <span style={{ display: 'inline-block', width: `var(${token.name})`, height: 12, background: 'var(--color-bg-brand)' }} />
  return null
}

function CollectionTable({ collection }: { collection: Collection }) {
  const responsive = collection.tokens.some((t) => t.mobile !== undefined)
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ margin: '0 0 12px', font: '600 17px/24px system-ui, sans-serif' }}>
        {collection.name} — {collection.tokens.length}
      </h2>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={head}>Образец</th>
            <th style={head}>Переменная</th>
            <th style={head}>{responsive ? 'Desktop' : 'Значение'}</th>
            <th style={head}>{responsive ? 'Mobile' : 'Итог'}</th>
          </tr>
        </thead>
        <tbody>
          {collection.tokens.map((token) => (
            <tr key={token.name}>
              <td style={cell}>
                <Sample token={token} />
              </td>
              <td style={{ ...cell, ...mono }}>{token.name}</td>
              <td style={{ ...cell, ...mono }}>{token.value}</td>
              <td style={{ ...cell, ...mono }}>
                {responsive ? token.mobile : token.value === resolve(token.value) ? '' : resolve(token.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function TokensPage() {
  return (
    <div style={page}>
      <h1 style={{ margin: '0 0 8px', font: '700 22px/28px system-ui, sans-serif' }}>Токены</h1>
      <p style={{ margin: '0 0 32px', color: 'var(--color-fg-secondary)' }}>
        Всего переменных: {total} · {collections.map((c) => `${c.name} ${c.tokens.length}`).join(' · ')}
      </p>
      {collections.map((collection) => (
        <CollectionTable key={collection.name} collection={collection} />
      ))}
    </div>
  )
}

const meta = {
  title: 'Токены',
  component: TokensPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TokensPage>

export default meta
type Story = StoryObj<typeof meta>

export const Variables: Story = { name: 'Переменные' }
