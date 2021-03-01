/* eslint-disable no-dupe-class-members */
import Binding from './Binding'
import { Key, Resolvable } from './types'

export default class Container {
  protected bindings = new Map()
  protected instances = new Map()
  protected aliases = new Map()

  has(key: Key) {
    const alias = this.getAlias(key)
    return this.bindings.has(alias) || this.instances.has(alias)
  }

  bind(key: Key | Resolvable<unknown>, resolvable?: unknown | Resolvable<unknown>, shared = false) {
    if (!key) {
      throw new TypeError('First parameter is required')
    } else if (!resolvable) resolvable = key as Resolvable<unknown>

    if (Binding.isResolvable(resolvable)) {
      this.bindings.set(key, new Binding(resolvable as Resolvable<unknown>, shared))
      return this
    }

    throw new TypeError(`Only functions are bindable, got [${typeof resolvable}]`)
  }

  resolve(key: Key, params?: unknown[]) {
    const alias = this.getAlias(key)
    const instance = this.getInstance(alias)

    if (instance) return instance

    if (this.bindings.has(alias)) {
      const binding = this.bindings.get(alias)
      const result = binding.resolve(this, params)

      if (binding.shared) {
        this.instances.set(alias, result)
      }

      return result
    }
  }

  make(key: unknown, ...params: unknown[]) {
    const binding = this.resolve(key, params)

    if (binding) {
      return binding
    } else if (Binding.isResolvable(key)) {
      return Binding.once(key as Resolvable<unknown>, this, params)
    }

    throw new TypeError(`Can not resolve anything for ${key}`)
  }

  get<T extends new (...p: any[]) => InstanceType<T>>(key: T): InstanceType<T>
  get<T>(key: T): T extends new () => infer I ? I : unknown
  get(key: unknown): unknown {
    const binding = this.resolve(key)

    if (binding) return binding

    throw new TypeError(`${key} is not bound`)
  }

  instance(key: Key, value: unknown) {
    this.instances.set(key, value)
  }

  singleton(key: Key, resolvable: unknown) {
    return this.bind(key, resolvable, true)
  }

  getInstance(key: Key) {
    return this.instances.has(key) ? this.instances.get(key) : null
  }

  alias(alias: unknown, key: Key | Resolvable<unknown>) {
    this.aliases.set(alias, key)
  }

  getAlias(alias: unknown) {
    const key = this.aliases.has(alias) ? this.aliases.get(alias) : null
    return key || alias
  }
}
