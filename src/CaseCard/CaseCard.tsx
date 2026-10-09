import type { ReactNode } from 'react'

import { Chip, type ChipColor, type ChipStartIcon } from '../Chip/Chip'

export type CaseCardDevice = 'desktop' | 'mobile'

/** Тег под картинкой. В ките — чипы `tag 1` … `tag 4`: `Default` + `tint`, цвет по смыслу тега. */
export type CaseCardTag = { label: string; color?: Exclude<ChipColor, 'neutral' | 'orange'>; icon?: ChipStartIcon }

export type CaseCardProps = {
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
  /** Адрес кейса: с ним карточка — ссылка. */
  href?: string
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
  href,
  className,
  'data-ds-state': dsState,
}: CaseCardProps) {
  const chip = device === 'desktop' ? 'm' : 's'
  const Root = href ? 'a' : 'article'
  return (
    <Root
      href={href}
      className={['ds-case-card', className].filter(Boolean).join(' ')}
      data-device={device}
      data-ds-state={dsState}
    >
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
              <Chip key={tag.label} color={tag.color ?? 'blue'} size={chip} startIcon={tag.icon}>
                {tag.label}
              </Chip>
            ))}
          </div>
        ) : null}
        <div className="ds-case-card__heading">
          <h3 className="ds-case-card__title ds-text-h3">{title}</h3>
          <p className="ds-case-card__teaser ds-text-body-2">{teaser}</p>
        </div>
      </div>
    </Root>
  )
}
