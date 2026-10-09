import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { Button, type ButtonProps, type ButtonSize, type ButtonView } from './Button'

const meta = {
  title: 'Base UI/Button',
  component: Button,
  args: { view: 'primary-brand', size: 'xl', children: 'Content' },
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Имена — как в UI-kit: оси View, Size, State, Icon only.
const views: Record<string, ButtonView> = {
  'Primary-brand': 'primary-brand',
  'Outlined-action': 'outlined-action',
  Flat: 'flat',
  'Flat-action': 'flat-action',
  'Flat-secondary': 'flat-secondary',
}
const sizes: ButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const states: Record<string, Partial<ButtonProps>> = {
  Default: {},
  Hover: { 'data-ds-state': 'hover' },
  Focus: { 'data-ds-state': 'focus' },
  Selected: { selected: true },
  Disabled: { disabled: true },
  Loading: { loading: true },
}

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }
const cell: CSSProperties = { padding: '10px 24px 10px 0', textAlign: 'left', verticalAlign: 'middle' }

function Card({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <div className="ds-text-control-m" style={caption}>
        {name}
      </div>
      {children}
    </div>
  )
}

// Панель Controls повторяет панель свойств набора в Figma: те же имена, значения и порядок.
type PanelArgs = {
  View: string
  Size: string
  State: string
  'Icon only': boolean
  'Start icon': boolean
  'End icon': boolean
  Content: string
}

export const Playground: StoryObj<PanelArgs> = {
  args: {
    View: 'Primary-brand',
    Size: 'XL',
    State: 'Default',
    'Icon only': false,
    'Start icon': true,
    'End icon': false,
    Content: 'Content',
  },
  argTypes: {
    View: { control: 'inline-radio', options: Object.keys(views) },
    Size: { control: 'inline-radio', options: ['XS', 'S', 'M', 'L', 'XL'] },
    State: { control: 'inline-radio', options: Object.keys(states) },
    'Icon only': { control: 'boolean' },
    'Start icon': { control: 'boolean' },
    'End icon': { control: 'boolean' },
    Content: { control: 'text' },
  },
  parameters: { controls: { disable: false, include: ['View', 'Size', 'State', 'Icon only', 'Start icon', 'End icon', 'Content'] } },
  render: (panel) => (
    <Button
      {...states[panel.State]}
      view={views[panel.View]}
      size={panel.Size.toLowerCase() as ButtonSize}
      iconOnly={panel['Icon only']}
      startIcon={panel['Start icon'] || panel['Icon only'] ? 'edit' : undefined}
      endIcon={panel['End icon'] ? 'chevron-down' : undefined}
      aria-label={panel['Icon only'] ? panel.Content : undefined}
    >
      {panel.Content}
    </Button>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {sizes.map((size) => (
        <Card key={size} name={`Size=${size.toUpperCase()}`}>
          <Button {...args} size={size} />
        </Card>
      ))}
    </div>
  ),
}

export const Views: Story = {
  render: (args) => (
    <div style={row}>
      {Object.entries(views).map(([name, view]) => (
        <Card key={view} name={`View=${name}`}>
          <Button {...args} view={view} />
        </Card>
      ))}
    </div>
  ),
}

// Опции иконок: слева, справа, обе и вариант «только иконка» — по строке на размер.
const options: Record<string, Partial<ButtonProps>> = {
  'Start icon': { startIcon: 'edit' },
  'End icon': { endIcon: 'chevron-down' },
  'Start icon + End icon': { startIcon: 'edit', endIcon: 'chevron-down' },
  'Icon only=On': { startIcon: 'edit', iconOnly: true, 'aria-label': 'Content' },
}

export const Icons: Story = {
  render: (args) => (
    <table className="ds-text-control-m" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...cell, ...caption, fontWeight: 400 }} />
          {sizes.map((size) => (
            <th key={size} style={{ ...cell, ...caption, fontWeight: 400 }}>
              Size={size.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(options).map(([option, props]) => (
          <tr key={option}>
            <td style={{ ...cell, ...caption }}>{option}</td>
            {sizes.map((size) => (
              <td key={size} style={cell}>
                <Button {...args} {...props} size={size} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

// Все 300 вариантов набора: вид блоком, состояние строкой, размер столбцом, дважды — с текстом и только иконка.
function StatesTable({ view, iconOnly, args }: { view: ButtonView; iconOnly: boolean; args: ButtonProps }) {
  return (
    <table className="ds-text-control-m" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...cell, ...caption, fontWeight: 400 }}>Icon only={iconOnly ? 'On' : 'Off'}</th>
          {sizes.map((size) => (
            <th key={size} style={{ ...cell, ...caption, fontWeight: 400 }}>
              Size={size.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(states).map(([state, props]) => (
          <tr key={state}>
            <td style={{ ...cell, ...caption }}>State={state}</td>
            {sizes.map((size) => (
              <td key={size} style={cell}>
                <Button
                  {...args}
                  {...props}
                  view={view}
                  size={size}
                  startIcon="edit"
                  iconOnly={iconOnly}
                  aria-label={iconOnly ? 'Content' : undefined}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {Object.entries(views).map(([name, view]) => (
        <section key={view}>
          <h2 className="ds-text-subhead" style={{ margin: '0 0 12px' }}>
            View={name}
          </h2>
          <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <StatesTable view={view} iconOnly={false} args={args} />
            <StatesTable view={view} iconOnly args={args} />
          </div>
        </section>
      ))}
    </div>
  ),
}

// Класс страницы перебивает стиль библиотеки: стили пакета лежат в слое `ds`, класс страницы — вне слоя.
// Пример из макетов: у текстовой кнопки `Flat-action` сняты боковые поля.
export const PageClass: Story = {
  name: 'Класс страницы',
  render: () => (
    <div style={row}>
      <style>{'.page-px-0 { padding-left: 0; padding-right: 0; }'}</style>
      <Card name="View=Flat-action — как в библиотеке">
        <div style={{ outline: '1px dashed var(--ds-color-fg-border)' }}>
          <Button view="flat-action">Content</Button>
        </div>
      </Card>
      <Card name='className="page-px-0" — боковые поля сняты'>
        <div style={{ outline: '1px dashed var(--ds-color-fg-border)' }}>
          <Button view="flat-action" className="page-px-0">
            Content
          </Button>
        </div>
      </Card>
    </div>
  ),
}
