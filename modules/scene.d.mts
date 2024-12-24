declare class Point3D {
    x: any;
    y: any;
    z: any;
    constructor(x: any, y: any, z: any);
    toString(): string;
}
declare class Axis {
    #private;
    static x: Axis;
    static y: Axis;
    static z: Axis;
    constructor(name: String);
    toString(): String;
}
declare class WidthAndHeight {
    width: any;
    height: any;
    constructor(width: any, height: any);
}
declare class Scene {
    #private;
    constructor(sizeInPixels: any, cameraPosition: any);
    createRectangle(widthAndHeight: any, position: any, perpendicularToAxis: any, color: any, opacity: any): HTMLDivElement;
}
export { Scene, Point3D, WidthAndHeight, Axis };
