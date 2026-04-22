import path from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const storybookDir = path.dirname(new URL(import.meta.url).pathname)

const config: StorybookConfig = {
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          {
            find: '@fullstack-template/ui/styles.css',
            replacement: path.resolve(storybookDir, '../../../packages/ui/src/styles.css'),
          },
          {
            find: '@fullstack-template/ui',
            replacement: path.resolve(storybookDir, '../../../packages/ui/src/index.ts'),
          },
        ],
      },
      server: {
        fs: {
          allow: [path.resolve(storybookDir, '../../..')],
        },
      },
    }),
}

export default config
