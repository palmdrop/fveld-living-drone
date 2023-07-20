import p5 from "p5";
import { Segment, SpaceColonizationGraph } from "../systems/generation/SpaceColonizationGraph"
import { Point } from "../types/point";
import { clamp, lerp, mapLinear, random } from "../utils/math";
import { Settings } from "./settings";
import { Attractor } from "./attractor";
import { rgbToHex, sampleGradient } from "../utils/color";

export const createRenderer = (
  p: p5,
  heightMap: (point: Point) => number,
  attractor: Attractor,
  settings: Settings['rendererSettings']
) => {
  let baseContext: CanvasRenderingContext2D;
  let baseLayer: p5.Graphics;
  let lowerLayer: p5.Graphics;
  let upperLayer: p5.Graphics;

  let colorFadeOffset = 0;
  // TODO: make own function
  colorFadeOffset = Math.random() * (1 - settings.colors.fadeAmount);

  const initDrawLayers = () => {
    lowerLayer = p.createGraphics(p.width, p.height);
    upperLayer = p.createGraphics(p.width, p.height);
  }

  const initBaseLayer = () => {
    baseLayer = p.createGraphics(p.width, p.height);
    baseContext = baseLayer.drawingContext as CanvasRenderingContext2D;
    /*
    baseLayer.background(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b,
    );
    */
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

    const n = heightMap(child.origin);
    const desiredThickness = mapLinear(
      n ** settings.thicknessPow,
      0,
      1,
      settings.minThickness,
      settings.maxThickness,
    );

    const parentThickness = parent.metadata!.thickness as number;
    const thickness = lerp(parentThickness, desiredThickness, settings.thicknessDelta);

    child.metadata ={
      ...child.metadata ?? {},
      thickness
    };

    // TODO: connect fade to thickness instead of underlying noise?
    const colorFade = clamp(mapLinear(
      n ** settings.colors.fadePow + random(-settings.colors.fadeRandom, settings.colors.fadeRandom), 
      0,
      1,
      // TODO: add support for reversing fade!?
      colorFadeOffset,
      colorFadeOffset + settings.colors.fadeAmount
    ), 0, 1);

    const lowerLayerColor = sampleGradient(settings.colors.outlineFade, colorFade);
    const upperLayerColor = sampleGradient(settings.colors.bodyFade, colorFade);

    const lowerLayerContext = lowerLayer.drawingContext as CanvasRenderingContext2D;

    // Render lower layer
    lowerLayer.stroke(
      lowerLayerColor.r, 
      lowerLayerColor.g,
      lowerLayerColor.b,
    );

    lowerLayer.strokeWeight(thickness + 2);
    lowerLayerContext.shadowOffsetX = 2;
    lowerLayerContext.shadowOffsetY = 2;
    lowerLayerContext.shadowBlur = 5;
    lowerLayerContext.shadowColor = '#00000013';

    lowerLayer.line(
      parent.origin.x, parent.origin.y,
      child.origin.x, child.origin.y,
    );

    // TODO: render additional steps

    // Render upper layer
    upperLayer.stroke(
      upperLayerColor.r, 
      upperLayerColor.g,
      upperLayerColor.b,
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
      if(segment.children.length || segment.metadata?.drawed || !parent) return;
      segment.metadata ={
        ...segment.metadata ?? {},
        drawed: true
      };

      renderConnection(parent, segment, lowerLayer, upperLayer);
    });
  }

  let lastFade = p.millis();
  const render = () => {
    const millis = p.millis();
    if((millis - lastFade) > settings.fade.frequency) {
      baseContext.save();
      baseContext.globalAlpha = settings.fade.amount;
      baseContext.globalCompositeOperation = 'destination-out';
      baseContext.fillStyle = `rgb(${settings.colors.background.r}, ${settings.colors.background.g}, ${settings.colors.background.b})`;
      baseContext.fillRect(0, 0, p.width, p.height);
      baseContext.restore();

      lastFade = millis;
    }

    p.background(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b
    );

    p.image(baseLayer, 0, 0);
    p.image(lowerLayer, 0, 0);
    p.image(upperLayer, 0, 0);

    p.fill(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b,
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

    colorFadeOffset = Math.random() * (1 - settings.colors.fadeAmount);
  }

  return {
    draw,
    render,
    handleResize,
    createNewLayer
  }
}

export type Renderer = ReturnType<typeof createRenderer>;