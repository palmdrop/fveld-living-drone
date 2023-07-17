import { Point } from "../types/point";
import { lengthOfVector, limitVector, mapLinear } from "../utils/math";
import { Settings } from "./settings";

export const createAttractor = (
  startPoint: Point, 
  attractorConfig: Settings['attractor']
) => {
  const attractor = {
    position: {
      ...startPoint
    },
    velocity: {
      x: 0, y: 0,
    },
    acceleration: {
      x: 0, y: 0
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    moveTowards: (_point: Point) => { 
      // 
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addForce: (_force: Point) => {
      // 
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: (_delta: number) => {
      // 
    }
  };

  attractor.addForce = force => {
    attractor.acceleration.x += force.x;
    attractor.acceleration.y += force.y;
  }

  attractor.moveTowards = point => {
    const pointToAttractor = {
      x: point.x - attractor.position.x,
      y: point.y - attractor.position.y,
    }

    const length = lengthOfVector(pointToAttractor);
    const force = {
      x: pointToAttractor.x / length,
      y: pointToAttractor.y / length
    }

    let speed = attractorConfig.speed;
    if(length < attractorConfig.falloffFrom) {
      const n = mapLinear(length, 0, attractorConfig.falloffFrom, 0, 1) ** attractorConfig.falloff;
      speed *= n;
    }

    force.x *= speed;
    force.y *= speed;

    attractor.addForce(force);
  }

  attractor.update = (delta: number) => {
    limitVector(attractor.acceleration, attractorConfig.maxForce);

    attractor.velocity.x += attractor.acceleration.x * delta;
    attractor.velocity.y += attractor.acceleration.y * delta;

    attractor.velocity.x *= (1 - attractorConfig.friction * delta);
    attractor.velocity.y *= (1 - attractorConfig.friction * delta);

    limitVector(attractor.velocity, attractorConfig.maxSpeed);

    attractor.position.x += attractor.velocity.x * delta;
    attractor.position.y += attractor.velocity.y * delta;

    attractor.acceleration.x = 0;
    attractor.acceleration.y = 0;
  }

  return attractor;
}

export type Attractor = ReturnType<typeof createAttractor>;