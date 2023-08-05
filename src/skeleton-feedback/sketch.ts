/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import p5 from 'p5';
import { PoissonDiskSampleGenerator } from '../systems/generation/PoissionDiskSampleGenerator';
import { Point } from '../types/point';
import { SpaceColonizationGraph } from '../systems/generation/SpaceColonizationGraph';
import { Area, lengthOfVector, mapLinear, randomUnitVector } from '../utils/math';
import { Renderer, createRenderer } from './renderer';
import { settings } from './settings';
import { randomElement } from '../utils/array';
import { Attractor, createAttractor } from './attractor';

export const sketch = (p: p5, parentElement: HTMLElement, settings: Record<string, any>, pixelRatio: number, callback: (p: p5, canvas: HTMLCanvasElement) => void) => {
  let poissionDiskSampleGenerator: PoissonDiskSampleGenerator;
  let graph: SpaceColonizationGraph;
  let attractor: Attractor;

  let renderer: Renderer;
  let points: Point[];

  const heightMap = (point: Point) => {
    return p.noise(
      point.x * settings.heightMap.frequency,
      (point.y + settings.heightMap.speed * p.millis() / 1000) * settings.heightMap.frequency
    ) ** settings.heightMap.pow;
  }

  const createGraph = (points: Point[]) => {
    const mapValue = (min: number, max: number) => (point: Point) => mapLinear(
      heightMap(point),
      0, 1,
      min, max
    );

    const graph = new SpaceColonizationGraph(
      mapValue(
        settings.growth.minDistance.min,
        settings.growth.minDistance.max
      ),
      mapValue(
        settings.growth.maxDistance.min,
        settings.growth.maxDistance.max
      ),
      mapValue(
        settings.growth.dynamics.min,
        settings.growth.dynamics.max
      ),
      mapValue(
        settings.growth.stepSize.min,
        settings.growth.stepSize.max
      ),
      mapValue(
        settings.growth.randomDeviation.min,
        settings.growth.randomDeviation.max
      ),
      settings.growth.mode,
      settings.growth.maxChildren,
      settings.growth.minDepth
    );

    graph.setGravity(settings.attractor);

    graph.generate(
      points,
      poissionDiskSampleGenerator.area,
      // randomElement(points),
      {
        x: p.width / 2,
        y: p.height / 2,
      },
      randomUnitVector(),
      1
    );

    graph.traverse(segment => {
      segment.metadata = {
        ...segment.metadata ?? {},
        thickness: settings.rendererSettings.maxThickness / 10
      }
    })

    return graph;
  }

  const getRadius = () => {
    return Math.min(p.width, p.height) * (settings.leaves.circleRadius ?? 0.0);
  }

  const createPointGenerator = () => {
    const radius = getRadius();

    let area: Area;

    if (radius) {
      area = {
        x: p.width / 2 - radius,
        y: p.height / 2 - radius,
        w: 2 * radius,
        h: 2 * radius,
      };
    } else {
      const w = p.width * settings.leaves.width;
      const h = p.height * settings.leaves.height;
      area = {
        x: (p.width - w) / 2,
        y: (p.height - h) / 2,
        w,
        h,
      }
    }

    return new PoissonDiskSampleGenerator({
      area,
      heightMap,
      tries: settings.leaves.tries,
      minRadius: settings.leaves.minRadius,
      maxRadius: settings.leaves.maxRadius,
      initialSpawner: {
        x: p.width / 2,
        y: p.height / 2
      }
    });
  }

  p.setup = () => {
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight;

    const p5Renderer = p.createCanvas(width, height);
    const canvas = p5Renderer.elt as HTMLCanvasElement;

    p.smooth();
    p.noiseSeed(Math.random() * Number.MAX_SAFE_INTEGER / 2);
    p.pixelDensity(pixelRatio);

    poissionDiskSampleGenerator = createPointGenerator();
    poissionDiskSampleGenerator.generate(10000);

    const radius = getRadius();
    if (radius) {
      const cX = poissionDiskSampleGenerator.area.x + poissionDiskSampleGenerator.area.w / 2;
      const cY = poissionDiskSampleGenerator.area.y + poissionDiskSampleGenerator.area.h / 2;
      points = poissionDiskSampleGenerator.points.filter(
        point => ((point.x - cX) ** 2 + (point.y - cY) ** 2) < (radius ** 2)
      );
    } else {
      points = poissionDiskSampleGenerator.points;
    }

    graph = createGraph([...points]);

    attractor = createAttractor(
      randomElement(points),
      settings.attractor
    );

    renderer = createRenderer(
      p,
      heightMap,
      attractor,
      settings.rendererSettings
    );

    callback(p, canvas);
  }

  let mouseActive = false;
  let mouseHeld = false;
  p.mouseMoved = p.mouseDragged = () => {
    mouseActive = true;
  }

  p.mousePressed = () => {
    mouseHeld = true;
    mouseActive = true;
  }

  p.mouseReleased = () => {
    mouseHeld = false;
  }

  let steps = 0;
  // Delta is limited to avoid strange issues when the browser window is out of focus
  const maxDelta = 1 / 20;

  p.draw = () => {
    const delta = Math.min(p.deltaTime / 1000, maxDelta);

    if (!graph.isExhausted() && steps < settings.growth.maxSteps) {
      graph.grow();
      steps++;
    } else {
      // TODO: render "ends" to all leaves, i.e a node tip that makes sure thick lines do not look awkward?

      renderer.createNewLayer();
      graph = createGraph([...points]);
      steps = 0;
    }

    renderer.draw(graph);
    renderer.render();

    attractor.update(delta);

    if (mouseActive) {
      attractor.moveTowards(
        {
          x: p.mouseX,
          y: p.mouseY,
        },
        settings.attractor.mouseInfluence
      );

      mouseActive = mouseHeld;
    } else {
      const n = p.noise(
        attractor.position.x * settings.attractor.noiseFrequency + settings.attractor.noiseSpeed * p.millis(),
        attractor.position.y * settings.attractor.noiseFrequency,
      );

      const angle = 8 * n * Math.PI;

      attractor.addForce({
        x: Math.cos(angle) * settings.attractor.noiseAmount,
        y: Math.sin(angle) * settings.attractor.noiseAmount,
      });

      const gravityDirection = {
        x: p.width / 2 - attractor.position.x,
        y: p.height / 2 - attractor.position.y,
      };

      const distanceToCenter = lengthOfVector(gravityDirection);
      const gravityAmount = (distanceToCenter ** settings.attractor.gravityFalloff) * settings.attractor.gravityAmount;

      attractor.addForce({
        x: gravityAmount * gravityDirection.x,
        y: gravityAmount * gravityDirection.y
      });
    }

    /*
    const n = 0.5 * p.millis() / 1000;

    attractor.position.x = Math.cos(n) * 500 + p.width / 2;
    attractor.position.y = Math.sin(n) * 500 + p.height / 2;
    */
    graph.setGravityPosition(attractor.position.x, attractor.position.y);
  }
}