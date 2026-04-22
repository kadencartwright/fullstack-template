import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './components/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/card'

const meta = {
  title: 'UI/Card',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <Badge className="mb-2 w-fit">Starter</Badge>
        <CardTitle>Shared card component</CardTitle>
        <CardDescription>
          Reuse this in the app and inspect it in Storybook from the same source file.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        The UI package is presentation-only so it stays easy to test and reuse.
      </CardContent>
    </Card>
  ),
}
