import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

// Страница читает сам файл токенов: что в коде, то и на странице. Второго списка нет.
import { readCollections, resolve, type Collection, type Token } from './showcase/css.stories.helpers'
import tokensCss from './tokens.css?raw'

const collections = readCollections(tokensCss)
const all = new Map(collections.flatMap((c) => c.tokens).map((t) => [t.name, t.value]))
const total = collections.reduce((sum, c) => sum + c.tokens.length, 0)

const result = (token: Token) => resolve(token.value, all)
const isColor = (token: Token) => {
  const resolved = result(token)
  return 'value' in resolved && /^(#|rgb)/.test(resolved.value)
}

const page: CSSProperties = { padding: 32, background: 'var(--ds-color-bg-default)', color: 'var(--ds-color-fg-primary)' }
const cell: CSSProperties = {
  padding: '8px 16px 8px 0',
  borderBottom: '1px solid var(--ds-color-fg-border-subtle)',
  textAlign: 'left',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
}
const head: CSSProperties = { ...cell, color: 'var(--ds-color-fg-secondary)', fontWeight: 400 }
const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, monospace' }
const swatch: CSSProperties = {
  display: 'inline-block',
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--ds-color-fg-border)',
  verticalAlign: 'middle',
}

function Sample({ token }: { token: Token }) {
  if (isColor(token)) return <span style={{ ...swatch, background: `var(${token.name})` }} />
  if (token.name.startsWith('--ds-radius'))
    return <span style={{ ...swatch, borderRadius: `min(var(${token.name}), 16px)`, background: 'var(--ds-color-bg-subtle)' }} />
  if (token.name.startsWith('--ds-space'))
    return <span style={{ display: 'inline-block', width: `var(${token.name})`, height: 12, background: 'var(--ds-color-bg-brand)' }} />
  return null
}

function Final({ token }: { token: Token }) {
  const resolved = result(token)
  if ('error' in resolved) return <span style={{ color: 'var(--ds-color-fg-danger)' }}>ошибка — {resolved.error}</span>
  return <>{resolved.value === token.value ? '' : resolved.value}</>
}

function CollectionTable({ collection }: { collection: Collection }) {
  const responsive = collection.tokens.some((t) => t.mobile !== undefined)
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 className="ds-text-subhead" style={{ margin: '0 0 12px' }}>
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
              <td style={{ ...cell, ...mono }}>{responsive ? token.mobile : <Final token={token} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function TokensPage() {
  return (
    <div className="ds-text-control-m" style={page}>
      <h1 className="ds-text-h3" style={{ margin: '0 0 8px' }}>
        Токены
      </h1>
      <p style={{ margin: '0 0 32px', color: 'var(--ds-color-fg-secondary)' }}>
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
