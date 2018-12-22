const Binding = require("./Binding");

module.exports = class ServiceContainer {
  constructor() {
    this.bindings = {};
    this.injector = {};
  }

  get(key, args) {
    if (!this.bindings[key]) throw new ReferenceError(key + " is not bound");
    return this.bindings[key].resolve(this, args);
  }

  _define(key, resolver, type) {
    this.bindings[key] = new Binding(type, key, resolver);

    Object.defineProperty(this.injector, key, {
      configurable: true, // so it can be unbound
      enumerable: true, // so it can be deconstructed
      get: () => this.get(key)
    });
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
