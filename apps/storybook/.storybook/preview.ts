import type { Preview } from '@storybook/react-vite'
import '@fullstack-template/ui/styles.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'canvas',
      values: [{ name: 'canvas', value: 'hsl(0 0% 100%)' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
}

export default preview
