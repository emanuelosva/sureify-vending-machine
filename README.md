# Sureify Vending Machine Challenge

### Candidate
**Emanuel Osorio** (Full Stack engineer)

## Task
Create a function in typescript responsible for calculating the price of a coffee in a vending machine based on the following inputs: size, creamer, and sweetener.
Focus on writing maintainable and scalable code.

See full original description here: [Challenge descriotion](https://drive.google.com/file/d/1NVyOSpftcnTvlJO9raxyBVVmggIkNaJB/view?usp=sharing)

## Result

```ts
// calc-coffee-price.ts

const coffeePriceComponents = {
  size: {
    small: 1,
    medium: 1.5,
    large: 2,
  },
  creamer: {
    none: 0,
    dairy: 0.25,
    "non-dairy": 0.5,
  },
  sweetener: {
    none: 0,
    sugar: 0.25,
    "sugar-alternative": 0.5,
  },
} as const;

type CoffeePriceComponents = typeof coffeePriceComponents;

export type CoffeeOptions = {
  size: keyof CoffeePriceComponents["size"];
  creamer?: keyof CoffeePriceComponents["creamer"];
  sweetener?: keyof CoffeePriceComponents["sweetener"];
};

export function calcCoffeePrice({
  size,
  creamer = "none",
  sweetener = "none",
}: CoffeeOptions): number {
  validateCoffeeOptionsOrThrow({ size, creamer, sweetener });
  return (
    coffeePriceComponents.size[size] +
    coffeePriceComponents.creamer[creamer] +
    coffeePriceComponents.sweetener[sweetener]
  );
}

function validateCoffeeOptionsOrThrow(options: CoffeeOptions): void {
  (Object.keys(options) as (keyof CoffeePriceComponents)[]).forEach((key) => {
    const value = options[key]!;
    // @ts-expect-error "value is possible undefined" -> Actually we are checking if the value is undefined
    if (typeof coffeePriceComponents[key][value] === "undefined") {
      const validOptions = Object.keys(coffeePriceComponents[key]).join(", ");
      throw new Error(`Invalid option [${value}] for ${key}. Valid options are: ${validOptions}`);
    }
  })
}
```

## Design Decisions

### 1. `coffeePriceComponents`
I consolidated all price factors into a single constant object. This decision offers the following benefits:

- Easy to understand for new engineers.
- Centralized pricing. If a new size is added or prices change, we only need to modify a single source of truth.
- Portability. If the pricing data needs to be moved or fetched from an external source in the future, we only need to import or fetch this object.
- Automatic type inference from the keys of coffeePriceComponents.

### 2. `CoffeeOptions`
This type creates a contract for the function input. While it is possible to use an approach like
`[K in keyof CoffeePriceComponents]: keyof CoffeePriceComponents[K]`, this would make all inputs required by default, removing the ability to specify optional inputs with defaults. By defining creamer and sweetener as optional, the function becomes more user-friendly and versatile.

### 3. `validateCoffeeOptionsOrThrow`
Even though TypeScript protects against passing invalid values during development and build time, the validation function ensures safety at runtime. This is especially useful in scenarios where external implementations might bypass type checking, ensuring robustness.

### 4. **Maintainability**
The current implementation requires changes in only three places if a new price component is added:

- Add the component to coffeePriceComponents.
- Update the CoffeeOptions type.
- Include the component in the final price calculation.

While it is possible to implement a more "automatic" approach to infer or iterate over coffeePriceComponents, this would add unnecessary complexity and reduce code readability.
