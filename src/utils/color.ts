import { clamp, lerp, mapLinear } from "./math";

export type Color = {
  r: number,
  g: number,
  b: number,
  a?: number
}

export type Gradient = Color[];

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!result) throw new Error(`"${hex}" is not a valid hex color string`);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
} 

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const lerpRgb = (
  c1: Color,
  c2: Color,
  n: number
): Color => {
  return {
    r: lerp(c1.r, c2.r, n),
    g: lerp(c1.g, c2.g, n),
    b: lerp(c1.b, c2.b, n),
    a: lerp(c1.a ?? 1.0, c2.a ?? 1.0, n)
  }
}

export const sampleGradient = (gradient: Gradient, n: number) => {
  if(!gradient.length) throw new Error('A gradient needs at least one color.');
  if(gradient.length === 1) return gradient[0];

  const index = clamp(
    Math.floor(
      mapLinear(n, 0, 1, 0, gradient.length)
    ), 
    0, 
    gradient.length - 2
  );

  const c1 = gradient[index];
  const c2 = gradient[index + 1];

  const lerpAmount = (n % (1.0 / gradient.length)) * gradient.length;

  return lerpRgb(c1, c2, lerpAmount);
}