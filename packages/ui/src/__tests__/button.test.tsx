import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Button } from '../components/button'

describe('Button', () => {
  test('renders its label', () => {
    render(<Button>Launch</Button>)

    expect(screen.getByRole('button', { name: 'Launch' })).toBeTruthy()
  })
})
