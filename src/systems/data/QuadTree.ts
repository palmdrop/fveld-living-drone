import { Point } from '../../types/point';
import { areaPointIntersection, type Area, circleAreaIntersection, type Circle, circlePointIntersection } from '../../utils/math';

type QueryMode = 'entry' | 'point' | 'data';
type Entry<T> = { point: Point, data: T | null };

export class Quadtree<T> {
  area: Area;
  capacity: number;
  maxDepth: number;

  size = 0;
  depth = 1;

  preDivide: boolean;
  subdivided = false;
  nodes: Quadtree<T>[] = [];
  entries: Entry<T>[] = [];

  constructor(area: Area, capacity: number, maxDepth: number, preDivide?: boolean) {
    this.area = area;
    this.capacity = capacity;
    this.maxDepth = maxDepth;

    this.size = 0;
    this.depth = 1;

    this.subdivided = false;
    this.preDivide = !!preDivide;
    this.nodes = [];
    this.entries = [];
  }

  insertAll(points: Point[], data: T[] ) {
    for( let i = 0; i < points.length; i++ ) {
      let d : T | null = null;
      if( data ) {
        d = data[ i ];
      }

      this.insert(points[i], d);
    }
  }

  insert(point: Point, data: T | null) {
    if( !areaPointIntersection(this.area, point)) {
      return false;
    }

    this.size++;

    // A new point should be added to this node
    if(this.entries.length < this.capacity || this.depth === this.maxDepth) {
      this.entries.push({ point, data });

      if(this.preDivide && this.entries.length === this.capacity) {
        this._subdivide();
      }
    } 
    // Subdivide
    else {
      if( !this.subdivided ) {
        this._subdivide();
      }

      const node = this._getNode(point);
      node.insert( point, data );
    }

    return true;
  }

  // NOTE: function should only be used if the point is known to be inside the current node volume
  _getNode(point: Point) {
    const { x, y, w, h } = this.area;

    const ix = Math.floor( 2.0 * ( point.x - x ) / w );
    const iy = Math.floor( 2.0 * ( point.y - y ) / h );

    const index = ix + iy * 2;
    const node = this.nodes[ index ];
    return node;
  }

  _subdivide() {
    const { x, y, w, h } = this.area;

      for( let cy = 0; cy < 2; cy++ ) 
        for( let cx = 0; cx < 2; cx++ ) {
          const area = {
            x: x + cx * ( w / 2.0 ),
            y: y + cy * ( h / 2.0 ),

            w: w / 2.0,
            h: h / 2.0,
          };

          const node = new Quadtree<T>(area, this.capacity, this.maxDepth, this.preDivide);
          node.depth = this.depth + 1;

          this.nodes.push(node);
        }

    this.subdivided = true;
  }

  _circleInsideVolume(circle: Circle) {
    return circleAreaIntersection(circle, this.area);
  }

  // Get all entires/points/data inside a sphere
  // The "found" array holds everything found so far. 

  circleQuery(circle: Circle, mode: QueryMode = 'entry', found: unknown[] = []) {
    if( !this._circleInsideVolume(circle)) {
      return found;
    }

    const queryModeConverter = ( () => {
      switch( mode ) {
        case 'entry': return ( entry : Entry<T> ) => entry;
        case 'point': return ( entry : Entry<T> ) => entry.point;
        case 'data': return ( entry : Entry<T> ) => entry.data;
      }
    } )();


    this.entries.forEach( entry => {
      if(circlePointIntersection(circle, entry.point)) {
        found.push( queryModeConverter( entry ) );
      }
    } );

    this.nodes.forEach( node => {
      node.circleQuery(circle, mode, found);
    } );

    return found;
  }

  // Finds the node in which the point is located

  getLowestNode(point: Point): Quadtree<T> | undefined {
    if (!areaPointIntersection(this.area, point)) return undefined;

    if( !this.subdivided ) {
      return this;
    }

    return this.nodes.map(node => node.getLowestNode(point)).find(node => !!node);
  }

  getNodeAtLevel(point: Point, level: number): Quadtree<T> | undefined {
    if ( !areaPointIntersection( this.area, point ) || level < 0 ) return undefined;

    if( !this.subdivided ) {
      return this;
    }

    return this.nodes.map(node => node.getNodeAtLevel(point, level - 1)).find(node => !!node);
  }

  traverseEntries( callback ?: ( entry : Entry<T>, octree : Quadtree<T> ) => void ) {
    if( !callback ) return;
    this.entries.forEach( entry => callback( entry, this ) );
    this.nodes.forEach( node => node.traverseEntries( callback ) );
  }

  traverseChildren( callback ?: ( node : Quadtree<T> ) => void ) {
    this.nodes.forEach( node => callback && callback( node ) );
  }

  traverseNodes( callback ?: ( node : Quadtree<T> ) => void ) {
    callback && callback( this );
    this.nodes.forEach( node => node.traverseNodes( callback ) );
  }

  getFlattenedNodes() {
    const flattenedNodes: Quadtree<T>[] = [];
    this.traverseNodes(node => flattenedNodes.push(node));
    return flattenedNodes;
  }

  getLeafNodes() {
    const leafNodes: Quadtree<T>[] = [];
    this.traverseNodes(node => {
      if(!node.entries.length) leafNodes.push(node);
    });
    return leafNodes;
  }

  getChildCount() {
    return this.nodes.length;
  }

  getArea() {
    return this.area;
  }
}