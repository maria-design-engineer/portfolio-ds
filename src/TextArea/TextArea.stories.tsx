import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { TextArea, type TextAreaProps, type TextAreaSize } from './TextArea'

const meta = {
  title: 'TextArea',
  component: TextArea,
  args: { size: 'xl', defaultValue: 'Content' },
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
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
  'Clear button': boolean
  'Error icon': boolean
  'Error text': string
  Additional: boolean
  '↳ Additional text': string
}

export const Playground: StoryObj<PanelArgs> = {
  args: {
    Size: 'XL',
    State: 'Default',
    Content: true,
    '↳ Content text': 'Content',
    'Clear button': true,
    'Error icon': true,
    'Error text': 'Error text',
    Additional: false,
    '↳ Additional text': 'Additional',
  },
  argTypes: {
    Size: { control: 'inline-radio', options: ['S', 'M', 'L', 'XL'] },
    State: { control: 'inline-radio', options: Object.keys(states) },
    Content: { control: 'boolean' },
    '↳ Content text': { control: 'text' },
    'Clear button': { control: 'boolean' },
    'Error icon': { control: 'boolean' },
    'Error text': { control: 'text' },
    Additional: { control: 'boolean' },
    '↳ Additional text': { control: 'text' },
  },
  parameters: { controls: { disable: false, include: ['Size', 'State', 'Content', '↳ Content text', 'Clear button', 'Error icon', 'Error text', 'Additional', '↳ Additional text'] } },
  render: (panel) => (
    <div style={{ width: 340 }}>
      {/* key пересоздаёт поле при смене панели: иначе браузер держит прежний текст */}
      <TextArea
        key={JSON.stringify(panel)}
        {...states[panel.State]}
        size={panel.Size.toLowerCase() as TextAreaSize}
        defaultValue={panel.Content && panel.State !== 'Suggest' ? panel['↳ Content text'] : ''}
        placeholder={panel.State === 'Suggest' ? panel['↳ Content text'] : undefined}
        clearable={panel['Clear button']}
        clearLabel="Clear"
        errorIcon={panel['Error icon'] && panel.State === 'Error inline'}
        errorText={panel.State === 'Error outline' ? panel['Error text'] : undefined}
        additional={panel.Additional ? panel['↳ Additional text'] : undefined}
      />
    </div>
  ),
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
