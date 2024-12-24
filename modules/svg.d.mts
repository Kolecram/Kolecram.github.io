declare function createSvgElement(name: string): SVGElement;
declare class PathBuilder {
    #private;
    addMoveCommand(position: Array<number>): void;
    addLineCommand(position: Array<number>): void;
    addDeltaLineCommand(position: Array<number>): void;
    addArcCommand(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, position: Array<number>): void;
    addDeltaArcCommand(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, position: Array<number>): void;
    build(): string;
}
declare class CssStyleBuilder {
    #private;
    add(name: string, value: string): this;
    addStrokeWidth(value: number): this;
    addFontSize(value: number): this;
    build(): string;
}
declare class TransformBuilder {
    #private;
    addRotate(degrees: number): this;
    addScale(x: number, y: number): this;
    addTranslate(x: number, y: number): this;
    addTransform(name: string, ...args: Array<number>): void;
    build(): string;
}
export { PathBuilder, createSvgElement, CssStyleBuilder, TransformBuilder };
