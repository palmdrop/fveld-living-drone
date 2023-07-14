export const settings = {
  heightMap: {
    frequency: 2,
    pow: 5
  },
  leaves: {
    tries: 8,
    minRadius: 5,
    maxRadius: 200,
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
  }
} as const;