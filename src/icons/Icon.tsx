// Иконки библиотеки. Контуры — пакет @fluentui/svg-icons: в собранный пакет попадают только названные здесь.
// Лицензия набора — MIT, текст лежит в public/licenses/ и едет в пакет и в витрину.
// Наружу компонент не выходит: иконки живут внутри полей и кнопки, имя набора в сайт не едет.
import apps16Regular from '@fluentui/svg-icons/icons/apps_16_regular.svg?raw'
import brightnessLow16Regular from '@fluentui/svg-icons/icons/brightness_low_16_regular.svg?raw'
import chevronDown12 from '@fluentui/svg-icons/icons/chevron_down_12_filled.svg?raw'
import chevronDown16 from '@fluentui/svg-icons/icons/chevron_down_16_filled.svg?raw'
import circleSmall20 from '@fluentui/svg-icons/icons/circle_small_20_filled.svg?raw'
import designIdeas16Regular from '@fluentui/svg-icons/icons/design_ideas_16_regular.svg?raw'
import dismiss12 from '@fluentui/svg-icons/icons/dismiss_12_filled.svg?raw'
import dismiss12Regular from '@fluentui/svg-icons/icons/dismiss_12_regular.svg?raw'
import dismiss16 from '@fluentui/svg-icons/icons/dismiss_16_filled.svg?raw'
import edit12 from '@fluentui/svg-icons/icons/edit_12_filled.svg?raw'
import edit16 from '@fluentui/svg-icons/icons/edit_16_filled.svg?raw'
import eye12 from '@fluentui/svg-icons/icons/eye_12_filled.svg?raw'
import eye16 from '@fluentui/svg-icons/icons/eye_16_filled.svg?raw'
import formMultipleCollection20Regular from '@fluentui/svg-icons/icons/form_multiple_collection_20_regular.svg?raw'
import search12 from '@fluentui/svg-icons/icons/search_12_filled.svg?raw'
import search16 from '@fluentui/svg-icons/icons/search_16_filled.svg?raw'
import warning12 from '@fluentui/svg-icons/icons/warning_12_filled.svg?raw'
import warning16 from '@fluentui/svg-icons/icons/warning_16_filled.svg?raw'
import hatGraduation16Regular from '@fluentui/svg-icons/icons/hat_graduation_16_regular.svg?raw'

// Тема Filled — поля и кнопка; тема Regular — чип: так стоит в наборах кита. Размер есть не у каждой иконки.
// У `circle-small` и `form-multiple-collection-regular` размера 16 в наборе нет: взят 20 и ужат до 16, как в ките.
const icons = {
  'apps-regular': { 16: apps16Regular },
  'brightness-low-regular': { 16: brightnessLow16Regular },
  'circle-small': { 16: circleSmall20 },
  'design-ideas-regular': { 16: designIdeas16Regular },
  'form-multiple-collection-regular': { 16: formMultipleCollection20Regular },
  'hat-graduation-regular': { 16: hatGraduation16Regular },
  'chevron-down': { 12: chevronDown12, 16: chevronDown16 },
  dismiss: { 12: dismiss12, 16: dismiss16 },
  'dismiss-regular': { 12: dismiss12Regular },
  edit: { 12: edit12, 16: edit16 },
  eye: { 12: eye12, 16: eye16 },
  search: { 12: search12, 16: search16 },
  warning: { 12: warning12, 16: warning16 },
} satisfies Record<string, Partial<Record<12 | 16, string>>>

export type IconName = keyof typeof icons

// Перечень для страницы «Иконки» в витрине: имя и размеры, которые есть у иконки.
export const iconList = Object.entries(icons).map(([name, sizes]) => ({
  name: name as IconName,
  sizes: Object.keys(sizes).map(Number) as IconSize[],
  // Сами контуры: по ним страница узнаёт подключённую иконку, из какого бы размера файла её ни взяли.
  svgs: Object.values(sizes) as string[],
}))
export type IconSize = 12 | 16

// Иконка красится в цвет текста вокруг и для скринридера не существует: смысл несёт соседний текст или подпись кнопки.
export function Icon({ name, size }: { name: IconName; size: IconSize }) {
  return (
    <span
      className="ds-icon"
      data-size={size}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: (icons[name] as Partial<Record<IconSize, string>>)[size] ?? '' }}
    />
  )
}
