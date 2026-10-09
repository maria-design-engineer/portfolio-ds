import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'

import { nbsp } from '../showcase/text.stories.helpers'
import { CaseCard, type CaseCardDevice, type CaseCardProps, type CaseCardTag } from './CaseCard'

const meta = {
  title: 'Product components/CaseCard',
  component: CaseCard,
  // На страницах с разложенными вариантами панель не нужна; у Playground она своя.
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
} satisfies Meta<typeof CaseCard>

export default meta
// Страницы сами раскладывают варианты, пропы приходят из мастеров ниже, а не из панели.
type Story = StoryObj

// Тексты, теги и ширины — как у мастеров набора в UI-kit.
const TITLE = nbsp('Умное планирование и опора на данные')
const TEASER = nbsp(
  'Приложение под один вид спорта и одну задачу тренера. Планировать и собирать факт. Анализ и дизайн сделаны, сейчас уточняю методику с тренерами. Код дальше тоже мой',
)
const WIDTH: Record<CaseCardDevice, number> = { desktop: 676, mobile: 330 }
const TAGS: CaseCardTag[] = [
  { label: 'UX/UI', color: 'blue', icon: 'design-ideas-regular' },
  { label: 'Анализ домена', color: 'blue', icon: 'form-multiple-collection-regular' },
  { label: 'Приложение', color: 'green', icon: 'apps-regular' },
  { label: 'Приложение 2', color: 'green', icon: 'apps-regular' },
]

// Картинки кейсов в библиотеку не едут. Вместо картинки — область фона `color/bg/subtle`, как под картинкой в ките.
const master = (device: CaseCardDevice, tags = 3, status = true): CaseCardProps => ({
  device,
  title: TITLE,
  teaser: TEASER,
  status: status ? 'Сейчас в работе' : undefined,
  statusIcon: 'circle-small',
  domain: 'Тяжёлая атлетика',
  tags: TAGS.slice(0, tags),
})

const variants: { device: CaseCardDevice; state: string; props: Partial<CaseCardProps> }[] = [
  { device: 'desktop', state: 'default', props: {} },
  { device: 'desktop', state: 'hover', props: { 'data-ds-state': 'hover' } },
  { device: 'mobile', state: 'default', props: {} },
]

const caption: CSSProperties = { marginBottom: 8, color: 'var(--ds-color-fg-secondary)' }
const stage: CSSProperties = { padding: 32, background: 'var(--ds-color-bg-default)' }

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

// Мобильная карточка стоит в режиме Mobile: шрифты h3 и body-2 берут мобильные размеры.
function Framed({ device, children }: { device: CaseCardDevice; children: ReactNode }) {
  return (
    <div data-ds-mode={device} style={{ width: WIDTH[device] }}>
      {children}
    </div>
  )
}

// Панель Controls повторяет панель свойств набора в Figma: те же имена, значения и порядок.
type PanelArgs = {
  status: boolean
  'tag 3': boolean
  'tag 4': boolean
  title: string
  teaser: string
  device: CaseCardDevice
  state: 'default' | 'hover'
}

export const Playground: StoryObj<PanelArgs> = {
  args: { status: true, 'tag 3': true, 'tag 4': false, title: TITLE, teaser: TEASER, device: 'desktop', state: 'default' },
  argTypes: {
    status: { control: 'boolean' },
    'tag 3': { control: 'boolean' },
    'tag 4': { control: 'boolean' },
    title: { control: 'text' },
    teaser: { control: 'text' },
    device: { control: 'inline-radio', options: ['desktop', 'mobile'] },
    state: { control: 'inline-radio', options: ['default', 'hover'] },
  },
  parameters: { controls: { disable: false, include: ['status', 'tag 3', 'tag 4', 'title', 'teaser', 'device', 'state'] } },
  render: (panel) => (
    <div style={stage}>
      <Framed device={panel.device}>
        <CaseCard
          {...master(panel.device, panel['tag 4'] ? 4 : panel['tag 3'] ? 3 : 2, panel.status)}
          title={panel.title}
          teaser={panel.teaser}
          data-ds-state={panel.state === 'hover' && panel.device === 'desktop' ? 'hover' : undefined}
        />
      </Framed>
    </div>
  ),
}

export const Views: Story = {
  render: () => (
    <div style={{ ...stage, display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(['desktop', 'mobile'] as CaseCardDevice[]).map((device) => (
        <Card key={device} name={`device=${device}`}>
          <Framed device={device}>
            <CaseCard {...master(device)} />
          </Framed>
        </Card>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ ...stage, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div className="ds-text-control-m" style={{ color: 'var(--ds-color-fg-secondary)' }}>
        Вариантов: {variants.length}
      </div>
      {variants.map(({ device, state, props }) => (
        <Card key={`${device}-${state}`} name={`device=${device}, state=${state}`}>
          <Framed device={device}>
            <CaseCard {...master(device)} {...props} />
          </Framed>
        </Card>
      ))}
    </div>
  ),
}
