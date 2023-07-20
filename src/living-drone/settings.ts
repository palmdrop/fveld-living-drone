import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#9f9f80');

const outlineFade = [
  hexToRgb('#352121'),
  hexToRgb('#709c36'),
  hexToRgb('#1a3921')
];

const bodyFade = [
  hexToRgb('#537d68'),
  hexToRgb('#96393e'),
  hexToRgb('#74793d'),
  hexToRgb('#7b6134')
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
    minThickness: 0.5,
    maxThickness: 130,
    thicknessPow: 2.0,
    thicknessDelta: 0.3,
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
      frequency: 200,
      duration: 10000
    }
  }
} as const;

export type Settings = typeof settings;