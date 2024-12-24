import { Vector2D } from "../modules/geometry.mjs";
import { SvgMathSpace } from "../modules/svgmathspace.mjs";
import { createSvgElement, PathBuilder } from "../modules/svg.mjs";
import { involute } from "../modules/involute.mjs";
function tekenInvoluutSvg() {
    const strokeWidth = 0.005;
    const space = new SvgMathSpace(2, 2, 200, strokeWidth);
    const o = new Vector2D(0.2, 0.2);
    space.drawPoint("O", o, "top");
    space.drawCircle(o, 1);
    const alpha = Math.PI / 3;
    const involuteElement = createSvgElement("path");
    const pathBuilder = new PathBuilder();
    pathBuilder.addMoveCommand(o.plus(new Vector2D(1, 0)).array());
    for (let angle = 0; angle < alpha; angle += alpha / 100) {
        pathBuilder.addLineCommand(o.plus(involute(angle)).array());
    }
    pathBuilder.addLineCommand(o.plus(involute(alpha)).array());
    involuteElement.setAttribute("d", pathBuilder.build());
    involuteElement.setAttribute("style", "fill: transparent; stroke: red; stroke-width: " + strokeWidth);
    space.appendChild(involuteElement);
    const p = o.plus(Vector2D.createPolarVector(alpha, 1));
    space.drawPoint("P", p, "top");
    space.drawLineSegment(o, p);
    const q = p.plus(new Vector2D(alpha * Math.sin(alpha), -alpha * Math.cos(alpha)));
    space.drawPoint("Q", q, "lower-right");
    space.drawLineSegment(p, q);
    const s = o.plus(new Vector2D(1, 0));
    space.drawPoint("S", s, "lower-right");
    space.drawLineSegment(o, s);
    const os = s.minus(o);
    const op = p.minus(o);
    space.drawAngle(o, os, op, "&alpha;");
    const po = o.minus(p);
    const pq = q.minus(p);
    space.drawRightAngle(p, po, pq);
    const pt = pq.projectX();
    const t = p.plus(pt);
    space.drawPoint("T", t, "top");
    space.drawLineSegment(p, t);
}
window.onload = (event) => {
    tekenInvoluutSvg();
};
