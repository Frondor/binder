import Binding from "./Binding";

export default class ServiceContainer {
  constructor() {
    // has to be a Map because we need a key-value object that honors registration order
    this.bindings = {};

    // key-value store of getters to resolve bindings on demand
    this.injector = {}; // probably this needs to be implemented outside container
    // same here but how to declare getter?
  }

  _resolveBinding(key) {
    return this.bindings[key].resolve();
  }

  get(key) {
    if (!this.bindings[key]) throw new Error(key + " is not bound"); // to-do typed error
    return this._resolveBinding(key);
  }

  _define(key, resolver, type) {
    const descriptor = {
      configurable: true, // so it can be unbound
      enumerable: true // so it can be deconstructed
    };

    this.bindings[key] = new Binding(this, type, key, resolver);
    switch (type) {
      case Binding.types.INSTANCE:
        descriptor.value = resolver;
        break;
      case Binding.types.CLASS:
      case Binding.types.SINGLETON:
      default:
        descriptor.get = () => this._resolveBinding(key);
        break;
    }

    Object.defineProperty(this.injector, key, descriptor);
  }

  bind(key, resolver) {
    if (typeof resolver !== "function") return this.instance(key, resolver);
    this._define(key, resolver, Binding.types.CLASS);
  }
  instance(key, obj) {
    this._define(key, obj, Binding.types.INSTANCE);
  }
  singleton(key, resolver) {
    this._define(key, resolver, Binding.types.SINGLETON);
  }

  // No real usage for this
  // unbind(key) {
  //   delete this.injector[key];
  //   delete this.bindings[key];
  // }
}
