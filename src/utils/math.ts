import { Point } from "../types/point";

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export type Area = { 
  x: number, 
  y: number, 
  w: number, 
  h: number 
};

export type Volume = {
  x : number,
  y : number,
  z : number,
  w : number,
  h : number,
  d : number
}

export type Circle = {
  x: number,
  y: number,
  radius: number
}

export const remap = ( value : number, min : number, max : number, newMin : number, newMax : number ) => {
  const normalized = ( value - min ) / ( max - min );
  return normalized * ( newMax - newMin ) + newMin;
};
export const square = ( v : number ) => v * v;

export const areaPointIntersection = (area: Area, point: Point) => {
  const { x, y, w, h } = area;

  return ( point.x >= x ) && ( point.x < ( x + w ) )
    && ( point.y >= y ) && ( point.y < ( y + h ) );
};

export const circlePointIntersection = (circle: Circle, point: Point) => {
  const { x, y, radius } = circle;
  const distanceSquared = Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2);
  return distanceSquared < square( radius );
};

export const circleAreaIntersection = (circle: Circle, area: Area) => {
  const dx = circle.x - Math.max(area.x, Math.min(circle.x, area.x + area.w));
  const dy = circle.y - Math.max(area.y, Math.min(circle.y, area.y + area.h));
  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min( max, value ));
}

export function mapLinear( x: number, a1: number, a2: number, b1: number, b2: number ) {
	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
}

export const randomInArea = (area: Area) => {
  const x = random(area.x, area.x + area.w);
  const y = random(area.y, area.y + area.h);
  return { x, y };
}

export const isInArea = (point: { x: number, y: number }, area: Area) => {
  return (
    point.x >= area.x && 
    point.y >= area.y &&
    point.x < area.x + area.w && 
    point.y < area.y + area.h
  );
}

export const smoothstep = (start: number, end: number, n: number) => {
  n = clamp((n - start) / (end - start), 0.0, 1.0);
  return n * n * (3 - 2 * n);
}

export const smoothSquare = (x: number, cornerRadius: number) => {
  return (1.0 / Math.atan(1.0 / cornerRadius)) * Math.atan(Math.sin(x) / cornerRadius);
}

export const distanceToSquared = (p1: Point, p2: Point) => {
  return (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
}

export const lengthOfVector = (point: Point) => {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

export const normalizeVector = (point: Point) => {
  const l = lengthOfVector(point);
  point.x /= l;
  point.y /= l;
  return point;
}

export const lerp = (v1: number, v2: number, n: number) => {
  return v1 + n * (v2 - v1);
}

export const lerpPoints = (p1: Point, p2: Point, n: number) => {
  return {
    x: lerp(p1.x, p2.x, n),
    y: lerp(p1.y, p2.y, n)
  }
}

export const randomUnitVector = () => {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
}

export const dot = (p1: Point, p2: Point) => {
  return p1.x * p2.x + p1.y * p2.y;
}

export const limitVector = (vector: Point, maxLength: number) => {
  const length = lengthOfVector(vector);
  if(length > maxLength) {
    normalizeVector(vector);
    vector.x * maxLength;
    vector.y * maxLength;
  }

  return vector;
}