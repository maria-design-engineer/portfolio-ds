// Иконки библиотеки. Контуры — пакет @fluentui/svg-icons: в собранный пакет попадают только названные здесь.
// Наружу компонент не выходит: иконки живут внутри полей и кнопки, имя набора в сайт не едет.
import chevronDown12 from '@fluentui/svg-icons/icons/chevron_down_12_filled.svg?raw'
import chevronDown16 from '@fluentui/svg-icons/icons/chevron_down_16_filled.svg?raw'
import dismiss12 from '@fluentui/svg-icons/icons/dismiss_12_filled.svg?raw'
import dismiss16 from '@fluentui/svg-icons/icons/dismiss_16_filled.svg?raw'
import edit12 from '@fluentui/svg-icons/icons/edit_12_filled.svg?raw'
import edit16 from '@fluentui/svg-icons/icons/edit_16_filled.svg?raw'
import eye12 from '@fluentui/svg-icons/icons/eye_12_filled.svg?raw'
import eye16 from '@fluentui/svg-icons/icons/eye_16_filled.svg?raw'
import search12 from '@fluentui/svg-icons/icons/search_12_filled.svg?raw'
import search16 from '@fluentui/svg-icons/icons/search_16_filled.svg?raw'
import warning12 from '@fluentui/svg-icons/icons/warning_12_filled.svg?raw'
import warning16 from '@fluentui/svg-icons/icons/warning_16_filled.svg?raw'

const icons = {
  'chevron-down': { 12: chevronDown12, 16: chevronDown16 },
  dismiss: { 12: dismiss12, 16: dismiss16 },
  edit: { 12: edit12, 16: edit16 },
  eye: { 12: eye12, 16: eye16 },
  search: { 12: search12, 16: search16 },
  warning: { 12: warning12, 16: warning16 },
}

export type IconName = keyof typeof icons
export type IconSize = 12 | 16

// Иконка красится в цвет текста вокруг и для скринридера не существует: смысл несёт соседний текст или подпись кнопки.
export function Icon({ name, size }: { name: IconName; size: IconSize }) {
  return (
    <span
      className="ds-icon"
      data-size={size}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name][size] }}
    />
  )
}
