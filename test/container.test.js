const ServiceContainer = require("../src/ServiceContainer");

class Country {
  constructor(TLD) {
    this.TLD = TLD;
  }
}

test("Method .instance binds instance", () => {
  const container = new ServiceContainer();
  container.instance("Uruguay", new Country(".uy"));
  container.instance("Uruguay3", new Country(".uy"));

  const uruguay1 = container.get("Uruguay");
  const uruguay2 = container.get("Uruguay");
  const uruguay3 = container.get("Uruguay3");
  expect(uruguay1 === uruguay2 && uruguay2 !== uruguay3).toBe(true);
});

test("Method .bind fallback to .instance for non-function resolvers", () => {
  const container = new ServiceContainer();
  container.bind("Uruguay", new Country(".uy"));
  container.bind("Uruguay3", new Country(".uy"));

  const uruguay1 = container.get("Uruguay");
  const uruguay2 = container.get("Uruguay");
  const uruguay3 = container.get("Uruguay3");
  expect(uruguay1 === uruguay2 && uruguay2 !== uruguay3).toBe(true);
});

test("Method .bind binds a class to be instantiated on each resolve", () => {
  const container = new ServiceContainer();
  container.bind("Uruguay", () => {
    return new Country(".uy");
  });

  const uruguay1 = container.get("Uruguay");
  const uruguay2 = container.get("Uruguay");
  expect(uruguay1 !== uruguay2).toBe(true);
});

test("Resolver function receives injector as first param", () => {
  const container = new ServiceContainer();
  container.instance("Uruguay", new Country(".uy"));
  container.bind("Argentina", ({ Uruguay }) => {
    return new Country(Uruguay.TLD);
  });

  const Uruguay = container.get("Uruguay");
  const Argentina = container.get("Argentina");
  expect(Uruguay.TLD).toBe(Argentina.TLD);
});

test("Method .singleton binds a class to be instantiated once for subsequent resolves", () => {
  const container = new ServiceContainer();
  container.singleton("Uruguay", () => {
    return new Country(".uy");
  });

  const Uruguay = container.get("Uruguay");
  const Uruguay2 = container.get("Uruguay");
  expect(Uruguay === Uruguay2).toBe(true);
});

test("Method .get throws error for unregisted services", () => {
  const container = new ServiceContainer();

  expect(() => container.get("Uruguay")).toThrowError("Uruguay is not bound");
});

test("Method .get accepts array of params to provide resolver function with", () => {
  const container = new ServiceContainer();
  container.singleton("Uruguay", (undefined, args) => {
    return new Country(...args);
  });

  const Uruguay = container.get("Uruguay", [".uy"]);
  expect(Uruguay.TLD).toBe(".uy");
});

test("Method .get throws error if receives other than Array as second arg", () => {
  const container = new ServiceContainer();

  container.singleton("Uruguay", (_, args) => new Country(...args));

  expect(() => container.get("Uruguay", ".uy")).toThrowError(
    "[Container binding] Arguments must be passed as Array"
  );
});
