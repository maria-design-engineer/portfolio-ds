import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'

import { Button } from '../Button/Button'
import { TextArea } from '../TextArea/TextArea'
import { TextInput } from '../TextInput/TextInput'

// Проверка: ссылка страницы доходит до самого поля ввода, и крестик при этом работает.
function FieldRefCheck() {
  const input = useRef<HTMLInputElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const [report, setReport] = useState('—')

  const focus = (name: string, node: HTMLElement | null) => {
    node?.focus()
    const active = document.activeElement
    setReport(`${name}: ref → <${node?.tagName.toLowerCase() ?? 'пусто'}> · фокус стоит в поле: ${active === node ? 'да' : 'нет'}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 340 }}>
      <TextInput ref={input} defaultValue="Content" clearable clearLabel="Clear" />
      <TextArea ref={area} defaultValue="Content" clearable clearLabel="Clear" />
      <div style={{ display: 'flex', gap: 12 }}>
        <Button size="m" view="outlined-action" onClick={() => focus('TextInput', input.current)}>
          Фокус в TextInput
        </Button>
        <Button size="m" view="outlined-action" onClick={() => focus('TextArea', area.current)}>
          Фокус в TextArea
        </Button>
      </div>
      <div className="ds-text-control-m" style={{ color: 'var(--ds-color-fg-secondary)' }}>
        {report}
      </div>
    </div>
  )
}

const meta = {
  title: 'Проверки/Поля — ref',
  component: FieldRefCheck,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof FieldRefCheck>

export default meta

export const Ref: StoryObj<typeof meta> = { name: 'Фокус через ref' }
