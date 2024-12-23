import { Vector2D } from "./geometry.mjs";
import { SvgMathSpace } from "./svgmathspace.mjs";
import { createSvgElement, PathBuilder } from "./svg.mjs";
import { involute } from "./involute.mjs";

function tekenInvoluutSvg() {
    const strokeWidth = 0.005;
    const space = new SvgMathSpace(2, 2, 200, strokeWidth);

    const circleCenter = new Vector2D(0.5, 0.5);
    space.drawCircle(circleCenter, 1);

    // qElement.setAttribute("d", "M " + p.toSvg() + " L " + q.toSvg());
    // qElement.setAttribute("style", "fill: transparent; stroke: black;");
    // svgElement.appendChild(qElement);

    // const alphaElement = document.createElementNS(svgNamespace, "text");
    // alphaElement.setAttribute("x", 20);
    // alphaElement.setAttribute("y", -10);
    // alphaElement.innerHTML = "&alpha;";
    // svgElement.appendChild(alphaElement);

    const alpha = Math.PI / 3;

    const involuteElement = createSvgElement("path");
    const pathBuilder = new PathBuilder();
    pathBuilder.addMoveCommand(circleCenter.plus(new Vector2D(1, 0)).array());
    for (let angle = 0; angle <= alpha; angle += alpha / 200) {
        pathBuilder.addLineCommand(circleCenter.plus(involute(angle)).array());
    }
    involuteElement.setAttribute("d", pathBuilder.build());
    involuteElement.setAttribute("style", "fill: transparent; stroke: red; stroke-width: " + strokeWidth);
    space.appendChild(involuteElement);

    const p = Vector2D.createPolarVector(alpha, 1);
    space.drawVector(circleCenter, p, false);

    const pq = new Vector2D(alpha * Math.sin(alpha), -alpha * Math.cos(alpha));
    space.drawVector(circleCenter.plus(p), pq, false);
}

window.onload = (event) => {
    tekenInvoluutSvg();
}