import ServiceContainer from "../src/ServiceContainer";

class Country {
  constructor(TLD) {
    this.TLD = TLD;

    setTimeout(() => {
      this.time = new Date().getTime();
    });
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

test("Method .bind injects dependencies to resolver callback", () => {
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
