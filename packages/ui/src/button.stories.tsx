import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight } from 'lucide-react'
import { Button } from './components/button'

const meta = {
  component: Button,
  title: 'UI/Button',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      Continue
      <ArrowRight />
    </Button>
  ),
}
