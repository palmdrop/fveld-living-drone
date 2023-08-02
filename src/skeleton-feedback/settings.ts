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
const outlineFade = [
  hexToRgb('#141a1a')
];

const bodyFade = [
  hexToRgb('#e8f7f7'),
  hexToRgb('#e8f7f7'),
];

const attractorColor = hexToRgb('#d6de4f');
const attractorShadowColor = hexToRgb('#e0e75a');

const mainShadowColor = '#550e0e39';
const secondaryShadowColor = '#1b3235da';
const highlightShadowColor = '#b5f520ff';
const mainShadowProportion = 0.885;
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
    pow: 2.5,
    speed: 3
  },
  leaves: {
    tries: 8,
    minRadius: 6,
    maxRadius: 100,
    circleRadius: 0.5
  },
  attractor: {
    /*
    min: 0.5,
    max: 0.5,
    */
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
      min: 5,
      max: 50,
    },
    maxDistance: {
      min: 200,
      max: 200
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 0.9,
      max: 0.1
    },
    stepSize: {
      min: 2.0,
      max: 8
    },
    randomDeviation: {
      min: 0.5,
      max: 1.0
    }
  },
  rendererSettings: {
    minThickness: 0.0,
    maxThickness: 10,
    thicknessPow: 2.3,
    thicknessDelta: 0.1,
    outlineThickness: 0.5,
    elevation: {
      angle: Math.random() * Math.PI * 2,
      steps: 2
    },
    colors: {
      background: bodyFade[0],
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
        offsetX: -2,
        offsetY: -2,
        blur: 10,
        color: secondaryShadowColor
      },
      highlightShadow: {
        offsetX: -20,
        offsetY: -20,
        blur: 20,
        color: highlightShadowColor
      }
    },
    fade: {
      // amount: 0.008,
      amount: 0.5,
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