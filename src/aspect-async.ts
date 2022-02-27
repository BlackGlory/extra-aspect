import { IAsyncHooks } from './types'
import { normalizeArrayable } from './normalize-arrayable'
import { each } from 'extra-promise'
import { isFunction } from '@blackglory/types'

export function aspectAsync<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, hooks: IAsyncHooks<T>
, concurrency?: number
): (...args: Args) => Promise<T>
export function aspectAsync<T, Args extends any[]>(
  hooks: IAsyncHooks<T>
, fn: (...args: Args) => PromiseLike<T>
, concurrency?: number
): (...args: Args) => Promise<T>
export function aspectAsync<T, Args extends any[]>(...args:
| [fn: (...args: Args) => PromiseLike<T>, hooks: IAsyncHooks<T>, concurrency?: number]
| [hooks: IAsyncHooks<T>, fn: (...args: Args) => PromiseLike<T>, concurrency?: number]
): (...args: Args) => Promise<T> {
  if (isFunction(args[0])) {
    const [fn, hooks, concurrency] = args as [fn: (...args: Args) => PromiseLike<T>, hooks: IAsyncHooks<T>, concurrency?: number]
    return aspectAsync(hooks, fn, concurrency)
  }

  const [hooks, fn, concurrency = 1] = args as [hooks: IAsyncHooks<T>, fn: (...args: Args) => PromiseLike<T>, concurrency?: number]
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
