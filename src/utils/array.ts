import { random } from "./math";

export const randomElement = <T = unknown>(array: T[]): T => {
  if (array.length === 0) throw new Error("Array has to have at least one element");
  const index = Math.floor(random(0, array.length));
  return array[index];
};