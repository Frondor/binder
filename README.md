# Binder

<center>
  <a href="https://travis-ci.org/Frondor/binder">
    <img src="https://travis-ci.org/Frondor/binder.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/Frondor/binder.svg" alt="Greenkeeper badge">
  </a>
</center>

Simple, yet powerful IoC container and service locator for both, the browser and node.
Inspired by [Illuminate/Container](https://github.com/illuminate/container).

## Installation

TBD

## Getting started

It's pretty simple, you only need to create an instance of the [ServiceContainer](src/ServiceContainer.js) class and `import` it whenever you need.

## API

### <code>container.bind(string: key, <a href="#resolver-function">Function: resolver</a>)</code>

Registers a service/object into the container, passing a function that will be called whenever the service is requested or ["injected"](#container.injector), resolving a new instance of the given class each time.

Example:

```js
container.bind("UserController", ({ auth }) => {
  return new UserController(auth);
});
```

### `container.instance(string: key, any: instance)`

Registers an existing object instance into the container, that will always be returned on subsequent calls.

Example:

```js
container.instance("config", new ConfigStore());
```

### <code>container.singleton(string: key, <a href="#resolver-function">Function: resolver</a>)</code>

Just like `bind`, but the resolver function creates the object instance once, and then always return the same instance on subsequent calls.

Example:

```js
container.singleton("cache", () => new CacheStore());
```

### `container.get(string: key, Array: arguments?)`

Resolve and return registered bindings from the container.

Pass an array of parameters as second argument to provide the binding's resolver function with.

Example:

```js
container.bind("storage", (_, args) => new StorageDriver(...args));
container.get("storage", ["session"]);
```

### `container.injector`

This object is passed as the first argument of every resolver function, but you can use it whenever you want to implement Dependency Injection.
It uses property accesors to resolve its properties directly from the container (internally calling `container.get()`), and throw an error if they are not registered.

Example:

```js
const { cache } = container.injector;
container.get("cache") === cache;
```

Dependency Injection outside the container:

```js
class UsersController {
  constructor({ db }) {
    this.db = db;
  }

  async getUser(req) {
    return await this.db
      .select("*")
      .from("users")
      .where("id", req.params.id);
  }
}

const controller = new UsersController(container.injector);
app.get("/user/:id", controller.getUser);
```

### `resolver` function

The resolver function instructs the container on how to create an object, returning a new instance of it.

Note that it receives the [`container.injector`](#containerinjector) as the first argument, so we can then use the container to resolve sub-dependencies of the object we are building, and an optional array of params as second argument (see `container.get`).
