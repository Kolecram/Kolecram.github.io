declare class Vector2D {
    #private;
    constructor(x: any, y: any);
    x(): any;
    y(): any;
    length(): number;
    angle(): number;
    array(): any[];
    reverse(v: Vector2D): Vector2D;
    plus(v: Vector2D): Vector2D;
    minus(v: Vector2D): Vector2D;
    times(a: number): Vector2D;
    normalize(): Vector2D;
    projectX(): Vector2D;
    projectY(): Vector2D;
    bisect(v: Vector2D): Vector2D;
    toString(): string;
    static zero(): Vector2D;
    static createPolarVector(angle: number, radius: number): Vector2D;
}
export { Vector2D };
