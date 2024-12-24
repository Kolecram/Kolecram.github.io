import { Vector2D } from "../modules/geometry.mjs";
declare class SvgMathSpace {
    #private;
    constructor(nrOfUnitsHorizontal: number, nrOfUnitsVertical: number, pixelsPerUnit: number, strokeWidth: number);
    drawCircle(origin: Vector2D, radius: number): void;
    drawVector(origin: Vector2D, vector: Vector2D, showLength: boolean): void;
    drawLineSegment(start: Vector2D, end: Vector2D): void;
    drawRightAngle(a: Vector2D, b: Vector2D, c: Vector2D): void;
    drawAngle(a: Vector2D, b: Vector2D, c: Vector2D, label: string): void;
    drawPoint(label: string, vector: Vector2D, labelPosition: string): void;
    drawLabel(vector: Vector2D, labelPosition: string, label: string): void;
    appendChild(childElement: SVGElement): void;
}
export { SvgMathSpace };
