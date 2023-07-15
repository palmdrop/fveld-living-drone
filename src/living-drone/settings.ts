import { hexToRgb } from "../utils/color";

const backgroundColor = hexToRgb('#efeee1');
const outlineColor = hexToRgb('#2e1805');
const bodyColor = backgroundColor;

export const settings = {
  heightMap: {
    frequency: 0.45,
    pow: 3
  },
  leaves: {
    tries: 8,
    minRadius: 3,
    maxRadius: 150,
  },
  growth: {
    startPosition: 'fromSeed',
    maxSteps: 1000,
    mode: 'open',
    seedSpawnProbability: 1.02,
    seedSpawnMaxMultiplier: 1.5,
    minDepth: 1,

    minDistance: {
      min: 10,
      max: 30,
    },
    maxDistance: {
      min: 100,
      max: 120
    },
    // TODO: make dynamics higher when closer to attractor?
    dynamics: {
      min: 1.0,
      max: 0.5
    },
    stepSize: {
      min: 4,
      max: 8
    },
    randomDeviation: {
      min: 0.5,
      max: 2.5
    },
    gravity: {
      min: 0.9,
      max: 0.9,
      minRange: 1,
      maxRange: 10,
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
      outline: outlineColor,
      body: bodyColor
    }
  }
} as const;

export type Settings = typeof settings;