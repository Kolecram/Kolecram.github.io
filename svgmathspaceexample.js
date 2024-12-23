import { Vector2D } from "./geometry.mjs";
import { SvgMathSpace } from "./svgmathspace.mjs";
import { createSvgElement, PathBuilder } from "./svg.mjs";

window.onload = (event) => {
    const strokeWidth = 0.005;
    const space = new SvgMathSpace(1.2, 1.2, 400, strokeWidth);

    const angle = Math.PI / 3;
    const p = new Vector2D(Math.cos(angle), Math.sin(angle));
    space.drawVector(new Vector2D(0, 0), p, false);

    // qElement.setAttribute("d", "M " + p.toSvg() + " L " + q.toSvg());
    // qElement.setAttribute("style", "fill: transparent; stroke: black;");
    // svgElement.appendChild(qElement);

    // const alphaElement = document.createElementNS(svgNamespace, "text");
    // alphaElement.setAttribute("x", 20);
    // alphaElement.setAttribute("y", -10);
    // alphaElement.innerHTML = "&alpha;";
    // svgElement.appendChild(alphaElement);

    space.drawVector(new Vector2D(0, 0), new Vector2D(0.95, 0.94), false);
    space.drawCircle(new Vector2D(0, 0), 1);
}
