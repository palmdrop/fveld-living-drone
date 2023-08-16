import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#dedebe');

const outlineFade = [
  hexToRgb('#663333'),
  hexToRgb('#58642d'),
  hexToRgb('#3b5c40')
];

const bodyFade = [
  hexToRgb('#a8c187'),
  hexToRgb('#702025'),
  hexToRgb('#a0a383'),
  hexToRgb('#9bae88')
];


const shadowColor = '#4311110f';

const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

export const settings = {
  heightMap: {
    frequency: 0.012,
    pow: 2.0,
    speed: 10
  },
  leaves: {
    tries: 5,
    minRadius: 35,
    maxRadius: 220,
    circleRadius: 0.0
  },
  attractor: {
    min: 0.18,
    max: 0.47,
    minRange: 1,
    maxRange: 500,

    speed: 1000,
    maxForce: 2000,
    maxSpeed: 1000,
    mouseInfluence: 10,

    falloffFrom: 100,
    falloff: 2,

    friction: 1.5,

    noiseFrequency: 0.0003,
    noiseAmount: 300,
    noiseSpeed: 0.0001,

    gravityAmount: 0.001,
    gravityFalloff: 1
  },
  growth: {
    startPosition: 'fromSeed',
    maxSteps: 2000,
    maxChildren: 2,

    minDistance: {
      min: 20,
      max: 80,
    },
    maxDistance: {
      min: 140,
      max: 250
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
      min: 0.1,
      max: 0.5
    }
  },
  rendererSettings: {
    minThickness: 1.7,
    maxThickness: 100,
    thicknessPow: 2.3,
    thicknessDelta: 0.2,
    outlineThickness: 2,
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
      fadeRandom: 0.005,

      shadow: {
        x: 4,
        y: 4,
        blur: 10,
        color: shadowColor
      }
    },
    fade: {
      amount: 0.02,
      frequency: 350
    },
    attractor: {
      show: false,
      color: attractorColor,
      shadowColor: attractorShadowColor,
      shadowBlur: 50,
      size: 30
    }
  }
} as const;

export type Settings = typeof settings;