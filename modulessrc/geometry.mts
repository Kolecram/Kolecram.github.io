class Vector2D {
    #xCoord;
    #yCoord;
    constructor(x, y) {
        this.#xCoord = x;
        this.#yCoord = y;
    }
    x() {
        return this.#xCoord;
    }
    y() {
        return this.#yCoord;
    }
    length() {
        return Math.sqrt(this.#xCoord ** 2 + this.#yCoord ** 2);
    }
    angle() {
        // returns angle alpha in radians, where -Math.PI < alpha <= Math.PI
        return Math.atan2(this.#yCoord, this.#xCoord);
    }
    array() {
        return [this.#xCoord, this.#yCoord];
    }
    reverse(v: Vector2D) {
        return new Vector2D(-this.#xCoord, -this.#yCoord);
    }
    plus(v: Vector2D) {
        return new Vector2D(this.#xCoord + v.#xCoord, this.#yCoord + v.#yCoord);
    }
    minus(v: Vector2D) {
        return new Vector2D(this.#xCoord - v.#xCoord, this.#yCoord - v.#yCoord);
    }
    times(a: number) {
        return new Vector2D(a * this.#xCoord, a * this.#yCoord);
    }
    normalize() {
        return this.times(1 / this.length());
    }
    projectX() {
        return new Vector2D(this.#xCoord, 0);
    }
    projectY() {
        return new Vector2D(0, this.#yCoord);
    }
    bisect(v: Vector2D) {
        let averageAngle = (this.angle() + v.angle()) / 2;
        return Vector2D.createPolarVector(averageAngle, 1);
    }
    toString() {
        return this.#xCoord + "," + this.#yCoord;
    }
    static zero() {
        return new Vector2D(0, 0);
    }
    static createPolarVector(angle: number, radius: number) {
        return new Vector2D(Math.cos(angle), Math.sin(angle)).times(radius);
    }
}

export { Vector2D };