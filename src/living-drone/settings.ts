import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#e0dfd6');
const outlineColor = hexToRgb('#483d0e');
const bodyColor = backgroundColor;

export const settings = {
  heightMap: {
    frequency: 0.45,
    pow: 3
  },
  leaves: {
    tries: 8,
    minRadius: 3,
    maxRadius: 150,
    circleRadius: 0.35
  },
  attractor: {
    min: 0.9,
    max: 0.8,
    minRange: 1,
    maxRange: 10,

    speed: 700,
    maxForce: 2000,
    maxSpeed: 3000,
    falloffFrom: 100,
    falloff: 2,

    friction: 1,

    noiseFrequency: 0.0003,
    noiseAmount: 300,
    noiseSpeed: 0.0001,

    gravityAmount: 0.001,
    gravityFalloff: 1
  },
  growth: {
    startPosition: 'fromSeed',
    maxSteps: 300,
    maxChildren: 3,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 10,
      max: 15,
    },
    maxDistance: {
      min: 100,
      max: 200
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1,
      max: 0.3
    },
    stepSize: {
      min: 2.5,
      max: 10
    },
    randomDeviation: {
      min: 0.5,
      max: 2.5
    }
  },
  rendererSettings: {
    minThickness: 0.5,
    maxThickness: 220,
    thicknessPow: 2.5,
    thicknessDelta: 0.2,
    elevation: {
      angle: Math.random() * Math.PI * 2,
      steps: 2
    },
    colors: {
      background: backgroundColor,
      outline: outlineColor,
      body: bodyColor
    },
    fade: {
      amount: 3,
      duration: 10000
    }
  }
} as const;

export type Settings = typeof settings;