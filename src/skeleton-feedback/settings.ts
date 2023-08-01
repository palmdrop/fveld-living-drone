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
const backgroundColor = hexToRgb('#ffffff');
const outlineFade = [
  hexToRgb('#ffffff')
];

const bodyFade = [
  backgroundColor
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#550e0e39';
const secondaryShadowColor = '#caff3941';
const highlightShadowColor = '#09ff009a';
const mainShadowProportion = 0.985;
/*
const backgroundColor = hexToRgb('#c9d2d2');
const outlineFade = [
  hexToRgb('#c9d7d7')
  // backgroundColor
];

const bodyFade = [
  backgroundColor
];
const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#41455912';
const secondaryShadowColor = '#dff8df14';
const highlightShadowColor = '#f01616ff';
const mainShadowProportion = 1.0;
*/

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
    min: 0.0,
    max: 0.0,
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
      min: 10,
      max: 10,
    },
    maxDistance: {
      min: 100,
      max: 200
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 0.9,
      max: 0.1
    },
    stepSize: {
      min: 1.5,
      max: 8
    },
    randomDeviation: {
      min: 0.5,
      max: 1.0
    }
  },
  rendererSettings: {
    minThickness: 0.5,
    maxThickness: 30,
    thicknessPow: 2.4,
    thicknessDelta: 0.2,
    outlineThickness: 0.5,
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