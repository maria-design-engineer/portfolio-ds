import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { Chip, type ChipColor, type ChipProps, type ChipSize, type ChipVariant } from './Chip'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

// Имена — как в UI-kit: оси color, conditionals, style, size.
const colors: ChipColor[] = ['blue', 'green', 'teal', 'orange', 'neutral']
const sizes: ChipSize[] = ['m', 's']
// В ките conditionals и style ходят парой.
const pairs: Record<ChipVariant, string> = {
  tint: 'conditionals=Default, style=tint',
  stroke: 'conditionals=active, style=stroke',
  fill: 'conditionals=active, style=fill',
}
const variantsOf = (color: ChipColor): ChipVariant[] => (color === 'neutral' ? ['tint'] : ['tint', 'stroke', 'fill'])

// Проп variant зависит от color, поэтому сборка пропов вынесена сюда.
const chip = (color: ChipColor, variant: ChipVariant, rest: Omit<ChipProps, 'color' | 'variant'>) =>
  color === 'neutral' ? <Chip color="neutral" {...rest} /> : <Chip color={color} variant={variant} {...rest} />

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }
const cell: CSSProperties = { padding: '8px 24px 8px 0', textAlign: 'left', verticalAlign: 'middle' }

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
  color: ChipColor
  conditionals: 'Default' | 'active'
  style: ChipVariant
  size: ChipSize
  'icon-left': boolean
  'icon-right': boolean
  текст: string
}

export const Playground: StoryObj<PanelArgs> = {
  args: {
    color: 'blue',
    conditionals: 'Default',
    style: 'tint',
    size: 'm',
    'icon-left': true,
    'icon-right': true,
    текст: 'текст',
  },
  argTypes: {
    color: { control: 'inline-radio', options: colors },
    conditionals: { control: 'inline-radio', options: ['Default', 'active'] },
    style: { control: 'inline-radio', options: ['tint', 'stroke', 'fill'] },
    size: { control: 'inline-radio', options: sizes },
    'icon-left': { control: 'boolean' },
    'icon-right': { control: 'boolean' },
    текст: { control: 'text' },
  },
  parameters: {
    controls: { disable: false, include: ['color', 'conditionals', 'style', 'size', 'icon-left', 'icon-right', 'текст'] },
  },
  // Пара как в ките: Default — всегда tint; active — stroke или fill.
  render: (panel) =>
    chip(panel.color, panel.conditionals === 'Default' ? 'tint' : panel.style === 'fill' ? 'fill' : 'stroke', {
      size: panel.size,
      startIcon: panel['icon-left'] ? 'brightness-low-regular' : undefined,
      endIcon: panel['icon-right'] ? 'dismiss-regular' : undefined,
      children: panel.текст,
    }),
}

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {sizes.map((size) => (
        <Card key={size} name={`size=${size}`}>
          {chip('blue', 'tint', { size, children: 'текст' })}
        </Card>
      ))}
    </div>
  ),
}

// Пять цветов в трёх видах; у neutral вид один.
export const Views: Story = {
  render: () => (
    <table className="ds-text-control-m" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...cell, ...caption, fontWeight: 400 }} />
          {Object.entries(pairs).map(([variant, name]) => (
            <th key={variant} style={{ ...cell, ...caption, fontWeight: 400 }}>
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {colors.map((color) => (
          <tr key={color}>
            <td style={{ ...cell, ...caption }}>color={color}</td>
            {(Object.keys(pairs) as ChipVariant[]).map((variant) => (
              <td key={variant} style={cell}>
                {variantsOf(color).includes(variant) ? chip(color, variant, { children: 'текст' }) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

const options: Record<string, Omit<ChipProps, 'color' | 'variant'>> = {
  'icon-left': { startIcon: 'brightness-low-regular' },
  'icon-right': { endIcon: 'dismiss-regular' },
  'icon-left + icon-right': { startIcon: 'brightness-low-regular', endIcon: 'dismiss-regular' },
  'без иконок': {},
}

export const Icons: Story = {
  render: () => (
    <table className="ds-text-control-m" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...cell, ...caption, fontWeight: 400 }} />
          {sizes.map((size) => (
            <th key={size} style={{ ...cell, ...caption, fontWeight: 400 }}>
              size={size}
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
                {chip('blue', 'tint', { ...props, size, children: 'текст' })}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

// Все 26 вариантов набора, с иконками, как стоят мастера в ките.
const all = colors.flatMap((color) => variantsOf(color).flatMap((variant) => sizes.map((size) => ({ color, variant, size }))))

export const States: Story = {
  render: () => (
    <div>
      <div className="ds-text-control-m" style={{ ...caption, marginBottom: 24 }}>
        Вариантов: {all.length}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '24px 64px' }}>
        {all.map(({ color, variant, size }) => (
          <Card key={`${color}-${variant}-${size}`} name={`color=${color}, ${pairs[variant]}, size=${size}`}>
            {chip(color, variant, {
              size,
              startIcon: 'brightness-low-regular',
              endIcon: 'dismiss-regular',
              children: 'текст',
            })}
          </Card>
        ))}
      </div>
    </div>
  ),
}
