import { isArray } from '@blackglory/types'
import { Arrayable } from 'justypes'

export function normalizeArrayable<T>(arrayable: Arrayable<T>): T[] {
  return isArray(arrayable)
         ? arrayable
         : [arrayable]
}
