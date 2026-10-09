import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

import { Icon, iconList } from './Icon'

// Каталог иконок, подключённых в библиотеку. Страница читает ту же таблицу, что и компоненты.
const cell: CSSProperties = {
  padding: '12px 32px 12px 0',
  borderBottom: '1px solid var(--ds-color-fg-border-subtle)',
  textAlign: 'left',
  verticalAlign: 'middle',
}
const head: CSSProperties = { ...cell, color: 'var(--ds-color-fg-secondary)', fontWeight: 400 }
const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, monospace' }

function IconsPage() {
  return (
    <div className="ds-text-control-m" style={{ padding: 32, color: 'var(--ds-color-fg-primary)' }}>
      <h1 className="ds-text-h3" style={{ margin: '0 0 8px' }}>
        Иконки
      </h1>
      <p style={{ margin: '0 0 32px', color: 'var(--ds-color-fg-secondary)' }}>
        Подключено в библиотеку: {iconList.length}. Имя с «regular» — тема Regular, остальные — Filled.
      </p>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={head}>Имя в коде</th>
            <th style={head}>12</th>
            <th style={head}>16</th>
          </tr>
        </thead>
        <tbody>
          {iconList.map(({ name, sizes }) => (
            <tr key={name}>
              <td style={{ ...cell, ...mono }}>{name}</td>
              <td style={cell}>{sizes.includes(12) ? <Icon name={name} size={12} /> : '—'}</td>
              <td style={cell}>{sizes.includes(16) ? <Icon name={name} size={16} /> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
