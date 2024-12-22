import { createSvgElement } from "./svg.mjs";

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
  #svgElement;
  #magnification;

  constructor(widthInPixels, widthInSpaceUnits) {
    this.#magnification = 100 / widthInSpaceUnits;

    this.#svgElement = createSvgElement("svg");
    this.#svgElement.setAttribute("viewBox", "-100 -100 200 200");
    this.#svgElement.setAttribute("width", widthInPixels);
    this.#svgElement.setAttribute("height", widthInPixels);
    this.#svgElement.setAttribute("style", "border-style: solid; border-width: 1px;");
    document.body.appendChild(this.#svgElement);

    const defsElement = createSvgElement("defs");
    this.#svgElement.appendChild(defsElement);

    const markerElement = createSvgElement("marker");
    markerElement.setAttribute("id", "arrowHead");
    markerElement.setAttribute("viewBox", "0 -5 10 10");
    markerElement.setAttribute("markerWidth", 10); // 10 times the stroke width
    markerElement.setAttribute("markerHeight", 10); // 10 times the stroke width
    markerElement.setAttribute("orient", "auto");
    markerElement.setAttribute("overflow", "visible");
    defsElement.appendChild(markerElement);

    const arrowHeadElement = createSvgElement("path");
    arrowHeadElement.setAttribute(
      "d",
      "M 0,-5 L 10,0 L 0,5 L 5,0.5 L 0,0.5 L 0,-0.5 L 5,-0.5 Z"
    );
    arrowHeadElement.setAttribute("style", "fill: black");
    markerElement.appendChild(arrowHeadElement);

    this.#drawAxes();
  }

  drawVector(origin, vector, showLength) {
    const pElement = createSvgElement("path");
    pElement.setAttribute("d", "M " + this.#toSvg(origin) + " L " + this.#toSvg(vector));
    pElement.setAttribute(
      "style",
      "fill: transparent; stroke: black; marker-end: url(#arrowHead);"
    );
    pElement.setAttribute("marker-end", "url(#arrowHead)");
    this.#svgElement.appendChild(pElement);
  
    if (showLength) {
      const curlyBracesElement = createSvgElement("text");
      const angleOfBracesText = 90; // angle of text "}"
      const rotationAngle = (vector.angle() * 360) / (Math.PI * 2);
      const x = this.#magnification * (origin.x + vector.x / 2);
      const y = this.#magnification * -(origin.y + vector.y / 2);
      curlyBracesElement.setAttribute("x", x);
      curlyBracesElement.setAttribute("y", y);
      curlyBracesElement.setAttribute(
        "transform",
        "scale(" +
        (this.#magnification * vector.length()) / 10 +
        ") rotate(" +
        rotationAngle +
        ")"
      );
      curlyBracesElement.setAttribute("transform-origin", x + " " + y);
      curlyBracesElement.innerHTML = "}";
      this.#svgElement.appendChild(curlyBracesElement);
    }
  }
  
  #toSvg(vector) {
    return this.#magnification * vector.x + "," + -(this.#magnification * vector.y);
  }

  #drawAxes() {
    const xAxisElement = createSvgElement("path");
    xAxisElement.setAttribute("d", "M 0 0 h " + this.#magnification * 1.5);
    xAxisElement.setAttribute(
      "style",
      "fill: transparent; stroke: black; marker-end: url(#arrowHead);"
    );
    this.#svgElement.appendChild(xAxisElement);
    const xAxisLabelElement = createSvgElement("text");
    xAxisLabelElement.setAttribute("x", 0);
    xAxisLabelElement.setAttribute("y", -175);
    xAxisLabelElement.innerHTML = "x";
    xAxisLabelElement.setAttribute(
      "style",
      "dominant-baseline: middle; text-anchor: middle;"
    );
    this.#svgElement.appendChild(xAxisLabelElement);
  
    const yAxisElement = createSvgElement("path");
    yAxisElement.setAttribute("d", "M 0 0 v " + -this.#magnification * 1.5);
    yAxisElement.setAttribute(
      "style",
      "fill: transparent; stroke: black; marker-end: url(#arrowHead);"
    );
    this.#svgElement.appendChild(yAxisElement);
    const yAxisLabelElement = createSvgElement("text");
    yAxisLabelElement.setAttribute("x", 175);
    yAxisLabelElement.setAttribute("y", 0);
    yAxisLabelElement.innerHTML = "y";
    yAxisLabelElement.setAttribute(
      "style",
      "dominant-baseline: middle; text-anchor: middle;"
    );
    this.#svgElement.appendChild(yAxisLabelElement);
  }  
}

export {SvgMathSpace, Vector};