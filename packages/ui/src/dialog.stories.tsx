import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/dialog'

const meta = {
  title: 'UI/Dialog',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Starter dialog</DialogTitle>
          <DialogDescription>
            This dialog is built with Radix and styled with shadcn patterns.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
}
