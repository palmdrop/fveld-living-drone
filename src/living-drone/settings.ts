import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#dedebe');

const outlineFade = [
  hexToRgb('#663333'),
  hexToRgb('#dee1d3'),
  hexToRgb('#3b5c40')
];

const bodyFade = [
  hexToRgb('#a8c187'),
  hexToRgb('#702025'),
  hexToRgb('#a0a383'),
  hexToRgb('#9bae88')
];

export const settings = {
  heightMap: {
    frequency: 0.012,
    pow: 2.0
  },
  leaves: {
    tries: 8,
    minRadius: 20,
    maxRadius: 150,
    // circleRadius: 0.25
    // circleRadius: 0.5
    circleRadius: 0.0
  },
  attractor: {
    min: 0.2,
    max: 1.2,
    minRange: 1,
    maxRange: 500,

    speed: 700,
    maxForce: 2000,
    maxSpeed: 3000,
    mouseInfluence: 2,

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
    maxSteps: 500,
    maxChildren: 2,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 3,
      max: 80,
    },
    maxDistance: {
      min: 80,
      max: 150
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1,
      max: 1.0
    },
    stepSize: {
      min: 3.0,
      max: 10
    },
    randomDeviation: {
      min: 0.6,
      max: 2.0
    }
  },
  rendererSettings: {
    minThickness: 0.7,
    maxThickness: 100,
    thicknessPow: 2.3,
    thicknessDelta: 0.4,
    elevation: {
      angle: Math.random() * Math.PI * 2,
      steps: 2
    },
    colors: {
      background: backgroundColor,
      bodyFade,
      outlineFade,
      fadeAmount: 0.4,
      fadePow: 0.4,
      fadeRandom: 0.02
    },
    fade: {
      amount: 0.02,
      frequency: 200
    }
  }
} as const;

export type Settings = typeof settings;