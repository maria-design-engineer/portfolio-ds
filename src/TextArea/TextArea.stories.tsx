import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { TextArea, type TextAreaProps, type TextAreaSize } from './TextArea'

const meta = {
  title: 'TextArea',
  component: TextArea,
  args: { size: 'xl', defaultValue: 'Content' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l', 'xl'] },
    additional: { control: 'text' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    clearLabel: { control: 'text' },
    clearable: { control: 'boolean' },
    errorIcon: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-ds-state': { table: { disable: true } },
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

// Имена — как в UI-kit: оси Size и State.
const sizes: TextAreaSize[] = ['s', 'm', 'l', 'xl']
const states: Record<string, Partial<TextAreaProps>> = {
  Default: {},
  Hover: { 'data-ds-state': 'hover' },
  Active: { 'data-ds-state': 'active' },
  Suggest: { defaultValue: '', placeholder: 'Content' },
  Disabled: { disabled: true },
  'Error inline': { error: true },
  'Error outline': { error: true, errorText: 'Error text' },
}

const caption: CSSProperties = { marginBottom: 8, color: 'var(--color-fg-secondary)', font: 'var(--text-control-m)' }
const column: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24, width: 340 }
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 340px)', gap: '32px 40px', alignItems: 'start' }

function Card({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{name}</div>
      {children}
    </div>
  )
}

export const Playground: Story = {
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
}

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Card key={size} name={size.toUpperCase()}>
          <TextArea {...args} size={size} />
        </Card>
      ))}
    </div>
  ),
}

// Все 28 вариантов набора: состояние строкой, размер столбцом.
export const States: Story = {
  render: (args) => (
    <div style={grid}>
      {Object.entries(states).flatMap(([state, props]) =>
        sizes.map((size) => (
          <Card key={`${state}-${size}`} name={`Size=${size.toUpperCase()}, State=${state}`}>
            <TextArea {...args} {...props} size={size} />
          </Card>
        )),
      )}
    </div>
  ),
}

// Опции набора по одной и все вместе.
const options: Record<string, Partial<TextAreaProps>> = {
  'Clear button': { clearable: true, clearLabel: 'Clear' },
  Additional: { additional: 'Additional' },
  'Error icon': { error: true },
  'Все вместе': { clearable: true, clearLabel: 'Clear', additional: 'Additional', error: true, errorText: 'Error text' },
}

export const Icons: Story = {
  render: (args) => (
    <div style={grid}>
      {Object.entries(options).flatMap(([option, props]) =>
        sizes.map((size) => (
          <Card key={`${option}-${size}`} name={`${option} · ${size.toUpperCase()}`}>
            <TextArea {...args} {...props} size={size} />
          </Card>
        )),
      )}
    </div>
  ),
}
