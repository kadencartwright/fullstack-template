import { describe, expect, test } from 'vitest'
import { appEnv } from '../lib/env'

describe('appEnv', () => {
  test('exposes string defaults for template setup', () => {
    expect(typeof appEnv.clerkPublishableKey).toBe('string')
    expect(typeof appEnv.convexUrl).toBe('string')
  })
})
