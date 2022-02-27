import { IHooks } from './types'
import { normalizeArrayable } from './normalize-arrayable'
import { isFunction } from '@blackglory/types'

export function aspect<T, Args extends any[]>(
  fn: (...args: Args) => T
, hooks: IHooks<T>
): (...args: Args) => T
export function aspect<T, Args extends any[]>(
  hooks: IHooks<T>
, fn: (...args: Args) => T
): (...args: Args) => T
export function aspect<T, Args extends any[]>(...args:
| [fn: (...args: Args) => T, hooks: IHooks<T>]
| [hooks: IHooks<T>, fn: (...args: Args) => T]
): (...args: Args) => T {
  if (isFunction(args[0])) {
    const [fn, hooks] = args as [fn: (...args: Args) => T, hooks: IHooks<T>]
    return aspect(hooks, fn)
  }

  const [hooks, fn] = args as [hooks: IHooks<T>, fn: (...args: Args) => T]
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
