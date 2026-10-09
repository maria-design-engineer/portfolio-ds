import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { TextInput, type TextInputProps, type TextInputSize } from './TextInput'

const meta = {
  title: 'Base UI/TextInput',
  component: TextInput,
  args: { size: 'xl', defaultValue: 'Content' },
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
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

// Панель Controls повторяет панель свойств набора в Figma: те же имена, значения и порядок.
type PanelArgs = {
  Size: string
  State: string
  Content: boolean
  '↳ Content text': string
  Label: boolean
  '↳ Label text': string
  'Start icon': boolean
  'Right side': boolean
  'Clear button': boolean
  'Edit icon': boolean
  'Eye icon': boolean
  Additional: boolean
  '↳ Additional text': string
  'Error icon': boolean
  'Error text': string
}

export const Playground: StoryObj<PanelArgs> = {
  args: {
    Size: 'XL',
    State: 'Default',
    Content: true,
    '↳ Content text': 'Content',
    Label: false,
    '↳ Label text': 'Label:',
    'Start icon': false,
    'Right side': false,
    'Clear button': false,
    'Edit icon': false,
    'Eye icon': false,
    Additional: false,
    '↳ Additional text': 'Additional',
    'Error icon': true,
    'Error text': 'Error content',
  },
  argTypes: {
    Size: { control: 'inline-radio', options: ['S', 'M', 'L', 'XL'] },
    State: { control: 'inline-radio', options: Object.keys(states) },
    Content: { control: 'boolean' },
    '↳ Content text': { control: 'text' },
    Label: { control: 'boolean' },
    '↳ Label text': { control: 'text' },
    'Start icon': { control: 'boolean' },
    'Right side': { control: 'boolean' },
    'Clear button': { control: 'boolean' },
    'Edit icon': { control: 'boolean' },
    'Eye icon': { control: 'boolean' },
    Additional: { control: 'boolean' },
    '↳ Additional text': { control: 'text' },
    'Error icon': { control: 'boolean' },
    'Error text': { control: 'text' },
  },
  parameters: { controls: { disable: false, include: ['Size', 'State', 'Content', '↳ Content text', 'Label', '↳ Label text', 'Start icon', 'Right side', 'Clear button', 'Edit icon', 'Eye icon', 'Additional', '↳ Additional text', 'Error icon', 'Error text'] } },
  render: (panel) => (
    <div style={{ width: 340 }}>
      {/* key пересоздаёт поле при смене панели: иначе браузер держит прежний текст */}
      <TextInput
        key={JSON.stringify(panel)}
        {...states[panel.State]}
        size={panel.Size.toLowerCase() as TextInputSize}
        defaultValue={panel.Content && panel.State !== 'Suggest' ? panel['↳ Content text'] : ''}
        placeholder={panel.State === 'Suggest' ? panel['↳ Content text'] : undefined}
        label={panel.Label ? panel['↳ Label text'] : undefined}
        startIcon={panel['Start icon']}
        clearable={panel['Right side'] && panel['Clear button']}
        clearLabel="Clear"
        editIcon={panel['Right side'] && panel['Edit icon']}
        eyeIcon={panel['Right side'] && panel['Eye icon']}
        additional={panel['Right side'] && panel.Additional ? panel['↳ Additional text'] : undefined}
        errorIcon={panel['Error icon'] && panel.State === 'Error inline'}
        errorText={panel.State === 'Error outline' ? panel['Error text'] : undefined}
      />
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
