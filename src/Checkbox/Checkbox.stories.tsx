import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { Checkbox, type CheckboxProps, type CheckboxSize } from './Checkbox'

const meta = {
  title: 'Base UI/Checkbox',
  component: Checkbox,
  args: { size: 'xl', children: 'Content' },
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Имена — как в UI-kit: оси Size, State и Checked. Порядок значений — как в панели свойств набора.
const sizes: CheckboxSize[] = ['m', 'l', 'xl']
const states: Record<string, Partial<CheckboxProps>> = {
  Default: {},
  Hover: { 'data-ds-state': 'hover' },
  Disabled: { disabled: true },
  Focus: { 'data-ds-state': 'focus' },
  Error: { error: true },
}
const checkedValues: Record<string, boolean> = { Off: false, On: true }

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
const column: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24 }
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'center' }
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '32px 16px', alignItems: 'start' }

// `tall` держит под подпись две строки: длинное имя варианта переносится, и галочки в ряду стоят на одной линии.
function Card({ name, tall = false, children }: { name: string; tall?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="ds-text-control-m" style={tall ? { ...caption, minHeight: 36 } : caption}>{name}</div>
      {children}
    </div>
  )
}

// Панель Controls повторяет панель свойств набора в Figma: те же имена, значения и порядок.
type PanelArgs = {
  Size: string
  State: string
  Checked: boolean
  Content: boolean
  '↳ Content text': string
}

export const Playground: StoryObj<PanelArgs> = {
  args: {
    Size: 'XL',
    State: 'Default',
    Checked: false,
    Content: true,
    '↳ Content text': 'Content',
  },
  argTypes: {
    Size: { control: 'inline-radio', options: ['M', 'L', 'XL'] },
    State: { control: 'inline-radio', options: Object.keys(states) },
    Checked: { control: 'boolean' },
    Content: { control: 'boolean' },
    '↳ Content text': { control: 'text' },
  },
  parameters: { controls: { disable: false, include: ['Size', 'State', 'Checked', 'Content', '↳ Content text'] } },
  render: (panel) => (
    // key пересоздаёт галочку при смене панели: дальше отметку держит сам компонент, её можно нажать.
    <Checkbox
      key={JSON.stringify(panel)}
      {...states[panel.State]}
      size={panel.Size.toLowerCase() as CheckboxSize}
      defaultChecked={panel.Checked}
      aria-label={panel.Content ? undefined : panel['↳ Content text']}
    >
      {panel.Content ? panel['↳ Content text'] : null}
    </Checkbox>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <Card key={size} name={size.toUpperCase()}>
          <div style={row}>
            <Checkbox {...args} size={size} />
            <Checkbox {...args} size={size} defaultChecked />
          </div>
        </Card>
      ))}
    </div>
  ),
}

// Все 30 вариантов набора: состояние строкой, в строке — размер и отметка.
export const States: Story = {
  render: (args) => (
    <div style={grid}>
      {Object.entries(states).flatMap(([state, props]) =>
        sizes.flatMap((size) =>
          Object.entries(checkedValues).map(([checked, on]) => (
            <Card key={`${state}-${size}-${checked}`} tall name={`Size=${size.toUpperCase()}, State=${state}, Checked=${checked}`}>
              <Checkbox {...args} {...props} size={size} defaultChecked={on} />
            </Card>
          )),
        ),
      )}
    </div>
  ),
}

// Опция набора: с подписью и без неё. Без подписи остаётся один квадрат, имя для скринридера даёт страница.
const options: Record<string, Partial<CheckboxProps>> = {
  Content: {},
  'Content выключен': { children: null, 'aria-label': 'Content' },
}

export const Content: Story = {
  render: (args) => (
    <div style={{ ...grid, gridTemplateColumns: 'repeat(3, minmax(0, 220px))' }}>
      {Object.entries(options).flatMap(([option, props]) =>
        sizes.map((size) => (
          <Card key={`${option}-${size}`} name={`${option} · ${size.toUpperCase()}`}>
            <div style={row}>
              <Checkbox {...args} {...props} size={size} />
              <Checkbox {...args} {...props} size={size} defaultChecked />
            </div>
          </Card>
        )),
      )}
    </div>
  ),
}
