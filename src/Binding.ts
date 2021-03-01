import { Container } from '.'
import { Resolvable } from './types'

interface BindingContract {
  resolvable: Resolvable<unknown>
  shared: boolean
}

const hasPrototype = (fn: Resolvable<unknown>) => 'prototype' in fn

class Binding implements BindingContract {
  resolvable: Resolvable<unknown>
  shared: boolean

  constructor(resolvable: Resolvable<unknown>, shared = false) {
    this.shared = shared
    this.resolvable = resolvable as Resolvable<unknown>
  }

  resolveInjectables(container: Container) {
    if (Array.isArray(this.resolvable.injects)) {
      return this.resolvable.injects.map((key: unknown) => container.get(key))
    }

    return [container]
  }

  resolve(container: Container, params: unknown[] = []) {
    if (hasPrototype(this.resolvable)) {
      const dependencies = this.resolveInjectables(container)

      if (params.length) {
        dependencies.push(...params)
      }

      return Reflect.construct(this.resolvable as Resolvable<unknown>, dependencies)
    }

    return this.resolvable(container, ...params)
  }

  static isResolvable(binding: unknown) {
    return typeof binding === 'function'
  }

  static once(resolvable: Resolvable<unknown>, container: Container, params: unknown[]) {
    return new Binding(resolvable).resolve(container, params)
  }
}

export default Binding
