import { Arrayable } from 'justypes'

export type IHooks<T> = {
  before?: Arrayable<() => unknown>
  returning?: Arrayable<(result: T) => unknown>
  throwing?: Arrayable<(err: unknown) => unknown>
  finally?: Arrayable<() => unknown>
}

export type IAsyncHooks<T> = {
  before?: Arrayable<() => unknown | PromiseLike<unknown>>
  returning?: Arrayable<(result: T) => unknown | PromiseLike<unknown>>
  throwing?: Arrayable<(err: unknown) => unknown | PromiseLike<unknown>>
  finally?: Arrayable<() => unknown | PromiseLike<unknown>>
}
