import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#e6e2ce');

const outlineFade = [
  hexToRgb('#442020'),
  hexToRgb('#3a431c'),
  hexToRgb('#2f4621')
];

const bodyFade = [
  hexToRgb('#e3e4ce'),
  hexToRgb('#d5dab9'),
  hexToRgb('#e7d8d5'),
  hexToRgb('#dfe3b2')
];

const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

export const settings = {
  heightMap: {
    frequency: 0.012,
    pow: 2.5
  },
  leaves: {
    tries: 8,
    minRadius: 5,
    maxRadius: 100,
    circleRadius: 0.25
    // circleRadius: 0.5
    // circleRadius: 0.0
  },
  attractor: {
    min: 0.9,
    max: 1.9,
    minRange: 1,
    maxRange: 500,

    speed: 500,
    maxForce: 2000,
    maxSpeed: 500,
    mouseInfluence: 2,

    falloffFrom: 100,
    falloff: 2,

    friction: 1,

    noiseFrequency: 0.00005,
    noiseAmount: 1000,
    noiseSpeed: 0.001,

    gravityAmount: 0.04,
    gravityFalloff: 0.5,
  },
  growth: {
    startPosition: 'fromSeed',
    maxSteps: 300,
    maxChildren: 2,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 3,
      max: 10,
    },
    maxDistance: {
      min: 30,
      max: 100
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 0.5,
      max: 0.25
    },
    stepSize: {
      min: 1.0,
      max: 2
    },
    randomDeviation: {
      min: 0.0,
      max: 3.0
    }
  },
  rendererSettings: {
    minThickness: 1,
    maxThickness: 100,
    thicknessPow: 2.3,
    thicknessDelta: 0.1,
    elevation: {
      angle: Math.random() * Math.PI * 2,
      steps: 2
    },
    colors: {
      background: backgroundColor,
      bodyFade,
      outlineFade,
      fadeAmount: 0.6,
      fadePow: 0.7,
      fadeRandom: 0.03
    },
    fade: {
      amount: 0.005,
      frequency: 200
    },
    attractor: {
      show: true,
      color: attractorColor,
      shadowColor: attractorShadowColor,
      shadowBlur: 50,
      size: 30
    }
  }
} as const;

export type Settings = typeof settings;