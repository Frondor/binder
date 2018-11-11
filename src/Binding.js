class Binding {
  constructor(type, name, resolver) {
    this.type = type; // class, singleton, instance
    this.name = name;
    this.resolver = resolver;
    this.instance = type === Binding.types.INSTANCE ? resolver : null;
    this.isSingleton = type === Binding.types.SINGLETON;
  }

  _checkAndReturnArgs(args) {
    if (args && (!args.constructor || args.constructor.name !== "Array"))
      throw new TypeError(
        "[Container binding] Arguments must be passed as Array"
      );
    return args || [];
  }

  resolve(container, args) {
    let result;
    if (this.instance) result = this.instance;
    else if (this.isSingleton)
      result = this.instance = this.resolver(
        container.injector,
        this._checkAndReturnArgs(args)
      );
    else
      result = this.resolver(
        container.injector,
        this._checkAndReturnArgs(args)
      );

    return result;
  }
}

Object.defineProperty(Binding, "types", {
  value: {
    CLASS: 1,
    INSTANCE: 2,
    SINGLETON: 3
  }
});

export default Binding;
