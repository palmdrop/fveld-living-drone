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

const fadeAmount = 0.4;
const fadePow = 0.8;
const fadeRandom = 0.02;

export const settings = {
  heightMap: {
    frequency: 0.012,
    pow: 2.0
  },
  leaves: {
    tries: 8,
    minRadius: 20,
    maxRadius: 100,
    // circleRadius: 0.25
    // circleRadius: 0.5
    circleRadius: 0.0
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
    maxSteps: 500,
    maxChildren: 3,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 10,
      max: 80,
    },
    maxDistance: {
      min: 150,
      max: 250
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1,
      max: 0.5
    },
    stepSize: {
      min: 3.0,
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
      bodyFade,
      outlineFade,
      fadeAmount,
      fadePow,
      fadeRandom
    },
    fade: {
      amount: 0,
      duration: 10000
    }
  }
} as const;

export type Settings = typeof settings;