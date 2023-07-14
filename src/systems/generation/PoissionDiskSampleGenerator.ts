import { Point } from '../../types/point';
import { Quadtree } from '../data/QuadTree';
import { areaPointIntersection, type Area, random, distanceToSquared, mapLinear } from '../../utils/math';

type HeightMap = (point: Point) => number;

const getRadius = (
  point: Point,
  heightMap: HeightMap,
  minRadius: number,
  maxRadius: number
) => {
  return mapLinear(heightMap(point), 0, 1, minRadius, maxRadius);
}

export class PoissonDiskSampleGenerator {
  area: Area;
  tries: number;
  heightMap: HeightMap;
  minRadius: number;
  maxRadius: number;

  quadtree: Quadtree<Point>;
  points: Point[];
  collisions: { point1: Point, point2: Point }[];
  spawnPoints: Point[];
  maxGeneratedRadius: number;

  constructor(config: {
    area: Area,
    tries: number,
    heightMap?: HeightMap,
    minRadius?: number,
    maxRadius?: number,
    initialSpawner?: Point
  }) {
    this.area = config.area;
    this.tries = config.tries;
    this.heightMap = config.heightMap ?? ((_: Point) => 1);
    this.minRadius = config.minRadius ?? 0;
    this.maxRadius = config.maxRadius ?? 1;

    this.spawnPoints = [
      config.initialSpawner ?? {
        x: random(this.area.x, this.area.x + this.area.w),
        y: random(this.area.y, this.area.y + this.area.h)
      }
    ];

    this.quadtree = new Quadtree<Point>(
      this.area,
      4,
      6
    );

    this.points = [];
    this.collisions = [];
    this.maxGeneratedRadius = 0;
  }

  generate(numberOfSamples: number, minBias = false) {
    const samples: Point[] = [];
    const sampleData: { 
      spawner: Point, 
      sample: Point,
      radius: number
    }[] = [];

    while(!this.isSatiated && numberOfSamples > 0) {
      const spawnIndex = Math.floor(random(0, this.spawnPoints.length - 1));
      const spawner = this.spawnPoints[spawnIndex];

      const spawnRadius = getRadius(spawner, this.heightMap, this.minRadius, this.maxRadius);

      const minDistance = minBias
        ? this.minRadius
        : spawnRadius;

      const distance = random(minDistance, 2 * spawnRadius);

      let accepted = false;
      const candidate = { x: 0, y: 0 };
      const latestCollision = { x: 0, y: 0 };
      for(let i = 0; i < this.tries; i++) {
        const angle = random(0, Math.PI * 2);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        candidate.x = spawner.x + dx * distance;
        candidate.y = spawner.y + dy * distance;

        const candidateRadius = getRadius(candidate, this.heightMap, this.minRadius, this.maxRadius);

        if(this.isValid(candidate, candidateRadius, minBias, latestCollision)) {
          this.points.push(candidate);
          this.spawnPoints.push(candidate);
          this.quadtree.insert(candidate, candidate);

          samples.push(candidate),
          sampleData.push({
            spawner,
            sample: candidate,
            radius: candidateRadius
          });

          this.maxGeneratedRadius = Math.max(this.maxGeneratedRadius, candidateRadius);
          accepted = true;
          numberOfSamples--;
          break;
        }
      }

      if(!accepted) {
        this.spawnPoints.splice(spawnIndex, 1);
        this.collisions.push({ point1: spawner, point2: latestCollision });
      }
    }

    return { samples, sampleData };
  }

  isValid(point: Point, radius: number, minBias: boolean, collision?: Point) {
    if(!areaPointIntersection(this.area, point)) return false;

    const otherPoints = this.quadtree.circleQuery({ x: point.x, y: point.y, radius: this.maxGeneratedRadius }, 'point') as Point[];

    for(const otherPoint of otherPoints) {
      const otherRadius = getRadius(otherPoint, this.heightMap, this.minRadius, this.maxRadius);
      const radiusToCompare = minBias 
        ? Math.min(radius, otherRadius)
        : Math.max(radius, otherRadius)
      const distSq = distanceToSquared(otherPoint, point);
      if(distSq < (radiusToCompare * radiusToCompare)) {
        if(collision) {
          collision.x = otherPoint.x;
          collision.y = otherPoint.y;
        }
        return false;
      }
    }

    return true;
  }

  get isSatiated() {
    return !this.spawnPoints.length;
  }
}