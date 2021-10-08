# extra-aspect

## Install

```sh
npm install --save extra-aspect
# or
yarn add extra-aspect
```

## Usage

```ts
import { aspect } from 'extra-aspect'

const fn = aspect(
  () => {
    console.log('called')
    return 'return'
  }
, {
    before: () => console.log('before')
  , returning: () => console.log('returning')
  }
)

console.log(fn())
// before
// called
// returning
// return
```

## API

```ts
type IHooks<T> = {
  before?: Arrayable<() => unknown>
  returning?: Arrayable<(result: T) => unknown>
  throwing?: Arrayable<(err: unknown) => unknown>
  finally?: Arrayable<() => unknown>
}

type IAsyncHooks<T> = {
  before?: Arrayable<() => unknown | PromiseLike<unknown>>
  returning?: Arrayable<(result: T) => unknown | PromiseLike<unknown>>
  throwing?: Arrayable<(err: unknown) => unknown | PromiseLike<unknown>>
  finally?: Arrayable<() => unknown | PromiseLike<unknown>>
}
```

### aspect

```ts
function aspect<T, Args extends any[]>(
  fn: (...args: Args) => T
, hooks: IHooks<T>
): (...args: Args) => T
```

### aspectAsync

```ts
function aspectAsync<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, hooks: IAsyncHooks<T>
, concurrency: number = 1
): (...args: Args) => Promise<T>
```

### compose

```ts
function compose<T>(...hooks: Array<IHooks<T>>): IHooks<T>
function compose<T>(...hooks: Array<IAsyncHooks<T>>): IAsyncHooks<T>
function compose<T>(...hooks: Array<IHooks<T> | IAsyncHooks<T>>): IAsyncHooks<T>
```
