# Binder

<p align="center">
  <a href="https://www.npmjs.com/package/binder">
    <img src="https://img.shields.io/npm/v/binder.svg" alt="npm version">
  </a>
  <a href="https://travis-ci.org/Frondor/binder">
    <img src="https://img.shields.io/travis/Frondor/binder/master.svg" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/Frondor/binder">
    <img src="https://img.shields.io/codecov/c/github/frondor/binder/master.svg" alt="coverage">
  </a>
  <a href="https://bundlephobia.com/result?p=binder@latest">
    <img src="https://img.shields.io/bundlephobia/minzip/binder.svg" alt="Package size">
  </a>
  <a href="https://snyk.io/test/npm/binder">
    <img src="https://snyk.io/test/npm/binder/badge.svg" alt="Known Vulnerabilities">
  </a>
</p>

Simple, yet powerful IoC container and service locator for both, the browser and node.
Inspired by [Illuminate/Container](https://github.com/illuminate/container).

## Installation

NPM users:

```console
> npm i binder
```
YARN users: 

```console
> yarn add binder
```

## Usage

While we miss a documentation website for this, you can simply check out the following example.

You can also refer to the [test cases](test/container.test.ts) and the [Container](src/Container.ts) API, which is pretty easy 

```js
import { Container } from 'binder'
const container = new Container()

class User {
  constructor({ email, password }) {
    this.email = email.toLowerCase().trim()
    this.password = password.trim()
  }
}

/**
 * This class is bound to the container using a factory function
 * that passes a Connection object as its dependency 
 */
class UserRepository {
  constructor(connection) {
    this.db = connection;
  }

  async create({ email, password }) {
    const user = new User({ email, password })
    UserRepository.validate(user)

    return this.db.insert(user.toJSON())
  }

  async findById(id) {
    const user = await this.db.select('email', 'password').where({ id })

    if (user) return new User(user)

    return null
  }

  static validate({ email, password }) {
    if (!email) throw new TypeError('Email is required')
    if (!password) throw new TypeError('Password is required')
  }
}

/**
 * This class is directly bound to the container, which injects itself
 * as the first param whenever the class is resolved. 
 */
class UserController {
  constructor(container) {
    // UserRepository is resolved by reference, so we have intellisense support!
    this.userRepo = containger.get(UserRepository)
  }

  // Simple handler for an express route, using the controller's instance
  async createUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.userRepo.create({ email, password })
      res.send({ user })
    } catch (err) {
      const { stack, ...error } = err
      res.status(400).send({ error })
    }
  }

  async getUser(req, res) {
    const { id } = req.body;
    try {
      const user = await this.userRepo.findById(id)
      if (user === null) {
        throw Object.assign(new Error(`User ${id} not found`), { status: 404 })
      }

      res.send({ user })
    } catch (err) {
      const { stack, status = 500, ...error } = err
      res.status(status).send({ error })
    }
  }
}

/**
 * We want to share the same instance of UserRepository, 
 * hence we bind it as a singleton, otherwise we'd use .bind()
 * 
 * We can provide a factory function as the second param
 * to resolve its dependencies (also from the container).
 */
container.singleton(UserRepository, (container) => {
  const connection = container.get('db').table('users')
  return new UserRepository(connection)
})

/**
 * Because UserController depends directly on the Container,
 * we can simply pass its class to either .get() or .make() methods.
 * The Container will know how to resolve and return an instance of it
 */
container.singleton(UserController)

// Example usage with an Express application (you may want to use a middleware instead)
app.post('/users', (req, res) => container.get(UserController).createUser(req, res))
app.post('/users/:id', (req, res) => container.get(UserController).getUser(req, res))

```

