import './css/reset.css';
import './css/global.css';
import { settings } from './living-drone/settings';
import p5 from 'p5';
import { sketch } from './living-drone/sketch';

const backgroundColor = settings.rendererSettings.colors.background;

const rootElement = document.querySelector<HTMLDivElement>('#living-drone-root')!;
rootElement.style.backgroundColor = `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;

let p5Instance: p5;

window.addEventListener('load', () => {
  p5Instance = new p5(sketch, rootElement);
});

window.addEventListener('unload', () => {
  p5Instance.remove();
});