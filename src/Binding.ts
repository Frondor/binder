import Container from './Container'
import { Resolvable } from './types'

class Binding {
  protected resolvable: Resolvable
  public shared: boolean

  constructor(resolvable: Resolvable, shared = false) {
    this.shared = shared
    this.resolvable = resolvable
  }

  get injectsDependencies() {
    return Array.isArray(this.resolvable.injects)
  }

  resolveInjectables(container: Container) {
    return this.resolvable.injects.map((key) => container.get(key))
  }

  resolve(container: Container, params = []) {
    if ('prototype' in this.resolvable) {
      const dependencies = this.injectsDependencies
        ? this.resolveInjectables(container)
        : [container]

      if (params.length) {
        dependencies.push(...params)
      }

      return new this.resolvable(...dependencies)
    }

    return this.resolvable(container, ...params)
  }

  static isResolvable(binding) {
    return typeof binding === 'function'
  }

  static once(resolvable, container, params) {
    return new Binding(resolvable).resolve(container, params)
  }
}

export default Binding
