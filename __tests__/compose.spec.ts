import { compose } from '@src/compose'
import { IHooks, IAsyncHooks } from '@src/types'
import { normalizeArrayable } from '@src/normalize-arrayable'

test('compose<T>(...hooks: Array<IHooks<T>>): IHooks<T>', () => {
  const hook1: IHooks<number> = {
    before: () => 1
  , returning: () => 1
  , throwing: () => 1
  , finally: () => 1
  }
  const hook2: IHooks<number> = {
    before: () => 2
  , returning: () => 2
  , throwing: () => 2
  , finally: () => 2
  }
  const hook3: IHooks<number> = {
    before: [() => 3, () => 4]
  , returning: [() => 3, () => 4]
  , throwing: [() => 3, () => 4]
  , finally: [() => 3, () => 4]
  }
  const hook4: IHooks<number> = {}

  const result = compose(hook1, hook2, hook3, hook4)

  expect(result).toStrictEqual({
    before: [hook1.before, hook2.before, ...normalizeArrayable(hook3.before)]
  , returning: [hook1.returning, hook2.returning, ...normalizeArrayable(hook3.returning)]
  , throwing: [hook1.throwing, hook2.throwing, ...normalizeArrayable(hook3.throwing)]
  , finally: [hook1.finally, hook2.finally, ...normalizeArrayable(hook3.finally)]
  })
})

test('compose<T>(...hooks: Array<IAsyncHooks<T>>): IAsyncHooks<T>', () => {
  const hook1: IAsyncHooks<number> = {
    before: async () => 1
  , returning: async () => 1
  , throwing: async () => 1
  , finally: async () => 1
  }
  const hook2: IAsyncHooks<number> = {
    before: async () => 2
  , returning: async () => 2
  , throwing: async () => 2
  , finally: async () => 2
  }
  const hook3: IAsyncHooks<number> = {
    before: [async () => 3, async () => 4]
  , returning: [async () => 3, async () => 4]
  , throwing: [async () => 3, async () => 4]
  , finally: [async () => 3, async () => 4]
  }
  const hook4: IAsyncHooks<number> = {}

  const result = compose(hook1, hook2, hook3, hook4)

  expect(result).toStrictEqual({
    before: [hook1.before, hook2.before, ...normalizeArrayable(hook3.before)]
  , returning: [hook1.returning, hook2.returning, ...normalizeArrayable(hook3.returning)]
  , throwing: [hook1.throwing, hook2.throwing, ...normalizeArrayable(hook3.throwing)]
  , finally: [hook1.finally, hook2.finally, ...normalizeArrayable(hook3.finally)]
  })
})

describe('compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>): IAsyncHooks<T>', () => {
  const hook1: IHooks<number> = {
    before: () => 1
  , returning: () => 1
  , throwing: () => 1
  , finally: () => 1
  }
  const hook2: IAsyncHooks<number> = {
    before: async () => 2
  , returning: async () => 2
  , throwing: async () => 2
  , finally: async () => 2
  }
  const hook3: IAsyncHooks<number> = {
    before: [() => 3, async () => 4]
  , returning: [() => 3, async () => 4]
  , throwing: [() => 3, async () => 4]
  , finally: [() => 3, async () => 4]
  }
  const hook4: IAsyncHooks<number> = {}

  const result = compose(hook1, hook2, hook3, hook4)

  expect(result).toStrictEqual({
    before: [hook1.before, hook2.before, ...normalizeArrayable(hook3.before)]
  , returning: [hook1.returning, hook2.returning, ...normalizeArrayable(hook3.returning)]
  , throwing: [hook1.throwing, hook2.throwing, ...normalizeArrayable(hook3.throwing)]
  , finally: [hook1.finally, hook2.finally, ...normalizeArrayable(hook3.finally)]
  })
})
