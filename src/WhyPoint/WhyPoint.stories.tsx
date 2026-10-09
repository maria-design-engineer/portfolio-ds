import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'

import { WhyPoint, type WhyPointProps, type WhyPointView } from './WhyPoint'

const meta = {
  title: 'Product components/WhyPoint',
  component: WhyPoint,
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
} satisfies Meta<typeof WhyPoint>

export default meta
type Story = StoryObj<typeof meta>

// Текст и ширины — как у мастеров набора в UI-kit.
const TEXT = '…чтобы гипотезы не состарились в бэклоге'
const WIDTH: Record<WhyPointView, number> = { list: 431, tab: 292 }

// Пять мастеров набора: у плашки `view=tab` состояния hover нет.
const variants: { view: WhyPointView; state: string; props: Partial<WhyPointProps> }[] = [
  { view: 'list', state: 'default', props: {} },
  { view: 'list', state: 'hover', props: { 'data-ds-state': 'hover' } },
  { view: 'list', state: 'selected', props: { selected: true } },
  { view: 'tab', state: 'default', props: {} },
  { view: 'tab', state: 'selected', props: { selected: true } },
]

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
// Серый фон блока: белая плашка `tab` на белом не видна.
const stage: CSSProperties = { padding: 32, background: 'var(--ds-color-bg-subtle)' }

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
type PanelArgs = { text: string; view: WhyPointView; state: 'selected' | 'default' | 'hover' }

export const Playground: StoryObj<PanelArgs> = {
  args: { text: TEXT, view: 'list', state: 'selected' },
  argTypes: {
    text: { control: 'text' },
    view: { control: 'inline-radio', options: ['list', 'tab'] },
    state: { control: 'inline-radio', options: ['selected', 'default', 'hover'] },
  },
  parameters: { controls: { disable: false, include: ['text', 'view', 'state'] } },
  render: (panel) => (
    <div style={stage}>
      <div style={{ width: WIDTH[panel.view] }}>
        <WhyPoint
          view={panel.view}
          selected={panel.state === 'selected'}
          data-ds-state={panel.state === 'hover' && panel.view === 'list' ? 'hover' : undefined}
        >
          {panel.text}
        </WhyPoint>
      </div>
    </div>
  ),
}

export const Views: Story = {
  render: () => (
    <div style={{ ...stage, display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(['list', 'tab'] as WhyPointView[]).map((view) => (
        <Card key={view} name={`view=${view}`}>
          <div style={{ width: WIDTH[view] }}>
            <WhyPoint view={view} selected>
              {TEXT}
            </WhyPoint>
          </div>
        </Card>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ ...stage, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className="ds-text-control-m" style={{ color: 'var(--ds-color-fg-secondary)' }}>
        Вариантов: {variants.length}
      </div>
      {variants.map(({ view, state, props }) => (
        <Card key={`${view}-${state}`} name={`view=${view}, state=${state}`}>
          <div style={{ width: WIDTH[view] }}>
            <WhyPoint view={view} {...props}>
              {TEXT}
            </WhyPoint>
          </div>
        </Card>
      ))}
    </div>
  ),
}

// Живое переключение: пункты нажимаются мышью и клавиатурой, как в блоке «Зачем».
// Тексты-заглушки: настоящие тексты пунктов живут на макете, в витрину не переписываются.
const points = ['Пункт первый — текст в две строки, как у мастера в ките', 'Пункт второй', 'Пункт третий']

function Switcher({ view }: { view: WhyPointView }) {
  const [current, setCurrent] = useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: view === 'list' ? 16 : 10, width: WIDTH[view] }}>
      {points.map((text, index) => (
        <WhyPoint key={text} view={view} selected={index === current} onClick={() => setCurrent(index)}>
          {text}
        </WhyPoint>
      ))}
    </div>
  )
}

export const Switching: Story = {
  name: 'Переключение',
  render: () => (
    <div style={{ ...stage, display: 'flex', gap: 64, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Card name="view=list — нажми на пункт">
        <Switcher view="list" />
      </Card>
      <Card name="view=tab — нажми на плашку">
        <Switcher view="tab" />
      </Card>
    </div>
  ),
}
