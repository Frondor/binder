import Binding from "./Binding";

export default class ServiceContainer {
  constructor() {
    // has to be a Map because we need a key-value object that honors registration order
    this.bindings = {};

    // key-value store of getters to resolve bindings on demand
    this.injector = {}; // probably this needs to be implemented outside container
    // same here but how to declare getter?
  }

  _resolveBinding(key, args) {
    return this.bindings[key].resolve(args);
  }

  get(key, args) {
    if (!this.bindings[key]) throw new ReferenceError(key + " is not bound");
    return this._resolveBinding(key, args);
  }

  _define(key, resolver, type) {
    this.bindings[key] = new Binding(this, type, key, resolver);

    Object.defineProperty(this.injector, key, {
      configurable: true, // so it can be unbound
      enumerable: true, // so it can be deconstructed
      get: () => this.get(key)
    });
  }

  /**
   * Binds a class
   *
   * @param {*} key key to identify the service
   * @param {*} resolver function to instruct the container how to instantiate the service
   * @returns
   * @memberof ServiceContainer
   */
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
