import p5 from "p5";
import { Segment, SpaceColonizationGraph } from "../systems/generation/SpaceColonizationGraph"

export const createRenderer = (p: p5) => {
  const renderConnection = (
    parent: Segment | null,
    child: Segment
    // ???
  ) => {
    if(!parent) return;

    p.stroke(255, 255, 255);
    p.strokeWeight(1);
    p.line(
      parent.origin.x, parent.origin.y,
      child.origin.x, child.origin.y,
    );
  }

  const render = (graph: SpaceColonizationGraph) => {
    graph.traverse((segment, parent) => {
      // TODO: optimize by keeping a list of the newly added segments, only rendrer these!
      if(segment.children.length || !parent) return;

      renderConnection(segment, parent);

      /*
      segment.children.forEach(child => {
        renderConnection(segment, child);
      });
      */
    });
  }

  return {
    render
  }
}

export type Renderer = ReturnType<typeof createRenderer>;