import {SvgMathSpace, Vector} from "./svgmathspace.mjs";

window.onload = (event) => {
    const space = new SvgMathSpace(400, 3);

    const angle = Math.PI / 3;
    const p = new Vector(Math.cos(angle), Math.sin(angle));
    space.drawVector(new Vector(0, 0), p, false);

    // qElement.setAttribute("d", "M " + p.toSvg() + " L " + q.toSvg());
    // qElement.setAttribute("style", "fill: transparent; stroke: black;");
    // svgElement.appendChild(qElement);

    // const alphaElement = document.createElementNS(svgNamespace, "text");
    // alphaElement.setAttribute("x", 20);
    // alphaElement.setAttribute("y", -10);
    // alphaElement.innerHTML = "&alpha;";
    // svgElement.appendChild(alphaElement);

    // const involuteElement = document.createElementNS(svgNamespace, "path");
    // let path = "M " + magnification + ",0";
    // for (let alpha = 0; alpha < Math.PI; alpha += Math.PI / 40) {
    //     path += " L " + involute(alpha).toSvg();
    // }
    // involuteElement.setAttribute("d", path);
    // involuteElement.setAttribute("style", "fill: transparent; stroke: black;");
    // svgElement.appendChild(involuteElement);

    space.drawVector(new Vector(0, 0), new Vector(-1, -1), false);
}
