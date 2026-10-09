import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { TextInput, type TextInputProps, type TextInputSize } from './TextInput'

const meta = {
  title: 'TextInput',
  component: TextInput,
  args: { size: 'xl', defaultValue: 'Content' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l', 'xl'] },
    label: { control: 'text' },
    additional: { control: 'text' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    clearLabel: { control: 'text' },
    startIcon: { control: 'boolean' },
    clearable: { control: 'boolean' },
    editIcon: { control: 'boolean' },
    eyeIcon: { control: 'boolean' },
    errorIcon: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-ds-state': { table: { disable: true } },
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

// Имена — как в UI-kit: оси Size и State.
const sizes: TextInputSize[] = ['s', 'm', 'l', 'xl']
const states: Record<string, Partial<TextInputProps>> = {
  Default: {},
  Hover: { 'data-ds-state': 'hover' },
  Active: { 'data-ds-state': 'active' },
  Suggest: { defaultValue: '', placeholder: 'Content' },
  Disabled: { disabled: true },
  'Error inline': { error: true },
  'Error outline': { error: true, errorText: 'Error content' },
}

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
const column: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24, width: 340 }
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 340px)', gap: '32px 40px', alignItems: 'start' }

function Card({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <div className="ds-text-control-m" style={caption}>{name}</div>
      {children}
    </div>
  )
}

// key пересоздаёт поле, когда в Controls меняют defaultValue: иначе браузер держит прежний текст.
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 340 }}>
      <TextInput key={String(args.defaultValue)} {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Card key={size} name={size.toUpperCase()}>
          <TextInput {...args} size={size} />
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
            <TextInput {...args} {...props} size={size} />
          </Card>
        )),
      )}
    </div>
  ),
}

// Опции набора по одной и все вместе.
const options: Record<string, Partial<TextInputProps>> = {
  'Start icon': { startIcon: true },
  Label: { label: 'Label:' },
  'Clear button': { clearable: true, clearLabel: 'Clear' },
  'Edit icon': { editIcon: true },
  'Eye icon': { eyeIcon: true },
  Additional: { additional: 'Additional' },
  'Error icon': { error: true },
  'Все вместе': {
    startIcon: true,
    label: 'Label:',
    clearable: true,
    clearLabel: 'Clear',
    editIcon: true,
    eyeIcon: true,
    additional: 'Additional',
  },
}

export const Icons: Story = {
  render: (args) => (
    <div style={grid}>
      {Object.entries(options).flatMap(([option, props]) =>
        sizes.map((size) => (
          <Card key={`${option}-${size}`} name={`${option} · ${size.toUpperCase()}`}>
            <TextInput {...args} {...props} size={size} />
          </Card>
        )),
      )}
    </div>
  ),
}
