import type { Preview } from '@storybook/react-vite'

// Стили библиотеки — те же, что уезжают в пакет.
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    // Порядок меню: токены, затем три группы компонентов — как страницы кита и очереди сборки.
    options: {
      storySort: {
        order: ['Токены', ['Переменные', 'Стили', 'Иконки'], 'Base UI', 'Components', 'Product components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
