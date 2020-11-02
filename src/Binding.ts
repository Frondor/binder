import { Resolvable, ContainerContract } from './types'

interface BindingContract {
  resolvable: Resolvable
  shared: boolean
}

const hasPrototype = (fn: Resolvable) => 'prototype' in fn

class Binding implements BindingContract {
  resolvable: Resolvable
  shared: boolean

  constructor(resolvable: Resolvable, shared = false) {
    this.shared = shared
    this.resolvable = resolvable
  }

  resolveInjectables(container: ContainerContract) {
    if (Array.isArray(this.resolvable.injects)) {
      return this.resolvable.injects.map((key) => container.get(key))
    }

    return [container]
  }

  resolve(container: ContainerContract, params: unknown[] = []) {
    if (hasPrototype(this.resolvable)) {
      const dependencies = this.resolveInjectables(container)

      if (params.length) {
        dependencies.push(...params)
      }

      return Reflect.construct(this.resolvable, dependencies)
    }

    return this.resolvable(container, ...params)
  }

  static isResolvable(binding: unknown) {
    return typeof binding === 'function'
  }

  static once(resolvable: Resolvable, container: ContainerContract, params: unknown[]) {
    return new Binding(resolvable).resolve(container, params)
  }
}

export default Binding
