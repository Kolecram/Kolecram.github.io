import { createSvgElement, PathBuilder, CssStyleBuilder, TransformBuilder } from "../modules/svg.mjs";
import { Vector2D } from "../modules/geometry.mjs";

const pointCircleSize = 0.02;
const fontSize = 0.1;
const angleMarkerRadius = 0.2;
const angleLabelRadius = 0.25;
const rightAngleMarkerSize = angleMarkerRadius / 2;
const labelColor = "blue";

class SvgMathSpace {
  #groupElement: SVGElement;
  #strokeWidth: number;

  constructor(nrOfUnitsHorizontal: number, nrOfUnitsVertical: number, pixelsPerUnit: number, strokeWidth: number) {
    this.#strokeWidth = strokeWidth;

    const svgElement = createSvgElement("svg");
    svgElement.setAttribute("width", (nrOfUnitsHorizontal * pixelsPerUnit).toString());
    svgElement.setAttribute("height", (nrOfUnitsVertical * pixelsPerUnit).toString());
    svgElement.setAttribute("style", "border-style: solid; border-width: 1px;");
    document.body.appendChild(svgElement);

    const defsElement = createSvgElement("defs");
    svgElement.appendChild(defsElement);

    const markerElement = createSvgElement("marker");
    markerElement.setAttribute("id", "arrowHead");
    markerElement.setAttribute("viewBox", "0 -5 10 10");
    markerElement.setAttribute("markerWidth", String(10)); // 10 times the stroke width
    markerElement.setAttribute("markerHeight", String(10)); // 10 times the stroke width
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
  }

  drawCircle(origin: Vector2D, radius: number) {
    const circleElement = createSvgElement("circle");
    circleElement.setAttribute("r", String(radius));
    circleElement.setAttribute("cx", origin.x());
    circleElement.setAttribute("cy", origin.y());
    const style = new CssStyleBuilder().add("fill", "transparent").add("stroke", "black").addStrokeWidth(this.#strokeWidth).build();
    circleElement.setAttribute("style", style);
    this.#groupElement.appendChild(circleElement);
  }

  drawVector(origin: Vector2D, vector: Vector2D, showLength: boolean) {
    const style = new CssStyleBuilder().add("fill", "transparent").add("stroke", "black").addStrokeWidth(this.#strokeWidth).add("marker-end", "url(#arrowHead)").build();
    this.#drawLinePath(origin, origin.plus(vector), style);

    if (showLength) {
      const curlyBracesElement = createSvgElement("text");
      const angleOfBracesText = 90; // angle of text "}"
      const rotationAngle = (vector.angle() * 360) / (Math.PI * 2);
      const x = origin.x() + vector.x() / 2;
      const y = origin.y() + vector.y() / 2;
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

  drawLineSegment(start: Vector2D, end: Vector2D) {
    const style = new CssStyleBuilder().add("fill", "transparent").add("stroke", "black").addStrokeWidth(this.#strokeWidth).build();
    this.#drawLinePath(start, end, style);
  }

  #drawLinePath(start: Vector2D, end: Vector2D, style: string) {
    const pElement = createSvgElement("path");
    const pathBuilder = new PathBuilder();
    pathBuilder.addMoveCommand(start.array());
    pathBuilder.addLineCommand(end.array());
    pElement.setAttribute("d", pathBuilder.build());
    pElement.setAttribute("style", style);
    this.#groupElement.appendChild(pElement);
  }

  drawRightAngle(a: Vector2D, b: Vector2D, c: Vector2D) {
    const pElement = createSvgElement("path");
    const pathBuilder = new PathBuilder();
    const bVector = b.normalize().times(rightAngleMarkerSize);
    const cVector = c.normalize().times(rightAngleMarkerSize);
    const pathStart = a.plus(bVector).array();
    const pathDelta = cVector;
    const pathEnd = a.plus(cVector).array();
    pathBuilder.addMoveCommand(pathStart);
    pathBuilder.addDeltaLineCommand(pathDelta.array());
    pathBuilder.addLineCommand(pathEnd);
    pElement.setAttribute("d", pathBuilder.build());
    const style = new CssStyleBuilder().add("fill", "transparent").add("stroke", labelColor).addStrokeWidth(this.#strokeWidth).build();
    pElement.setAttribute("style", style);
    this.#groupElement.appendChild(pElement);
  }

  drawAngle(a: Vector2D, b: Vector2D, c: Vector2D, label: string) {
    const pElement = createSvgElement("path");
    const pathBuilder = new PathBuilder();
    const arcStart = a.plus(b.normalize().times(angleMarkerRadius)).array();
    const arcEnd = a.plus(c.normalize().times(angleMarkerRadius)).array();
    pathBuilder.addMoveCommand(arcStart);
    pathBuilder.addDeltaArcCommand(angleMarkerRadius, angleMarkerRadius, 0, 0, 1, arcEnd);
    pElement.setAttribute("d", pathBuilder.build());
    const style = new CssStyleBuilder().add("fill", "transparent").add("stroke", labelColor).addStrokeWidth(this.#strokeWidth).build();
    pElement.setAttribute("style", style);
    this.#groupElement.appendChild(pElement);

    let labelPosition = a.plus(b.bisect(c).times(angleLabelRadius));

    this.drawLabel(labelPosition, "center", label);
  }

  drawPoint(label: string, vector: Vector2D, labelPosition: string) {
    this.drawCircle(vector, pointCircleSize);
    this.drawLabel(vector, labelPosition, label);
  }

  drawLabel(vector: Vector2D, labelPosition: string, label: string) {
    let vectorToLabel: Vector2D;
    switch (labelPosition) {
      case "center":
        vectorToLabel = Vector2D.zero();
        break;
      case "left":
        vectorToLabel = new Vector2D(-fontSize, 0);
        break;
      case "right":
        vectorToLabel = new Vector2D(fontSize, 0);
        break;
      case "lower-right":
        vectorToLabel = new Vector2D(fontSize, -fontSize);
        break;
      case "top":
        vectorToLabel = new Vector2D(0, fontSize);
        break;
      case "bottom":
        vectorToLabel = new Vector2D(0, -fontSize);
        break;
    }
    const labelElement = createSvgElement("text");
    labelElement.setAttribute("x", vector.x());
    labelElement.setAttribute("y", vector.y());
    labelElement.innerHTML = label;
    labelElement.setAttribute("style", new CssStyleBuilder().addFontSize(fontSize).add("fill", labelColor).add("dominant-baseline", "middle").add("text-anchor", "middle").build());
    labelElement.setAttribute("transform", new TransformBuilder().addTranslate(vectorToLabel.x(), vectorToLabel.y()).addScale(1, -1).build());
    labelElement.setAttribute("transform-origin", vector.array().join(" "));
    this.#groupElement.appendChild(labelElement);
  }

  appendChild(childElement: SVGElement) {
    this.#groupElement.appendChild(childElement);
  }
}

export { SvgMathSpace };