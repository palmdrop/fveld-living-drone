/**
 * Partly inspired by https://github.com/jasonwebb/2d-space-colonization-experiments
 */

import { Point } from "../../types/point";
import { Area, clamp, distanceToSquared, dot, lengthOfVector, lerpPoints, mapLinear, normalizeVector, randomUnitVector } from "../../utils/math";
import { Quadtree } from "../data/QuadTree";

type ArgumentFunction = (value: Point) => number;

const toArgumentFunction = (argument : ArgumentFunction | number) => {
  if(typeof argument === 'function') {
    return argument;
  } else {
    return () => argument;
  }
};

/*
class Segment {
  constructor( origin, direction ) {
    this.origin = origin;
    this.direction = direction;

    this.children = [];
  }
}
*/

export type Segment = {
  origin : Point,
  direction : Point,
  position?: Point,
  children : Segment[],
  parent ?: Segment,
  depth ?: number,
  reverseDepth ?: number,
  metadata ?: Record<string, any>
}

export type Gravity = {
  pow?: number,
  min: number,
  max: number
  minRange: number,
  maxRange: number,
  point?: Point
}

class SegmentData {
  segment: Segment; 
  newDirection: Point;
  interactions: number;
  maxChildren: number;
  reached: boolean;

  constructor(segment: Segment, maxChildren = 3) {
    this.segment = segment;
    this.newDirection = { ...segment.direction };
    this.interactions = 0;
    this.maxChildren = maxChildren;
    this.reached = false;
  }

  normalize() {
    normalizeVector(this.newDirection);
  }

  reset() {
    this.newDirection = { ...this.segment.direction };
    this.interactions = 1;
  }
}
// TODO: change to an actual graph? this is still a tree
export class SpaceColonizationGraph {
  private minDistance: ArgumentFunction;
  private maxDistance: ArgumentFunction;
  private dynamics: ArgumentFunction;
  private stepSize: ArgumentFunction;
  private randomDeviation: ArgumentFunction;

  private area: Area;

  private leaves: Point[];
  private consumedLeaves: Point[];
  // TODO: track which leaves have been interacted with. If they then stop being interacted with, remove!

  private exhausted = false;

  private segments: Quadtree<SegmentData>;
  private root?: Segment;
  private maxDepth?: number;

  private gravity?: Gravity;

  constructor( 
    minDistance : ArgumentFunction | number, 
    maxDistance : ArgumentFunction | number, 
    dynamics : ArgumentFunction | number, 
    stepSize : ArgumentFunction | number, 
    randomDeviation : ArgumentFunction | number,
    private mode : 'open' | 'closed' | 'broken-closed' = 'open',
    private maxChildren : number = 3,
    private minDepth : number = 1
  ) {
    this.minDistance = toArgumentFunction( minDistance );
    this.maxDistance = toArgumentFunction( maxDistance );
    this.dynamics = toArgumentFunction( dynamics );
    this.stepSize = toArgumentFunction( stepSize );
    this.randomDeviation = toArgumentFunction( randomDeviation );

    this.area = {
      x: 0, y: 0, w: 0, h: 0
    };

    this.leaves = [];
    this.consumedLeaves = [];
    this.segments = this._createQuadtree();
  }

  setGravity(gravity: Gravity) {
    this.gravity = gravity;
  }

  setGravityPosition(x: number, y: number) {
    if(!this.gravity) return;
    if(!this.gravity.point) this.gravity.point = { x: 0, y: 0 };

    this.gravity.point.x = x;
    this.gravity.point.y = y;
  }

  unsetGravityPosition() {
    if(!this.gravity) return;
    this.gravity.point = undefined;
  }

  _createQuadtree() {
    return new Quadtree<SegmentData>( this.area, 8, 3 );
  }

  generate( leaves : Point[], area : Area, origin : Point, startDirection : Point, iterations : number ) {
    this.exhausted = false;
    this.area = area;
    this.leaves = leaves;

    const root : Segment = {
      origin, 
      direction: normalizeVector({ ...startDirection }),
      children: [],
      depth: 0
    };

    this.segments = this._createQuadtree();
    this.segments.insert( origin, new SegmentData( root, this.maxChildren ) );

    for( let i = 0; i < iterations && !this.exhausted; i++ ) this.grow();

    this.root = root;

    return root;
  }

  grow() {
    // If the tree is exhausted, do nothing
    if( this.exhausted ) return true;

    // Set true if at least one segment found a leaf to interact with
    let foundOne = false;

    // Octree of new segments
    const nextSegmentData = this._createQuadtree();

    // All segments that interacted with a leaf (living segments)
    const interactingSegmentData = new Set<SegmentData>();
    
    // Active leafs
    // NOTE: only used for closed mode
    const interactingLeaves = new Map<Point, SegmentData[]>();

    const addGravity = (position: Point, direction: Point) => {
      if(!this.gravity || !this.gravity.point) return;
      const gravityDirection = {
        x: this.gravity.point.x - position.x,
        y: this.gravity.point.y - position.y
      };

      const distance = lengthOfVector(gravityDirection);
      normalizeVector(gravityDirection);

      const gravityFactor = mapLinear(
        clamp(distance, this.gravity.minRange, this.gravity.maxRange),
        this.gravity.minRange,
        this.gravity.maxRange,
        this.gravity.min ?? 0,
        this.gravity.max ?? 1,
      );

      const gravityForce = Math.pow(gravityFactor, this.gravity.pow ?? 1.0);

      direction.x += gravityDirection.x * gravityForce;
      direction.y += gravityDirection.y * gravityForce;

      return direction;
    }

    // Iterate over all leaves and check if there's a segment that can interact with it
    for( let i = this.leaves.length - 1; i >= 0; i-- ) {
      const leaf = this.leaves[ i ];

      if(this.mode === 'open') {
        // Find the closest segment (within the maxDistance)
        const closestSegmentData = this._closestSegmentData( leaf );

        // If none is found, continue to next leaf
        if( !closestSegmentData ) continue;
        foundOne = true;

        const segmentOrigin = closestSegmentData.segment.origin;

        const minDistance = this.minDistance( segmentOrigin );
        const dynamics = this.dynamics( segmentOrigin );

        const distSq = distanceToSquared(leaf, segmentOrigin);

        // If the segment is sufficiently close to the leaf, remove the leaf
        if( distSq < minDistance * minDistance ) {
          this.consumeLeaf(i);
        } else {
          // Otherwise, prepare for creating a new segment

          // Calculate the desired direction
          const dir = lerpPoints(
            closestSegmentData.segment.direction, 
            normalizeVector({
              x: leaf.x - closestSegmentData.segment.origin.x,
              y: leaf.y - closestSegmentData.segment.origin.y,
            }),
            dynamics
          );

          addGravity(closestSegmentData.segment.origin, dir);

          // and accumulate (a segment might be attracted by multiple leaves)
          closestSegmentData.newDirection.x += dir.x;
          closestSegmentData.newDirection.y += dir.y;
          closestSegmentData.interactions++;

          interactingSegmentData.add( closestSegmentData );
        }
      } else {
        const neighborSegments = this._relativeNeighborSegmentData( leaf );

        if (neighborSegments.length) {
          interactingLeaves.set(leaf, neighborSegments);
        }

        for( const segmentData of neighborSegments ) {
          // NOTE: this is wrong, but creates interesting results!
          // if (segmentData.reached) continue;

          const segmentOrigin = segmentData.segment.origin;
          const minDistance = this.minDistance( segmentOrigin );
          const distSq = distanceToSquared(leaf, segmentOrigin );

          if(distSq < minDistance * minDistance) {
            segmentData.reached = true;

            if( neighborSegments.some( neighbor => !neighbor.reached && !neighbor.segment.children.length )) {
              interactingSegmentData.add( segmentData );
            }

            continue;
          }

          if(!segmentData.reached) foundOne = true;

          const dynamics = this.dynamics( segmentOrigin );

          // TODO: this could be abstracted to separate function
          const dir = lerpPoints( 
            segmentData.segment.direction, 
            normalizeVector({
              x: leaf.x - segmentData.segment.origin.x,
              y: leaf.y - segmentData.segment.origin.y
            }),
            dynamics
          );
          
          addGravity(segmentData.segment.origin, dir);

          // and accumulate (a segment might be attracted by multiple leaves)
          segmentData.newDirection.x += dir.x;
          segmentData.newDirection.y += dir.y;
          segmentData.interactions++;

          interactingSegmentData.add( segmentData );
        }
      }
    }

    // If no segment is close enough to a leaf, then the tree is exhausted
    if( !foundOne ) {
      this.exhausted = true;
      return true;
    }

    // Iterate over all the segments that interacted with a leaf
    interactingSegmentData.forEach( segmentData => {
      if (segmentData.reached && segmentData.segment.depth! > this.minDepth) {
        if(this.mode !== 'broken-closed') {
          nextSegmentData.insert( segmentData.segment.origin, segmentData );
        }

        return;
      }

      segmentData.normalize();

      const randomDeviation = this.randomDeviation( segmentData.segment.origin );
      const stepSize = this.stepSize( segmentData.segment.origin );

      const newPosition = {
        x: segmentData.segment.origin.x + segmentData.newDirection.x * stepSize,
        y: segmentData.segment.origin.y + segmentData.newDirection.y * stepSize,
      };

      const randomDirection = randomUnitVector();
      newPosition.x += randomDirection.x * randomDeviation;
      newPosition.y += randomDirection.y * randomDeviation;

      const newSegment : Segment = {
        origin: newPosition,
        direction: segmentData.newDirection,
        parent: segmentData.segment,
        children: [],
        depth: segmentData.segment.depth! + 1
      };
            
      segmentData.reset();
      segmentData.segment.children.push( newSegment );

      nextSegmentData.insert( segmentData.segment.origin, segmentData );
      nextSegmentData.insert( newSegment.origin, new SegmentData( newSegment, this.maxChildren ) );
    } );

    // iterate over all leafs that have active segments in their neighborhood
    this.leaves = this.leaves.filter(leaf => {
      if(!interactingLeaves.has(leaf)) return true;

      const segmentsData = interactingLeaves.get(leaf)!;
      let allReached = true;
      let oneInKillDistance = false;
      // return segmentsData.some(segment => !segment.reached);
      for(const segmentData of segmentsData) {
        if(!segmentData.reached) {
          allReached = false;
          break;
        }

        const distToSq = distanceToSquared(leaf, segmentData.segment.origin);
        const minDistance = this.minDistance(segmentData.segment.origin);
        if(distToSq <= minDistance * minDistance) {
          oneInKillDistance = true;

          const connector : Segment = {
            origin: leaf,
            direction: segmentData.newDirection,
            children: [],
            parent: segmentData.segment,
            depth: segmentData.segment.depth! + 1
          };

          segmentData.segment.children.push(connector);
        }
      }

      const consumed = (allReached && oneInKillDistance);

      if(consumed) {
        this.consumedLeaves.push(leaf);
      }

      return !consumed;
    });

    this.segments = nextSegmentData;

    return false;
  }

  _relativeNeighborSegmentData( leaf : Point ) : SegmentData[] {
    const maxDistance = this.maxDistance( leaf );

    const nearbySegments = this.segments.circleQuery(
      { ...leaf, radius: maxDistance },
    ) as { point : Point, data : SegmentData }[];

    const relativeNeighbors : SegmentData[] = [];

    for( let i = 0; i < nearbySegments.length; i++ ) {
      const segment = nearbySegments[i];

      if( 
        segment.data.maxChildren &&
        segment.data.segment.children.length >= segment.data.maxChildren
      ) continue;

      let isNeighbor = true;

      const leafToSegmentDistanceSq = distanceToSquared(segment.point, leaf);

      // NOTE: could be optimized by caching results and just iterating from j = i
      for( let j = 0; j < nearbySegments.length; j++ ) {
        if(i === j) continue;

        const other = nearbySegments[j];
        const leafToOtherDistanceSq = distanceToSquared(other.point, leaf);

        if( leafToOtherDistanceSq > leafToSegmentDistanceSq ) continue;

        const segmentToOtherDistanceSq = distanceToSquared(segment.point, other.point);

        if( leafToSegmentDistanceSq > segmentToOtherDistanceSq ) {
          isNeighbor = false;
          break;
        }
      }

      if( isNeighbor ) {
        relativeNeighbors.push( segment.data );
      }
    }

    return relativeNeighbors;
  }

  _closestSegmentData( leaf : Point ) : SegmentData | null {
    let closest : SegmentData | null = null;

    const maxDistance = this.maxDistance( leaf );

    const nearbySegmentsData = this.segments.circleQuery( 
      { ...leaf, radius: maxDistance },
    ) as { point : Point, data : SegmentData }[];

    let minDistSq = maxDistance * maxDistance;

    nearbySegmentsData.forEach( ( { point, data } ) => {
      if(
        data.maxChildren &&
        data.segment.children.length >= data.maxChildren
      ) return;

      const distSq = distanceToSquared( leaf, point );
      if( distSq < minDistSq ) {
        closest = data;
        minDistSq = distSq;
      }
    } );

    return closest;
  }

  traverse( callback : ( segment : Segment, parent : Segment | null, depth : number ) => void ) {
    const traverseSegment = ( segment : Segment, parent : Segment | null, depth : number ) => {
      callback( segment, parent, depth );

      segment.children.forEach( child => {
        traverseSegment( child, segment, depth + 1 );
      } );
    };

    this.root && traverseSegment( this.root, null, 1 );
  }

  calculateDepths() {
    // Calculate max depth
    let maxDepth = -1;

    this.traverse( ( segment : Segment, _ : Segment | null, depth : number ) => {
      // And set the depth of each segment
      segment.depth = depth;

      maxDepth = Math.max( maxDepth, depth );
    } );
    this.maxDepth = maxDepth;

    // Calculate the reverse depth (number of segments from a leaf)
    const calculateReverseDepth = ( segment : Segment ) => {
      let count = 0;

      segment.children.forEach( child => {
        count = Math.max( count, calculateReverseDepth( child ) );
      } );

      segment.reverseDepth = 1 + count;

      return segment.reverseDepth;
    };

    this.root && calculateReverseDepth( this.root );
  }

  toSkeleton( threshold : number | ( ( segment : Segment, maxDepth : number ) => number ) ) {
    this.calculateDepths();

    let thresholdFunction : ( segment : Segment, maxDepth : number ) => number;
    if( typeof threshold !== 'function' ) thresholdFunction = () => threshold;
    else thresholdFunction = threshold;

    const convert = ( segment : Segment ) => {
      let current = segment;

      //TODO what to do if segment has multiple children at start?

      if( current.children.length === 0 ) return;

      if( current.children.length > 1 ) {
        current.children.forEach( child => {
          convert( child );
        } );

        return;
      }

      while( current.children.length === 1 ) {
        const child = current.children[ 0 ];

        const dotDirection = dot(current.direction, child.direction );
        const angle = mapLinear( dotDirection, -1, 1, Math.PI * 2, 0 );

        const t = thresholdFunction( child, this.maxDepth || 0 );

        if( angle > t ) {
          segment.position = current.position;
          segment.direction = current.direction;
          segment.children = current.children;

          convert( child );
          return;
        }
        current = child;
      }

      segment.position = current.position;
      segment.direction = current.direction;
      segment.children = current.children;

      convert( segment );
    };

    this.root && convert( this.root );
  }

  private consumeLeaf(index: number) {
    const leaf = this.leaves.splice( index, 1 );
    this.consumedLeaves.push(...leaf);
  }

  getSegments() {
    return this.segments;
  }

  getLeaves() {
    return this.leaves;
  }

  getConsumedLeaves() {
    return this.consumedLeaves;
  }

  isExhausted() {
    return this.exhausted;
  }
}