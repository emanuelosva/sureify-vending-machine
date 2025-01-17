import { test, expect } from "bun:test";
import { calcCoffeePrice, type CoffeeOptions } from "./vending-machine";

test("calcCoffeePrice should throw error for invalid props", () => {
  expect(() => calcCoffeePrice({ size: "extra-small" as CoffeeOptions["size"] })).toThrowError(
    "Invalid option [extra-small] for size. Valid options are: small, medium, large"
  );
  expect(() => calcCoffeePrice({ size: "small", creamer: "extra-dairy" as CoffeeOptions["creamer"] })).toThrowError(
    "Invalid option [extra-dairy] for creamer. Valid options are: none, dairy, non-dairy"
  );
  expect(() => calcCoffeePrice({ size: "small", sweetener: "extra-sweetener" as CoffeeOptions["sweetener"] })).toThrowError(
    "Invalid option [extra-sweetener] for sweetener. Valid options are: none, sugar, sugar-alternative"
  );
});

test("calcCoffeePrice should return correct price for valid props", () => {
  expect(calcCoffeePrice({ size: "small" })).toBe(1);
  expect(calcCoffeePrice({ size: "medium", creamer: "dairy" })).toBe(1.75);
  expect(calcCoffeePrice({ size: "large", creamer: "non-dairy", sweetener: "sugar" })).toBe(2.75);
  expect(calcCoffeePrice({ size: "large", creamer: "none", sweetener: "none" })).toBe(2);
})
