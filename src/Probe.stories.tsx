import type { Meta, StoryObj } from '@storybook/react-vite'

import { Probe } from './Probe'

// Story пробного компонента окружения. Убрать вместе с Probe.
const meta = {
  title: 'Окружение/Probe',
  component: Probe,
} satisfies Meta<typeof Probe>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Подпись из story' },
}
