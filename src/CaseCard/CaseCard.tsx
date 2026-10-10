import { useRender } from '@base-ui/react/use-render'
import type { ComponentPropsWithRef, ReactNode } from 'react'

import { Chip, type ChipColor, type ChipStartIcon } from '../Chip/Chip'

export type CaseCardDevice = 'desktop' | 'mobile'

/** Тег под картинкой. В ките — чипы `tag 1` … `tag 4`: `Default` + `tint`, цвет по смыслу тега; `neutral` — серая пометка. */
export type CaseCardTag = { label: string; color?: Exclude<ChipColor, 'orange' | 'white'>; icon?: ChipStartIcon }

export type CaseCardProps = Omit<ComponentPropsWithRef<'a'>, 'title' | 'children' | 'className' | 'style'> & {
  /** Раскладка: `desktop` на макете 1440, `mobile` на макете 360. В ките — ось `device`. */
  device?: CaseCardDevice
  /** Заголовок. В ките — `title`. */
  title: string
  /** Описание. В ките — `teaser`. */
  teaser: string
  /** Картинка кейса: изображение, которое ставит страница. В ките — `media`. */
  media?: ReactNode
  /** Метка статуса слева на картинке. В ките — опция `status`. */
  status?: string
  /** Иконка метки статуса. */
  statusIcon?: ChipStartIcon
  /** Подпись области справа на картинке. В ките — чип `domain`. */
  domain?: string
  /** Теги, до четырёх. В ките — `tag 1` … `tag 4`. */
  tags?: CaseCardTag[]
  /**
   * Свой корневой элемент — как у компонентов на Base UI: `render={<Link href="/cases/x" />}`.
   * Без него корень — `a` при `href` и `article` без него.
   */
  render?: useRender.RenderProp
  className?: string
  /** Только для витрины: показать `hover` карточкой, без мыши. */
  'data-ds-state'?: 'hover'
}

// Карточка кейса на витрине главной: картинка, метки на ней, теги, заголовок, описание.
export function CaseCard({
  device = 'desktop',
  title,
  teaser,
  media,
  status,
  statusIcon,
  domain,
  tags = [],
  render,
  ref,
  className,
  ...root
}: CaseCardProps) {
  const chip = device === 'desktop' ? 'm' : 's'
  const children = (
    <>
      <div className="ds-case-card__media">
        {media}
        <div className="ds-case-card__badges">
          {status ? (
            <Chip className="ds-case-card__status" size={chip} startIcon={statusIcon}>
              {status}
            </Chip>
          ) : (
            <span />
          )}
          {domain ? <Chip size={chip}>{domain}</Chip> : null}
        </div>
      </div>
      <div className="ds-case-card__content">
        {tags.length ? (
          <div className="ds-case-card__tags">
            {tags.slice(0, 4).map((tag) => (
              // Серый тег — пометка без смысла направления, например «Учебный проект»: в макетах главной он стоит среди тегов.
              tag.color === 'neutral' ? (
                <Chip key={tag.label} color="neutral" size={chip} startIcon={tag.icon}>
                  {tag.label}
                </Chip>
              ) : (
                <Chip key={tag.label} color={tag.color ?? 'blue'} size={chip} startIcon={tag.icon}>
                  {tag.label}
                </Chip>
              )
            ))}
          </div>
        ) : null}
        <div className="ds-case-card__heading">
          <h3 className="ds-case-card__title ds-text-h3">{title}</h3>
          <p className="ds-case-card__teaser ds-text-body-2">{teaser}</p>
        </div>
      </div>
    </>
  )
  // Остальные пропы страницы — `href`, `target`, `rel`, `onClick`, `aria-*` — и `ref` уходят в корень.
  return useRender({
    render,
    ref,
    defaultTagName: root.href ? 'a' : 'article',
    props: { ...root, className: ['ds-case-card', className].filter(Boolean).join(' '), 'data-device': device, children },
  })
}
