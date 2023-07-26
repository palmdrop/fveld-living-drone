import { hexToRgb } from "../utils/color";

/*
const backgroundColor = hexToRgb('#dfddc9');
const outlineFade = [
  hexToRgb('#6d7420')
];

const bodyFade = [
  backgroundColor
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#59603848';
const secondaryShadowColor = '#a2a98410';
const highlightShadowColor = '#ff5100ff';
const mainShadowProportion = 0.98;
*/
const backgroundColor = hexToRgb('#5a4419');
const outlineFade = [
  hexToRgb('#835220')
];

const bodyFade = [
  backgroundColor
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#370a0a39';
const secondaryShadowColor = '#ffde3910';
const highlightShadowColor = '#bbff00ff';
const mainShadowProportion = 0.975;

export const settings = {
  heightMap: {
    frequency: 0.008,
    pow: 2.3,
    speed: 3
  },
  leaves: {
    tries: 8,
    minRadius: 3,
    maxRadius: 180,
    // circleRadius: 0.0
    circleRadius: 0.5
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

    noiseFrequency: 0.01,
    noiseAmount: 400,
    noiseSpeed: 0.0001,

    gravityAmount: 0.04,
    gravityFalloff: 0.5,
  },
  growth: {
    startPosition: 'fromSeed',
    maxSteps: 280,
    maxChildren: 2,
    mode: 'open',
    minDepth: 1,

    minDistance: {
      min: 5,
      max: 30,
    },
    maxDistance: {
      min: 50,
      max: 130
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
    maxThickness: 200,
    thicknessPow: 3.0,
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

      mainShadowProportion,
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
      // show: true,
      show: false,
      color: attractorColor,
      shadowColor: attractorShadowColor,
      shadowBlur: 50,
      size: 30
    }
  }
} as const;

export type Settings = typeof settings;