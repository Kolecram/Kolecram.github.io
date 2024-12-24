import { Vector2D } from "../modules/geometry.mjs";
import { SvgMathSpace } from "../modules/svgmathspace.mjs";
window.onload = (event) => {
    const strokeWidth = 0.005;
    const space = new SvgMathSpace(1.2, 1.2, 400, strokeWidth);
    const angle = Math.PI / 3;
    const p = new Vector2D(Math.cos(angle), Math.sin(angle));
    space.drawVector(new Vector2D(0, 0), p, false);
    space.drawVector(new Vector2D(0, 0), new Vector2D(0.95, 0.94), false);
    space.drawCircle(new Vector2D(0, 0), 1);
};
