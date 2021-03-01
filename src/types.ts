/* eslint-disable no-use-before-define */
export type Key = unknown

export type Injectable = {
  injects: Array<Resolvable<unknown>>
}

export type Resolvable<T> = { (...params: unknown[]): T } & {
  new (...params: unknown[]): T
} & T &
  Injectable
