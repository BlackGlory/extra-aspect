import { IAsyncHooks } from './types'
import { normalizeArrayable } from './normalize-arrayable'
import { each } from 'extra-promise'

export function aspectAsync<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, hooks: IAsyncHooks<T>
, concurrency: number = 1
): (...args: Args) => Promise<T> {
  return async function (this: unknown, ...args: Args): Promise<T> {
    if (hooks.before) {
      await each(normalizeArrayable(hooks.before), fn => fn(), concurrency)
    }

    try {
      const result = await fn.apply(this, args)

      if (hooks.returning) {
        await each(normalizeArrayable(hooks.returning), fn => fn(result), concurrency)
      }

      return result
    } catch (e) {
      if (hooks.throwing) {
        await each(normalizeArrayable(hooks.throwing), fn => fn(e), concurrency)
      }

      throw e
    } finally {
      if (hooks.finally) {
        await each(normalizeArrayable(hooks.finally), fn => fn(), concurrency)
      }
    }
  }
}
