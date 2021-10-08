import { aspect } from '@src/aspect'
import { getError } from 'return-style'

describe(`
  aspect<T, Args extends any[]>(
    fn: (...args: Args) => T
  , hooks: IHooks<T>
  ): (...args: Args) => T
`, () => {
  describe('before', () => {
    test('function', () => {
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        return 'bar'
      })
      const before = jest.fn(() => {
        order.push(before)
      })

      const newFn = aspect(fn, { before })
      const result = newFn('foo')

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(before).toBeCalledTimes(1)
      expect(result).toBe('bar')
      expect(order).toStrictEqual([before, fn])
    })

    test('array', () => {
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        return 'bar'
      })
      const before1 = jest.fn(() => {
        order.push(before1)
      })
      const before2 = jest.fn(() => {
        order.push(before2)
      })

      const newFn = aspect(fn, { before: [before1, before2] })
      const result = newFn('foo')

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(before1).toBeCalledTimes(1)
      expect(before2).toBeCalledTimes(1)
      expect(result).toBe('bar')
      expect(order).toStrictEqual([before1, before2, fn])
    })
  })

  describe('returning', () => {
    test('function', () => {
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        return 'bar'
      })
      const returning = jest.fn(() => {
        order.push(returning)
      })
      const throwing = jest.fn(() => {
        order.push(throwing)
      })

      const newFn = aspect(fn, { returning, throwing })
      const result = newFn('foo')

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(returning).toBeCalledTimes(1)
      expect(throwing).toBeCalledTimes(0)
      expect(result).toBe('bar')
      expect(order).toStrictEqual([fn, returning])
    })

    test('array', () => {
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        return 'bar'
      })
      const returning1 = jest.fn(() => {
        order.push(returning1)
      })
      const returning2 = jest.fn(() => {
        order.push(returning2)
      })
      const throwing = jest.fn(() => {
        order.push(throwing)
      })

      const newFn = aspect(fn, { returning: [returning1, returning2], throwing })
      const result = newFn('foo')

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(returning1).toBeCalledTimes(1)
      expect(returning2).toBeCalledTimes(1)
      expect(throwing).toBeCalledTimes(0)
      expect(result).toBe('bar')
      expect(order).toStrictEqual([fn, returning1, returning2])
    })
  })

  describe('throwing', () => {
    test('function', () => {
      const customError = new Error('error')
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        throw customError
      })
      const returning = jest.fn(() => {
        order.push(returning)
      })
      const throwing = jest.fn(() => {
        order.push(throwing)
      })

      const newFn = aspect(fn, { returning, throwing })
      const err = getError(() => newFn('foo'))

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(returning).toBeCalledTimes(0)
      expect(throwing).toBeCalledTimes(1)
      expect(err).toBe(customError)
      expect(order).toStrictEqual([fn, throwing])
    })

    test('array', () => {
      const customError = new Error('error')
      const order: Function[] = []
      const fn = jest.fn(_ => {
        order.push(fn)
        throw customError
      })
      const returning = jest.fn(() => {
        order.push(returning)
      })
      const throwing1 = jest.fn(() => {
        order.push(throwing1)
      })
      const throwing2 = jest.fn(() => {
        order.push(throwing2)
      })

      const newFn = aspect(fn, { returning, throwing: [throwing1, throwing2] })
      const err = getError(() => newFn('foo'))

      expect(fn).toBeCalledWith('foo')
      expect(fn).toBeCalledTimes(1)
      expect(returning).toBeCalledTimes(0)
      expect(throwing1).toBeCalledTimes(1)
      expect(throwing2).toBeCalledTimes(1)
      expect(err).toBe(customError)
      expect(order).toStrictEqual([fn, throwing1, throwing2])
    })
  })

  describe('finally', () => {
    describe('returning', () => {
      test('function', () => {
        const order: Function[] = []
        const fn = jest.fn(_ => {
          order.push(fn)
          return 'bar'
        })
        const returning = jest.fn(() => {
          order.push(returning)
        })
        const finallyHook = jest.fn(() => {
          order.push(finallyHook)
        })

        const newFn = aspect(fn, { returning, finally: finallyHook })
        const result = newFn('foo')

        expect(fn).toBeCalledWith('foo')
        expect(fn).toBeCalledTimes(1)
        expect(returning).toBeCalledTimes(1)
        expect(finallyHook).toBeCalledTimes(1)
        expect(result).toBe('bar')
        expect(order).toStrictEqual([fn, returning, finallyHook])
      })

      test('array', () => {
        const order: Function[] = []
        const fn = jest.fn(_ => {
          order.push(fn)
          return 'bar'
        })
        const returning = jest.fn(() => {
          order.push(returning)
        })
        const finally1 = jest.fn(() => {
          order.push(finally1)
        })
        const finally2 = jest.fn(() => {
          order.push(finally2)
        })

        const newFn = aspect(fn, { returning, finally: [finally1, finally2] })
        const result = newFn('foo')

        expect(fn).toBeCalledWith('foo')
        expect(fn).toBeCalledTimes(1)
        expect(returning).toBeCalledTimes(1)
        expect(finally1).toBeCalledTimes(1)
        expect(finally2).toBeCalledTimes(1)
        expect(result).toBe('bar')
        expect(order).toStrictEqual([fn, returning, finally1, finally2])
      })
    })

    describe('throwing', () => {
      test('function', () => {
        const customError = new Error('error')
        const order: Function[] = []
        const fn = jest.fn(_ => {
          order.push(fn)
          throw customError
        })
        const throwing = jest.fn(() => {
          order.push(throwing)
        })
        const finallyHook = jest.fn(() => {
          order.push(finallyHook)
        })

        const newFn = aspect(fn, { throwing, finally: finallyHook })
        const err = getError(() => newFn('foo'))

        expect(fn).toBeCalledWith('foo')
        expect(fn).toBeCalledTimes(1)
        expect(throwing).toBeCalledTimes(1)
        expect(finallyHook).toBeCalledTimes(1)
        expect(err).toBe(customError)
        expect(order).toStrictEqual([fn, throwing, finallyHook])
      })

      test('array', () => {
        const customError = new Error('error')
        const order: Function[] = []
        const fn = jest.fn(_ => {
          order.push(fn)
          throw customError
        })
        const throwing = jest.fn(() => {
          order.push(throwing)
        })
        const finally1 = jest.fn(() => {
          order.push(finally1)
        })
        const finally2 = jest.fn(() => {
          order.push(finally2)
        })

        const newFn = aspect(fn, { throwing, finally: [finally1, finally2] })
        const err = getError(() => newFn('foo'))

        expect(fn).toBeCalledWith('foo')
        expect(fn).toBeCalledTimes(1)
        expect(throwing).toBeCalledTimes(1)
        expect(finally1).toBeCalledTimes(1)
        expect(err).toBe(customError)
        expect(order).toStrictEqual([fn, throwing, finally1, finally2])
      })
    })
  })
})
