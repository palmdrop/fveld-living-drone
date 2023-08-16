import p5 from "p5";
import { Segment, SpaceColonizationGraph } from "../systems/generation/SpaceColonizationGraph"
import { Point } from "../types/point";
import { clamp, lerp, mapLinear, random } from "../utils/math";
import { Settings } from "./settings";
import { sampleGradient } from "../utils/color";

export const createRenderer = (
  p: p5,
  heightMap: (point: Point) => number,
  settings: Settings['rendererSettings']
) => {
  let maxWidth = p.width;
  let maxHeight = p.height;

  let baseContext: CanvasRenderingContext2D;
  let baseLayer: p5.Graphics;
  let lowerLayer: p5.Graphics;
  let upperLayer: p5.Graphics;

  let colorFadeOffset = 0;
  // TODO: make own function
  colorFadeOffset = Math.random() * (1 - settings.colors.fadeAmount);

  const getGraphicsDimensions = (desiredWidth = p.width, desiredHeight = p.height) => {
    const width = Math.max(maxWidth, desiredWidth);
    const height = Math.max(maxHeight, desiredHeight);

    maxWidth = width;
    maxHeight = height;

    return {
      width,
      height
    }
  }

  const initDrawLayers = () => {
    const {
      width,
      height
    } = getGraphicsDimensions();

    lowerLayer = p.createGraphics(width, height);
    upperLayer = p.createGraphics(width, height);
    return {
      lowerLayer,
      upperLayer
    }
  }

  const initBaseLayer = () => {
    const {
      width,
      height
    } = getGraphicsDimensions();

    baseLayer = p.createGraphics(width, height);
    baseContext = baseLayer.drawingContext as CanvasRenderingContext2D;
    return baseLayer;
  }

  initDrawLayers();
  initBaseLayer();

  const handleResize = (elementWidth: number, elementHeight: number) => {
    const {
      width,
      height
    } = getGraphicsDimensions(elementWidth, elementHeight);

    p.resizeCanvas(width, height);

    const oldLowerLayer = lowerLayer;
    const oldUpperLayer = upperLayer;
    const oldBaseLayer = baseLayer;

    const {
      lowerLayer: newLowerLayer, 
      upperLayer: newUpperLayer
    } = initDrawLayers();
    const newBaseLayer = initBaseLayer();

    newBaseLayer.image(oldBaseLayer, 0, 0);
    newLowerLayer.image(oldLowerLayer, 0, 0);
    newUpperLayer.image(oldUpperLayer, 0, 0);

    p.background(
      settings.colors.background.r,
      settings.colors.background.g,
      settings.colors.background.b
    );
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

    lowerLayer.strokeWeight(thickness + settings.outlineThickness);
    lowerLayerContext.shadowOffsetX = settings.colors.shadow.x;
    lowerLayerContext.shadowOffsetY = settings.colors.shadow.y;
    lowerLayerContext.shadowBlur = settings.colors.shadow.blur;
    lowerLayerContext.shadowColor = settings.colors.shadow.color;

    lowerLayer.line(
      parent.origin.x, parent.origin.y,
      child.origin.x, child.origin.y,
    );

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
    graph.getNewSegments().forEach(data => {
      const segment = data.segment;
      const parent = segment.parent!;
      renderConnection(parent, segment, lowerLayer, upperLayer)
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