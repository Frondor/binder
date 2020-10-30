import Binding from './Binding'

export default class Container {
  protected bindings = new Map()
  protected instances = new Map()
  protected aliases = new Map()

  has(key) {
    const alias = this.getAlias(key)
    return this.#bindings.has(alias) || this.#instances.has(alias)
  }

  bind(key, resolvable, shared = false) {
    if (!key) {
      throw new TypeError('First parameter is required')
    } else if (!resolvable) resolvable = key

    if (!Binding.isResolvable(resolvable)) {
      throw new TypeError(`Only functions are bindable, got [${typeof resolvable}]`)
    }

    this.#bindings.set(key, new Binding(resolvable, shared))
  }

  resolve(key, params?) {
    const alias = this.getAlias(key)
    const instance = this.getInstance(alias)

    if (instance) return instance

    if (this.#bindings.has(alias)) {
      const binding = this.#bindings.get(alias)
      const result = binding.resolve(this, params)

      if (binding.shared) {
        this.#instances.set(alias, result)
      }

      return result
    }
  }

  make(key, ...params) {
    const binding = this.resolve(key, params)

    if (binding) {
      return binding
    } else if (Binding.isResolvable(key)) {
      return Binding.once(key, this, params)
    }

    throw new TypeError(`Can not resolve anything for ${key}`)
  }

  get(key) {
    const binding = this.resolve(key)

    if (binding) return binding

    throw new TypeError(`${key} is not bound`)
  }

  instance(key, value) {
    this.#instances.set(key, value)
  }

  singleton(key, resolvable) {
    return this.bind(key, resolvable, true)
  }

  getInstance(key) {
    return this.#instances.has(key) ? this.#instances.get(key) : null
  }

  alias(alias, key) {
    this.#aliases.set(alias, key)
  }

  getAlias(alias) {
    const key = this.#aliases.has(alias) ? this.#aliases.get(alias) : null
    return key || alias
  }
}
