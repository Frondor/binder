export default class Binding {
  /**
   * Creates an instance of Binding.
   * @param {ServiceContainer} container
   * @param {String} type class, singleton, instance
   * @param {String} name
   * @param {*} resolver resolver function (or instance) with instructions on how to "make" the object
   */
  constructor(container, type, name, resolver) {
    this.container = container;
    this.type = type; // class, singleton, instance
    this.name = name;
    this.resolver = resolver;
    this.instance = type === Binding.types.INSTANCE ? resolver : null;
    this.isSingleton = type === Binding.types.SINGLETON;
  }

  resolve() {
    let result;
    if (this.instance) result = this.instance;
    else if (this.isSingleton)
      result = this.instance = this.resolver(this.container.injector);
    else result = this.resolver(this.container.injector);

    return result;
  }

  static get types() {
    return { CLASS: "class", INSTANCE: "instance", SINGLETON: "singleton" };
  }
}
