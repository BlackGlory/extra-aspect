import { IHooks } from './types'
import { normalizeArrayable } from './normalize-arrayable'

export function aspect<T, Args extends any[]>(
  fn: (...args: Args) => T
, hooks: IHooks<T>
): (...args: Args) => T {
  return function (this: unknown, ...args: Args): T {
    if (hooks.before) {
      normalizeArrayable(hooks.before).forEach(fn => fn())
    }

    try {
      const result = fn.apply(this, args)

      if (hooks.returning) {
        normalizeArrayable(hooks.returning).forEach(fn => fn(result))
      }

      return result
    } catch (e) {
      if (hooks.throwing) {
        normalizeArrayable(hooks.throwing).forEach(fn => fn(e))
      }

      throw e
    } finally {
      if (hooks.finally) {
        normalizeArrayable(hooks.finally).forEach(fn => fn())
      }
    }
  }
}
