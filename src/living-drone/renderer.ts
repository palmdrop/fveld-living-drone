import p5 from "p5";
import { Segment, SpaceColonizationGraph } from "../systems/generation/SpaceColonizationGraph"
import { Point } from "../types/point";
import { lerp, mapLinear } from "../utils/math";
import { Settings } from "./settings";
import { Attractor } from "./attractor";

export const createRenderer = (
  p: p5,
  heightMap: (point: Point) => number,
  attractor: Attractor,
  settings: Settings['rendererSettings']
) => {
  let baseLayer: p5.Graphics;
  let lowerLayer: p5.Graphics;
  let upperLayer: p5.Graphics;

  let fading = false;
  let fadeStart = p.millis();

  const initDrawLayers = () => {
    lowerLayer = p.createGraphics(p.width, p.height);
    upperLayer = p.createGraphics(p.width, p.height);
  }

  const initBaseLayer = () => {
    baseLayer = p.createGraphics(p.width, p.height);
    baseLayer.background(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b
    );
  }

  initDrawLayers();
  initBaseLayer();

  const handleResize = () => {
    // TODO
    /*
    const oldLowerLayer = lowerLayer;
    const oldUpperLayer = upperLayer;
    const oldBaseLayer = baseLayer;
    */

    initDrawLayers();
    initBaseLayer();

    // TODO: render old layers to new layers to preserve contents?
  }

  const renderConnection = (
    parent: Segment | null,
    child: Segment,
    lowerLayer: p5.Graphics,
    upperLayer: p5.Graphics
  ) => {
    if(!parent) return;

    const getThickness = (point: Point) => {
      const n = heightMap(point) ** settings.thicknessPow;
      return mapLinear(
        n,
        0,
        1,
        settings.minThickness,
        settings.maxThickness,
      );
    }

    const desiredThickness = getThickness(child.origin);

    if(typeof parent?.metadata?.thickness === 'undefined') {
      parent.metadata = {
        thickness: getThickness(parent.origin)
      }
    }

    const parentThickness = parent.metadata.thickness as number;
    const thickness = lerp(parentThickness, desiredThickness, settings.thicknessDelta);

    child.metadata = {
      thickness
    };

    // Render lower layer
    lowerLayer.stroke(
      settings.colors.outline.r, 
      settings.colors.outline.g, 
      settings.colors.outline.b
    );

    lowerLayer.strokeWeight(thickness + 2);
    lowerLayer.line(
      parent.origin.x, parent.origin.y,
      child.origin.x, child.origin.y,
    );

    // TODO: render additional steps

    // Render upper layer
    upperLayer.stroke(
      settings.colors.body.r, 
      settings.colors.body.g, 
      settings.colors.body.b
    );
    upperLayer.strokeWeight(thickness);
    upperLayer.line(
      parent.origin.x, parent.origin.y,
      child.origin.x, child.origin.y,
    );
  }

  const draw = (graph: SpaceColonizationGraph) => {
    graph.traverse((segment, parent) => {
      // TODO: optimize by keeping a list of the newly added segments, only rendrer these!
      if(segment.children.length || !parent) return;

      renderConnection(parent, segment, lowerLayer, upperLayer);
    });
  }

  const render = () => {
    if(fading && (p.millis() - fadeStart) < settings.fade.duration) {
      const delta = p.deltaTime / settings.fade.duration;
      const alpha = 255 * settings.fade.amount * delta

      baseLayer.background(
        settings.colors.background.r,
        settings.colors.background.g,
        settings.colors.background.b,
        alpha
      );
    } else {
      fading = false;
    }

    p.image(baseLayer, 0, 0);
    p.image(lowerLayer, 0, 0);
    p.image(upperLayer, 0, 0);

    p.fill(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b,
    );
    p.stroke(
      settings.colors.outline.r,
      settings.colors.outline.g,
      settings.colors.outline.b,
    );
    p.ellipse(
      attractor.position.x,
      attractor.position.y,
      30
    );
  }

  const createNewLayer = () => {
    baseLayer.image(lowerLayer, 0, 0);
    baseLayer.image(upperLayer, 0, 0);

    lowerLayer.clear(0, 0, 0, 0);
    upperLayer.clear(0, 0, 0, 0);

    fading = true;
    fadeStart = p.millis();
  }

  return {
    draw,
    render,
    handleResize,
    createNewLayer
  }
}

export type Renderer = ReturnType<typeof createRenderer>;