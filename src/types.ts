/* eslint-disable no-use-before-define */
export type Key = unknown

export interface ContainerContract {
  has(): boolean

  get<T>(abstract: T): T extends Resolvable ? T : unknown
}

// type FactoryFunction = () => unknown
// declare class ClassLike {
//   injects?: unknown[]
// }

export type Resolvable<T> = { (): T } & { new (): T } & T
// export type Resolvable = FactoryFunction & ClassLike

function create<T>(C: { new (): T }): T
function create(C: unknown): unknown {
  return new C()
}

class Animal {}
const animal = create(Animal)
const bobCat = create('bob')
console.log(animal, bobCat)
