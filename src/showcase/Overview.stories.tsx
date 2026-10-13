import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

// Обзорная страница показывает те же раскладки вариантов, что страницы States компонентов: второго списка нет.
import * as button from '../Button/Button.stories'
import * as caseCard from '../CaseCard/CaseCard.stories'
import * as checkbox from '../Checkbox/Checkbox.stories'
import * as chip from '../Chip/Chip.stories'
import * as spin from '../Spin/Spin.stories'
import * as textArea from '../TextArea/TextArea.stories'
import * as textInput from '../TextInput/TextInput.stories'
import * as whyPoint from '../WhyPoint/WhyPoint.stories'

type Mode = 'desktop' | 'mobile'
type Renderable = { render?: (args: never, context: never) => ReactNode }

// Раскладка вариантов со страницы компонента, с его пропами по умолчанию.
function show(story: Renderable, args: object = {}) {
  return story.render?.(args as never, {} as never) ?? null
}

// Порядок снизу вверх: атомы, молекулы, продуктовые. Число — вариантов набора в UI-kit.
const sections: { name: string; group: string; count: number; content: () => ReactNode }[] = [
  { name: 'Spin', group: 'Components', count: 6, content: () => show(spin.Sizes, spin.default.args) },
  { name: 'Chip', group: 'Components', count: 28, content: () => show(chip.States) },
  { name: 'Button', group: 'Base UI', count: 300, content: () => show(button.States, button.default.args) },
  { name: 'TextInput', group: 'Base UI', count: 28, content: () => show(textInput.States, textInput.default.args) },
  { name: 'TextArea', group: 'Base UI', count: 28, content: () => show(textArea.States, textArea.default.args) },
  { name: 'Checkbox', group: 'Base UI', count: 30, content: () => show(checkbox.States, checkbox.default.args) },
  { name: 'WhyPoint', group: 'Product components', count: 5, content: () => show(whyPoint.States) },
  { name: 'CaseCard', group: 'Product components', count: 3, content: () => show(caseCard.States) },
]

// Ширина 1280 — десктопный брейкпоинт набора; фон из токенов. Сетки продукта на странице нет: это каталог.
function Overview({ mode }: { mode: Mode }) {
  return (
    <div
      data-ds-mode={mode}
      style={{
        boxSizing: 'border-box',
        width: 1280,
        padding: 32,
        background: 'var(--ds-color-bg-subtle)',
        color: 'var(--ds-color-fg-primary)',
      }}
    >
      <h1 className="ds-text-h1" style={{ margin: '0 0 8px' }}>
        Обзор — {mode === 'desktop' ? 'Desktop' : 'Mobile'}
      </h1>
      <p className="ds-text-control-m" style={{ margin: '0 0 48px', color: 'var(--ds-color-fg-secondary)' }}>
        Компонентов: {sections.length} · режим шрифтов {mode === 'desktop' ? 'Desktop' : 'Mobile'} · ширина 1280
      </p>
      {sections.map((section) => (
        <section
          key={section.name}
          style={{
            marginBottom: 32,
            padding: 32,
            borderRadius: 'var(--ds-radius-block-24)',
            background: 'var(--ds-color-bg-default)',
            overflow: 'hidden',
          }}
        >
          <h2 className="ds-text-h2" style={{ margin: '0 0 4px' }}>
            {section.name}
          </h2>
          <p className="ds-text-control-m" style={{ margin: '0 0 24px', color: 'var(--ds-color-fg-secondary)' }}>
            {section.group} · вариантов в UI-kit: {section.count}
          </p>
          {section.content()}
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Обзор',
  component: Overview,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof Overview>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = { args: { mode: 'desktop' } }
export const Mobile: Story = { args: { mode: 'mobile' } }
