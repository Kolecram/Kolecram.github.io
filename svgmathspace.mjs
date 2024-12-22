import { createSvgElement, PathBuilder } from "./svg.mjs";

class Vector {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  angle() {
    // returns angle alpha in radians, where -Math.PI < alpha <= Math.PI
    return Math.atan2(this.y, this.x);
  }
}

class SvgMathSpace {
  #groupElement;

  constructor(widthInPixels, nrOfUnits) {
    const svgElement = createSvgElement("svg");
    svgElement.setAttribute("viewBox", [0, -nrOfUnits, nrOfUnits, nrOfUnits].join(" "));
    svgElement.setAttribute("width", widthInPixels);
    svgElement.setAttribute("height", widthInPixels);
    svgElement.setAttribute("style", "border-style: solid; border-width: 1px;");
    svgElement.setAttribute("transform", "scale(0 -1)");
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
    arrowHeadElement.setAttribute("d",pathBuilder.build());
    arrowHeadElement.setAttribute("style", "fill: black; stroke-width: 1%;");
    markerElement.appendChild(arrowHeadElement);

    this.#groupElement = createSvgElement("g");
    svgElement.appendChild(this.#groupElement);

    // this.#drawAxes();
  }

  drawCircle(radius) {
    const circleElement = createSvgElement("circle");
    circleElement.setAttribute("r", radius);
    circleElement.setAttribute("style", "fill: transparent; stroke: black; stroke-width: 0.3%;");
    this.#groupElement.appendChild(circleElement);
  }

  drawVector(origin, vector, showLength) {
    const pElement = createSvgElement("path");
    pElement.setAttribute("d", "M " + this.#toSvg(origin) + " L " + this.#toSvg(vector));
    pElement.setAttribute(
      "style",
      "fill: transparent; stroke: black; stroke-width: 0.3%; marker-end: url(#arrowHead);"
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
}

export {SvgMathSpace, Vector};