'use client'

// Пометка для Next: компоненты пакета держат состояние и обработчики, они клиентские.
// Точка входа пакета: чего здесь нет, того для приложения не существует.
import './styles.css'


export { TextInput } from './TextInput/TextInput'
export type { TextInputProps, TextInputSize } from './TextInput/TextInput'
export { TextArea } from './TextArea/TextArea'
export type { TextAreaProps, TextAreaSize } from './TextArea/TextArea'
export { Spin } from './Spin/Spin'
export type { SpinProps, SpinSize } from './Spin/Spin'
export { Button } from './Button/Button'
export type { ButtonProps, ButtonView, ButtonSize, ButtonIcon } from './Button/Button'
export { Chip } from './Chip/Chip'
export type { ChipProps, ChipColor, ChipVariant, ChipSize, ChipStartIcon, ChipEndIcon } from './Chip/Chip'
export { WhyPoint } from './WhyPoint/WhyPoint'
export type { WhyPointProps, WhyPointView } from './WhyPoint/WhyPoint'
export { CaseCard } from './CaseCard/CaseCard'
export type { CaseCardProps, CaseCardDevice, CaseCardTag } from './CaseCard/CaseCard'
