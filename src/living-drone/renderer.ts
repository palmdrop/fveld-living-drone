import p5 from "p5";
import { Segment, SpaceColonizationGraph } from "../systems/generation/SpaceColonizationGraph"
import { Point } from "../types/point";
import { lerp, mapLinear } from "../utils/math";
import { Settings } from "./settings";

export const createRenderer = (
  p: p5,
  heightMap: (point: Point) => number,
  settings: Settings['rendererSettings']
) => {
  let lowerLayer: p5.Graphics;
  let upperLayer: p5.Graphics;

  const handleResize = () => {
    p.background(0);

    const oldLowerLayer = lowerLayer;
    const oldUpperLayer = upperLayer;

    lowerLayer = p.createGraphics(p.width, p.height);
    upperLayer = p.createGraphics(p.width, p.height);

    // TODO: render old layers to new layers to preserve contents?
  }

  handleResize();

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
    p.background(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b
    );
    p.image(lowerLayer, 0, 0);
    p.image(upperLayer, 0, 0);
  }

  return {
    draw,
    render
  }
}

export type Renderer = ReturnType<typeof createRenderer>;