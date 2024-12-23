import { createSvgElement, PathBuilder } from "./svg.mjs";

const strokeWidth = "0.01";

class SvgMathSpace {
  #groupElement;
  #strokeWidth;

  constructor(nrOfUnitsHorizontal, nrOfUnitsVertical, pixelsPerUnit, strokeWidth) {
    this.#strokeWidth = strokeWidth;

    const svgElement = createSvgElement("svg");
    svgElement.setAttribute("width", nrOfUnitsHorizontal * pixelsPerUnit);
    svgElement.setAttribute("height", nrOfUnitsVertical * pixelsPerUnit);
    svgElement.setAttribute("style", "border-style: solid; border-width: 1px;");
    document.body.appendChild(svgElement);

    const defsElement = createSvgElement("defs");
    svgElement.appendChild(defsElement);

    const markerElement = createSvgElement("marker");
    markerElement.setAttribute("id", "arrowHead");
    markerElement.setAttribute("viewBox", "0 -5 10 10");
    markerElement.setAttribute("markerWidth", 10); // 10 times the stroke width
    markerElement.setAttribute("markerHeight", 10); // 10 times the stroke width
    markerElement.setAttribute("orient", "auto");
    markerElement.setAttribute("refX", "10");
    markerElement.setAttribute("overflow", "visible");
    defsElement.appendChild(markerElement);

    const arrowHeadElement = createSvgElement("path");

    const pathBuilder = new PathBuilder();
    pathBuilder.addMoveCommand([0, -5]);
    pathBuilder.addLineCommand([10, -0.5]);
    pathBuilder.addLineCommand([10, 0.5]);
    pathBuilder.addLineCommand([0, 5]);
    pathBuilder.addLineCommand([5, 0.5]);
    pathBuilder.addLineCommand([0, 0.5]);
    pathBuilder.addLineCommand([0, -0.5]);
    pathBuilder.addLineCommand([5, -0.5]);
    arrowHeadElement.setAttribute("d", pathBuilder.build());
    arrowHeadElement.setAttribute("style", "fill: black; stroke-width: " + this.#strokeWidth);
    markerElement.appendChild(arrowHeadElement);

    this.#groupElement = createSvgElement("g");
    const scale = [pixelsPerUnit, -pixelsPerUnit];
    const translate = [0, -nrOfUnitsVertical];
    this.#groupElement.setAttribute("transform", "scale(" + scale.join(" ") + ") translate(" + translate.join(" ") + ")");
    svgElement.appendChild(this.#groupElement);

    // this.#drawAxes();
  }

  drawCircle(origin, radius) {
    const circleElement = createSvgElement("circle");
    circleElement.setAttribute("r", radius);
    circleElement.setAttribute("cx", origin.x);
    circleElement.setAttribute("cy", origin.y);
    circleElement.setAttribute("style", "fill: transparent; stroke: black; stroke-width: " + this.#strokeWidth);
    this.#groupElement.appendChild(circleElement);
  }

  drawVector(origin, vector, showLength) {
    const pElement = createSvgElement("path");
    pElement.setAttribute("d", "M " + this.#toSvg(origin) + " l " + this.#toSvg(vector));
    pElement.setAttribute(
      "style",
      "fill: transparent; stroke: black; stroke-width: " + this.#strokeWidth + "; marker-end: url(#arrowHead);"
    );
    pElement.setAttribute("marker-end", "url(#arrowHead)");
    this.#groupElement.appendChild(pElement);

    if (showLength) {
      const curlyBracesElement = createSvgElement("text");
      const angleOfBracesText = 90; // angle of text "}"
      const rotationAngle = (vector.angle() * 360) / (Math.PI * 2);
      const x = origin.x + vector.x / 2;
      const y = origin.y + vector.y / 2;
      curlyBracesElement.setAttribute("x", x);
      curlyBracesElement.setAttribute("y", y);
      curlyBracesElement.setAttribute(
        "transform",
        "scale(" +
        vector.length() / 10 +
        ") rotate(" +
        rotationAngle +
        ")"
      );
      curlyBracesElement.setAttribute("transform-origin", x + " " + y);
      curlyBracesElement.innerHTML = "}";
      this.#groupElement.appendChild(curlyBracesElement);
    }
  }

  #toSvg(vector) {
    return vector.x + "," + vector.y;
  }

  #drawAxes() {
    const xAxisLabelElement = createSvgElement("text");
    xAxisLabelElement.setAttribute("x", 0);
    xAxisLabelElement.setAttribute("y", -1.1);
    xAxisLabelElement.innerHTML = "x";
    xAxisLabelElement.setAttribute(
      "style",
      "dominant-baseline: middle; text-anchor: middle;"
    );
    this.#groupElement.appendChild(xAxisLabelElement);

    const yAxisLabelElement = createSvgElement("text");
    yAxisLabelElement.setAttribute("x", 1.1);
    yAxisLabelElement.setAttribute("y", 0);
    yAxisLabelElement.innerHTML = "y";
    yAxisLabelElement.setAttribute(
      "style",
      "dominant-baseline: middle; text-anchor: middle;"
    );
    this.#groupElement.appendChild(yAxisLabelElement);
  }

  appendChild(childElement) {
    this.#groupElement.appendChild(childElement);
  }
}

export { SvgMathSpace };