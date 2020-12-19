/* eslint-disable no-use-before-define */
export type Key = unknown

export type Resolvable<T> = { (...params: unknown[]): T } & {
  new (...params: unknown[]): T
} & T

export interface ContainerContract {
  has(key: Key): boolean

  get<T>(key: T): T extends new () => infer I ? I : unknown
  get(key: unknown): unknown
}
