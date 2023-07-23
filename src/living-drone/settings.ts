import { hexToRgb } from "../utils/color";

/*
const backgroundColor = hexToRgb('#e6e2ce');
const outlineFade = [
  hexToRgb('#442020'),
  hexToRgb('#3a431c'),
  hexToRgb('#2f4621')
];
const bodyFade = [
  hexToRgb('#e3e4ce'),
  hexToRgb('#d8dabf'),
  hexToRgb('#e7d8d5'),
  hexToRgb('#dfe2bc')
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');
*/
const backgroundColor = hexToRgb('#5f5a52');
const outlineFade = [
  // backgroundColor,
  hexToRgb('#6d6d60'),
];
const bodyFade = [
  backgroundColor
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#320e0e35';
const secondaryShadowColor = '#c6fe8a0c';
const highlightShadowColor = '#ff9900ff';

export const settings = {
  heightMap: {
    frequency: 0.008,
    pow: 2.3,
    speed: 3
  },
  leaves: {
    tries: 8,
    minRadius: 5,
    maxRadius: 130,
    // circleRadius: 0.0
    circleRadius: 0.35
    // circleRadius: 0.0
  },
  attractor: {
    min: 0.7,
    max: 1.1,
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
    maxSteps: 380,
    maxChildren: 2,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 5,
      max: 10,
    },
    maxDistance: {
      min: 30,
      max: 100
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1,
      max: 0.5
    },
    stepSize: {
      min: 2.0,
      max: 5
    },
    randomDeviation: {
      min: 0.0,
      max: 0.0
    }
  },
  rendererSettings: {
    minThickness: 1.0,
    maxThickness: 150,
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
      fadeAmount: 0.6,
      fadePow: 0.7,
      fadeRandom: 0.0,

      mainShadowProportion: 0.98, 
      mainShadow: {
        offsetX: 10,
        offsetY: 10,
        blur: 15,
        color: mainShadowColor
      },
      secondaryShadow: {
        offsetX: -10,
        offsetY: -10,
        blur: 10,
        color: secondaryShadowColor
      },
      highlightShadow: {
        offsetX: -30,
        offsetY: -30,
        blur: 70,
        color: highlightShadowColor
      }
    },
    fade: {
      // amount: 0.005,
      amount: 0.0,
      frequency: 300
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