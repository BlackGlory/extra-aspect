import { normalizeArrayable } from '@src/normalize-arrayable'

describe('normalizeArrayable<T>(arrayable: Arrayable<T>): T[]', () => {
  test('array', () => {
    const result = normalizeArrayable([1])

    expect(result).toStrictEqual([1])
  })

  test('non-array', () => {
    const result = normalizeArrayable(1)

    expect(result).toStrictEqual([1])
  })
})
