import p5 from 'p5';
import { useRef, useEffect } from 'react';
import { sketch } from '../living-drone/sketch';
import { settings } from '../living-drone/settings';

const LivingDrone = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!rootRef.current) return;

    const p5Instance = new p5(sketch, rootRef.current);

    return () => {
      p5Instance.remove();
    }
  }, [rootRef]);

  const backgroundColor = settings.rendererSettings.colors.background;

  return (
    <div 
     ref={rootRef}
     style={{
      overflow: "hidden",
      width: "100vw",
      height: "100vh",
      backgroundColor: `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
     }}
    />
  )
}

export default LivingDrone;