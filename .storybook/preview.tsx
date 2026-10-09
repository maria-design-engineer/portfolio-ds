import type { Preview } from '@storybook/react-vite'

// Стили библиотеки — те же, что уезжают в пакет.
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
