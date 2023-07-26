import { hexToRgb } from "../utils/color";
import { random } from "../utils/math";

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
const backgroundColor = hexToRgb('#624c20');
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
const mainShadowProportion = 0.985;

export const settings = {
  heightMap: {
    frequency: random(0.02, 0.004),
    pow: 2.3,
    speed: 3
  },
  leaves: {
    tries: 8,
    minRadius: 5,
    maxRadius: 160,
    circleRadius: 0.5
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
      max: 50,
    },
    maxDistance: {
      min: 50,
      max: 140
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1,
      max: 0.4
    },
    stepSize: {
      min: 1.5,
      max: 8
    },
    randomDeviation: {
      min: 0.2,
      max: 0.5
    }
  },
  rendererSettings: {
    minThickness: 1.0,
    maxThickness: 150,
    thicknessPow: 2.1,
    thicknessDelta: 0.15,
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
        blur: 20,
        color: mainShadowColor
      },
      secondaryShadow: {
        offsetX: -10,
        offsetY: -10,
        blur: 15,
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
      // amount: 0.008,
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