import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spin, type SpinSize } from './Spin'

const meta = {
  title: 'Spin',
  component: Spin,
  args: { size: 'xs' },
  // На странице с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Spin>

export default meta
type Story = StoryObj<typeof meta>

const sizes: SpinSize[] = ['xxs', 'xs', 's', 'm', 'l', 'xl']

// Панель Controls повторяет панель свойств набора в Figma.
export const Playground: StoryObj<{ Size: string }> = {
  args: { Size: 'XS' },
  argTypes: { Size: { control: 'inline-radio', options: ['XXS', 'XS', 'S', 'M', 'L', 'XL'] } },
  parameters: { controls: { disable: false, include: ['Size'] } },
  render: (panel) => <Spin size={panel.Size.toLowerCase() as SpinSize} />,
}

// Шесть вариантов набора, имя — как в UI-kit.
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
      {sizes.map((size) => (
        <div key={size}>
          <div className="ds-text-control-m" style={{ marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }}>
            Size={size.toUpperCase()}
          </div>
          <Spin {...args} size={size} />
        </div>
      ))}
    </div>
  ),
}
