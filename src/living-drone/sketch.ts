import { debounce, min } from 'lodash';
import p5 from 'p5';
import { PoissonDiskSampleGenerator } from '../systems/generation/PoissionDiskSampleGenerator';
import { Point } from '../types/point';
import { SpaceColonizationGraph } from '../systems/generation/SpaceColonizationGraph';
import { mapLinear, random, randomUnitVector } from '../utils/math';
import { Renderer, createRenderer } from './renderer';
import { settings } from './settings';

export const sketch = (p: p5) => {
  let poissionDiskSampleGenerator: PoissonDiskSampleGenerator;
  let graph: SpaceColonizationGraph;
  let renderer: Renderer;
  p.setup = () => {
    const p5Renderer = p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(p.color(0));
    p.smooth();
    p.colorMode(p.RGB);

    const canvas = p5Renderer.elt as HTMLCanvasElement;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";

    p.noiseSeed(Math.random() * Number.MAX_SAFE_INTEGER / 2);

    const heightMap = (point: Point) => {
      return p.noise(
        point.x * settings.heightMap.frequency, 
        point.y * settings.heightMap.frequency
      ) ** settings.heightMap.pow;
    }

    const createPointGenerator = () => {
      const minDimension = Math.min(p.width, p.height);
      return new PoissonDiskSampleGenerator({
        area: {
          x: (p.width - minDimension) / 2,
          y: (p.height - minDimension) / 2,
          w: minDimension,
          h: minDimension,
        },
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

    poissionDiskSampleGenerator = createPointGenerator();
    poissionDiskSampleGenerator.generate(10000);

    const createGraph = () => {
      const graph = new SpaceColonizationGraph(
        // Min distance  
        p => {
          return mapLinear(
            heightMap(p),
            0, 1,
            settings.growth.minDistance?.min ?? 3, settings.growth.minDistance?.max ?? 10
          );
        },
        // Max distance  
        p => {
          return mapLinear(
            heightMap(p),
            0, 1,
            settings.growth.maxDistance?.min ?? 70, settings.growth.maxDistance?.max ?? 220
          );
        },
        // Dynamics
        // NOTE: low dynamics creates pretty nice metal patterns...
        p => {
          return mapLinear(
            heightMap(p),
            0, 1,
            settings.growth.dynamics?.min ?? 1, settings.growth.dynamics?.max ?? 1
          );
        },
        // Step size
        // NOTE: step size of 10 provides really chaotic results
        p => {
          return mapLinear(
            heightMap(p),
            0, 1,
            settings.growth.stepSize?.min ?? 1, settings.growth.stepSize?.max ?? 1
          );
        },
        // Random deviation
        p => {
          return mapLinear(
            heightMap(p),
            0, 1,
            settings.growth.randomDeviation?.min ?? 0.5, settings.growth.randomDeviation?.max ?? 2
          );
        },
        settings.growth.mode,
        3,
        settings.growth.minDepth 
      );

      graph.setGravity(settings.growth.gravity);

      return graph;
    }

    graph = createGraph();

    const radius = Math.min(poissionDiskSampleGenerator.area.w, poissionDiskSampleGenerator.area.h) / 2;
    const cX = poissionDiskSampleGenerator.area.x + poissionDiskSampleGenerator.area.w / 2;
    const cY = poissionDiskSampleGenerator.area.y + poissionDiskSampleGenerator.area.h / 2;
    const points = poissionDiskSampleGenerator.points.filter(
      point => ((point.x - cX) ** 2 + (point.y - cY) ** 2) < (radius ** 2)
    );

    graph.generate(
      points,
      poissionDiskSampleGenerator.area,
      {
        x: p.width / 2,
        y: p.height / 2,
      },
      randomUnitVector(),
      1
    );

    renderer = createRenderer(p);
  }

  p.windowResized = debounce(() => {
    //
  }, 250);


  p.mouseDragged = () => {
    graph.setGravityPosition(p.mouseX, p.mouseY);
  }

  p.mouseReleased = () => {
    graph.unsetGravityPosition();
  }

  p.draw = () => {
    // p.background(0);

    if(!graph.isExhausted()) {
      graph.grow();
    }

    // p.circle(p.width / 2, p.height / 2, 100);
    p.strokeWeight(1);
    /*
    graph.getLeaves().forEach(point => {
      p.circle(point.x, point.y, 1);
    });
    */

    renderer.render(graph);
  }
}