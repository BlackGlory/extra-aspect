import { IHooks, IAsyncHooks } from './types'
import { isntUndefined } from '@blackglory/types'
import 'core-js/features/array/flat'

export function compose<T>(...hooks: Array<IHooks<T>>): IHooks<T>
export function compose<T>(...hooks: Array<IAsyncHooks<T>>): IAsyncHooks<T>
export function compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>): IAsyncHooks<T>
export function compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>) {
  return {
    before: hooks.map(x => x.before)
                 .filter(isntUndefined)
                 .flat()
  , returning: hooks.map(x => x.returning)
                    .filter(isntUndefined)
                    .flat()
  , throwing: hooks.map(x => x.throwing)
                   .filter(isntUndefined)
                   .flat()
  , finally: hooks.map(x => x.finally)
                  .filter(isntUndefined)
                  .flat()
  }
}
