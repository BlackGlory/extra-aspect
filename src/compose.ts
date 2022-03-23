import { IHooks, IAsyncHooks } from './types'
import { isntUndefined } from '@blackglory/types'
import flatten from 'lodash/flatten'

export function compose<T>(...hooks: Array<IHooks<T>>): IHooks<T>
export function compose<T>(...hooks: Array<IAsyncHooks<T>>): IAsyncHooks<T>
export function compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>): IAsyncHooks<T>
export function compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>) {
  return {
    before: flatten(
      hooks
        .map(x => x.before)
        .filter(isntUndefined)
    )
  , returning: flatten(
      hooks
        .map(x => x.returning)
        .filter(isntUndefined)
    )
  , throwing: flatten(
      hooks
        .map(x => x.throwing)
        .filter(isntUndefined)
    )
  , finally: flatten(
      hooks
        .map(x => x.finally)
        .filter(isntUndefined)
    )
  }
}
