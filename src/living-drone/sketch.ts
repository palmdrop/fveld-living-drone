import p5 from 'p5';
import { PoissonDiskSampleGenerator } from '../systems/generation/PoissionDiskSampleGenerator';
import { Point } from '../types/point';
import { SpaceColonizationGraph } from '../systems/generation/SpaceColonizationGraph';
import { lengthOfVector, mapLinear, randomUnitVector } from '../utils/math';
import { Renderer, createRenderer } from './renderer';
import { settings } from './settings';
import { randomElement } from '../utils/array';
import { Attractor, createAttractor } from './attractor';
import { debounce } from '../utils/time';

export const sketch = (p: p5) => {
  let graph: SpaceColonizationGraph;
  let attractor: Attractor;

  let renderer: Renderer;
  let canvas: HTMLCanvasElement;
  let points: Point[];

  let hasResizedSinceCurrentGraph = false;

  const getArea = () => {
    return {
      x: 0,
      y: 0,
      w: p.width,
      h: p.height
    }
  };

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
      settings.growth.maxChildren
    );

    graph.setGravity(settings.attractor);

    graph.generate(
      points,
      getArea(),
      randomElement(points),
      randomUnitVector(),
      1
    );

    graph.traverse(segment => {
      segment.metadata ={ 
        ...segment.metadata ?? {},
        thickness: settings.rendererSettings.maxThickness / 10
      }
    })

    return graph;
  }

  const generatePoints = () => {
    const generator = new PoissonDiskSampleGenerator({
      area: getArea(),
      heightMap, 
      tries: settings.leaves.tries,
      minRadius: settings.leaves.minRadius,
      maxRadius: settings.leaves.maxRadius,
      initialSpawner: {
        x: p.width / 2,
        y: p.height / 2
      }
    });

    return generator.generate(1000).samples;
  }

  p.setup = () => {
    const p5Renderer = p.createCanvas(window.innerWidth, window.innerHeight);
    canvas = p5Renderer.elt as HTMLCanvasElement;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    p.smooth();
    p.noiseSeed(Math.random() * Number.MAX_SAFE_INTEGER / 2);
    p.pixelDensity(window.devicePixelRatio);

    points = generatePoints();
    graph = createGraph(points);

    attractor = createAttractor(
      randomElement(points),
      settings.attractor
    );

    renderer = createRenderer(
      p, 
      heightMap, 
      settings.rendererSettings
    );
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

  const handleResize = debounce(() => {
    const width = canvas.parentElement?.clientWidth ?? window.innerWidth;
    const height = canvas.parentElement?.clientHeight ?? window.innerHeight;

    p.resizeCanvas(width, height);

    renderer.handleResize();

    hasResizedSinceCurrentGraph = true;
  }, 300);

  p.windowResized = () => {
    void handleResize();
  }

  let steps = 0;
  // Delta is limited to avoid strange issues when the browser window is out of focus
  const maxDelta = 1 / 20;

  p.draw = () => {
    const delta = Math.min(p.deltaTime / 1000, maxDelta);

    if(!graph.isExhausted() && steps < settings.growth.maxSteps) {
      graph.grow();
      steps++;
    } else {
      if(hasResizedSinceCurrentGraph) {
        points = generatePoints();
      }

      renderer.createNewLayer();
      graph = createGraph(points);
      steps = 0;

      hasResizedSinceCurrentGraph = false;
    }

    renderer.draw(graph);
    renderer.render();

    attractor.update(delta);

    if(mouseActive) {
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

    graph.setGravityPosition(attractor.position.x, attractor.position.y);
  }
}