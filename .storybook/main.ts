import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  // Тексты лицензий шрифтов едут в витрину вместе с самими шрифтами.
  "staticDirs": ["../public"],
  "framework": "@storybook/react-vite"
};
export default config;