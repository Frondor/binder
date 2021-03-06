import { Container } from '../src'

class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class Dog extends Animal {}
class Cat extends Animal {}

describe('container', () => {
  let container = new Container()
  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    container = new Container()
  })

  describe('when resolving classes', () => {
    it('should return distinct instances of that class', () => {
      container.bind(Animal)
      const animal1 = container.get(Animal)
      const animal2 = container.get(Animal)
      expect(animal1).toBeInstanceOf(Animal)
      expect(animal2).toBeInstanceOf(Animal)
      expect(animal1 === animal2).toBe(false)
    })

    it('should resolve function-like classes', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const LegacyClass = function () {}
      container.bind(LegacyClass)
      expect(container.get(LegacyClass)).toBeInstanceOf(LegacyClass)
    })
  })

  describe('when resolving factories', () => {
    it('should resolve factory: arrow function', () => {
      container.instance('name', 'Rocco')
      container.bind('dog', (container: Container) => new Dog(container.get('name') as string))
      const dog = container.get('dog') as Dog
      expect(dog).toBeInstanceOf(Dog)
      expect(dog.name).toStrictEqual('Rocco')
    })

    it('should resolve factory: non-arrow function', () => {
      container.instance('name', 'Rocco')
      container.bind('dog', function (container: Container) {
        return new Dog(container.get('name') as string)
      })
      const dog = container.get('dog') as Dog
      expect(dog).toBeInstanceOf(Dog)
      expect(dog.name).toStrictEqual('Rocco')
    })

    it('should resolve factory: bound arrow function (edge case)', () => {
      container.instance('name', 'Rocco')
      container.bind('dog', (container: Container) => new Dog(container.get('name') as string))
      const dog = container.get('dog') as Dog
      expect(dog).toBeInstanceOf(Dog)
      expect(dog.name).toStrictEqual('Rocco')
    })

    it('should resolve factory: bound non-arrow function (edge case)', () => {
      container.instance('name', 'Rocco')
      container.bind('dog', function (container: Container) {
        return new Dog(container.get('name') as string)
      })
      const dog = container.get('dog') as Dog
      expect(dog).toBeInstanceOf(Dog)
      expect(dog.name).toStrictEqual('Rocco')
    })

    it('should resolve accepting params', () => {
      container.instance('name', 'Rocco')
      // Arrow function
      container.bind(
        'dog',
        (container: Container, param1: unknown, param2: unknown) =>
          new Dog(container.get('name') + (param1 as string) + param2)
      )
      // Normal function
      container.bind('catdog', function (container: Container, param1: unknown, param2: unknown) {
        return new Dog(container.get('name') + (param1 as string) + param2)
      })
      expect(container.make('dog', ' es ', 'lindo').name).toStrictEqual('Rocco es lindo')
      expect(container.make('catdog', ' es ', 'feo').name).toStrictEqual('Rocco es feo')
    })
  })

  describe('when resolving singletons', () => {
    it('class: should always return the same instance', () => {
      container.singleton(Animal, Dog)
      const dog1 = container.get(Animal)
      const dog2 = container.get(Animal)
      expect(dog1).toStrictEqual(dog2)
    })

    it('factory: should always return the same instance', () => {
      container.singleton(Animal, () => new Dog(''))
      const dog1 = container.get(Animal)
      const dog2 = container.get(Animal)
      expect(dog1).toStrictEqual(dog2)
    })
  })

  describe('when binding instances', () => {
    it('should always get() the same reference', () => {
      container.instance(Animal, new Dog(''))
      const dog1 = container.get(Animal)
      const dog2 = container.get(Animal)
      expect(dog1).toStrictEqual(dog2)
    })
  })

  describe('when binding already bound keys', () => {
    it('should override class bindings', () => {
      container.bind(Animal, Dog)
      container.bind(Animal, Cat)
      expect(container.get(Animal)).toBeInstanceOf(Cat)
    })

    it('should override singletons bindings', () => {
      container.singleton(Animal, () => new Dog(''))
      container.singleton(Animal, () => new Cat(''))
      expect(container.get(Animal)).toBeInstanceOf(Cat)
    })

    it('should override factory bindings', () => {
      container.bind(Animal, () => new Dog(''))
      container.bind(Animal, function () {
        return new Cat('')
      })
      expect(container.get(Animal)).toBeInstanceOf(Cat)
      container.bind(Animal, () => new Dog(''))
      expect(container.get(Animal)).toBeInstanceOf(Dog)
    })

    it('should override instance bindings', () => {
      container.instance(Animal, new Dog(''))
      container.instance(Animal, new Cat(''))
      expect(container.get(Animal)).toBeInstanceOf(Cat)
    })
  })

  describe('when aliasing bindings', () => {
    it('should accept any primitive as the key', () => {
      container.bind(Dog)
      container.alias('dog', Dog)
      const dogObj = {}
      container.alias(dogObj, Dog)
      const dogSymbol = Symbol('The Dog')
      container.alias(dogSymbol, Dog)
      const dog = container.get(Dog)
      expect(container.get('dog')).toStrictEqual(dog)
      expect(container.get(dogObj)).toStrictEqual(dog)
      expect(container.get(dogSymbol)).toStrictEqual(dog)
    })
  })

  describe('when passing params', () => {
    it('should resolve class with params', () => {
      class DogWrapper extends Dog {
        constructor(container: Container, name: string) {
          super(name)
        }
      }
      container.bind(Dog, DogWrapper)
      expect(container.make(DogWrapper, 'Milo').name).toBe('Milo')
      expect(container.make(DogWrapper, 'Rocco').name).toBe('Rocco')
    })

    it('should resolve factory with params', () => {
      container.bind(Dog, (container: Container, name = 'Milo') => new Dog(name))
      expect((container.get(Dog) as Dog).name).toBe('Milo')
      expect(container.make(Dog).name).toBe('Milo')
      expect(container.make(Dog, 'Rocco').name).toBe('Rocco')
    })

    it('should receive container as only param if the class does not injects dependencies', () => {
      class ContainerWrapper {
        theContainer: Container
        constructor(container: Container) {
          this.theContainer = container
        }
      }

      class ClassWithDependencies {
        container: Container
        static get injects() {
          return [ContainerWrapper]
        }

        constructor(wrapper: ContainerWrapper) {
          this.container = wrapper.theContainer
        }
      }

      container.bind(ContainerWrapper)
      container.bind(ClassWithDependencies)
      expect((container.get(ContainerWrapper) as ContainerWrapper).theContainer === container).toBe(
        true
      )
      expect(
        (container.get(ClassWithDependencies) as ClassWithDependencies).container === container
      ).toBe(true)
    })
  })

  describe('when using make() with unbound classes', () => {
    it('should do a one-off resolve', () => {
      expect(container.has(Dog)).toBe(false)
      expect(container.make(Dog)).toBeInstanceOf(Dog)
    })
  })

  describe('when binding resolvables', () => {
    it('should accept any primitive as the key', () => {
      container.bind(Dog)
      container.bind('dog', Dog)
      const dogObj = {}
      container.bind(dogObj, Dog)
      const dogSymbol = Symbol('The Dog')
      container.bind(dogSymbol, Dog)
      const dog = container.get(Dog)
      expect(container.get('dog')).toStrictEqual(dog)
      expect(container.get(dogObj)).toStrictEqual(dog)
      expect(container.get(dogSymbol)).toStrictEqual(dog)
    })
  })
})

describe('container errors', () => {
  const container = new Container()

  it('should throw if a bind() is called without a key', () => {
    expect(() => container.bind(undefined)).toThrow('First parameter is required')
  })

  it('should throw if bind() receives a non-resolvable parameter', () => {
    expect(() => container.bind('myObj', {})).toThrow('Only functions are bindable, got [object]')
  })

  it('should throw if make() is called without function', () => {
    expect(() => container.make(123)).toThrow('Can not resolve anything for 123')
  })

  it('should throw if get() fails to find the binding', () => {
    expect(() => container.get(123)).toThrow('123 is not bound')
  })
})
