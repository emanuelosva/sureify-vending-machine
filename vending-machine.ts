export const coffeePriceComponents = {
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
